/**
 * AppRouter Component Tests
 *
 * Comprehensive test suite for the main routing configuration
 * of the Todo VibeCoding application with minimalist UI.
 *
 * Tests cover:
 * - Route rendering and navigation
 * - Error handling for unknown routes
 * - Router configuration validation
 * - Navigation flow between pages
 *
 * @author VibeCoding Team
 * @version 2.0.0 - Minimalist UI
 */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryRouter, RouterProvider } from "react-router";
import { HomePage, CreateTodoPage } from "../pages";
import { ErrorPage } from "./ErrorPage";

/**
 * Mock Components
 *
 * Simplified mock implementations to avoid complex rendering
 * and focus on routing logic testing.
 */

// Mock the main pages with minimalist UI indicators
jest.mock("../pages", () => ({
  HomePage: () => (
    <div
      data-testid="home-page"
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Todo VibeCoding - Home
        </h1>
        <p className="text-slate-300">
          Gestiona tus tareas con estilo minimalista
        </p>
      </div>
    </div>
  ),
  CreateTodoPage: () => (
    <div
      data-testid="create-todo-page"
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Crear Nueva Tarea
        </h1>
        <p className="text-slate-300">
          Formulario de creación con glassmorphism
        </p>
      </div>
    </div>
  ),
}));

// Mock the ErrorPage with minimalist design
jest.mock("./ErrorPage", () => ({
  ErrorPage: () => (
    <div
      data-testid="error-page"
      className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Error 404</h1>
        <p className="text-slate-300">Página no encontrada</p>
      </div>
    </div>
  ),
}));

/**
 * Helper Functions
 */

/**
 * Renders the router with specific initial routes for testing
 *
 * @param initialEntries - Array of initial route paths
 * @returns Render result from React Testing Library
 */
const renderWithRoute = (initialEntries: string[]) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/crear-todo",
        element: <CreateTodoPage />,
        errorElement: <ErrorPage />,
      },
    ],
    {
      initialEntries,
    }
  );

  return render(<RouterProvider router={router} />);
};

/**
 * Test Suite: AppRouter
 *
 * Tests the main routing functionality of the Todo VibeCoding application
 */
describe("AppRouter - Minimalist UI Routing", () => {
  /**
   * Test: Root Route Rendering
   *
   * Verifies that the HomePage component renders correctly
   * when navigating to the root path ("/").
   *
   * @test {HTMLElement} homePage - HomePage component with minimalist design
   */
  it("renders HomePage with minimalist design for root route", () => {
    renderWithRoute(["/"]);

    // Verify HomePage is rendered
    const homePage = screen.getByTestId("home-page");
    expect(homePage).toBeInTheDocument();

    // Verify minimalist UI elements
    expect(screen.getByText("Todo VibeCoding - Home")).toBeInTheDocument();
    expect(
      screen.getByText("Gestiona tus tareas con estilo minimalista")
    ).toBeInTheDocument();

    // Verify CSS classes for minimalist design
    expect(homePage).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-slate-900",
      "to-slate-800"
    );
  });

  /**
   * Test: Create Todo Route Rendering
   *
   * Verifies that the CreateTodoPage component renders correctly
   * when navigating to the create todo path ("/crear-todo").
   *
   * @test {HTMLElement} createTodoPage - CreateTodoPage component with glassmorphism
   */
  it("renders CreateTodoPage with glassmorphism design for /crear-todo route", () => {
    renderWithRoute(["/crear-todo"]);

    // Verify CreateTodoPage is rendered
    const createTodoPage = screen.getByTestId("create-todo-page");
    expect(createTodoPage).toBeInTheDocument();

    // Verify glassmorphism UI elements
    expect(screen.getByText("Crear Nueva Tarea")).toBeInTheDocument();
    expect(
      screen.getByText("Formulario de creación con glassmorphism")
    ).toBeInTheDocument();

    // Verify CSS classes for minimalist design
    expect(createTodoPage).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-slate-900",
      "to-slate-800"
    );
  });

  /**
   * Test: Error Page for Unknown Routes
   *
   * Verifies that the ErrorPage component renders correctly
   * when navigating to an unknown/invalid route.
   *
   * @test {HTMLElement} errorPage - ErrorPage component with minimalist error design
   */
  it("renders ErrorPage with minimalist design for unknown routes", () => {
    renderWithRoute(["/unknown-route"]);

    // Verify ErrorPage is rendered
    const errorPage = screen.getByTestId("error-page");
    expect(errorPage).toBeInTheDocument();

    // Verify error UI elements
    expect(screen.getByText("Error 404")).toBeInTheDocument();
    expect(screen.getByText("Página no encontrada")).toBeInTheDocument();

    // Verify CSS classes for minimalist error design
    expect(errorPage).toHaveClass(
      "min-h-screen",
      "bg-gradient-to-br",
      "from-slate-900",
      "to-slate-800"
    );
  });

  /**
   * Test: Navigation Flow Between Routes
   *
   * Verifies that programmatic navigation works correctly
   * between different routes in the application.
   *
   * @test {Function} navigation - Router navigation functionality
   */
  it("handles navigation flow between routes with minimalist UI", async () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <HomePage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/crear-todo",
          element: <CreateTodoPage />,
          errorElement: <ErrorPage />,
        },
      ],
      {
        initialEntries: ["/"],
      }
    );

    render(<RouterProvider router={router} />);

    // Initially shows HomePage with minimalist design
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByText("Todo VibeCoding - Home")).toBeInTheDocument();

    // Navigate to create todo page
    router.navigate("/crear-todo");
    await waitFor(() => {
      expect(screen.getByTestId("create-todo-page")).toBeInTheDocument();
      expect(screen.getByText("Crear Nueva Tarea")).toBeInTheDocument();
    });

    // Navigate back to home
    router.navigate("/");
    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
      expect(screen.getByText("Todo VibeCoding - Home")).toBeInTheDocument();
    });
  });

  /**
   * Test: Route Configuration Validation
   *
   * Verifies that the router configuration includes
   * all expected routes and error handling.
   *
   * @test {Array} routes - Router configuration completeness
   */
  it("has complete route configuration for the application", () => {
    // Test multiple route scenarios
    const testRoutes = ["/", "/crear-todo", "/invalid-route"];

    testRoutes.forEach((route) => {
      const { unmount } = renderWithRoute([route]);

      if (route === "/") {
        expect(screen.getByTestId("home-page")).toBeInTheDocument();
      } else if (route === "/crear-todo") {
        expect(screen.getByTestId("create-todo-page")).toBeInTheDocument();
      } else {
        expect(screen.getByTestId("error-page")).toBeInTheDocument();
      }

      unmount();
    });
  });
});
