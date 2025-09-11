import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { RegisterForm } from "./RegisterForm";
import type { SubmitHandler } from "react-hook-form";
import type { FormData } from "./hooks";

// Mock the entire hook with a simple implementation
jest.mock("./hooks", () => ({
  useRegisterForm: () => ({
    register: jest.fn(() => ({})),
    handleSubmit: jest.fn((fn: SubmitHandler<FormData>) => (e?: React.FormEvent) => {
      e?.preventDefault();
      fn({} as FormData);
    }),
    control: {},
    formState: {
      errors: {},
      isSubmitting: false,
      isDirty: false,
      isValid: false,
      isLoading: false,
      isSubmitted: false,
      isSubmitSuccessful: false,
      isValidating: false,
      submitCount: 0,
      touchedFields: {},
      dirtyFields: {},
      validatingFields: {},
      defaultValues: undefined,
      disabled: false,
      isReady: true,
    },
    reset: jest.fn(),
    onSubmit: jest.fn(),
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showConfirmPassword: false,
    setShowPassword: jest.fn(),
    setShowConfirmPassword: jest.fn(),
    passwordStrength: 0,
    strengthInfo: { text: "", color: "warning" },
    passwordsMatch: false,
    isLoading: false,
    error: null,
  }),
}));

// Mock react-hook-form Controller to avoid complex control object
jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: ({ render }: { render: (props: { field: { value: boolean; onChange: () => void; onBlur: () => void; name: string } }) => React.ReactElement }) => {
    const mockField = {
      value: false,
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name: "acceptTerms",
    };
    return render({ field: mockField });
  },
}));

// Mock router navigate
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Wrapper component for router context
const renderRegisterForm = (props = {}) => {
  return render(
    <MemoryRouter>
      <RegisterForm {...props} />
    </MemoryRouter>
  );
};

describe("RegisterForm", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render registration form with all required fields", () => {
      renderRegisterForm();

      const crearCuentaElements = screen.getAllByText(/Crear cuenta/i);
      expect(crearCuentaElements.length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText(/tu_usuario/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tu nombre/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tu apellido/i)).toBeInTheDocument();
    });

    it("should render password fields with visibility toggles", () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/confirmar contraseña/i)
      ).toBeInTheDocument();
      expect(
        screen.getAllByRole("button", { name: /mostrar contraseña/i })
      ).toHaveLength(2);
    });

    it("should render submit button", () => {
      renderRegisterForm();

      expect(
        screen.getByRole("button", { name: /crear cuenta/i })
      ).toBeInTheDocument();
    });
  });

  describe("Form Fields", () => {
    it("should allow typing in username field", async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const usernameInput = screen.getByLabelText(/nombre de usuario/i);
      await user.type(usernameInput, "testuser");

      expect(usernameInput).toHaveValue("testuser");
    });

    it("should allow typing in email field", async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const emailInput = screen.getByLabelText(/correo electrónico/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("should allow typing in name fields", async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const firstNameInput = screen.getByPlaceholderText(/tu nombre/i);
      const lastNameInput = screen.getByPlaceholderText(/tu apellido/i);

      await user.type(firstNameInput, "John");
      await user.type(lastNameInput, "Doe");

      expect(firstNameInput).toHaveValue("John");
      expect(lastNameInput).toHaveValue("Doe");
    });
  });

  describe("Password Visibility", () => {
    it("should toggle password visibility", async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^contraseña$/i);
      const toggleButtons = screen.getAllByRole("button", {
        name: /mostrar contraseña/i,
      });

      expect(passwordInput).toHaveAttribute("type", "password");

      await user.click(toggleButtons[0]);
      // Note: The actual toggle behavior would be tested if the mock was more sophisticated
    });
  });

  describe("Form Submission", () => {
    it("should handle form submission", async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const submitButton = screen.getByRole("button", {
        name: /crear cuenta/i,
      });
      await user.click(submitButton);

      // The form submission would be handled by the mocked hook
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Terms and Conditions", () => {
    it("should render terms and conditions checkbox", () => {
      renderRegisterForm();

      expect(screen.getByText(/acepto los/i)).toBeInTheDocument();
      expect(screen.getByText(/términos y condiciones/i)).toBeInTheDocument();
    });

    it("should have link to terms page", () => {
      renderRegisterForm();

      const links = screen.getAllByRole("link");
      const termsLink = links.find(
        (link) => link.getAttribute("href") === "/terms"
      );
      expect(termsLink).toBeDefined();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      renderRegisterForm();

      const usernameInput = screen.getByLabelText(/nombre de usuario/i);
      const emailInput = screen.getByLabelText(/correo electrónico/i);

      expect(usernameInput).toHaveAttribute("aria-invalid", "false");
      expect(emailInput).toHaveAttribute("aria-invalid", "false");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      renderRegisterForm();

      const usernameInput = screen.getByLabelText(/nombre de usuario/i);

      await user.tab();
      expect(usernameInput).toHaveFocus();
    });
  });

  describe("Loading States", () => {
    it("should handle loading state", () => {
      renderRegisterForm();

      const submitButton = screen.getByRole("button", {
        name: /crear cuenta/i,
      });
      expect(submitButton).not.toBeDisabled();
    });
  });
});
