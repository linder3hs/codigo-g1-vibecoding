/**
 * AuthService Tests
 * Tests for authentication service functionality
 */

import { authService } from '../../services/authService';
import httpClient from '../../services/httpClient';
import { store } from '../../stores/store';
import type { ApiAuthResponse, LoginCredentials, RegisterData } from '../../types/auth';

// Mock dependencies
jest.mock('../../services/httpClient');
jest.mock('../../stores/store');

const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;
const mockedStore = store as jest.Mocked<typeof store>;

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    
    // Mock store dispatch
    mockedStore.dispatch = jest.fn();
    mockedStore.getState = jest.fn().mockReturnValue({
      auth: {
        refreshToken: 'mock-refresh-token'
      }
    });
  });

  describe('login', () => {
    it('should successfully login and map API response correctly', async () => {
      // Arrange
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: 'testpass123'
      };

      const mockApiResponse: ApiAuthResponse = {
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'user',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        expiresIn: 3600
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockApiResponse });

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.token).toBe('mock-access-token');
      expect(result.data?.refreshToken).toBe('mock-refresh-token');
      expect(result.data?.user.username).toBe('testuser');
      expect(result.data?.expiresIn).toBe(3600);

      // Verify localStorage storage
      expect(localStorage.getItem('auth_token')).toBe('mock-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
      expect(localStorage.getItem('user_data')).toBe(JSON.stringify(mockApiResponse.user));
      expect(localStorage.getItem('token_expires_at')).toBeDefined();

      // Verify store dispatch was called
      expect(mockedStore.dispatch).toHaveBeenCalled();
    });

    it('should handle login failure', async () => {
      // Arrange
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: 'wrongpass'
      };

      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS'
          }
        }
      };

      mockedHttpClient.post.mockRejectedValue(mockError);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Invalid credentials');
      expect(result.error?.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('register', () => {
    it('should successfully register and map API response correctly', async () => {
      // Arrange
      const userData: RegisterData = {
        username: 'newuser',
        email: 'newuser@example.com',
        first_name: 'New',
        last_name: 'User',
        password: 'newpass123',
        password_confirm: 'newpass123'
      };

      const mockApiResponse: ApiAuthResponse = {
        user: {
          id: '2',
          username: 'newuser',
          email: 'newuser@example.com',
          first_name: 'New',
          last_name: 'User',
          role: 'user',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        access: 'new-access-token',
        refresh: 'new-refresh-token'
        // Note: expiresIn is optional, should default to 3600
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockApiResponse });

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.token).toBe('new-access-token');
      expect(result.data?.refreshToken).toBe('new-refresh-token');
      expect(result.data?.user.username).toBe('newuser');
      expect(result.data?.expiresIn).toBe(3600); // Should default to 3600

      // Verify localStorage storage
      expect(localStorage.getItem('auth_token')).toBe('new-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token');
    });

    it('should handle password mismatch', async () => {
      // Arrange
      const userData: RegisterData = {
        username: 'newuser',
        email: 'newuser@example.com',
        first_name: 'New',
        last_name: 'User',
        password: 'newpass123',
        password_confirm: 'differentpass'
      };

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Las contraseñas no coinciden');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists and is not expired', () => {
      // Arrange
      const futureTime = Date.now() + 3600000; // 1 hour from now
      localStorage.setItem('auth_token', 'valid-token');
      localStorage.setItem('token_expires_at', futureTime.toString());

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when token is expired', () => {
      // Arrange
      const pastTime = Date.now() - 3600000; // 1 hour ago
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('token_expires_at', pastTime.toString());

      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when no token exists', () => {
      // Act
      const result = authService.isAuthenticated();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('initializeAuth', () => {
    it('should initialize auth state from localStorage when valid data exists', () => {
      // Arrange
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'user' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      const futureTime = Date.now() + 3600000;
      localStorage.setItem('auth_token', 'stored-token');
      localStorage.setItem('refresh_token', 'stored-refresh');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      localStorage.setItem('token_expires_at', futureTime.toString());

      // Act
      authService.initializeAuth();

      // Assert
      expect(mockedStore.dispatch).toHaveBeenCalled();
      expect(httpClient.defaults.headers.common['Authorization']).toBe('Bearer stored-token');
    });

    it('should clear invalid data when authentication check fails', () => {
      // Arrange
      const pastTime = Date.now() - 3600000; // Expired token
      localStorage.setItem('auth_token', 'expired-token');
      localStorage.setItem('refresh_token', 'expired-refresh');
      localStorage.setItem('token_expires_at', pastTime.toString());

      // Act
      authService.initializeAuth();

      // Assert
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('token_expires_at')).toBeNull();
    });
  });
});