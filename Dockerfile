# syntax=docker/dockerfile:1

# Object Recovery Application Dockerfile
# Includes Datadog monitoring integration

# Use a more stable LTS version of Node
ARG NODE_VERSION=20.12.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Install Datadog dependencies
RUN apk add --no-cache curl

################################################################################
# Create a stage for installing production dependencies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Define build arguments for environment variables
ARG VITE_DATADOG_APPLICATION_ID
ARG VITE_DATADOG_CLIENT_TOKEN
ARG VITE_DATADOG_SITE
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_APP_VERSION

# Set environment variables for the build
ENV VITE_DATADOG_APPLICATION_ID=${VITE_DATADOG_APPLICATION_ID}
ENV VITE_DATADOG_CLIENT_TOKEN=${VITE_DATADOG_CLIENT_TOKEN}
ENV VITE_DATADOG_SITE=${VITE_DATADOG_SITE}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_ENABLE_DATADOG=true

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
FROM base AS final

# Define runtime environment variables
ARG DD_API_KEY
ARG DD_ENV=production
ARG DD_SERVICE=object-recovery
ARG DD_SITE=datadoghq.com

# Set environment variables
ENV NODE_ENV=production \
    DD_API_KEY=${DD_API_KEY} \
    DD_ENV=${DD_ENV} \
    DD_SERVICE=${DD_SERVICE} \
    DD_SITE=${DD_SITE} \
    DD_RUNTIME_METRICS_ENABLED=true \
    DD_PROFILING_ENABLED=true \
    DD_TRACE_ENABLED=true

# Copy Datadog configuration
COPY datadog-config.yaml /etc/datadog-agent/datadog.yaml

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 8080

# Set up a local directory for global npm modules (no root required)
ENV NPM_GLOBAL_DIR=/home/node/npm-global
RUN mkdir -p "$NPM_GLOBAL_DIR" && \
    npm config set prefix "$NPM_GLOBAL_DIR" && \
    chmod -R 777 "$NPM_GLOBAL_DIR"

# Install serve into custom location
RUN npm install -g serve --no-update-notifier

# Add global bin directory to PATH
ENV PATH="$NPM_GLOBAL_DIR/bin:$PATH"

# Start the application with Datadog tracing
CMD ["serve", "-s", "dist", "-l", "8080"]