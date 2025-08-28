/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Handles redirection and preserves intended route
 */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Loading component for authentication verification
 */
const AuthLoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <span className="ml-3 text-lg text-muted-foreground">
      Verificando autenticación...
    </span>
  </div>
);

/**
 * ProtectedRoute component
 * Protects routes that require authentication
 *
 * @param children - Child components to render if authenticated
 * @param redirectTo - Route to redirect to if not authenticated (default: "/login")
 * @param requireAuth - Whether authentication is required (default: true)
 *
 * @example
 * <ProtectedRoute>
 *   <TasksPage />
 * </ProtectedRoute>
 *
 * @example
 * <ProtectedRoute redirectTo="/welcome" requireAuth={false}>
 *   <PublicPage />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  children,
  redirectTo = "/login",
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, refreshToken, checkAuthStatus } =
    useAuth();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * Initialize authentication check on component mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check current auth status
        const isCurrentlyAuth = checkAuthStatus();

        if (!isCurrentlyAuth) {
          // Try to refresh token if available
          await refreshToken();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus, refreshToken]);

  /**
   * Show loading spinner during authentication verification
   */
  if (isLoading || isInitializing) {
    return <AuthLoadingSpinner />;
  }

  /**
   * Handle authentication requirement
   */
  if (requireAuth && !isAuthenticated) {
    // Preserve the intended route in location state
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  /**
   * Handle case where user is authenticated but route doesn't require auth
   * (e.g., login page when already logged in)
   */
  if (!requireAuth && isAuthenticated) {
    // Get the intended route from location state or default to home
    const from = location.state?.from || "/";
    return <Navigate to={from} replace />;
  }

  /**
   * Render children if authentication requirements are met
   */
  return <>{children}</>;
};

export default ProtectedRoute;
