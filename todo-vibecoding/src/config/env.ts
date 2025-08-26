/**
 * Environment configuration
 * Centralizes all environment variables with type safety
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
 * Validates that required environment variables are present
 * @param key - Environment variable key
 * @param defaultValue - Optional default value
 * @returns The environment variable value
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

/**
 * Environment configuration object
 * All environment variables are centralized here for type safety
 */
export const env: EnvConfig = {
  API_BASE_URL: getEnvVar("VITE_API_BASE_URL", "http://localhost:8000/api"),
  API_VERSION: getEnvVar("VITE_API_VERSION", "v1"),
  APP_NAME: getEnvVar("VITE_APP_NAME", "Todo VibeCoding"),
  APP_VERSION: getEnvVar("VITE_APP_VERSION", "1.0.0"),
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

/**
 * API endpoints configuration
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
 * Application constants
 */
export const appConfig = {
  name: env.APP_NAME,
  version: env.APP_VERSION,
  isDevelopment: env.IS_DEVELOPMENT,
  isProduction: env.IS_PRODUCTION,
} as const;
