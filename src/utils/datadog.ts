/**
 * Datadog monitoring utilities
 * 
 * This file provides a mock implementation of Datadog monitoring functions
 * that will work even if the Datadog packages are not installed.
 * 
 * When the actual packages are installed, the real implementations will be used.
 */

// Mock implementations that do nothing but log
const mockDatadogRum = {
  init: (config: any) => {
    console.log('Mock Datadog RUM init called with config:', config);
  },
  setUser: (user: any) => {
    console.log('Mock Datadog RUM setUser called with user:', user);
  },
  addRumGlobalContext: (key: string, value: any) => {
    console.log('Mock Datadog RUM addRumGlobalContext called:', key, value);
  },
  removeRumGlobalContext: (key: string) => {
    console.log('Mock Datadog RUM removeRumGlobalContext called:', key);
  },
  addError: (error: Error | string, source?: string, context?: object) => {
    console.log('Mock Datadog RUM addError called:', error, source, context);
  },
  addAction: (name: string, context?: object) => {
    console.log('Mock Datadog RUM addAction called:', name, context);
  }
};

const mockDatadogLogs = {
  init: (config: any) => {
    console.log('Mock Datadog Logs init called with config:', config);
  },
  logger: {
    debug: (message: string, context?: object) => {
      console.log('Mock Datadog Logs debug:', message, context);
    },
    info: (message: string, context?: object) => {
      console.log('Mock Datadog Logs info:', message, context);
    },
    warn: (message: string, context?: object) => {
      console.log('Mock Datadog Logs warn:', message, context);
    },
    error: (message: string | Error, context?: object) => {
      console.log('Mock Datadog Logs error:', message, context);
    }
  }
};

// Cache for the imported modules to avoid multiple imports
let datadogRumModule: any = null;
let datadogLogsModule: any = null;

// Safe import function that won't break builds
const safeImport = async (modulePath: string) => {
  // Only attempt import in browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    return await import(/* @vite-ignore */ modulePath);
  } catch (error) {
    console.warn(`Failed to import ${modulePath}:`, error);
    return null;
  }
};

// Initialize Datadog RUM (Real User Monitoring)
export const initDatadogRUM = async (): Promise<void> => {
  // Only initialize in production or if explicitly enabled in development
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') {
    try {
      // Use mock implementation by default
      let datadogRum = mockDatadogRum;
      
      // Only try to import the real module if we're in a browser environment
      if (typeof window !== 'undefined') {
        try {
          // Use cached module if available
          if (!datadogRumModule) {
            // Use @vite-ignore to prevent Vite from trying to analyze this import
            datadogRumModule = await safeImport('@datadog/browser-rum');
          }
          
          if (datadogRumModule?.datadogRum) {
            datadogRum = datadogRumModule.datadogRum;
            console.log('Using real Datadog RUM implementation');
          }
        } catch (importError) {
          console.warn('Datadog RUM package not available, using mock implementation');
          // Continue with mock implementation
        }
      }
      
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
      
      console.log('Datadog RUM initialized');
      
      // Export for global access if needed
      if (typeof window !== 'undefined') {
        (window as any).__DATADOG_RUM__ = datadogRum;
      }
    } catch (error) {
      console.error('Failed to initialize Datadog RUM:', error);
    }
  }
};

// Initialize Datadog Logs
export const initDatadogLogs = async (): Promise<void> => {
  // Only initialize in production or if explicitly enabled in development
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') {
    try {
      // Use mock implementation by default
      let datadogLogs = mockDatadogLogs;
      
      // Only try to import the real module if we're in a browser environment
      if (typeof window !== 'undefined') {
        try {
          // Use cached module if available
          if (!datadogLogsModule) {
            // Use @vite-ignore to prevent Vite from trying to analyze this import
            datadogLogsModule = await safeImport('@datadog/browser-logs');
          }
          
          if (datadogLogsModule?.datadogLogs) {
            datadogLogs = datadogLogsModule.datadogLogs;
            console.log('Using real Datadog Logs implementation');
          }
        } catch (importError) {
          console.warn('Datadog Logs package not available, using mock implementation');
          // Continue with mock implementation
        }
      }
      
      datadogLogs.init({
        clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN || '',
        site: import.meta.env.VITE_DATADOG_SITE || 'datadoghq.com',
        service: 'object-recovery',
        env: import.meta.env.MODE || 'production',
        forwardErrorsToLogs: true,
        sessionSampleRate: 100
      });
      
      console.log('Datadog Logs initialized');
      
      // Export for global access if needed
      if (typeof window !== 'undefined') {
        (window as any).__DATADOG_LOGS__ = datadogLogs;
      }
    } catch (error) {
      console.error('Failed to initialize Datadog Logs:', error);
    }
  }
};

// Helper function to update user information when they log in
export const setDatadogUser = async (userId: string, userName: string, userEmail: string): Promise<void> => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') {
    try {
      // Try to use the globally cached instance first
      let datadogRum = (window as any).__DATADOG_RUM__ || mockDatadogRum;
      
      // If not available, try to import
      if (datadogRum === mockDatadogRum && typeof window !== 'undefined') {
        try {
          // Use cached module if available
          if (!datadogRumModule) {
            datadogRumModule = await safeImport('@datadog/browser-rum');
          }
          
          if (datadogRumModule?.datadogRum) {
            datadogRum = datadogRumModule.datadogRum;
          }
        } catch (importError) {
          console.warn('Datadog RUM package not available, using mock implementation');
          // Continue with mock implementation
        }
      }
      
      datadogRum.setUser({
        id: userId,
        name: userName,
        email: userEmail
      });
    } catch (error) {
      console.error('Failed to set Datadog user:', error);
    }
  }
};

// Export a getter for the RUM instance that can be used throughout the app
export const getDatadogRum = async () => {
  if (typeof window !== 'undefined' && (window as any).__DATADOG_RUM__) {
    return (window as any).__DATADOG_RUM__;
  }
  
  // Try to import if not already cached
  if (!datadogRumModule && typeof window !== 'undefined') {
    datadogRumModule = await safeImport('@datadog/browser-rum');
  }
  
  return datadogRumModule?.datadogRum || mockDatadogRum;
};