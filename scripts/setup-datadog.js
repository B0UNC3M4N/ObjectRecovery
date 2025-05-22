/**
 * Script to set up Datadog monitoring
 * 
 * This script:
 * 1. Creates a proper implementation of datadog.ts that uses the real packages
 * 2. Installs the required Datadog packages
 * 3. Sets up the environment variables
 * 
 * Run with: node scripts/setup-datadog.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}Setting up Datadog monitoring...${colors.reset}`);

// Real implementation of datadog.ts that uses the actual packages
const realImplementation = `// Safely import Datadog packages with error handling
let datadogRum: any;
let datadogLogs: any;

try {
  // Dynamic imports to prevent build errors if packages are not installed
  const importRum = async () => {
    try {
      return await import('@datadog/browser-rum');
    } catch (error) {
      console.warn('Datadog RUM package not available:', error);
      return { datadogRum: null };
    }
  };

  const importLogs = async () => {
    try {
      return await import('@datadog/browser-logs');
    } catch (error) {
      console.warn('Datadog Logs package not available:', error);
      return { datadogLogs: null };
    }
  };

  // Initialize the imports
  importRum().then(module => { datadogRum = module.datadogRum; });
  importLogs().then(module => { datadogLogs = module.datadogLogs; });
} catch (error) {
  console.warn('Error initializing Datadog imports:', error);
}

// Initialize Datadog RUM (Real User Monitoring)
export const initDatadogRUM = () => {
  // Only initialize in production or if explicitly enabled in development
  if ((import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') && datadogRum) {
    try {
      datadogRum.init({
        applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID || '',
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN || '',
        site: import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com',
        service: 'object-recovery',
        env: import.meta.env.MODE || 'production',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input'
      });
      
      // Add custom user information when available
      datadogRum.setUser({
        id: 'user-id', // Replace with actual user ID when authenticated
        name: 'user-name', // Replace with actual user name when authenticated
        email: 'user-email' // Replace with actual user email when authenticated
      });
      
      console.log('Datadog RUM initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Datadog RUM:', error);
    }
  }
};

// Initialize Datadog Logs
export const initDatadogLogs = () => {
  // Only initialize in production or if explicitly enabled in development
  if ((import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') && datadogLogs) {
    try {
      datadogLogs.init({
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN || '',
        site: import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com',
        service: 'object-recovery',
        env: import.meta.env.MODE || 'production',
        forwardErrorsToLogs: true,
        sessionSampleRate: 100
      });
      
      console.log('Datadog Logs initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Datadog Logs:', error);
    }
  }
};

// Helper function to update user information when they log in
export const setDatadogUser = (userId: string, userName: string, userEmail: string) => {
  if ((import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') && datadogRum) {
    try {
      datadogRum.setUser({
        id: userId,
        name: userName,
        email: userEmail
      });
    } catch (error) {
      console.error('Failed to set Datadog user:', error);
    }
  }
};`;

try {
  // 1. Update the datadog.ts file with the real implementation
  const datadogFilePath = path.join(__dirname, '..', 'src', 'utils', 'datadog.ts');
  console.log(`${colors.yellow}Updating datadog.ts with real implementation...${colors.reset}`);
  fs.writeFileSync(datadogFilePath, realImplementation);
  console.log(`${colors.green}datadog.ts updated successfully!${colors.reset}`);

  // 2. Install the required packages
  console.log(`${colors.yellow}Installing Datadog packages...${colors.reset}`);
  try {
    execSync('npm install @datadog/browser-rum @datadog/browser-logs --save', { stdio: 'inherit' });
    console.log(`${colors.green}Datadog packages installed successfully!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Failed to install Datadog packages. Please install them manually:${colors.reset}`);
    console.error(`${colors.yellow}npm install @datadog/browser-rum @datadog/browser-logs --save${colors.reset}`);
  }

  // 3. Create .env file if it doesn't exist
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log(`${colors.yellow}Creating .env file from .env.example...${colors.reset}`);
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`${colors.green}.env file created. Please update it with your Datadog credentials.${colors.reset}`);
  }

  console.log(`
${colors.magenta}Datadog setup complete!${colors.reset}

${colors.cyan}Next steps:${colors.reset}
1. Update your .env file with your Datadog credentials:
   - VITE_DATADOG_APPLICATION_ID
   - VITE_DATADOG_CLIENT_TOKEN
   - VITE_DATADOG_SITE
2. Set VITE_ENABLE_DATADOG=true to enable Datadog in development
3. Restart your development server

${colors.green}Your application is now ready to use Datadog monitoring!${colors.reset}
  `);
} catch (error) {
  console.error(`${colors.red}Error setting up Datadog:${colors.reset}`, error);
}