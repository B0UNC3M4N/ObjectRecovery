import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';
import { initDatadogRUM, initDatadogLogs } from './utils/datadog';

// Initialize Datadog with environment variables
const initDatadog = () => {
  // Only initialize if explicitly enabled or in production
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') {
    try {
      // Initialize RUM (Real User Monitoring)
      datadogRum.init({
        applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID || 'e2de982d-be99-46e9-8150-8c4409693f3b',
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN || 'pub4f710c5268b5f5d1d58139fdbe7315fa',
        site: import.meta.env.VITE_DATADOG_SITE || 'us5.datadoghq.com',
        service: 'object-recovery',
        env: import.meta.env.MODE || 'production',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input',
      });
      
      // Start session replay recording
      datadogRum.startSessionReplayRecording();
      
      // Initialize Logs
      datadogLogs.init({
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN || 'pub4f710c5268b5f5d1d58139fdbe7315fa',
        site: import.meta.env.VITE_DATADOG_SITE || 'us5.datadoghq.com',
        service: 'object-recovery',
        env: import.meta.env.MODE || 'production',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        forwardErrorsToLogs: true,
        sessionSampleRate: 100
      });
      
      // Add global context for better tracking
      datadogRum.addRumGlobalContext('app_version', import.meta.env.VITE_APP_VERSION || '1.0.0');
      
      console.log('Datadog initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Datadog:', error);
    }
  } else {
    console.log('Datadog initialization skipped (not enabled)');
  }
};

// Initialize Datadog
initDatadog();

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
