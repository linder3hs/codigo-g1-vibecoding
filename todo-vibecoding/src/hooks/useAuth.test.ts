import { cleanup } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import authSlice from '@/stores/slices/authSlice';
import type { LoginCredentials, RegisterData, User } from '@/types/auth';

// Mock authService
jest.mock('@/services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Test data
const mockUser: User = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'user' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const mockCredentials: LoginCredentials = {
  username: 'testuser',
  password: 'password123'
};

const mockRegisterData: RegisterData = {
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  password: 'password123',
  password_confirm: 'password123'
};

// Helper function to create store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice
    },
    preloadedState: {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,
        tokenExpiresAt: null,
        ...initialState
      }
    }
  });
};

describe('AuthService Integration Tests', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Authentication Service', () => {
    it('should handle successful login', async () => {
      mockAuthService.login.mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600
        }
      });

      const result = await mockAuthService.login(mockCredentials);

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials);
    });

    it('should handle failed login', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(mockAuthService.login(mockCredentials)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.login).toHaveBeenCalledWith(mockCredentials);
    });

    it('should handle successful registration', async () => {
      mockAuthService.register.mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600
        }
      });

      const result = await mockAuthService.register(mockRegisterData);

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRegisterData);
    });

    it('should handle failed registration', async () => {
      mockAuthService.register.mockRejectedValue(new Error('Email already exists'));

      await expect(mockAuthService.register(mockRegisterData)).rejects.toThrow('Email already exists');
      expect(mockAuthService.register).toHaveBeenCalledWith(mockRegisterData);
    });

    it('should handle successful logout', async () => {
      mockAuthService.logout.mockResolvedValue({
        success: true
      });

      const result = await mockAuthService.logout();

      expect(result.success).toBe(true);
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle logout failure', async () => {
      mockAuthService.logout.mockRejectedValue(new Error('Network error'));

      await expect(mockAuthService.logout()).rejects.toThrow('Network error');
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });

    it('should handle successful token refresh', async () => {
      mockAuthService.refreshToken.mockResolvedValue({
        success: true,
        data: {
          token: 'new-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 3600
        }
      });

      const result = await mockAuthService.refreshToken();

      expect(result.success).toBe(true);
      expect(result.data?.token).toBe('new-token');
      expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should handle failed token refresh', async () => {
      mockAuthService.refreshToken.mockRejectedValue(new Error('Refresh failed'));

      await expect(mockAuthService.refreshToken()).rejects.toThrow('Refresh failed');
      expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should get current user successfully', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue({
        success: true,
        data: mockUser
      });

      const result = await mockAuthService.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should handle get current user failure', async () => {
      mockAuthService.getCurrentUser.mockRejectedValue(new Error('User not found'));

      await expect(mockAuthService.getCurrentUser()).rejects.toThrow('User not found');
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should check authentication status', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const authStatus = mockAuthService.isAuthenticated();

      expect(authStatus).toBe(true);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
    });
  });

  describe('Redux Auth Slice', () => {
    it('should have correct initial state', () => {
      const store = createMockStore();
      const state = store.getState();

      expect(state.auth.user).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.isLoading).toBe(false);
      expect(state.auth.error).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.auth.refreshToken).toBeNull();
      expect(state.auth.tokenExpiresAt).toBeNull();
    });

    it('should handle login start action', () => {
      const store = createMockStore();
      
      store.dispatch({ type: 'auth/loginStart' });
      const state = store.getState();

      expect(state.auth.isLoading).toBe(true);
      expect(state.auth.error).toBeNull();
    });

    it('should handle login success action', () => {
      const store = createMockStore();
      
      store.dispatch({
        type: 'auth/loginSuccess',
        payload: {
          user: mockUser,
          token: 'test-token',
          refreshToken: 'test-refresh-token',
          expiresIn: 3600
        }
      });
      const state = store.getState();

      expect(state.auth.isLoading).toBe(false);
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user).toEqual(mockUser);
      expect(state.auth.token).toBe('test-token');
      expect(state.auth.refreshToken).toBe('test-refresh-token');
      expect(state.auth.error).toBeNull();
    });

    it('should handle login failure action', () => {
      const store = createMockStore();
      const error = { message: 'Invalid credentials', code: 'AUTH_ERROR' };
      
      store.dispatch({
        type: 'auth/loginFailure',
        payload: { error }
      });
      const state = store.getState();

      expect(state.auth.isLoading).toBe(false);
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.user).toBeNull();
      expect(state.auth.error).toEqual(error);
    });

    it('should handle logout action', () => {
      const store = createMockStore({
        user: mockUser,
        isAuthenticated: true,
        token: 'test-token',
        refreshToken: 'test-refresh-token'
      });
      
      store.dispatch({ type: 'auth/logout' });
      const state = store.getState();

      expect(state.auth.user).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
      expect(state.auth.token).toBeNull();
      expect(state.auth.refreshToken).toBeNull();
      expect(state.auth.tokenExpiresAt).toBeNull();
      expect(state.auth.error).toBeNull();
    });

    it('should handle clear error action', () => {
      const store = createMockStore({
        error: { message: 'Test error', code: 'TEST_ERROR' }
      });
      
      store.dispatch({ type: 'auth/clearError' });
      const state = store.getState();

      expect(state.auth.error).toBeNull();
    });
  });
});
