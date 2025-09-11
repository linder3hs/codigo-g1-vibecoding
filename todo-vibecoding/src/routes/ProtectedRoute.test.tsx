/**
 * @fileoverview Tests for ProtectedRoute Component
 *
 * Comprehensive test suite for the ProtectedRoute component of Todo VibeCoding application.
 * Tests cover authentication verification, route protection, redirection logic, and loading states.
 *
 * @author VibeCoding Team
 * @version 2.0.0 - Minimalist UI with Glassmorphism
 */

import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";

// Mock the useAuth hook
const mockUseAuth = {
  isAuthenticated: false,
  isLoading: false,
  refreshToken: jest.fn(),
  checkAuthStatus: jest.fn(),
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
};

jest.mock("../hooks/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

// Mock Navigate component from react-router
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: ({
    to,
    state,
    replace,
  }: {
    to: string;
    state?: { from?: string };
    replace?: boolean;
  }) => {
    mockNavigate({ to, state, replace });
    return <div data-testid="navigate-mock">Redirecting to {to}</div>;
  },
  useLocation: () => ({
    pathname: "/protected",
    search: "?param=value",
    state: null,
  }),
}));

// Test child component
const TestChild = () => (
  <div data-testid="protected-content">
    <h1>Protected Content</h1>
    <p>This content requires authentication</p>
  </div>
);

// Helper function to render ProtectedRoute with router
const renderProtectedRoute = (props = {}) => {
  const defaultProps = {
    children: <TestChild />,
    ...props,
  };

  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <ProtectedRoute {...defaultProps} />
    </MemoryRouter>
  );
};

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock to default state
    Object.assign(mockUseAuth, {
      isAuthenticated: false,
      isLoading: false,
      refreshToken: jest.fn().mockResolvedValue(undefined),
      checkAuthStatus: jest.fn().mockReturnValue(false),
    });
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Test Suite 1: Basic Rendering
   * Verifies component renders correctly in different states
   */
  describe("Basic Rendering", () => {
    it("should render loading spinner when authentication is loading", () => {
      mockUseAuth.isLoading = true;

      renderProtectedRoute();

      expect(
        screen.getByText("Verificando autenticación...")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Verificando autenticación...").previousElementSibling
      ).toHaveClass("animate-spin");
    });

    it("should render children when authenticated and auth required", async () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.checkAuthStatus.mockReturnValue(true);

      renderProtectedRoute();

      await waitFor(() => {
        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
      });
    });
  });

  /**
   * Test Suite 2: Authentication Requirements
   * Tests behavior based on authentication status
   */
  describe("Authentication Requirements", () => {
    it("should redirect to login when not authenticated and auth required", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/login",
          state: { from: "/protected?param=value" },
          replace: true,
        });
      });
    });

    it("should render children when not authenticated but auth not required", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute({ requireAuth: false });

      await waitFor(() => {
        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      });
    });
  });

  /**
   * Test Suite 3: Redirection Logic
   * Tests custom redirect paths and navigation behavior
   */
  describe("Redirection Logic", () => {
    it("should redirect to custom path when specified", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute({ redirectTo: "/custom-login" });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/custom-login",
          state: { from: "/protected?param=value" },
          replace: true,
        });
      });
    });

    it("should redirect authenticated user from non-auth required route", async () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.checkAuthStatus.mockReturnValue(true);

      renderProtectedRoute({ requireAuth: false });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/",
          state: undefined,
          replace: true,
        });
      });
    });
  });

  /**
   * Test Suite 4: Token Refresh Logic
   * Tests automatic token refresh attempts
   */
  describe("Token Refresh Logic", () => {
    it("should attempt token refresh when not initially authenticated", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);
      mockUseAuth.refreshToken.mockResolvedValue(undefined);

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockUseAuth.refreshToken).toHaveBeenCalled();
      });
    });

    it("should not attempt refresh when already authenticated", async () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.checkAuthStatus.mockReturnValue(true);

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockUseAuth.refreshToken).not.toHaveBeenCalled();
      });
    });
  });

  /**
   * Test Suite 5: Loading States
   * Tests different loading scenarios and UI feedback
   */
  describe("Loading States", () => {
    it("should show loading during initialization", () => {
      mockUseAuth.isLoading = false;
      // Component will show loading during initialization

      renderProtectedRoute();

      expect(
        screen.getByText("Verificando autenticación...")
      ).toBeInTheDocument();
    });

    it("should show loading when auth hook is loading", () => {
      mockUseAuth.isLoading = true;

      renderProtectedRoute();

      expect(
        screen.getByText("Verificando autenticación...")
      ).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 6: Error Handling
   * Tests error scenarios during authentication
   */
  describe("Error Handling", () => {
    it("should handle refresh token errors gracefully", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);
      mockUseAuth.refreshToken.mockRejectedValue(
        new Error("Token refresh failed")
      );

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      renderProtectedRoute();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Error initializing auth:",
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    it("should continue with redirect after refresh error", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);
      mockUseAuth.refreshToken.mockRejectedValue(new Error("Network error"));

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/login",
          state: { from: "/protected?param=value" },
          replace: true,
        });
      });
    });
  });

  /**
   * Test Suite 7: Props Validation
   * Tests different prop combinations and defaults
   */
  describe("Props Validation", () => {
    it("should use default redirectTo when not specified", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.objectContaining({ to: "/login" })
        );
      });
    });

    it("should use default requireAuth as true", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  /**
   * Test Suite 8: Component Lifecycle
   * Tests mounting, unmounting, and re-rendering behavior
   */
  describe("Component Lifecycle", () => {
    it("should initialize auth check on mount", () => {
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute();

      expect(mockUseAuth.checkAuthStatus).toHaveBeenCalled();
    });

    it("should handle unmounting without errors", () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.checkAuthStatus.mockReturnValue(true);

      const { unmount } = renderProtectedRoute();

      expect(() => unmount()).not.toThrow();
    });
  });

  /**
   * Test Suite 9: Accessibility
   * Tests accessibility features and ARIA attributes
   */
  describe("Accessibility", () => {
    it("should have accessible loading spinner", () => {
      mockUseAuth.isLoading = true;

      renderProtectedRoute();

      const loadingContainer = screen.getByText(
        "Verificando autenticación..."
      ).parentElement;
      expect(loadingContainer).toBeInTheDocument();
      expect(loadingContainer).toHaveClass(
        "flex",
        "items-center",
        "justify-center",
        "min-h-screen"
      );

      const spinner = screen.getByText(
        "Verificando autenticación..."
      ).previousElementSibling;
      expect(spinner).toHaveClass("animate-spin");
    });

    it("should provide meaningful loading text", () => {
      mockUseAuth.isLoading = true;

      renderProtectedRoute();

      expect(
        screen.getByText("Verificando autenticación...")
      ).toBeInTheDocument();
    });
  });

  /**
   * Test Suite 10: Integration Scenarios
   * Tests complex integration scenarios and edge cases
   */
  describe("Integration Scenarios", () => {
    it("should handle rapid authentication state changes", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.isLoading = true;

      const { rerender } = renderProtectedRoute();

      expect(
        screen.getByText("Verificando autenticación...")
      ).toBeInTheDocument();

      // Simulate auth completion
      mockUseAuth.isLoading = false;
      mockUseAuth.isAuthenticated = true;

      rerender(
        <MemoryRouter initialEntries={["/protected"]}>
          <ProtectedRoute>
            <TestChild />
          </ProtectedRoute>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
      });
    });

    it("should preserve location state during navigation", async () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.checkAuthStatus.mockReturnValue(false);

      renderProtectedRoute();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: "/login",
          state: { from: "/protected?param=value" },
          replace: true,
        });
      });
    });
  });
});
