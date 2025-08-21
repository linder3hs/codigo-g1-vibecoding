/**
 * Authentication Slice
 * Redux Toolkit slice for managing authentication state
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  LoginSuccessPayload,
  LoginFailurePayload,
  RegisterSuccessPayload,
  RegisterFailurePayload,
  RefreshTokenSuccessPayload,
  RefreshTokenFailurePayload,
  AuthError,
} from "@/types";

/**
 * Initial state for authentication
 */
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tokenExpiresAt: null,
};

/**
 * Authentication slice
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      const { user, token, refreshToken, expiresIn } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpiresAt = Date.now() + expiresIn * 1000;
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<LoginFailurePayload>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.error = action.payload.error;
    },

    // Register actions
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state, action: PayloadAction<RegisterSuccessPayload>) => {
      const { user, token, refreshToken, expiresIn } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpiresAt = Date.now() + expiresIn * 1000;
      state.error = null;
    },

    registerFailure: (state, action: PayloadAction<RegisterFailurePayload>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.error = action.payload.error;
    },

    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.tokenExpiresAt = null;
    },

    // Clear error action
    clearError: (state) => {
      state.error = null;
    },

    // Refresh token actions
    refreshTokenStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    refreshTokenSuccess: (
      state,
      action: PayloadAction<RefreshTokenSuccessPayload>
    ) => {
      const { token, refreshToken, expiresIn } = action.payload;
      state.isLoading = false;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpiresAt = Date.now() + expiresIn * 1000;
      state.error = null;
    },

    refreshTokenFailure: (
      state,
      action: PayloadAction<RefreshTokenFailurePayload>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiresAt = null;
      state.error = action.payload.error;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<AuthError>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  clearError,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  setLoading,
  setError,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectTokenExpiresAt = (state: { auth: AuthState }) =>
  state.auth.tokenExpiresAt;

// Helper selectors
export const selectIsTokenExpired = (state: { auth: AuthState }) => {
  const expiresAt = state.auth.tokenExpiresAt;
  return expiresAt ? Date.now() >= expiresAt : false;
};

export const selectIsTokenExpiringSoon = (state: { auth: AuthState }) => {
  const expiresAt = state.auth.tokenExpiresAt;
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  return expiresAt ? Date.now() >= expiresAt - fiveMinutes : false;
};

// Export reducer
export default authSlice.reducer;
