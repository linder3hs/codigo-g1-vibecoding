/**
 * HTTP Client Tests
 * Tests for Axios configuration and utility functions
 */

// Mock axios
const mockAxiosInstance = {
  defaults: {
    headers: {
      common: {},
    },
    baseURL: "http://localhost:8000/api",
    timeout: 10000,
  },
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

jest.mock("axios", () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

// Mock store
jest.mock("../stores/store", () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      auth: {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        tokenExpiresAt: null,
      },
      todos: {
        todos: [],
        filter: "all",
        isLoading: false,
        error: null,
      },
    })),
  },
}));

// Mock auth slice actions
jest.mock("../stores/slices/authSlice", () => ({
  refreshTokenSuccess: jest.fn((payload) => ({ type: "auth/refreshTokenSuccess", payload })),
  logout: jest.fn(() => ({ type: "auth/logout" })),
}));

// Mock environment config
jest.mock("../config/env", () => ({
  env: {
    API_BASE_URL: "http://localhost:8000/api",
    IS_DEVELOPMENT: true,
  },
}));

// Import httpClient after mocks are set up
import httpClient, { httpClientUtils } from "./httpClient";

// Mock console methods
const originalConsole = {
  log: console.log,
  error: console.error,
};

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
});

describe("HttpClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset httpClient defaults to initial state
    httpClient.defaults.headers.common = {};
    httpClient.defaults.baseURL = "http://localhost:8000/api";
    httpClient.defaults.timeout = 10000;
  });

  describe("Module Exports", () => {
    it("should export httpClient as default", () => {
      expect(httpClient).toBeDefined();
      expect(httpClient.defaults).toBeDefined();
    });

    it("should export httpClientUtils", () => {
      expect(httpClientUtils).toBeDefined();
      expect(typeof httpClientUtils.setAuthToken).toBe("function");
      expect(typeof httpClientUtils.removeAuthToken).toBe("function");
      expect(typeof httpClientUtils.setBaseURL).toBe("function");
      expect(typeof httpClientUtils.getConfig).toBe("function");
    });
  });

  describe("Axios Instance Creation", () => {
    it("should have correct default configuration", () => {
      expect(httpClient.defaults.baseURL).toBe("http://localhost:8000/api");
      expect(httpClient.defaults.timeout).toBe(10000);
      expect(httpClient.defaults.headers).toBeDefined();
    });

    it("should have interceptors available", () => {
      expect(httpClient.interceptors).toBeDefined();
      expect(httpClient.interceptors.request).toBeDefined();
      expect(httpClient.interceptors.response).toBeDefined();
    });
  });

  describe("HttpClient Utils - setAuthToken", () => {
    it("should set authorization token in default headers", () => {
      // Act
      httpClientUtils.setAuthToken("test-token");

      // Assert
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer test-token");
    });

    it("should handle empty token", () => {
      // Act
      httpClientUtils.setAuthToken("");

      // Assert
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer ");
    });

    it("should handle null token", () => {
      // Act
      httpClientUtils.setAuthToken(null as unknown as string);

      // Assert
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer null");
    });
  });

  describe("HttpClient Utils - removeAuthToken", () => {
    it("should remove authorization token from default headers", () => {
      // Arrange
      httpClient.defaults.headers.common.Authorization = "Bearer test-token";

      // Act
      httpClientUtils.removeAuthToken();

      // Assert
      expect(httpClient.defaults.headers.common.Authorization).toBeUndefined();
    });

    it("should handle removing token when none exists", () => {
      // Arrange - ensure no token exists
      delete httpClient.defaults.headers.common.Authorization;

      // Act
      httpClientUtils.removeAuthToken();

      // Assert
      expect(httpClient.defaults.headers.common.Authorization).toBeUndefined();
    });
  });

  describe("HttpClient Utils - setBaseURL", () => {
    it("should update base URL", () => {
      // Act
      httpClientUtils.setBaseURL("https://api.example.com");

      // Assert
      expect(httpClient.defaults.baseURL).toBe("https://api.example.com");
    });

    it("should handle empty base URL", () => {
      // Act
      httpClientUtils.setBaseURL("");

      // Assert
      expect(httpClient.defaults.baseURL).toBe("");
    });

    it("should handle base URL with trailing slash", () => {
      // Act
      httpClientUtils.setBaseURL("https://api.example.com/");

      // Assert
      expect(httpClient.defaults.baseURL).toBe("https://api.example.com/");
    });
  });

  describe("HttpClient Utils - getConfig", () => {
    it("should return current configuration", () => {
      // Arrange
      httpClient.defaults.baseURL = "https://api.example.com";
      httpClient.defaults.timeout = 5000;
      httpClient.defaults.headers.common.Authorization = "Bearer test-token";

      // Act
      const config = httpClientUtils.getConfig();

      // Assert
      expect(config.baseURL).toBe("https://api.example.com");
      expect(config.timeout).toBe(5000);
      expect(config.headers).toBeDefined();
      expect(config.headers.common.Authorization).toBe("Bearer test-token");
    });

    it("should return configuration with default values", () => {
      // Act
      const config = httpClientUtils.getConfig();

      // Assert
      expect(config).toHaveProperty("baseURL");
      expect(config).toHaveProperty("timeout");
      expect(config).toHaveProperty("headers");
      expect(typeof config.baseURL).toBe("string");
      expect(typeof config.timeout).toBe("number");
      expect(typeof config.headers).toBe("object");
    });
  });

  describe("Token Management Integration", () => {
    it("should handle complete token lifecycle", () => {
      // Initial state - no token
      expect(httpClient.defaults.headers.common.Authorization).toBeUndefined();

      // Set token
      httpClientUtils.setAuthToken("initial-token");
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer initial-token");

      // Update token
      httpClientUtils.setAuthToken("updated-token");
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer updated-token");

      // Remove token
      httpClientUtils.removeAuthToken();
      expect(httpClient.defaults.headers.common.Authorization).toBeUndefined();
    });
  });

  describe("Configuration Management", () => {
    it("should handle base URL and timeout updates", () => {
      // Initial state
      const initialConfig = httpClientUtils.getConfig();
      expect(initialConfig.baseURL).toBe("http://localhost:8000/api");
      expect(initialConfig.timeout).toBe(10000);

      // Update base URL
      httpClientUtils.setBaseURL("https://production-api.com");
      const updatedConfig = httpClientUtils.getConfig();
      expect(updatedConfig.baseURL).toBe("https://production-api.com");
      expect(updatedConfig.timeout).toBe(10000); // Should remain unchanged
    });

    it("should maintain headers when updating base URL", () => {
      // Set token first
      httpClientUtils.setAuthToken("test-token");
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer test-token");

      // Update base URL
      httpClientUtils.setBaseURL("https://new-api.com");

      // Token should still be there
      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer test-token");
      expect(httpClient.defaults.baseURL).toBe("https://new-api.com");
    });
  });

  describe("HTTP Client Instance Properties", () => {
    it("should have all required axios methods", () => {
      expect(typeof httpClient.get).toBe("function");
      expect(typeof httpClient.post).toBe("function");
      expect(typeof httpClient.put).toBe("function");
      expect(typeof httpClient.delete).toBe("function");
    });

    it("should have interceptors configured", () => {
      expect(httpClient.interceptors).toBeDefined();
      expect(httpClient.interceptors.request).toBeDefined();
      expect(httpClient.interceptors.response).toBeDefined();
    });

    it("should have proper default configuration structure", () => {
      expect(httpClient.defaults).toBeDefined();
      expect(httpClient.defaults.headers).toBeDefined();
      expect(httpClient.defaults.headers.common).toBeDefined();
      expect(typeof httpClient.defaults.baseURL).toBe("string");
      expect(typeof httpClient.defaults.timeout).toBe("number");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid token gracefully", () => {
      // This should not throw an error
      expect(() => {
        httpClientUtils.setAuthToken(undefined as unknown as string);
      }).not.toThrow();

      expect(httpClient.defaults.headers.common.Authorization).toBe("Bearer undefined");
    });

    it("should handle invalid base URL gracefully", () => {
      // This should not throw an error
      expect(() => {
        httpClientUtils.setBaseURL(null as unknown as string);
      }).not.toThrow();

      expect(httpClient.defaults.baseURL).toBe(null);
    });
  });
});