/**
 * Mock implementation of Datadog packages for build time
 * 
 * This file provides mock implementations of Datadog packages
 * that will be used during the build process to avoid errors.
 */

// Mock implementation of datadogRum
export const datadogRum = {
  init: () => {},
  setUser: () => {},
  addRumGlobalContext: () => {},
  removeRumGlobalContext: () => {},
  addError: () => {},
  addAction: () => {},
  startView: () => {}
};

// Mock implementation of datadogLogs
export const datadogLogs = {
  init: () => {},
  logger: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
  }
};

// Mock initialization functions
export const initDatadogRUM = async (): Promise<void> => {
  console.log('Mock Datadog RUM initialization');
};

export const initDatadogLogs = async (): Promise<void> => {
  console.log('Mock Datadog Logs initialization');
};

// Mock user update function
export const setDatadogUser = async (): Promise<void> => {
  console.log('Mock Datadog user update');
};

// Mock getter for the RUM instance
export const getDatadogRum = async () => {
  return datadogRum;
};