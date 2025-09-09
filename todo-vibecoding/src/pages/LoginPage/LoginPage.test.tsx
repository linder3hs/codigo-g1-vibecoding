import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";
import { LoginPage } from "./LoginPage";

// Mock LoginForm component
jest.mock("@/components/feature/LoginForm", () => ({
  LoginForm: ({ className }: { className?: string }) => (
    <form role="form" className={className} data-testid="login-form">
      <h1>Iniciar Sesión</h1>
      <label htmlFor="username">Usuario</label>
      <input
        id="username"
        type="text"
        placeholder="Usuario"
        data-testid="username-input"
      />
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        placeholder="Contraseña"
        data-testid="password-input"
      />
      <label htmlFor="remember">Recordarme</label>
      <input id="remember" type="checkbox" data-testid="remember-checkbox" />
      <button type="submit">Iniciar Sesión</button>
      <button type="button">¿Olvidaste tu contraseña?</button>
      <button type="button">Regístrate aquí</button>
    </form>
  ),
}));

// Router wrapper for components that use navigation
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <BrowserRouter>{children}</BrowserRouter>;

describe("LoginPage", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render correctly with proper layout structure", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      // Check that the form is rendered within the page structure
      const loginForm = screen.getByRole("form");
      expect(loginForm).toBeInTheDocument();
      
      // Check that the form container has the expected classes
      const formContainer = loginForm.closest("div");
      expect(formContainer).toBeInTheDocument();
      expect(formContainer).toHaveClass("flex", "justify-center");
    });

    it("should render LoginForm component with proper styling", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const loginForm = screen.getByRole("form");
      expect(loginForm).toBeInTheDocument();
      expect(loginForm).toHaveClass("w-full");
      expect(loginForm).toHaveAttribute("data-testid", "login-form");
    });

    it("should display login form title", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByRole("heading", { name: /iniciar sesión/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("should render all form fields correctly", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/recordarme/i)).toBeInTheDocument();
    });

    it("should render submit button with correct attributes", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
    });

    it("should render navigation buttons", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByRole("button", { name: /¿olvidaste tu contraseña\?/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /regístrate aquí/i })
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should allow typing in username field", async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      await user.type(usernameInput, "testuser");

      expect(usernameInput).toHaveValue("testuser");
    });

    it("should allow typing in password field", async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const passwordInput = screen.getByLabelText(/contraseña/i);
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    it("should handle checkbox interaction", async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const checkbox = screen.getByLabelText(/recordarme/i);
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("should handle form submission", async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      await user.click(submitButton);

      // Form should still be present after submission attempt
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper labels and form structure", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByRole("heading", { name: /iniciar sesión/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario/i)).toHaveAttribute(
        "id",
        "username"
      );
      expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute(
        "id",
        "password"
      );
      expect(screen.getByLabelText(/recordarme/i)).toHaveAttribute(
        "id",
        "remember"
      );
    });
  });
});
