import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { datadogPlugin } from "./vite-plugins/datadog-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    datadogPlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Improve chunk splitting to isolate Datadog dependencies
    rollupOptions: {
      output: {
        manualChunks: {
          // Put Datadog packages in a separate chunk
          datadog: ['@datadog/browser-logs', '@datadog/browser-rum'],
          // Put React in its own chunk
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Ensure Datadog packages are properly tree-shaken
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs'],
    },
  },
  optimizeDeps: {
    // Ensure Datadog packages are pre-bundled for development
    include: ['@datadog/browser-logs', '@datadog/browser-rum'],
  },
}));
