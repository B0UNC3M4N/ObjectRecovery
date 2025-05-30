/**
 * Vite plugin to handle Datadog packages
 * 
 * This plugin helps with properly handling Datadog packages during build
 * by ensuring they're properly externalized and don't cause build issues.
 */

import type { Plugin } from 'vite';

export function datadogPlugin(): Plugin {
  return {
    name: 'vite-plugin-datadog',
    
    // Intercept and handle imports of Datadog packages
    resolveId(id) {
      // Check if the import is for a Datadog package
      if (id === '@datadog/browser-logs' || id === '@datadog/browser-rum') {
        // Return the id to mark it as external
        return { id, external: true };
      }
      return null;
    },
    
    // Transform imports of Datadog packages
    transform(code, id) {
      // Only process JavaScript/TypeScript files
      if (!id.match(/\.[jt]sx?$/)) return null;
      
      // Check if the code imports Datadog packages
      if (code.includes('@datadog/browser-logs') || code.includes('@datadog/browser-rum')) {
        // Replace direct imports with dynamic imports
        let transformedCode = code;
        
        // Replace static imports with dynamic imports
        transformedCode = transformedCode.replace(
          /import\s+\{\s*datadogLogs\s*\}\s+from\s+['"]@datadog\/browser-logs['"]/g,
          `const datadogLogs = typeof window !== 'undefined' 
            ? await import(/* @vite-ignore */ '@datadog/browser-logs').then(m => m.datadogLogs).catch(() => ({ 
                init: () => {}, 
                logger: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } 
              }))
            : { 
                init: () => {}, 
                logger: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } 
              }`
        );
        
        transformedCode = transformedCode.replace(
          /import\s+\{\s*datadogRum\s*\}\s+from\s+['"]@datadog\/browser-rum['"]/g,
          `const datadogRum = typeof window !== 'undefined'
            ? await import(/* @vite-ignore */ '@datadog/browser-rum').then(m => m.datadogRum).catch(() => ({
                init: () => {}, setUser: () => {}, addRumGlobalContext: () => {}, 
                removeRumGlobalContext: () => {}, addError: () => {}, addAction: () => {}
              }))
            : {
                init: () => {}, setUser: () => {}, addRumGlobalContext: () => {}, 
                removeRumGlobalContext: () => {}, addError: () => {}, addAction: () => {}
              }`
        );
        
        return transformedCode;
      }
      
      return null;
    }
  };
}