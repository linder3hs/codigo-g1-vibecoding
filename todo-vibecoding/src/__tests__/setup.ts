/**
 * @fileoverview Configuración global para tests de Jest
 *
 * Este archivo contiene la configuración necesaria para ejecutar tests
 * en el entorno de Jest, incluyendo:
 * - Polyfills para Node.js
 * - Mock de import.meta.env para variables de entorno de Vite
 * - Configuración de Mock Service Worker (MSW)
 * - Extensiones de Jest DOM para matchers adicionales
 * - Mocks de APIs del navegador no disponibles en Node.js
 * - Configuración de objetos globales para testing
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

// Polyfills for Node.js environment
import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Set up global polyfills
Object.assign(global, {
  TextEncoder,
  TextDecoder,
});

// Basic polyfills for MSW compatibility
if (typeof global.ReadableStream === "undefined") {
  global.ReadableStream =
    class ReadableStream {} as unknown as typeof ReadableStream;
}
if (typeof global.WritableStream === "undefined") {
  global.WritableStream =
    class WritableStream {} as unknown as typeof WritableStream;
}
if (typeof global.TransformStream === "undefined") {
  global.TransformStream =
    class TransformStream {} as unknown as typeof TransformStream;
}

// Mock import.meta.env for Vite environment variables
Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: "http://localhost:8000/api",
        VITE_APP_NAME: "Todo VibeCoding",
        VITE_APP_VERSION: "1.0.0",
        DEV: true,
        PROD: false,
        MODE: "test",
      },
    },
  },
  writable: true,
  configurable: true,
});

// Types for Request mock
// Note: Request and Response are now provided by whatwg-fetch
// No need for manual mock implementations

// Mock BroadcastChannel ANTES de importar MSW
global.BroadcastChannel = jest.fn().mockImplementation(() => ({
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  close: jest.fn(),
}));

// Importa matchers adicionales de Jest DOM para testing
import "@testing-library/jest-dom";

// Importa y configura MSW para mocking de APIs
import { server } from "./mocks/server";

// Establish API mocking before all tests
beforeAll(() => {
  // Start the interception on the client side
  server.listen({
    // Warn about unhandled requests instead of failing tests
    onUnhandledRequest: "warn",
  });
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(() => {
  server.close();
});

// global.TextDecoder = TextDecoder;
/**
 * Mock de IntersectionObserver API
 *
 * IntersectionObserver no está disponible en el entorno de Node.js,
 * por lo que creamos un mock para evitar errores en los tests.
 *
 * @class IntersectionObserver
 * @description Mock que simula la API IntersectionObserver del navegador
 */
Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: class IntersectionObserver {
    /**
     * Constructor del mock de IntersectionObserver
     * @constructor
     */
    constructor() {}

    /**
     * Mock del método disconnect
     * @method disconnect
     */
    disconnect() {}

    /**
     * Mock del método observe
     * @method observe
     */
    observe() {}

    /**
     * Mock del método unobserve
     * @method unobserve
     */
    unobserve() {}
  },
});

/**
 * Mock de ResizeObserver API
 *
 * ResizeObserver no está disponible en el entorno de Node.js,
 * por lo que creamos un mock para evitar errores en los tests.
 *
 * @class ResizeObserver
 * @description Mock que simula la API ResizeObserver del navegador
 */
Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: class ResizeObserver {
    /**
     * Constructor del mock de ResizeObserver
     * @constructor
     */
    constructor() {}

    /**
     * Mock del método disconnect
     * @method disconnect
     */
    disconnect() {}

    /**
     * Mock del método observe
     * @method observe
     */
    observe() {}

    /**
     * Mock del método unobserve
     * @method unobserve
     */
    unobserve() {}
  },
});

/**
 * Mock de window.matchMedia API
 *
 * matchMedia no está disponible en el entorno de Node.js,
 * por lo que creamos un mock para testing de media queries.
 *
 * @function matchMedia
 * @param {string} query - Media query string
 * @returns {Object} Mock object con propiedades de MediaQueryList
 * @description Mock que simula la API matchMedia del navegador
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false, // Siempre retorna false en tests
    media: query, // Retorna la query original
    onchange: null, // Handler de cambio
    addListener: jest.fn(), // Método deprecated
    removeListener: jest.fn(), // Método deprecated
    addEventListener: jest.fn(), // Método moderno para eventos
    removeEventListener: jest.fn(), // Método moderno para remover eventos
    dispatchEvent: jest.fn(), // Método para disparar eventos
  })),
});

/**
 * Mock de CSS API
 *
 * Proporciona un mock de la API CSS para testing,
 * especialmente útil para CSS.supports().
 *
 * @namespace CSS
 * @property {Function} supports - Mock de CSS.supports() que siempre retorna false
 * @description Mock que simula la API CSS del navegador
 */
Object.defineProperty(window, "CSS", {
  value: {
    /**
     * Mock del método CSS.supports()
     * @function supports
     * @returns {boolean} Siempre retorna false en el entorno de testing
     */
    supports: jest.fn().mockReturnValue(false),
  },
});
