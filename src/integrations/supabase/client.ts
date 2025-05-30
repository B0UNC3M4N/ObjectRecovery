// Supabase client with Datadog integration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getDatadogRum } from '@/utils/datadog';

// Initialize a placeholder for the Datadog RUM instance
let datadogRum: any = {
  addAction: () => {},
  addError: () => {}
};

// Load the real Datadog RUM instance asynchronously
if (typeof window !== 'undefined') {
  getDatadogRum().then(rum => {
    datadogRum = rum;
  }).catch(error => {
    console.error('Failed to load Datadog RUM:', error);
  });
}

// Use environment variables when available, fallback to hardcoded values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zztqwjstrqmwpmcqfiqu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dHF3anN0cnFtd3BtY3FmaXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTQzNTUsImV4cCI6MjA2MzI5MDM1NX0.lm1jXxQuvWu3nSJlbQWfWBpVkVUDnCesyuZ0y6DwBJA";

// Create a custom fetch function with Datadog monitoring
const monitoredFetch = (url: string, options: RequestInit): Promise<Response> => {
  const startTime = performance.now();
  const method = options.method || 'GET';
  
  // Extract the endpoint path from the URL for better tracking
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  
  // Add RUM custom action for API call if Datadog is available
  if (datadogRum && typeof datadogRum.addAction === 'function') {
    datadogRum.addAction('supabase_request', {
      method,
      path,
      timestamp: new Date().toISOString()
    });
  }
  
  // Log the request to console in development
  if (import.meta.env.DEV) {
    console.debug(`Supabase request: ${method} ${path}`);
  }
  
  return fetch(url, options)
    .then(response => {
      const duration = performance.now() - startTime;
      
      // Track successful response if Datadog is available
      if (datadogRum && typeof datadogRum.addAction === 'function') {
        datadogRum.addAction('supabase_response', {
          method,
          path,
          status: response.status,
          duration,
          timestamp: new Date().toISOString()
        });
      }
      
      // Log the response to console in development
      if (import.meta.env.DEV) {
        console.debug(`Supabase response: ${method} ${path} (${response.status}) in ${duration.toFixed(2)}ms`);
      }
      
      return response;
    })
    .catch(error => {
      const duration = performance.now() - startTime;
      
      // Track error with Datadog if available
      if (datadogRum && typeof datadogRum.addError === 'function') {
        datadogRum.addError(error, 'supabase_request', {
          method,
          path,
          duration,
          timestamp: new Date().toISOString()
        });
      }
      
      // Log the error to console
      console.error(`Supabase error: ${method} ${path}`, error);
      
      throw error;
    });
};

// Create Supabase client with custom fetch and auto-retry
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    fetch: monitoredFetch,
    headers: {
      'x-application-name': 'object-recovery'
    }
  }
});

// Add error handler for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  try {
    // Track auth events in Datadog if available
    if (datadogRum && typeof datadogRum.addAction === 'function') {
      datadogRum.addAction('auth_state_change', {
        event,
        user: session?.user?.id,
        timestamp: new Date().toISOString()
      });
    }
    
    // Update user context in Datadog when user signs in
    if (event === 'SIGNED_IN' && session?.user && datadogRum && typeof datadogRum.setUser === 'function') {
      datadogRum.setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.full_name
      });
    }
    
    // Clear user context in Datadog when user signs out
    if (event === 'SIGNED_OUT' && datadogRum && typeof datadogRum.setUser === 'function') {
      datadogRum.setUser({
        id: undefined,
        email: undefined,
        name: undefined
      });
    }
  } catch (error) {
    console.error('Error handling auth state change:', error);
    if (datadogRum && typeof datadogRum.addError === 'function') {
      datadogRum.addError(error, 'auth_state_change');
    }
  }
});