**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Datadog for monitoring

## Datadog Monitoring Setup

This project includes Datadog integration for comprehensive monitoring:

### Features Implemented

- **Application Performance Monitoring (APM)**: Tracks application performance metrics
- **Real User Monitoring (RUM)**: Monitors user interactions and page load performance
- **Log Collection**: Captures and forwards logs to Datadog

### Setup Instructions

1. **Create a Datadog account** if you don't have one already at [datadoghq.com](https://www.datadoghq.com/)

2. **Install Datadog packages**:
   ```sh
   # Option 1: Use the setup script (recommended)
   node scripts/setup-datadog.js
   
   # Option 2: Install manually
   npm install @datadog/browser-rum @datadog/browser-logs --save
   ```
   
   > **Note for TypeScript users**: The current implementation uses mock objects that work even without installing the packages. If you want to use the real Datadog packages, run the setup script which will update the implementation.

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Datadog credentials:
     - `VITE_DATADOG_APPLICATION_ID`: Your RUM application ID from Datadog
     - `VITE_DATADOG_CLIENT_TOKEN`: Your client token from Datadog
     - `VITE_DATADOG_SITE`: Your Datadog site (e.g., `datadoghq.com` or `datadoghq.eu`)
     - `DD_API_KEY`: Your Datadog API key (for server-side monitoring)

4. **For local development**:
   - Set `VITE_ENABLE_DATADOG=true` to enable Datadog in development
   - Or leave it as `false` to disable Datadog during local development
   
5. **Restart your development server** after making these changes

### Troubleshooting TypeScript Errors

If you encounter TypeScript errors related to Datadog packages:

1. **Option 1: Use the mock implementation (default)**
   - The default implementation uses mock objects that don't require the actual packages
   - This approach works without installing any packages and won't cause TypeScript errors
   - Monitoring data will only be logged to the console, not sent to Datadog

2. **Option 2: Install the packages properly**
   - Run `node scripts/setup-datadog.js` to set up the real implementation
   - This will install the packages and update the code to use them
   - Make sure to restart your development server after running the script

3. **Option 3: Add type declarations**
   - If you're still seeing TypeScript errors, check that the type declarations in `src/types/datadog.d.ts` are being recognized
   - You may need to restart your TypeScript server in your IDE

4. **For production deployment**:
   - Ensure all Datadog environment variables are set in your deployment environment
   - Use the `datadog-config.yaml` file as a reference for configuring the Datadog agent

### DevOps Integration

For DevOps teams integrating Datadog in CI/CD pipelines:

1. **Server-side APM**:
   - Import the Datadog tracer at the entry point of your server:
   ```javascript
   // First line of your server code
   require('./datadog-apm');
   ```

2. **Docker/Kubernetes Deployment**:
   - Use the `datadog-config.yaml` as a reference for your Datadog agent configuration
   - Ensure the Datadog agent is deployed alongside your application
   - Set all required environment variables in your deployment configuration

3. **CI/CD Pipeline**:
   - Add Datadog environment variables to your CI/CD secrets
   - Configure your build process to include version information for better tracking

### User Tracking

The application automatically tracks user information in Datadog when users sign in or out. This helps with:

- Session tracking
- User journey analysis
- Performance monitoring by user segment

---

## How to Verify Docker and GitHub Actions

### Docker

- **Build locally:**  
  Run `docker build -t object-recovery:local .`  
  If the build completes without errors, Docker is working.
- **Run locally:**  
  Run `docker run -p 8080:8080 object-recovery:local`  
  Visit [http://localhost:8080](http://localhost:8080) in your browser to see your app running in Docker.

### GitHub Actions

- **Check build status:**  
  Go to your repository on GitHub.  
  Click on the "Actions" tab.  
  You should see workflow runs for your recent pushes and pull requests.
- **See logs:**  
  Click on a workflow run to view detailed logs for each step (checkout, build, Docker build, etc.).
- **Docker image push:**  
  If you have set up Docker Hub secrets, check your Docker Hub account for the `object-recovery:latest` image after a successful workflow run.

If you see green check marks and successful logs in GitHub Actions, and your Docker image builds and runs locally, both integrations are working.


