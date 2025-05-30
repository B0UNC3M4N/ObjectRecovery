import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render the app immediately
createRoot(document.getElementById("root")!).render(<App />);

// Initialize Datadog after the app has rendered (only in browser)
if (typeof window !== 'undefined') {
  // Use setTimeout to defer initialization until after the app renders
  setTimeout(() => {
    // Use a function that doesn't directly import Datadog
    const initDatadog = async () => {
      try {
        // Dynamic import with a try/catch to handle failures gracefully
        const { initDatadogRUM, initDatadogLogs } = await import('./utils/datadog');
        
        // Initialize Datadog services
        await initDatadogRUM();
        await initDatadogLogs();
        
        console.log('Datadog initialization complete');
      } catch (error) {
        console.error('Failed to initialize Datadog:', error);
      }
    };
    
    // Call the initialization function
    initDatadog().catch(error => {
      console.error('Error during Datadog initialization:', error);
    });
  }, 100);
}
