import { cleanup } from "@testing-library/react";
import { authService } from "./authService";
import { store } from "../stores/store";
import type { LoginCredentials, RegisterData } from "../types/auth";

// Mock the store to avoid Redux dependencies in unit tests
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
      },
    })),
  },
}));

// Mock httpClient to test service logic without actual HTTP calls
jest.mock("./httpClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

import httpClient from "./httpClient";

const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe("AuthService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Clear localStorage
    localStorage.clear();

    // Reset store mock
    (store.dispatch as jest.Mock).mockClear();
    (store.getState as jest.Mock).mockReturnValue({
      auth: {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    });
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe("Login Functionality", () => {
    it("should make correct API call to login endpoint", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      const mockApiResponse = {
        data: {
          message: "Login successful",
          user: {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            avatar: undefined,
            role: "user",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          tokens: {
            access: "mock_access_token",
            refresh: "mock_refresh_token",
          },
          expiresIn: 3600,
        },
      };

      mockHttpClient.post.mockResolvedValueOnce(mockApiResponse);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/auth/login/",
        mockCredentials
      );
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.user.username).toBe("testuser");
      expect(result.data?.token).toBe("mock_access_token");
    });

    it("should handle login API errors correctly", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "wronguser",
        password: "wrongpassword",
      };

      const mockError = {
        response: {
          data: {
            message: "Invalid credentials",
            code: "INVALID_CREDENTIALS",
          },
        },
      };

      mockHttpClient.post.mockRejectedValueOnce(mockError);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/auth/login/",
        mockCredentials
      );
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toBe("Invalid credentials");
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
    });

    it("should store authentication data after successful login", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      const mockApiResponse = {
        data: {
          message: "Login successful",
          user: {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
            avatar: undefined,
            role: "user",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          tokens: {
            access: "mock_access_token",
            refresh: "mock_refresh_token",
          },
          expiresIn: 3600,
        },
      };

      mockHttpClient.post.mockResolvedValueOnce(mockApiResponse);

      // Act
      await authService.login(mockCredentials);

      // Assert
      expect(localStorage.getItem("auth_token")).toBe("mock_access_token");
      expect(localStorage.getItem("refresh_token")).toBe("mock_refresh_token");
      expect(localStorage.getItem("user_data")).toBeDefined();
      expect(mockHttpClient.defaults.headers.common["Authorization"]).toBe(
        "Bearer mock_access_token"
      );
    });
  });

  describe("Register Functionality", () => {
    it("should make correct API call to register endpoint", async () => {
      // Arrange
      const mockRegisterData: RegisterData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        password_confirm: "password123",
        first_name: "New",
        last_name: "User",
      };

      const mockApiResponse = {
        data: {
          message: "Registration successful",
          user: {
            id: "2",
            username: "newuser",
            email: "newuser@example.com",
            first_name: "New",
            last_name: "User",
            avatar: undefined,
            role: "user",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
          },
          tokens: {
            access: "mock_access_token",
            refresh: "mock_refresh_token",
          },
          expiresIn: 3600,
        },
      };

      mockHttpClient.post.mockResolvedValueOnce(mockApiResponse);

      // Act
      const result = await authService.register(mockRegisterData);

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/auth/register/",
        mockRegisterData
      );
      expect(result.success).toBe(true);
      expect(result.data?.user.username).toBe("newuser");
    });

    it("should validate password confirmation", async () => {
      // Arrange
      const mockRegisterData: RegisterData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        password_confirm: "differentpassword",
        first_name: "New",
        last_name: "User",
      };

      // Act
      const result = await authService.register(mockRegisterData);

      // Assert
      expect(mockHttpClient.post).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Las contraseñas no coinciden");
    });
  });

  describe("Authentication State Management", () => {
    it("should check authentication status correctly", () => {
      // Arrange - No token stored
      expect(authService.isAuthenticated()).toBe(false);

      // Arrange - Valid token stored
      const futureTime = Date.now() + 3600000; // 1 hour from now
      localStorage.setItem("auth_token", "valid_token");
      localStorage.setItem("token_expires_at", futureTime.toString());

      // Act & Assert
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("should return false for expired tokens", () => {
      // Arrange - Expired token
      const pastTime = Date.now() - 3600000; // 1 hour ago
      localStorage.setItem("auth_token", "expired_token");
      localStorage.setItem("token_expires_at", pastTime.toString());

      // Act & Assert
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("should get stored user data correctly", () => {
      // Arrange
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        avatar: undefined,
        role: "user",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      localStorage.setItem("user_data", JSON.stringify(mockUser));

      // Act
      const storedUser = authService.getStoredUser();

      // Assert
      expect(storedUser).toEqual(mockUser);
    });

    it("should return null for invalid stored user data", () => {
      // Arrange
      localStorage.setItem("user_data", "invalid_json");

      // Act
      const storedUser = authService.getStoredUser();

      // Assert
      expect(storedUser).toBeNull();
    });
  });

  describe("Logout Functionality", () => {
    it("should clear authentication data on logout", async () => {
      // Arrange
      localStorage.setItem("auth_token", "token");
      localStorage.setItem("refresh_token", "refresh");
      localStorage.setItem("user_data", "{}");
      mockHttpClient.defaults.headers.common["Authorization"] = "Bearer token";
      mockHttpClient.post.mockResolvedValueOnce({ data: {} });

      // Act
      const result = await authService.logout();

      // Assert
      expect(result.success).toBe(true);
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
      expect(localStorage.getItem("user_data")).toBeNull();
      expect(
        mockHttpClient.defaults.headers.common["Authorization"]
      ).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors correctly", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      const networkError = new Error("Network Error");
      mockHttpClient.post.mockRejectedValueOnce(networkError);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Network Error");
      expect(result.error?.code).toBe("AUTH_ERROR");
    });

    it("should handle API errors with proper error structure", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      const apiError = {
        response: {
          data: {
            message: "Server error",
            code: "SERVER_ERROR",
            field: "username",
          },
        },
      };

      mockHttpClient.post.mockRejectedValueOnce(apiError);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Server error");
      expect(result.error?.code).toBe("SERVER_ERROR");
      expect(result.error?.field).toBe("username");
    });
  });

  describe("Accessibility", () => {
    it("should provide proper error messages for screen readers", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "",
        password: "",
      };

      const validationError = {
        response: {
          data: {
            message: "Username and password are required",
            code: "VALIDATION_ERROR",
          },
        },
      };

      mockHttpClient.post.mockRejectedValueOnce(validationError);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Username and password are required");
      expect(result.error?.code).toBe("VALIDATION_ERROR");
    });
  });
});
