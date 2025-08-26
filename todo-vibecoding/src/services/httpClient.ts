/**
 * HTTP Client Configuration
 * Configures Axios with interceptors for authentication and error handling
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { env } from "../config/env";
import { store } from "../stores/store";
import { refreshTokenSuccess, logout } from "../stores/slices/authSlice";

/**
 * HTTP Client configuration interface
 */
interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * API Error response interface
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Extended request config with retry flag
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * API response data interface
 */
interface ApiResponseData {
  message?: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * HTTP Client configuration
 */
const httpClientConfig: HttpClientConfig = {
  baseURL: `${env.API_BASE_URL}`,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

/**
 * Create Axios instance with base configuration
 */
const httpClient: AxiosInstance = axios.create(httpClientConfig);

/**
 * Request interceptor to add authentication token
 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    // Add authorization header if token exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (env.IS_DEVELOPMENT) {
      console.log("🚀 HTTP Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and token refresh
 */
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response in development
    if (env.IS_DEVELOPMENT) {
      console.log("✅ HTTP Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as ExtendedAxiosRequestConfig)._retry
    ) {
      (originalRequest as ExtendedAxiosRequestConfig)._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;

        if (refreshToken) {
          // Attempt to refresh token
          const refreshResponse = await axios.post(
            `${env.API_BASE_URL}/${env.API_VERSION}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const {
            token: newToken,
            refreshToken: newRefreshToken,
            expiresIn,
          } = refreshResponse.data;

          // Update tokens in store
          store.dispatch(
            refreshTokenSuccess({
              token: newToken,
              refreshToken: newRefreshToken,
              expiresIn,
            })
          );

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return httpClient(originalRequest);
        }
      } catch {
        // Refresh failed, logout user
        store.dispatch(logout());

        // Redirect to login page if in browser environment
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    // Create standardized error object
    const responseData = error.response?.data as ApiResponseData;
    const apiError: ApiError = {
      message:
        responseData?.message ||
        error.message ||
        "An unexpected error occurred",
      status: error.response?.status || 0,
      code: responseData?.code,
      details: responseData?.details,
    };

    // Log error in development
    if (env.IS_DEVELOPMENT) {
      console.error("❌ HTTP Error:", {
        status: apiError.status,
        message: apiError.message,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        code: apiError.code,
      });
    }

    return Promise.reject(apiError);
  }
);

/**
 * HTTP Client utility functions
 */
export const httpClientUtils = {
  /**
   * Set authorization token for all requests
   */
  setAuthToken: (token: string) => {
    httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  /**
   * Remove authorization token
   */
  removeAuthToken: () => {
    delete httpClient.defaults.headers.common.Authorization;
  },

  /**
   * Update base URL
   */
  setBaseURL: (baseURL: string) => {
    httpClient.defaults.baseURL = baseURL;
  },

  /**
   * Get current configuration
   */
  getConfig: () => ({
    baseURL: httpClient.defaults.baseURL,
    timeout: httpClient.defaults.timeout,
    headers: httpClient.defaults.headers,
  }),
};

/**
 * Export configured HTTP client
 */
export default httpClient;

/**
 * Export types for external use
 */
export type { AxiosResponse, AxiosError, InternalAxiosRequestConfig };
