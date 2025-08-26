/**
 * Authentication Service
 * Handles all authentication-related operations including login, register, logout, and token management
 */

import httpClient from "./httpClient";
import { store } from "../stores/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "../stores/slices/authSlice";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  AuthError,
} from "../types/auth";

/**
 * Service response wrapper for consistent error handling
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

/**
 * User profile update data
 */
export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

/**
 * Password change data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  password_confirm: string;
}

/**
 * Authentication Service Class
 * Provides methods for user authentication and session management
 */
class AuthService {
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly USER_KEY = "user_data";
  private refreshPromise: Promise<
    ServiceResponse<RefreshTokenResponse>
  > | null = null;

  /**
   * Login user with credentials
   * @param credentials - User login credentials
   * @returns Promise with authentication response
   */
  async login(
    credentials: LoginCredentials
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      // Dispatch login start action
      store.dispatch(loginStart());

      // Make API request
      const response = await httpClient.post<AuthResponse>(
        "/auth/login/",
        credentials
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      const { user, token, refreshToken, expiresIn } = response.data;

      // Store tokens and user data
      this.storeAuthData(user, token, refreshToken, expiresIn);

      // Dispatch success action
      store.dispatch(loginSuccess({ user, token, refreshToken, expiresIn }));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);
      store.dispatch(loginFailure({ error: authError }));

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with authentication response
   */
  async register(
    userData: RegisterData
  ): Promise<ServiceResponse<AuthResponse>> {
    try {
      // Validate password confirmation
      if (userData.password !== userData.password_confirm) {
        throw new Error("Las contraseñas no coinciden");
      }

      // Dispatch register start action
      store.dispatch(registerStart());

      // Make API request with all user data including password_confirm
      const response = await httpClient.post<AuthResponse>(
        "/auth/register/",
        userData
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      const { user, token, refreshToken, expiresIn } = response.data;

      // Store tokens and user data
      this.storeAuthData(user, token, refreshToken, expiresIn);

      // Dispatch success action
      store.dispatch(registerSuccess({ user, token, refreshToken, expiresIn }));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);
      store.dispatch(registerFailure({ error: authError }));

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Logout current user
   * Clears all authentication data and notifies the server
   */
  async logout(): Promise<ServiceResponse<void>> {
    try {
      // Attempt to notify server (optional, don't fail if it doesn't work)
      try {
        await httpClient.post("/auth/logout");
      } catch (error) {
        console.warn("Failed to notify server of logout:", error);
      }

      // Clear local storage
      this.clearAuthData();

      // Dispatch logout action
      store.dispatch(logoutAction());

      return {
        success: true,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Refresh authentication token
   * @returns Promise with new token data
   */
  async refreshToken(): Promise<ServiceResponse<RefreshTokenResponse>> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<
    ServiceResponse<RefreshTokenResponse>
  > {
    try {
      const refreshToken = this.getStoredRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Make API request
      const response = await httpClient.post<RefreshTokenResponse>(
        "/auth/refresh",
        {
          refreshToken,
        }
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      const { token, refreshToken: newRefreshToken, expiresIn } = response.data;

      // Update stored tokens
      this.updateTokens(token, newRefreshToken, expiresIn);

      // Dispatch success action
      store.dispatch(
        refreshTokenSuccess({ token, refreshToken: newRefreshToken, expiresIn })
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);
      store.dispatch(refreshTokenFailure({ error: authError }));

      // If refresh fails, logout user
      this.logout();

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Get current authenticated user
   * @returns Promise with current user data
   */
  async getCurrentUser(): Promise<ServiceResponse<User>> {
    try {
      // First check if user is in store
      const state = store.getState();
      if (state.auth.user && this.isAuthenticated()) {
        return {
          success: true,
          data: state.auth.user,
        };
      }

      // If not in store but we have a token, fetch from API
      if (this.getStoredToken()) {
        const response = await httpClient.get<User>("/auth/me");

        if (!response.data) {
          throw new Error("No user data received from server");
        }

        return {
          success: true,
          data: response.data,
        };
      }

      throw new Error("No authentication token available");
    } catch (error) {
      const authError = this.handleAuthError(error);

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken();

    if (!token) {
      return false;
    }

    // Check if token is expired
    const expiresAt = this.getTokenExpirationTime();
    if (expiresAt && Date.now() >= expiresAt) {
      return false;
    }

    return true;
  }

  /**
   * Update user profile
   * @param profileData - Updated profile data
   * @returns Promise with updated user data
   */
  async updateProfile(
    profileData: UpdateProfileData
  ): Promise<ServiceResponse<User>> {
    try {
      const response = await httpClient.put<User>("/auth/profile", profileData);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Update user in store
      const state = store.getState();
      if (state.auth.user) {
        const updatedUser = { ...state.auth.user, ...response.data };
        this.storeUser(updatedUser);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Change user password
   * @param passwordData - Password change data
   * @returns Promise with operation result
   */
  async changePassword(
    passwordData: ChangePasswordData
  ): Promise<ServiceResponse<void>> {
    try {
      // Validate password confirmation
      if (passwordData.newPassword !== passwordData.password_confirm) {
        throw new Error("Las contraseñas no coinciden");
      }

      // Make API request with all password data including password_confirm
      await httpClient.put("/auth/change-password", passwordData);

      return {
        success: true,
      };
    } catch (error) {
      const authError = this.handleAuthError(error);

      return {
        success: false,
        error: authError,
      };
    }
  }

  /**
   * Store authentication data in localStorage and update HTTP client
   */
  private storeAuthData(
    user: User,
    token: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    const expiresAt = Date.now() + expiresIn * 1000;

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem("token_expires_at", expiresAt.toString());

    // Update HTTP client with new token
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Update tokens in storage
   */
  private updateTokens(
    token: string,
    refreshToken: string,
    expiresIn: number
  ): void {
    const expiresAt = Date.now() + expiresIn * 1000;

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem("token_expires_at", expiresAt.toString());

    // Update HTTP client with new token
    httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Store user data
   */
  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem("token_expires_at");

    // Remove authorization header
    delete httpClient.defaults.headers.common["Authorization"];
  }

  /**
   * Get stored authentication token
   */
  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  private getTokenExpirationTime(): number | null {
    const expiresAt = localStorage.getItem("token_expires_at");
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  /**
   * Handle and normalize authentication errors
   */
  private handleAuthError(error: unknown): AuthError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: "AUTH_ERROR",
      };
    }

    // Handle Axios errors
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; code?: string; field?: string };
        };
        message?: string;
      };
      const response = axiosError.response;

      if (response?.data) {
        return {
          message: response.data.message || "Error de autenticación",
          code: response.data.code || "AUTH_ERROR",
          field: response.data.field,
        };
      }

      return {
        message: axiosError.message || "Error de conexión",
        code: "NETWORK_ERROR",
      };
    }

    return {
      message: "Error desconocido",
      code: "UNKNOWN_ERROR",
    };
  }

  /**
   * Initialize authentication state from stored data
   * Should be called on app startup
   */
  initializeAuth(): void {
    const token = this.getStoredToken();
    const refreshToken = this.getStoredRefreshToken();
    const user = this.getStoredUser();

    if (token && refreshToken && user && this.isAuthenticated()) {
      // Set authorization header
      httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Update store with stored auth data
      const expiresAt = this.getTokenExpirationTime();
      const expiresIn = expiresAt
        ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
        : 0;

      store.dispatch(loginSuccess({ user, token, refreshToken, expiresIn }));
    } else {
      // Clear any invalid stored data
      this.clearAuthData();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
