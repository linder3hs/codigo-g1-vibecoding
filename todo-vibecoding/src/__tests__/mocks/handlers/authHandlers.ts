/**
 * MSW Handlers for Authentication API endpoints
 * Provides mock responses for all auth-related operations
 */

import { http, HttpResponse } from "msw";
import type {
  User,
  LoginCredentials,
  RegisterData,
  ApiAuthResponse,
} from "../../../types/auth";
import type {
  UpdateProfileData,
  ChangePasswordData,
} from "../../../services/authService";

// Mock users database
const mockUsers: User[] = [
  {
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
  {
    id: "2",
    username: "admin",
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    avatar: undefined,
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Mock tokens storage
const mockTokens = new Map<string, { userId: string; expiresAt: number }>();
const mockRefreshTokens = new Map<
  string,
  { userId: string; expiresAt: number }
>();

// Helper functions
const generateToken = (): string => {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRefreshToken = (): string => {
  return `mock_refresh_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

const findUserByCredentials = (
  username: string,
  password: string
): User | null => {
  // For testing purposes, accept specific test credentials
  if (username === "testuser" && password === "password123") {
    return mockUsers.find((u) => u.username === username) || null;
  }
  if (username === "admin" && password === "admin123") {
    return mockUsers.find((u) => u.username === username) || null;
  }
  return null;
};

const findUserByUsername = (username: string): User | null => {
  return mockUsers.find((u) => u.username === username) || null;
};

const findUserByEmail = (email: string): User | null => {
  return mockUsers.find((u) => u.email === email) || null;
};

const validateToken = (token: string): User | null => {
  const tokenData = mockTokens.get(token);
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    return null;
  }
  return mockUsers.find((u) => u.id === tokenData.userId) || null;
};

const validateRefreshToken = (refreshToken: string): User | null => {
  const tokenData = mockRefreshTokens.get(refreshToken);
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    return null;
  }
  return mockUsers.find((u) => u.id === tokenData.userId) || null;
};

const createAuthResponse = (user: User): ApiAuthResponse => {
  const token = generateToken();
  const refreshToken = generateRefreshToken();
  const expiresIn = 3600; // 1 hour
  const refreshExpiresIn = 86400; // 24 hours

  // Store tokens
  mockTokens.set(token, {
    userId: user.id,
    expiresAt: Date.now() + expiresIn * 1000,
  });

  mockRefreshTokens.set(refreshToken, {
    userId: user.id,
    expiresAt: Date.now() + refreshExpiresIn * 1000,
  });

  return {
    message: "Login successful",
    user,
    tokens: {
      access: token,
      refresh: refreshToken,
    },
    expiresIn, // This should be at the root level according to ApiAuthResponse interface
  };
};

const getAuthHeader = (request: Request): string | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};

export const authHandlers = [
  // POST /api/auth/login/ - User login
  http.post("http://localhost:8000/api/auth/login/", async ({ request }) => {
    try {
      const body = (await request.json()) as LoginCredentials;

      // Validate required fields
      if (!body.username || !body.password) {
        return HttpResponse.json(
          {
            message: "Username and password are required",
          },
          { status: 400 }
        );
      }

      const user = findUserByCredentials(body.username, body.password);

      if (!user) {
        return HttpResponse.json(
          {
            message: "Invalid credentials",
            code: "INVALID_CREDENTIALS",
          },
          { status: 401 }
        );
      }

      // Return successful login response in ApiAuthResponse format
      const authResponse = createAuthResponse(user);
      return HttpResponse.json(authResponse, { status: 200 });
    } catch {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request body",
            code: "INVALID_JSON",
            status: 400,
          },
        },
        { status: 400 }
      );
    }
  }),

  // POST /api/auth/register/ - User registration
  http.post("http://localhost:8000/api/auth/register/", async ({ request }) => {
    try {
      const body = (await request.json()) as RegisterData;

      // Validate required fields
      const errors: Record<string, string[]> = {};

      if (!body.username || body.username.trim() === "") {
        errors.username = ["Username is required"];
      } else if (findUserByUsername(body.username)) {
        errors.username = ["Username already exists"];
      }

      if (!body.email || body.email.trim() === "") {
        errors.email = ["Email is required"];
      } else if (findUserByEmail(body.email)) {
        errors.email = ["Email already exists"];
      }

      if (!body.password || body.password.length < 6) {
        errors.password = ["Password must be at least 6 characters long"];
      }

      if (!body.password_confirm || body.password !== body.password_confirm) {
        errors.password_confirm = ["Passwords do not match"];
      }

      if (!body.first_name || body.first_name.trim() === "") {
        errors.first_name = ["First name is required"];
      }

      if (!body.last_name || body.last_name.trim() === "") {
        errors.last_name = ["Last name is required"];
      }

      if (Object.keys(errors).length > 0) {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Validation failed",
              code: "VALIDATION_ERROR",
              status: 400,
              details: errors,
            },
          },
          { status: 400 }
        );
      }

      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        username: body.username,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        avatar: undefined,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to mock database
      mockUsers.push(newUser);

      const authResponse = createAuthResponse(newUser);

      return HttpResponse.json(authResponse, { status: 201 });
    } catch {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request body",
            code: "INVALID_JSON",
            status: 400,
          },
        },
        { status: 400 }
      );
    }
  }),

  // POST /api/auth/refresh/ - Refresh access token
  http.post("http://localhost:8000/api/auth/refresh/", async ({ request }) => {
    try {
      const body = (await request.json()) as { refresh_token: string };

      if (!body.refresh_token) {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Refresh token is required",
              code: "VALIDATION_ERROR",
              status: 400,
            },
          },
          { status: 400 }
        );
      }

      const user = validateRefreshToken(body.refresh_token);

      if (!user) {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Invalid or expired refresh token",
              code: "INVALID_REFRESH_TOKEN",
              status: 401,
            },
          },
          { status: 401 }
        );
      }

      // Generate new tokens
      const newToken = generateToken();
      const newRefreshToken = generateRefreshToken();
      const expiresIn = 3600; // 1 hour
      const refreshExpiresIn = 86400; // 24 hours

      // Remove old tokens
      mockTokens.forEach((tokenData, token) => {
        if (tokenData.userId === user.id) {
          mockTokens.delete(token);
        }
      });

      mockRefreshTokens.delete(body.refresh_token);

      // Store new tokens
      mockTokens.set(newToken, {
        userId: user.id,
        expiresAt: Date.now() + expiresIn * 1000,
      });

      mockRefreshTokens.set(newRefreshToken, {
        userId: user.id,
        expiresAt: Date.now() + refreshExpiresIn * 1000,
      });

      return HttpResponse.json({
        success: true,
        data: {
          access_token: newToken,
          refresh_token: newRefreshToken,
          token_type: "Bearer",
          expires_in: expiresIn,
        },
      });
    } catch {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request body",
            code: "INVALID_JSON",
            status: 400,
          },
        },
        { status: 400 }
      );
    }
  }),

  // POST /api/auth/logout/ - User logout
  http.post("http://localhost:8000/api/auth/logout/", ({ request }) => {
    const token = getAuthHeader(request);

    if (token) {
      // Remove token from storage
      const tokenData = mockTokens.get(token);
      if (tokenData) {
        mockTokens.delete(token);

        // Remove all refresh tokens for this user
        mockRefreshTokens.forEach((refreshTokenData, refreshToken) => {
          if (refreshTokenData.userId === tokenData.userId) {
            mockRefreshTokens.delete(refreshToken);
          }
        });
      }
    }

    return HttpResponse.json({
      success: true,
      data: {
        message: "Successfully logged out",
      },
    });
  }),

  // GET /api/auth/me/ - Get current user profile
  http.get("http://localhost:8000/api/auth/me/", ({ request }) => {
    const token = getAuthHeader(request);

    if (!token) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Authentication required",
            code: "AUTHENTICATION_REQUIRED",
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    const user = validateToken(token);

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid or expired token",
            code: "INVALID_TOKEN",
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        user,
      },
    });
  }),

  // PUT /api/auth/profile/ - Update user profile
  http.put("http://localhost:8000/api/auth/profile/", async ({ request }) => {
    const token = getAuthHeader(request);

    if (!token) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Authentication required",
            code: "AUTHENTICATION_REQUIRED",
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    const user = validateToken(token);

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid or expired token",
            code: "INVALID_TOKEN",
            status: 401,
          },
        },
        { status: 401 }
      );
    }

    try {
      const body = (await request.json()) as UpdateProfileData;

      // Find user in mock database and update
      const userIndex = mockUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        const updatedUser: User = {
          ...mockUsers[userIndex],
          first_name: body.first_name || mockUsers[userIndex].first_name,
          last_name: body.last_name || mockUsers[userIndex].last_name,
          avatar:
            body.avatar !== undefined
              ? body.avatar
              : mockUsers[userIndex].avatar,
          updatedAt: new Date().toISOString(),
        };

        mockUsers[userIndex] = updatedUser;

        return HttpResponse.json({
          success: true,
          data: {
            user: updatedUser,
          },
        });
      }

      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "User not found",
            code: "USER_NOT_FOUND",
            status: 404,
          },
        },
        { status: 404 }
      );
    } catch {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request body",
            code: "INVALID_JSON",
            status: 400,
          },
        },
        { status: 400 }
      );
    }
  }),

  // POST /api/auth/change-password/ - Change user password
  http.post(
    "http://localhost:8000/api/auth/change-password/",
    async ({ request }) => {
      const token = getAuthHeader(request);

      if (!token) {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Authentication required",
              code: "AUTHENTICATION_REQUIRED",
              status: 401,
            },
          },
          { status: 401 }
        );
      }

      const user = validateToken(token);

      if (!user) {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Invalid or expired token",
              code: "INVALID_TOKEN",
              status: 401,
            },
          },
          { status: 401 }
        );
      }

      try {
        const body = (await request.json()) as ChangePasswordData;

        // Validate required fields
        const errors: Record<string, string[]> = {};

        if (!body.currentPassword) {
          errors.currentPassword = ["Current password is required"];
        }

        if (!body.newPassword || body.newPassword.length < 6) {
          errors.newPassword = [
            "New password must be at least 6 characters long",
          ];
        }

        if (
          !body.password_confirm ||
          body.newPassword !== body.password_confirm
        ) {
          errors.password_confirm = ["Passwords do not match"];
        }

        if (Object.keys(errors).length > 0) {
          return HttpResponse.json(
            {
              success: false,
              error: {
                message: "Validation failed",
                code: "VALIDATION_ERROR",
                status: 400,
                details: errors,
              },
            },
            { status: 400 }
          );
        }

        // For testing purposes, we don't actually validate the current password
        // In a real implementation, you would verify the current password

        return HttpResponse.json({
          success: true,
          data: {
            message: "Password changed successfully",
          },
        });
      } catch {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Invalid request body",
              code: "INVALID_JSON",
              status: 400,
            },
          },
          { status: 400 }
        );
      }
    }
  ),
];

// Export mock data for testing utilities
export { mockUsers, mockTokens, mockRefreshTokens };
