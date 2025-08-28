/**
 * AppRouter component - Main routing configuration
 * Defines all application routes using React Router v7
 * Integrates ProtectedRoute for authentication and Layout components
 */

import { createBrowserRouter, RouterProvider } from "react-router";
import { HomePage, CreateTodoPage, RegisterPage, LoginPage } from "../pages";
import { ErrorPage } from "./ErrorPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardLayout } from "../components/feature/Layout/Layout";

/**
 * Router configuration with all application routes
 * Organized into public and protected routes with appropriate layouts
 */
const router = createBrowserRouter([
  // Public routes with centered layout (auth pages)
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },

  // Protected routes with dashboard layout
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <HomePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/crear-todo",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <CreateTodoPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },

  // Additional protected routes can be added here
  {
    path: "/todos",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <HomePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6">
            <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tu información personal
            </p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

/**
 * AppRouter - Main router component
 * Provides routing functionality to the entire application
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
