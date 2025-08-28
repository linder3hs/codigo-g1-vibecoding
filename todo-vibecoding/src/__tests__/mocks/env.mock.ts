/**
 * Mock for environment configuration
 * Used in Jest tests to avoid import.meta.env issues
 */

interface EnvConfig {
  API_BASE_URL: string;
  API_VERSION: string;
  APP_NAME: string;
  APP_VERSION: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

/**
 * Mock environment configuration object
 */
export const env: EnvConfig = {
  API_BASE_URL: "http://localhost:8000/api",
  API_VERSION: "v1",
  APP_NAME: "Todo VibeCoding",
  APP_VERSION: "1.0.0",
  IS_DEVELOPMENT: true,
  IS_PRODUCTION: false,
};

/**
 * Mock API endpoints configuration
 */
export const apiEndpoints = {
  base: `${env.API_BASE_URL}/${env.API_VERSION}`,
  todos: {
    list: "/tasks",
    create: "/tasks/",
    update: (id: string) => `/tasks/${id}/`,
    delete: (id: string) => `/tasks/${id}/`,
    toggle: (id: string) => `/tasks/${id}/toggle`,
  },
} as const;

/**
 * Mock app configuration
 */
export const appConfig = {
  name: env.APP_NAME,
  version: env.APP_VERSION,
  isDevelopment: env.IS_DEVELOPMENT,
  isProduction: env.IS_PRODUCTION,
} as const;