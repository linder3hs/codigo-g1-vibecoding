import "@testing-library/jest-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { LoginForm } from "./LoginForm";

// Mock useAuth hook
const mockLogin = jest.fn();
const mockClearAuthError = jest.fn();
const mockNavigate = jest.fn();

// Create a mock that can be modified per test
const mockUseAuth = {
  login: mockLogin,
  isLoading: false,
  error: null as { message: string } | null,
  clearAuthError: mockClearAuthError,
  isAuthenticated: false,
};

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Mock framer-motion to avoid animation issues in tests
interface MockMotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: MockMotionProps) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, ...props }: MockMotionProps) => (
      <p {...props}>{children}</p>
    ),
  },
}));

const renderLoginForm = (props = {}) => {
  return render(
    <BrowserRouter>
      <LoginForm {...props} />
    </BrowserRouter>
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock state
    mockUseAuth.isLoading = false;
    mockUseAuth.error = null;
    mockUseAuth.isAuthenticated = false;
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render login form with all required fields", () => {
      renderLoginForm();

      expect(
        screen.getByRole("heading", { name: /iniciar sesión/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/ingresa tus credenciales para acceder/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /recordarme/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /iniciar sesión/i })
      ).toBeInTheDocument();
    });

    it("should render navigation links correctly", () => {
      renderLoginForm();

      expect(
        screen.getByRole("button", { name: /¿olvidaste tu contraseña\?/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /regístrate aquí/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Fields Interaction", () => {
    it("should allow typing in username field", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const usernameInput = screen.getByLabelText(/usuario/i);
      await user.type(usernameInput, "testuser");

      expect(usernameInput).toHaveValue("testuser");
    });

    it("should allow typing in password field", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/contraseña/i);
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });

    it("should toggle remember me checkbox", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: /recordarme/i,
      });
      expect(rememberMeCheckbox).not.toBeChecked();

      await user.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();

      await user.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });
  });

  describe("Password Visibility Toggle", () => {
    it("should toggle password visibility when eye icon is clicked", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/contraseña/i);
      const toggleButton = screen.getByRole("button", { name: "" }); // Eye icon button has no accessible name

      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute("type", "password");

      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      // Click to hide password again
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should show password text when visibility is toggled on", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/contraseña/i);
      const toggleButton = screen.getByRole("button", { name: "" });

      await user.type(passwordInput, "mypassword");
      await user.click(toggleButton);

      expect(passwordInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveValue("mypassword");
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty fields", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Este campo es obligatorio")
        ).toBeInTheDocument();
        expect(
          screen.getByText("La contraseña es requerida")
        ).toBeInTheDocument();
      });
    });

    it("should clear validation errors when user starts typing", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });
      const usernameInput = screen.getByLabelText(/usuario/i);

      // Trigger validation errors
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Este campo es obligatorio")
        ).toBeInTheDocument();
      });

      // Start typing to clear error
      await user.type(usernameInput, "u");

      await waitFor(() => {
        expect(
          screen.queryByText("Este campo es obligatorio")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should call login function with correct credentials on form submit", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValueOnce(true);
      renderLoginForm();

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          username: "testuser",
          password: "password123",
        });
      });
    });

    it("should handle register navigation", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const registerButton = screen.getByRole("button", {
        name: /regístrate aquí/i,
      });
      await user.click(registerButton);

      expect(mockNavigate).toHaveBeenCalledWith("/register");
    });
  });

  describe("Loading States", () => {
    it("should show loading state when form is submitting", () => {
      // Set loading state
      mockUseAuth.isLoading = true;

      renderLoginForm();

      expect(screen.getByText(/iniciando sesión\.\.\./i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /iniciando sesión\.\.\./i })
      ).toBeDisabled();

      // Reset state
      mockUseAuth.isLoading = false;
    });

    it("should disable form fields when loading", () => {
      // Set loading state
      mockUseAuth.isLoading = true;

      renderLoginForm();

      expect(screen.getByLabelText(/usuario/i)).toBeDisabled();
      expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
      expect(
        screen.getByRole("checkbox", { name: /recordarme/i })
      ).toBeDisabled();

      // Reset state
      mockUseAuth.isLoading = false;
    });
  });

  describe("Error Handling", () => {
    it("should display error message when login fails", () => {
      const mockError = { message: "Credenciales inválidas" };

      // Set error state
      mockUseAuth.error = mockError;

      renderLoginForm();

      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();

      // Reset state
      mockUseAuth.error = null;
    });

    it("should call clearAuthError on component unmount", () => {
      const { unmount } = renderLoginForm();

      unmount();

      expect(mockClearAuthError).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      renderLoginForm();

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
      expect(
        screen.getByRole("checkbox", { name: /recordarme/i })
      ).toHaveAttribute("id", "rememberMe");
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: /recordarme/i,
      });
      const submitButton = screen.getByRole("button", {
        name: /iniciar sesión/i,
      });

      // Tab through form elements
      await user.tab();
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab(); // Skip password toggle button
      await user.tab();
      expect(rememberMeCheckbox).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
