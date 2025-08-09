/**
 * Polyfills for React Router v7 testing
 * 
 * React Router v7 uses TextEncoder internally, which is not available in Jest's Node.js environment.
 * This polyfill ensures TextEncoder is available during tests.
 * 
 * Reference: https://remarkablemark.org/blog/2025/02/02/fix-jest-errors-in-react-router-7-upgrade/
 */

// Import TextEncoder from Node.js util module
const { TextEncoder, TextDecoder } = require('util');

// Polyfill TextEncoder for React Router v7
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

// Polyfill TextDecoder for completeness
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Log polyfill loading for debugging
console.log('✅ React Router v7 polyfills loaded successfully');