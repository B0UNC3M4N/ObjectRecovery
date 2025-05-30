import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initDatadogRUM, initDatadogLogs } from '@/utils/datadog';

// Initialize Datadog with environment variables
const initDatadog = async () => {
  try {
    // Initialize RUM (Real User Monitoring)
    await initDatadogRUM();
    
    // Initialize Logs
    await initDatadogLogs();
    
    console.log('Datadog initialization complete');
  } catch (error) {
    console.error('Failed to initialize Datadog:', error);
  }
};

// Initialize Datadog
initDatadog().catch(error => {
  console.error('Error during Datadog initialization:', error);
});

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
