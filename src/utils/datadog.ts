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
  addError: (error: Error | string) => {
    console.log('Mock Datadog RUM addError called:', error);
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

// Initialize Datadog RUM (Real User Monitoring)
export const initDatadogRUM = async (): Promise<void> => {
  // Only initialize in production or if explicitly enabled in development
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') {
    try {
      // Try to dynamically import the real Datadog RUM module
      let datadogRum;
      try {
        const module = await import('@datadog/browser-rum');
        datadogRum = module.datadogRum;
        console.log('Using real Datadog RUM implementation');
      } catch (importError) {
        console.warn('Datadog RUM package not available, using mock implementation');
        datadogRum = mockDatadogRum;
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
      // Try to dynamically import the real Datadog Logs module
      let datadogLogs;
      try {
        const module = await import('@datadog/browser-logs');
        datadogLogs = module.datadogLogs;
        console.log('Using real Datadog Logs implementation');
      } catch (importError) {
        console.warn('Datadog Logs package not available, using mock implementation');
        datadogLogs = mockDatadogLogs;
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
    } catch (error) {
      console.error('Failed to initialize Datadog Logs:', error);
    }
  }
};

// Helper function to update user information when they log in
export const setDatadogUser = async (userId: string, userName: string, userEmail: string): Promise<void> => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_DATADOG === 'true') {
    try {
      // Try to dynamically import the real Datadog RUM module
      let datadogRum;
      try {
        const module = await import('@datadog/browser-rum');
        datadogRum = module.datadogRum;
      } catch (importError) {
        console.warn('Datadog RUM package not available, using mock implementation');
        datadogRum = mockDatadogRum;
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