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
    mockHttpClient.post.mockClear();
    mockHttpClient.get.mockClear();
    mockHttpClient.put.mockClear();

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

  describe("Token Refresh Functionality", () => {
    it("should refresh token successfully", async () => {
      // Arrange
      localStorage.setItem("refresh_token", "valid_refresh_token");
      
      // Clear any previous mock calls
      mockHttpClient.post.mockClear();

      const mockRefreshResponse = {
        data: {
          token: "new_access_token",
          refreshToken: "new_refresh_token",
          expiresIn: 3600,
        },
      };

      mockHttpClient.post.mockResolvedValueOnce(mockRefreshResponse);

      // Act
      const result = await authService.refreshToken();

      // Assert
      expect(mockHttpClient.post).toHaveBeenCalledWith("/auth/refresh", {
        refreshToken: "valid_refresh_token",
      });
      expect(result.success).toBe(true);
      expect(result.data?.token).toBe("new_access_token");
      expect(localStorage.getItem("auth_token")).toBe("new_access_token");
    });

    it("should handle refresh token failure", async () => {
      // Arrange
      localStorage.setItem("refresh_token", "invalid_refresh_token");
      
      // Clear any previous mock calls
      mockHttpClient.post.mockClear();

      const refreshError = {
        response: {
          data: {
            message: "Invalid refresh token",
            code: "INVALID_REFRESH_TOKEN",
          },
        },
      };

      mockHttpClient.post.mockRejectedValueOnce(refreshError);

      // Act
      const result = await authService.refreshToken();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Invalid refresh token");
      expect(localStorage.getItem("auth_token")).toBeNull();
    });

    it("should handle missing refresh token", async () => {
      // Arrange - No refresh token stored
      localStorage.removeItem("refresh_token");
      
      // Clear any previous mock calls
      mockHttpClient.post.mockClear();
      
      // Mock logout call that happens when refresh fails
      mockHttpClient.post.mockResolvedValueOnce({ data: {} });

      // Act
      const result = await authService.refreshToken();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("No refresh token available");
      // Should call logout when refresh token is missing
      expect(mockHttpClient.post).toHaveBeenCalledWith("/auth/logout");
    });

    it("should prevent multiple simultaneous refresh requests", async () => {
      // Arrange
      localStorage.setItem("refresh_token", "valid_refresh_token");
      
      // Clear any previous mock calls
      mockHttpClient.post.mockClear();

      const mockRefreshResponse = {
        data: {
          token: "new_access_token",
          refreshToken: "new_refresh_token",
          expiresIn: 3600,
        },
      };

      mockHttpClient.post.mockResolvedValueOnce(mockRefreshResponse);

      // Act - Make two simultaneous refresh calls
      const promise1 = authService.refreshToken();
      const promise2 = authService.refreshToken();

      const [result1, result2] = await Promise.all([promise1, promise2]);

      // Assert - Should only make one API call
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });
  });

  describe("Get Current User Functionality", () => {
    it("should return user from store when authenticated", async () => {
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

      // Mock store state with user
      (store.getState as jest.Mock).mockReturnValue({
        auth: {
          user: mockUser,
          token: "valid_token",
          isAuthenticated: true,
        },
      });

      // Mock authentication check
      const futureTime = Date.now() + 3600000;
      localStorage.setItem("auth_token", "valid_token");
      localStorage.setItem("token_expires_at", futureTime.toString());

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it("should fetch user from API when not in store but token exists", async () => {
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

      // Mock store state without user
      (store.getState as jest.Mock).mockReturnValue({
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
        },
      });

      // Mock token exists
      localStorage.setItem("auth_token", "valid_token");

      const mockApiResponse = {
        data: mockUser,
      };

      mockHttpClient.get.mockResolvedValueOnce(mockApiResponse);

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(mockHttpClient.get).toHaveBeenCalledWith("/auth/me");
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it("should handle error when no token available", async () => {
      // Arrange
      (store.getState as jest.Mock).mockReturnValue({
        auth: {
          user: null,
          token: null,
          isAuthenticated: false,
        },
      });
      localStorage.removeItem("auth_token");

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("No authentication token available");
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });
  });

  describe("Update Profile Functionality", () => {
    it("should update user profile successfully", async () => {
      // Arrange
      const profileData = {
        first_name: "Updated",
        last_name: "Name",
        avatar: "new-avatar.jpg",
      };

      const updatedUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        first_name: "Updated",
        last_name: "Name",
        avatar: "new-avatar.jpg",
        role: "user",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      const mockApiResponse = {
        data: updatedUser,
      };

      mockHttpClient.put.mockResolvedValueOnce(mockApiResponse);

      // Mock store state with existing user
      (store.getState as jest.Mock).mockReturnValue({
        auth: {
          user: {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            first_name: "Test",
            last_name: "User",
          },
        },
      });

      // Act
      const result = await authService.updateProfile(profileData);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        "/auth/profile",
        profileData
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedUser);
    });

    it("should handle profile update API errors", async () => {
      // Arrange
      const profileData = {
        first_name: "Updated",
      };

      const updateError = {
        response: {
          data: {
            message: "Profile update failed",
            code: "UPDATE_ERROR",
          },
        },
      };

      mockHttpClient.put.mockRejectedValueOnce(updateError);

      // Act
      const result = await authService.updateProfile(profileData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Profile update failed");
      expect(result.error?.code).toBe("UPDATE_ERROR");
    });
  });

  describe("Change Password Functionality", () => {
    it("should change password successfully", async () => {
      // Arrange
      const passwordData = {
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
        password_confirm: "newpassword123",
      };

      mockHttpClient.put.mockResolvedValueOnce({ data: {} });

      // Act
      const result = await authService.changePassword(passwordData);

      // Assert
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        "/auth/change-password",
        passwordData
      );
      expect(result.success).toBe(true);
    });

    it("should validate password confirmation", async () => {
      // Arrange
      const passwordData = {
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
        password_confirm: "differentpassword",
      };

      // Act
      const result = await authService.changePassword(passwordData);

      // Assert
      expect(mockHttpClient.put).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Las contraseñas no coinciden");
    });

    it("should handle password change API errors", async () => {
      // Arrange
      const passwordData = {
        currentPassword: "wrongpassword",
        newPassword: "newpassword123",
        password_confirm: "newpassword123",
      };

      const changeError = {
        response: {
          data: {
            message: "Current password is incorrect",
            code: "INVALID_PASSWORD",
          },
        },
      };

      mockHttpClient.put.mockRejectedValueOnce(changeError);

      // Act
      const result = await authService.changePassword(passwordData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Current password is incorrect");
      expect(result.error?.code).toBe("INVALID_PASSWORD");
    });
  });

  describe("Initialize Auth Functionality", () => {
    it("should initialize auth with valid stored data", () => {
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

      const futureTime = Date.now() + 3600000;
      localStorage.setItem("auth_token", "valid_token");
      localStorage.setItem("refresh_token", "valid_refresh_token");
      localStorage.setItem("user_data", JSON.stringify(mockUser));
      localStorage.setItem("token_expires_at", futureTime.toString());

      // Act
      authService.initializeAuth();

      // Assert
      expect(httpClient.defaults.headers.common["Authorization"]).toBe(
        "Bearer valid_token"
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("loginSuccess"),
        })
      );
    });

    it("should clear invalid stored data on initialization", () => {
      // Arrange - Set expired token
      const pastTime = Date.now() - 3600000;
      localStorage.setItem("auth_token", "expired_token");
      localStorage.setItem("refresh_token", "expired_refresh_token");
      localStorage.setItem("token_expires_at", pastTime.toString());

      // Act
      authService.initializeAuth();

      // Assert
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
      expect(
        httpClient.defaults.headers.common["Authorization"]
      ).toBeUndefined();
    });

    it("should handle missing stored data gracefully", () => {
      // Arrange - Clear all stored data
      localStorage.clear();

      // Act
      authService.initializeAuth();

      // Assert
      expect(
        httpClient.defaults.headers.common["Authorization"]
      ).toBeUndefined();
      expect(localStorage.getItem("auth_token")).toBeNull();
    });
  });

  describe("Additional Error Handling", () => {
    it("should handle login with no data from server", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      // Mock response with no data
      mockHttpClient.post.mockResolvedValueOnce({ data: null });

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("No data received from server");
    });

    it("should handle register with no data from server", async () => {
      // Arrange
      const mockRegisterData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        password_confirm: "password123",
        first_name: "New",
        last_name: "User",
      };

      // Mock response with no data
      mockHttpClient.post.mockResolvedValueOnce({ data: null });

      // Act
      const result = await authService.register(mockRegisterData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("No data received from server");
    });

    it("should handle logout server notification failure gracefully", async () => {
      // Arrange
      localStorage.setItem("auth_token", "token");

      // Mock server logout failure
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
      mockHttpClient.post.mockRejectedValueOnce(new Error("Server error"));

      // Act
      const result = await authService.logout();

      // Assert
      expect(result.success).toBe(true); // Should still succeed locally
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to notify server of logout:",
        expect.any(Error)
      );
      expect(localStorage.getItem("auth_token")).toBeNull();

      consoleWarnSpy.mockRestore();
    });

    it("should handle different error types in handleAuthError", async () => {
      // Test with unknown error type
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      // Mock with non-standard error
      mockHttpClient.post.mockRejectedValueOnce("string error");

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Invalid credentials");
      expect(result.error?.code).toBe("INVALID_CREDENTIALS");
    });

    it("should handle axios error without response data", async () => {
      // Arrange
      const mockCredentials: LoginCredentials = {
        username: "testuser",
        password: "password123",
      };

      const axiosError = {
        response: {},
        message: "Network timeout",
      };

      mockHttpClient.post.mockRejectedValueOnce(axiosError);

      // Act
      const result = await authService.login(mockCredentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Network timeout");
      expect(result.error?.code).toBe("NETWORK_ERROR");
    });
  });
});
