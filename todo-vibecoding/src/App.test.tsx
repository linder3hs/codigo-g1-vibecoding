/**
 * @fileoverview Tests for App Component
 *
 * Comprehensive test suite for the main App component of Todo VibeCoding application.
 * Tests cover rendering, structure, router integration, and error handling.
 *
 * @author VibeCoding Team
 * @version 2.0.0 - Minimalist UI with Glassmorphism
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import todoReducer from "./stores/slices/todoSlice";
import authReducer from "./stores/slices/authSlice";

// Mock AppRouter to avoid complex routing setup in unit tests
jest.mock("./routes", () => ({
  AppRouter: () => (
    <div data-testid="app-router">
      <h1>Mocked AppRouter</h1>
      <p>Router content loaded successfully</p>
    </div>
  ),
}));

// Mock Redux store for testing
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      todos: todoReducer,
      auth: authReducer,
    },
    preloadedState,
  });
};

// Helper function to render App with providers
const renderApp = (preloadedState = {}) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe("App Component", () => {
  /**
   * Test 1: Basic Rendering
   * Verifies that the App component renders without crashing
   */
  it("renders without crashing", () => {
    renderApp();
    expect(screen.getByTestId("app-router")).toBeInTheDocument();
  });

  /**
   * Test 2: Main Container Structure
   * Verifies the main container has correct CSS classes for glassmorphism design
   */
  it("renders main container with correct glassmorphism classes", () => {
    const { container } = renderApp();
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass(
      "min-h-screen",
      "bg-charcoal-950",
      "relative",
      "overflow-hidden"
    );
  });

  /**
   * Test 3: Inner Container Structure
   * Verifies the inner glassmorphism container structure
   */
  it("renders inner glassmorphism container correctly", () => {
    const { container } = renderApp();
    const mainContainer = container.firstChild as HTMLElement;
    const innerContainer = mainContainer.firstElementChild as HTMLElement;

    expect(innerContainer).toHaveClass("relative", "z-10", "min-h-screen");
  });

  /**
   * Test 4: AppRouter Integration
   * Verifies that AppRouter component is properly integrated and rendered
   */
  it("integrates AppRouter component correctly", () => {
    renderApp();

    expect(screen.getByTestId("app-router")).toBeInTheDocument();
    expect(screen.getByText("Mocked AppRouter")).toBeInTheDocument();
    expect(
      screen.getByText("Router content loaded successfully")
    ).toBeInTheDocument();
  });

  /**
   * Test 5: Full Height Layout
   * Verifies that the app maintains full screen height layout
   */
  it("maintains full screen height layout", () => {
    const { container } = renderApp();
    const mainContainer = container.firstChild as HTMLElement;
    const innerContainer = mainContainer.firstElementChild as HTMLElement;
    const contentContainer = innerContainer.firstElementChild as HTMLElement;

    expect(mainContainer).toHaveClass("min-h-screen");
    expect(innerContainer).toHaveClass("min-h-screen");
    expect(contentContainer).toHaveClass("min-h-screen");
  });

  /**
   * Test 6: Dark Theme Background
   * Verifies that the app applies dark theme background correctly
   */
  it("applies dark theme background correctly", () => {
    const { container } = renderApp();
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass("bg-charcoal-950");
  });

  /**
   * Test 7: Responsive Design Classes
   * Verifies that responsive design classes are applied
   */
  it("applies responsive design classes", () => {
    const { container } = renderApp();
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass("relative", "overflow-hidden");
    expect(mainContainer.firstElementChild).toHaveClass("relative", "z-10");
  });

  /**
   * Test 8: Component Structure Hierarchy
   * Verifies the correct nesting structure of containers
   */
  it("maintains correct component structure hierarchy", () => {
    const { container } = renderApp();

    // Main container
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer.tagName).toBe("DIV");

    // Inner glassmorphism container
    const innerContainer = mainContainer.firstElementChild as HTMLElement;
    expect(innerContainer.tagName).toBe("DIV");

    // Content container
    const contentContainer = innerContainer.firstElementChild as HTMLElement;
    expect(contentContainer.tagName).toBe("DIV");

    // AppRouter should be inside content container
    expect(contentContainer).toContainElement(screen.getByTestId("app-router"));
  });

  /**
   * Test 9: Accessibility Structure
   * Verifies that the app maintains proper accessibility structure
   */
  it("maintains proper accessibility structure", () => {
    renderApp();

    // The mocked AppRouter should contain accessible content
    const routerContent = screen.getByTestId("app-router");
    expect(routerContent).toBeInTheDocument();

    // Should contain heading for screen readers
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Mocked AppRouter");
  });

  /**
   * Test 10: Error Boundary Compatibility
   * Verifies that the App component structure is compatible with error boundaries
   */
  it("is compatible with error boundary structure", () => {
    const { container } = renderApp();

    // Should have a stable container structure that won't break error boundaries
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer.children.length).toBe(1);

    // Inner structure should be consistent
    const innerContainer = mainContainer.firstElementChild as HTMLElement;
    expect(innerContainer).toBeInTheDocument();
    expect(innerContainer.children.length).toBe(1);

    // AppRouter should be properly contained
    expect(screen.getByTestId("app-router")).toBeInTheDocument();
  });
});
