// This file should be imported before any other imports in your server-side code
const tracer = require('dd-trace').init({
  service: 'object-recovery',
  env: process.env.NODE_ENV || 'production',
  version: process.env.npm_package_version || '1.0.0',
  logInjection: true,
  profiling: true,
  runtimeMetrics: true
});

module.exports = tracer;