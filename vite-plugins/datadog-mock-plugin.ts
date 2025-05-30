/**
 * Vite plugin to replace Datadog imports with mock implementations
 * 
 * This plugin replaces imports of Datadog packages with our mock implementation
 * during the build process to avoid errors.
 */

import type { Plugin } from 'vite';
import path from 'path';

export function datadogMockPlugin(): Plugin {
  return {
    name: 'vite-plugin-datadog-mock',
    
    resolveId(id) {
      // Check if the import is for a Datadog package
      if (id === '@datadog/browser-logs' || id === '@datadog/browser-rum') {
        // Return the path to our mock implementation
        return path.resolve(process.cwd(), 'src/utils/datadogMock.ts');
      }
      return null;
    }
  };
}