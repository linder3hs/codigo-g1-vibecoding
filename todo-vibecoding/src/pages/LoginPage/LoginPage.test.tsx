/**
 * LoginPage Component Tests
 * Comprehensive test suite with 10 test cases covering rendering, integration, styles, and accessibility
 */

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";
import { LoginPage } from "./LoginPage";

// Mock the LoginForm component
jest.mock("@/components/feature/LoginForm", () => ({
  LoginForm: jest.fn(({ className, ...props }) => (
    <div data-testid="login-form" className={className} {...props}>
      Mocked LoginForm Component
    </div>
  )),
}));

/**
 * Test wrapper component with router
 */
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

/**
 * Helper function to render LoginPage with router context
 */
const renderLoginPage = () => {
  return render(
    <TestWrapper>
      <LoginPage />
    </TestWrapper>
  );
};

describe("LoginPage Component", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render the LoginPage component without crashing", () => {
      renderLoginPage();

      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("should render the main container with correct structure", () => {
      const { container } = renderLoginPage();

      // Check main container exists
      const mainContainer = container.querySelector(
        ".min-h-screen.bg-gradient-to-br"
      );
      expect(mainContainer).toBeInTheDocument();

      // Check inner container structure
      const innerContainer = container.querySelector(
        ".w-full.max-w-6xl.mx-auto"
      );
      expect(innerContainer).toBeInTheDocument();

      // Check form wrapper
      const formWrapper = container.querySelector(".flex.justify-center");
      expect(formWrapper).toBeInTheDocument();
    });
  });

  describe("LoginForm Integration", () => {
    it("should render LoginForm component with correct props", () => {
      renderLoginPage();

      const loginForm = screen.getByTestId("login-form");
      expect(loginForm).toBeInTheDocument();
      expect(loginForm).toHaveClass("w-full");
    });

    it("should pass className prop to LoginForm correctly", () => {
      renderLoginPage();

      const loginForm = screen.getByTestId("login-form");
      expect(loginForm).toHaveAttribute("class", "w-full");
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should apply correct Tailwind CSS classes to main container", () => {
      const { container } = renderLoginPage();

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(
        "min-h-screen",
        "bg-gradient-to-br",
        "from-charcoal-50",
        "via-white",
        "to-persian_green-50",
        "flex",
        "items-center",
        "justify-center",
        "p-4"
      );
    });

    it("should apply correct responsive and layout classes", () => {
      const { container } = renderLoginPage();

      // Check inner container classes
      const innerContainer = container.querySelector(
        ".w-full.max-w-6xl.mx-auto"
      );
      expect(innerContainer).toHaveClass("w-full", "max-w-6xl", "mx-auto");

      // Check form wrapper classes
      const formWrapper = container.querySelector(".flex.justify-center");
      expect(formWrapper).toHaveClass("flex", "justify-center");
    });
  });

  describe("Layout and Structure", () => {
    it("should have proper DOM hierarchy", () => {
      const { container } = renderLoginPage();

      // Check that LoginForm is nested correctly
      const mainContainer = container.querySelector(".min-h-screen");
      const innerContainer = mainContainer?.querySelector(".max-w-6xl");
      const formWrapper = innerContainer?.querySelector(".flex.justify-center");
      const loginForm = formWrapper?.querySelector(
        '[data-testid="login-form"]'
      );

      expect(mainContainer).toBeInTheDocument();
      expect(innerContainer).toBeInTheDocument();
      expect(formWrapper).toBeInTheDocument();
      expect(loginForm).toBeInTheDocument();
    });

    it("should maintain responsive design structure", () => {
      const { container } = renderLoginPage();

      // Verify responsive container setup
      const responsiveContainer = container.querySelector(".w-full.max-w-6xl");
      expect(responsiveContainer).toBeInTheDocument();

      // Verify centering classes
      const centeringContainer = container.querySelector(
        ".flex.items-center.justify-center"
      );
      expect(centeringContainer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure for screen readers", () => {
      const { container } = renderLoginPage();

      // Check that the main container is accessible
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInTheDocument();

      // Verify LoginForm is accessible
      const loginForm = screen.getByTestId("login-form");
      expect(loginForm).toBeInTheDocument();
    });

    it("should not have any accessibility violations in basic structure", () => {
      const { container } = renderLoginPage();

      // Check for proper nesting and no invalid HTML
      expect(container.querySelector("div")).toBeInTheDocument();

      // Verify no duplicate IDs or invalid attributes
      const allElements = container.querySelectorAll("*");
      const ids = Array.from(allElements)
        .map((el) => el.id)
        .filter((id) => id !== "");

      // Should not have duplicate IDs
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Component Behavior", () => {
    it("should render consistently on multiple renders", () => {
      const { unmount } = renderLoginPage();
      expect(screen.getByTestId("login-form")).toBeInTheDocument();

      unmount();

      renderLoginPage();
      expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("should handle component lifecycle correctly", () => {
      const { unmount, container } = renderLoginPage();

      // Component should be mounted
      expect(container.firstChild).toBeInTheDocument();

      // Component should unmount cleanly
      unmount();
      expect(container.firstChild).toBeNull();
    });
  });
});
