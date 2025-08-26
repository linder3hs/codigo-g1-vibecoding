/**
 * Authentication Types
 * TypeScript definitions for authentication-related data structures
 */

/**
 * User interface representing authenticated user data
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Authentication error interface
 */
export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Auth state interface for Redux store
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  tokenExpiresAt: number | null;
}

/**
 * Auth action payload types
 */
export interface LoginStartPayload {
  credentials: LoginCredentials;
}

export interface LoginSuccessPayload {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginFailurePayload {
  error: AuthError;
}

export interface RegisterStartPayload {
  data: RegisterData;
}

export interface RegisterSuccessPayload {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterFailurePayload {
  error: AuthError;
}

export interface RefreshTokenSuccessPayload {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenFailurePayload {
  error: AuthError;
}
