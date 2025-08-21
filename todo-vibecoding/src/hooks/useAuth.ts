/**
 * useAuth Hook
 * Custom hook for authentication management with Redux integration
 * Provides a clean interface for authentication operations
 */

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "@/services/authService";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectIsTokenExpired,
  selectIsTokenExpiringSoon,
  clearError,
  logout as logoutAction,
} from "@/stores/slices/authSlice";
import type {
  LoginCredentials,
  RegisterData,
  User,
  AuthError,
} from "@/types/auth";
import type { RootState } from "@/stores/store";

/**
 * Authentication hook return type
 */
export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  isTokenExpired: boolean;
  isTokenExpiringSoon: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearAuthError: () => void;
  getCurrentUser: () => Promise<User | null>;

  // Utilities
  checkAuthStatus: () => boolean;
  initializeAuth: () => void;
}

/**
 * Custom hook for authentication management
 *
 * @returns {UseAuthReturn} Authentication state and methods
 *
 * @example
 * const { login, isLoading, error, isAuthenticated } = useAuth();
 *
 * const handleLogin = async (credentials) => {
 *   const success = await login(credentials);
 *   if (success) {
 *     // Handle successful login
 *   }
 * };
 */
export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();

  // Select auth state from Redux store
  const user = useSelector((state: RootState) => selectUser(state));
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const isLoading = useSelector((state: RootState) => selectIsLoading(state));
  const error = useSelector((state: RootState) => selectAuthError(state));
  const isTokenExpired = useSelector((state: RootState) =>
    selectIsTokenExpired(state)
  );
  const isTokenExpiringSoon = useSelector((state: RootState) =>
    selectIsTokenExpiringSoon(state)
  );

  /**
   * Login user with credentials
   * @param credentials - User login credentials
   * @returns Promise<boolean> - Success status
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        const response = await authService.login(credentials);
        return response.success;
      } catch (error) {
        console.error("Login error in useAuth:", error);
        return false;
      }
    },
    []
  );

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise<boolean> - Success status
   */
  const register = useCallback(
    async (userData: RegisterData): Promise<boolean> => {
      try {
        const response = await authService.register(userData);
        return response.success;
      } catch (error) {
        console.error("Register error in useAuth:", error);
        return false;
      }
    },
    []
  );

  /**
   * Logout current user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error in useAuth:", error);
      // Even if logout fails on server, clear local state
      dispatch(logoutAction());
    }
  }, [dispatch]);

  /**
   * Refresh authentication token
   * @returns Promise<boolean> - Success status
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken();
      return response.success;
    } catch (error) {
      console.error("Refresh token error in useAuth:", error);
      return false;
    }
  }, []);

  /**
   * Clear authentication error
   */
  const clearAuthError = useCallback((): void => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Get current user data
   * @returns Promise<User | null> - Current user or null
   */
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const response = await authService.getCurrentUser();
      return response.success ? response.data || null : null;
    } catch (error) {
      console.error("Get current user error in useAuth:", error);
      return null;
    }
  }, []);

  /**
   * Check current authentication status
   * @returns boolean - Authentication status
   */
  const checkAuthStatus = useCallback((): boolean => {
    return authService.isAuthenticated();
  }, []);

  /**
   * Initialize authentication state from stored data
   */
  const initializeAuth = useCallback((): void => {
    authService.initializeAuth();
  }, []);

  /**
   * Auto-refresh token when it's expiring soon
   */
  useEffect(() => {
    if (isAuthenticated && isTokenExpiringSoon && !isTokenExpired) {
      refreshToken().catch((error) => {
        console.error("Auto refresh token failed:", error);
      });
    }
  }, [isAuthenticated, isTokenExpiringSoon, isTokenExpired, refreshToken]);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Auto logout when token is expired
   */
  useEffect(() => {
    if (isAuthenticated && isTokenExpired) {
      console.warn("Token expired, logging out user");
      logout().catch((error) => {
        console.error("Auto logout failed:", error);
      });
    }
  }, [isAuthenticated, isTokenExpired, logout]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isTokenExpired,
    isTokenExpiringSoon,

    // Actions
    login,
    register,
    logout,
    refreshToken,
    clearAuthError,
    getCurrentUser,

    // Utilities
    checkAuthStatus,
    initializeAuth,
  };
};

/**
 * Hook for checking if user has specific permissions
 * @param requiredRole - Required user role
 * @returns boolean - Whether user has permission
 */
export const useAuthPermissions = (requiredRole?: string): boolean => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return false;
  }

  if (!requiredRole) {
    return true;
  }

  // Check if user has required role (assuming user has a role property)
  const userWithRole = user as User & { role?: string };
  return userWithRole.role === requiredRole || userWithRole.role === "admin";
};

/**
 * Hook for protected routes
 * @param redirectTo - Path to redirect if not authenticated
 * @returns boolean - Whether user can access the route
 */
export const useProtectedRoute = (redirectTo: string = "/login"): boolean => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // In a real app, you would use router navigation here
      console.warn("User not authenticated, should redirect to:", redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return isAuthenticated;
};

export default useAuth;
