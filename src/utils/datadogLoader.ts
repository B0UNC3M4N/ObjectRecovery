/**
 * Datadog loader utility
 * 
 * This file provides a way to load Datadog in the browser
 * without causing build issues with SSR or static site generation.
 */

// Function to initialize Datadog in the browser
export const loadDatadog = async (): Promise<void> => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    console.log('Skipping Datadog initialization in non-browser environment');
    return;
  }

  try {
    // Dynamically import the datadog utilities
    const { initDatadogRUM, initDatadogLogs } = await import('./datadog');
    
    // Initialize RUM (Real User Monitoring)
    await initDatadogRUM();
    
    // Initialize Logs
    await initDatadogLogs();
    
    console.log('Datadog initialization complete');
  } catch (error) {
    console.error('Failed to initialize Datadog:', error);
  }
};

// Export a function to initialize Datadog with a delay
export const initializeDatadogWithDelay = (delayMs = 0): void => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      loadDatadog().catch(error => {
        console.error('Error during Datadog initialization:', error);
      });
    }, delayMs);
  }
};