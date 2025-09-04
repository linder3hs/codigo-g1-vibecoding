/**
 * MSW Testing Utilities
 * Helper functions for working with Mock Service Worker in tests
 */

// Polyfills necesarios para MSW en Node.js
if (typeof global.BroadcastChannel === "undefined") {
  global.BroadcastChannel = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    close: jest.fn(),
  }));
}

if (typeof global.TransformStream === "undefined") {
  global.TransformStream = jest.fn().mockImplementation(() => ({
    readable: {
      getReader: jest.fn(() => ({
        read: jest.fn(() => Promise.resolve({ done: true, value: undefined })),
        releaseLock: jest.fn(),
      })),
    },
    writable: {
      getWriter: jest.fn(() => ({
        write: jest.fn(() => Promise.resolve()),
        close: jest.fn(() => Promise.resolve()),
        releaseLock: jest.fn(),
      })),
    },
  }));
}

import { http, HttpResponse } from "msw";
import { server, resetMockData } from "../mocks/server";
import type { Todo, TaskStatus, TodoPriority } from "../../types/todo";
import type { User, AuthError } from "../../types/auth";

/**
 * Test utilities for MSW server management
 */
export const mswUtils = {
  /**
   * Reset all handlers to their original state
   */
  resetHandlers: () => {
    server.resetHandlers();
  },

  /**
   * Restore all handlers to their original implementation
   */
  restoreHandlers: () => {
    server.restoreHandlers();
  },

  /**
   * Reset all mock data to initial state
   */
  resetMockData: () => {
    resetMockData();
  },

  /**
   * Add custom handlers for specific test scenarios
   */
  useHandlers: (...handlers: Parameters<typeof server.use>) => {
    server.use(...handlers);
  },
};

/**
 * Factory functions for creating custom MSW handlers
 */
export const createHandlers = {
  /**
   * Create a handler that returns an error response
   */
  errorResponse: (
    url: string,
    method: "get" | "post" | "put" | "delete",
    status: number,
    message: string
  ) => {
    const httpMethod = http[method];
    return httpMethod(url, () => {
      return HttpResponse.json({ message }, { status });
    });
  },

  /**
   * Create a handler that simulates network delay
   */
  delayedResponse: (
    url: string,
    method: "get" | "post" | "put" | "delete",
    delay: number,
    response?: Record<string, unknown>
  ) => {
    const httpMethod = http[method];
    return httpMethod(url, async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return HttpResponse.json(response || { success: true });
    });
  },

  /**
   * Create a handler that returns empty results
   */
  emptyResponse: (url: string, method: "get" | "post" | "put" | "delete") => {
    const httpMethod = http[method];
    return httpMethod(url, () => {
      return HttpResponse.json({
        count: 0,
        next: null,
        previous: null,
        results: [],
      });
    });
  },

  /**
   * Create a handler for authentication failure
   */
  authFailure: (url: string) => {
    return http.post(url, () => {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    });
  },

  /**
   * Create a handler for server errors
   */
  serverError: (url: string, method: "get" | "post" | "put" | "delete") => {
    const httpMethod = http[method];
    return httpMethod(url, () => {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    });
  },
};

/**
 * Mock data factories for creating test data
 */
export const createMockData = {
  /**
   * Create a mock Todo item
   */
  todo: (overrides: Partial<Todo> = {}): Todo => ({
    id: 1,
    title: "Test Todo",
    description: "Test description",
    status: "pendiente" as TaskStatus,
    status_display: "Pendiente",
    user_username: "testuser",
    is_completed: false,
    created_at: new Date().toISOString(),
    completed_at: null,
    priority: "medium" as TodoPriority,
    ...overrides,
  }),

  /**
   * Create multiple mock Todo items
   */
  todos: (count: number, overrides: Partial<Todo> = {}): Todo[] => {
    return Array.from({ length: count }, (_, index) =>
      createMockData.todo({
        id: index + 1,
        title: `Test Todo ${index + 1}`,
        ...overrides,
      })
    );
  },

  /**
   * Create a mock User
   */
  user: (overrides: Partial<User> = {}): User => ({
    id: "1",
    username: "testuser",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    avatar: undefined,
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  /**
   * Create a mock AuthError
   */
  authError: (overrides: Partial<AuthError> = {}): AuthError => ({
    message: "Authentication failed",
    code: "AUTH_ERROR",
    field: "credentials",
    ...overrides,
  }),

  /**
   * Create a paginated response
   */
  paginatedResponse: <T>(items: T[], page: number = 1, limit: number = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / limit);

    return {
      count: items.length,
      next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      results: paginatedItems,
    };
  },
};

/**
 * Common test scenarios using MSW
 */
export const testScenarios = {
  /**
   * Simulate network error
   */
  networkError: (
    url: string,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    mswUtils.useHandlers(
      createHandlers.errorResponse(url, method, 0, "Network Error")
    );
  },

  /**
   * Simulate slow network
   */
  slowNetwork: (
    url: string,
    delay: number = 2000,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    mswUtils.useHandlers(createHandlers.delayedResponse(url, method, delay));
  },

  /**
   * Simulate authentication required
   */
  authRequired: (
    url: string,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    mswUtils.useHandlers(
      createHandlers.errorResponse(url, method, 401, "Authentication required")
    );
  },

  /**
   * Simulate forbidden access
   */
  forbidden: (
    url: string,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    mswUtils.useHandlers(
      createHandlers.errorResponse(url, method, 403, "Forbidden")
    );
  },

  /**
   * Simulate resource not found
   */
  notFound: (
    url: string,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    mswUtils.useHandlers(
      createHandlers.errorResponse(url, method, 404, "Not found")
    );
  },

  /**
   * Simulate empty data response
   */
  emptyData: (
    url: string,
    method: "get" | "post" | "put" | "delete" = "get"
  ) => {
    mswUtils.useHandlers(createHandlers.emptyResponse(url, method));
  },
};

/**
 * Helper function to wait for MSW handlers to process
 */
export const waitForMSW = (ms: number = 100): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Helper to create a test wrapper with MSW utilities
 */
export const withMSW = (testFn: () => void | Promise<void>) => {
  return async () => {
    // Reset everything before test
    mswUtils.resetHandlers();
    mswUtils.resetMockData();

    try {
      await testFn();
    } finally {
      // Clean up after test
      mswUtils.resetHandlers();
    }
  };
};
