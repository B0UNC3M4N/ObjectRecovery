import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: 'e2de982d-be99-46e9-8150-8c4409693f3b',
    clientToken: 'pub4f710c5268b5f5d1d58139fdbe7315fa',
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'us5.datadoghq.com',
    service: 'object-recovery',
    env: '<ENV_NAME>',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
});
datadogRum.startSessionReplayRecording();

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
