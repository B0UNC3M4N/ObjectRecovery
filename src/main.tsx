import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render the app immediately
createRoot(document.getElementById("root")!).render(<App />);

// Initialize Datadog after the app has rendered
// This is done in a separate import to avoid build issues
if (typeof window !== 'undefined') {
  // Use dynamic import to load the Datadog loader
  import('./utils/datadogLoader')
    .then(({ initializeDatadogWithDelay }) => {
      // Initialize Datadog with a small delay to prioritize app rendering
      initializeDatadogWithDelay(100);
    })
    .catch(error => {
      console.error('Failed to load Datadog:', error);
    });
}
