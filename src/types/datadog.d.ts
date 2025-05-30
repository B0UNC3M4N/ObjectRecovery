/**
 * Type declarations for Datadog packages
 * This helps TypeScript understand the structure of the Datadog modules
 * even if they're not installed.
 */

declare module '@datadog/browser-rum' {
  interface DatadogRumUser {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: any;
  }

  interface DatadogRumInitOptions {
    applicationId: string;
    clientToken: string;
    site?: string;
    service?: string;
    env?: string;
    version?: string;
    sessionSampleRate?: number;
    sessionReplaySampleRate?: number;
    trackUserInteractions?: boolean;
    trackResources?: boolean;
    trackLongTasks?: boolean;
    defaultPrivacyLevel?: 'mask' | 'mask-user-input' | 'allow';
    [key: string]: any;
  }

  export const datadogRum: {
    init: (options: DatadogRumInitOptions) => void;
    setUser: (user: DatadogRumUser) => void;
    addRumGlobalContext: (key: string, value: any) => void;
    removeRumGlobalContext: (key: string) => void;
    addError: (error: Error | string, source?: string, context?: object) => void;
    addAction: (name: string, context?: object) => void;
    startView: (name: string, context?: object) => void;
    [key: string]: any;
  };
}

declare module '@datadog/browser-logs' {
  interface DatadogLogsInitOptions {
    clientToken: string;
    site?: string;
    service?: string;
    env?: string;
    forwardErrorsToLogs?: boolean;
    sessionSampleRate?: number;
    [key: string]: any;
  }

  export const datadogLogs: {
    init: (options: DatadogLogsInitOptions) => void;
    logger: {
      debug: (message: string, context?: object) => void;
      info: (message: string, context?: object) => void;
      warn: (message: string, context?: object) => void;
      error: (message: string | Error, context?: object) => void;
    };
    [key: string]: any;
  };
}