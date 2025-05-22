/**
 * Script to install Datadog packages
 * 
 * Run with: node scripts/install-datadog.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

console.log(`${colors.cyan}Starting Datadog packages installation...${colors.reset}`);

try {
  // Check if package.json exists
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found. Make sure you are running this script from the project root.');
  }

  // Install Datadog packages
  console.log(`${colors.yellow}Installing Datadog packages...${colors.reset}`);
  execSync('npm install @datadog/browser-rum @datadog/browser-logs --save', { stdio: 'inherit' });

  console.log(`${colors.green}Datadog packages installed successfully!${colors.reset}`);
  
  // Create .env file if it doesn't exist
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log(`${colors.yellow}Creating .env file from .env.example...${colors.reset}`);
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`${colors.green}.env file created. Please update it with your Datadog credentials.${colors.reset}`);
  }

  console.log(`
${colors.magenta}Next steps:${colors.reset}
1. Update your .env file with your Datadog credentials
2. Set VITE_ENABLE_DATADOG=true to enable Datadog in development
3. Restart your development server

${colors.green}Datadog setup complete!${colors.reset}
  `);
} catch (error) {
  console.error(`${colors.red}Error installing Datadog packages:${colors.reset}`, error.message);
  process.exit(1);
}