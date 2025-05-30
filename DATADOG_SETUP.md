# Datadog Integration Guide for Object Recovery

This guide explains how Datadog is integrated into the Object Recovery application for monitoring, logging, and performance tracking.

## Overview

Datadog is used for:
1. Real User Monitoring (RUM) to track user interactions
2. Error tracking and logging
3. Performance monitoring
4. API call tracking (including Supabase)
5. Session replay for debugging user issues

## Configuration

### Environment Variables

The following environment variables are used to configure Datadog:

```
# Datadog Configuration
VITE_DATADOG_APPLICATION_ID=your-datadog-application-id
VITE_DATADOG_CLIENT_TOKEN=your-datadog-client-token
VITE_DATADOG_SITE=datadoghq.com
VITE_ENABLE_DATADOG=true
VITE_APP_VERSION=1.0.0

# For server-side APM (if you have a Node.js backend)
DD_API_KEY=your-datadog-api-key
DD_SITE=datadoghq.com
DD_ENV=production
DD_SERVICE=object-recovery
DD_LOGS_INJECTION=true
DD_TRACE_SAMPLE_RATE=1
DD_PROFILING_ENABLED=true
DD_LOGS_INTAKE_URL=https://http-intake.logs.datadoghq.com
```

Copy these from `.env.example` to a new `.env` file and fill in your Datadog credentials.

### Initialization

Datadog is initialized in `src/main.tsx` for browser monitoring and in the Docker container for server-side monitoring.

## Supabase Integration

The Supabase client is integrated with Datadog to track:
- API calls to Supabase
- Response times
- Errors
- Authentication events

This integration is implemented in `src/integrations/supabase/client.ts`.

## Docker Setup

The application includes Docker configuration for running with Datadog:

1. A Dockerfile that sets up the application with Datadog tracing
2. A docker-compose.yml file that includes both the application and the Datadog agent

### Running with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Manual Setup

If you're not using Docker, you can still use Datadog:

1. Set up the environment variables in your deployment environment
2. Ensure the Datadog initialization code runs when the application starts

## Monitoring Custom Events

You can track custom events using:

```typescript
import { datadogRum } from '@datadog/browser-rum';

// Track a user action
datadogRum.addAction('button_click', { buttonId: 'submit-form' });

// Track an error
datadogRum.addError(new Error('Something went wrong'), { context: 'form-submission' });
```

## Logging

For logging, use:

```typescript
import { datadogLogs } from '@datadog/browser-logs';

// Log information
datadogLogs.logger.info('User completed signup', { userId: 'user-123' });

// Log errors
datadogLogs.logger.error('API call failed', { endpoint: '/api/data', status: 500 });
```

## Datadog Dashboard

A default dashboard is available in your Datadog account once data starts flowing. You can customize it to show:

- RUM performance metrics
- Error rates
- Supabase API call performance
- User session information

## Troubleshooting

If you're not seeing data in Datadog:

1. Check that the environment variables are correctly set
2. Verify that Datadog initialization is running (check console logs)
3. Ensure your Datadog API keys have the correct permissions
4. Check network requests to Datadog endpoints for any errors