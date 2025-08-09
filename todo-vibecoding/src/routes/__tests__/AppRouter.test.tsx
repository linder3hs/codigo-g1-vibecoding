/**
 * AppRouter Component Tests
 * Tests for the main routing configuration
 */

import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { HomePage, CreateTodoPage } from "../../pages";
import ErrorPage from "../ErrorPage";

// Mock the pages to avoid complex rendering
jest.mock("../../pages", () => ({
  HomePage: () => <div>HomePage Component</div>,
  CreateTodoPage: () => <div>CreateTodoPage Component</div>,
}));

// Mock the ErrorPage
jest.mock("../ErrorPage", () => {
  return function MockErrorPage() {
    return <div>Error Page Component</div>;
  };
});

// Helper function to render with specific route
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

describe("AppRouter", () => {
  it("renders HomePage for root route", () => {
    renderWithRoute(["/"]);
    expect(screen.getByText("HomePage Component")).toBeInTheDocument();
  });

  it("renders CreateTodoPage for /crear-todo route", () => {
    renderWithRoute(["/crear-todo"]);
    expect(screen.getByText("CreateTodoPage Component")).toBeInTheDocument();
  });

  it("renders ErrorPage for unknown routes", () => {
    renderWithRoute(["/unknown-route"]);
    expect(screen.getByText("Error Page Component")).toBeInTheDocument();
  });

  it("handles navigation between routes", () => {
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
    
    // Initially shows HomePage
    expect(screen.getByText("HomePage Component")).toBeInTheDocument();
    
    // Navigate to create todo page
    router.navigate("/crear-todo");
    expect(screen.getByText("CreateTodoPage Component")).toBeInTheDocument();
    
    // Navigate back to home
    router.navigate("/");
    expect(screen.getByText("HomePage Component")).toBeInTheDocument();
  });
});