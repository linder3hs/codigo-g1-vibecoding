import { renderHook, act, cleanup } from "@testing-library/react";
import React from "react";
import * as passwordUtils from "@/utils/passwordUtils";
import type { AuthError } from "@/types/auth";
import { useRegisterForm } from "./useRegisterForm";

// Mock dependencies
jest.mock("@/utils/passwordUtils");

// Mock react-hook-form
const mockReset = jest.fn();
const mockFormRegister = jest.fn(() => ({
  onChange: jest.fn(),
  onBlur: jest.fn(),
  name: "test",
  ref: jest.fn(),
}));
const mockHandleSubmit = jest.fn((fn) => fn);

// Create a state to track watched values
const watchedValues: Record<string, string> = {
  password: "",
  password_confirm: "",
};

const mockWatch = jest.fn((field) => {
  return watchedValues[field as keyof typeof watchedValues] || "";
});

// Helper to update watched values in tests
const setWatchedValue = (field: string, value: string) => {
  watchedValues[field] = value;
};

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: mockFormRegister,
    handleSubmit: mockHandleSubmit,
    formState: { errors: {}, isValid: true },
    watch: mockWatch,
    reset: mockReset,
    control: {},
  }),
}));

// Export helper for tests
(global as Record<string, unknown>).setWatchedValue = setWatchedValue;

// Mock zodResolver to return a simple resolver that doesn't validate
jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: () => undefined,
}));

// Mock the registerSchema to avoid validation issues
jest.mock("@/schemas/validationSchemas", () => ({
  registerSchema: {
    parse: jest.fn((data) => data),
    safeParse: jest.fn((data) => ({ success: true, data })),
  },
}));

// Mock react-router
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock useAuth hook
const mockUseAuth = {
  isAuthenticated: false,
  isLoading: false,
  refreshToken: jest.fn(),
  checkAuthStatus: jest.fn(),
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  error: null as AuthError | null,
  clearAuthError: jest.fn(),
  isTokenExpired: false,
  isTokenExpiringSoon: false,
  getCurrentUser: jest.fn(),
  initializeAuth: jest.fn(),
};

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

const mockPasswordUtils = passwordUtils as jest.Mocked<typeof passwordUtils>;

// Mock console methods
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

// Test wrapper component
// TestWrapper is not needed since we're mocking useNavigate directly
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, {}, children);
};

// Mock data
const mockAuthError: AuthError = {
  message: "Email already exists",
  field: "email",
  code: "DUPLICATE_EMAIL",
};

const mockFormData = {
  username: "testuser",
  email: "test@example.com",
  first_name: "Test",
  last_name: "User",
  password: "Password123!",
  password_confirm: "Password123!",
  acceptTerms: true,
  subscribeNewsletter: false,
};

describe("useRegisterForm Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();

    // Reset mock functions
    mockUseAuth.register.mockClear();
    mockUseAuth.clearAuthError.mockClear();
    mockUseAuth.login.mockClear();
    mockUseAuth.logout.mockClear();
    mockUseAuth.refreshToken.mockClear();
    mockUseAuth.getCurrentUser.mockClear();
    mockUseAuth.checkAuthStatus.mockClear();
    mockUseAuth.initializeAuth.mockClear();

    // Reset default values
    mockUseAuth.isLoading = false;
    mockUseAuth.error = null;

    // Reset watched values
    watchedValues.password = "";
    watchedValues.password_confirm = "";

    // Configure password utils mocks
    mockPasswordUtils.calculatePasswordStrength.mockReturnValue(85);
    mockPasswordUtils.getPasswordStrengthInfo.mockReturnValue({
      color: "success",
      text: "Strong",
    });
    mockPasswordUtils.checkPasswordsMatch.mockReturnValue(true);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Initialization", () => {
    it("should initialize with correct default values and state", () => {
      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      // Check initial state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.showPassword).toBe(false);
      expect(result.current.showConfirmPassword).toBe(false);
      expect(result.current.password).toBe("");
      expect(result.current.passwordConfirm).toBe("");
      expect(result.current.passwordStrength).toBe(85);
      expect(result.current.passwordsMatch).toBe(true);

      // Check form methods are available
      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.handleSubmit).toBe("function");
      expect(typeof result.current.onSubmit).toBe("function");
      expect(typeof result.current.reset).toBe("function");
      expect(typeof result.current.setShowPassword).toBe("function");
      expect(typeof result.current.setShowConfirmPassword).toBe("function");

      // Check form state
      expect(result.current.formState).toBeDefined();
      expect(result.current.control).toBeDefined();
    });

    it("should call clearAuthError on mount", () => {
      const mockClearAuthError = jest.fn();
      mockUseAuth.clearAuthError = mockClearAuthError;

      renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      expect(mockClearAuthError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Password Visibility State", () => {
    it("should toggle password visibility correctly", () => {
      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      // Initial state
      expect(result.current.showPassword).toBe(false);

      // Toggle password visibility
      act(() => {
        result.current.setShowPassword(true);
      });

      expect(result.current.showPassword).toBe(true);

      // Toggle back
      act(() => {
        result.current.setShowPassword(false);
      });

      expect(result.current.showPassword).toBe(false);
    });

    it("should toggle confirm password visibility correctly", () => {
      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      // Initial state
      expect(result.current.showConfirmPassword).toBe(false);

      // Toggle confirm password visibility
      act(() => {
        result.current.setShowConfirmPassword(true);
      });

      expect(result.current.showConfirmPassword).toBe(true);

      // Toggle back
      act(() => {
        result.current.setShowConfirmPassword(false);
      });

      expect(result.current.showConfirmPassword).toBe(false);
    });
  });

  describe("Password Validation", () => {
    it("should calculate password strength correctly", () => {
      mockPasswordUtils.calculatePasswordStrength.mockReturnValue(75);
      mockPasswordUtils.getPasswordStrengthInfo.mockReturnValue({
        color: "warning",
        text: "Moderada",
      });

      // Set password value using the helper
      setWatchedValue("password", "Password123");
      
      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      expect(mockPasswordUtils.calculatePasswordStrength).toHaveBeenCalledWith("Password123");
      expect(result.current.passwordStrength).toBe(75);
      expect(result.current.strengthInfo.color).toBe("warning");
      expect(result.current.strengthInfo.text).toBe("Moderada");
    });

    it("should check password match correctly", () => {
      mockPasswordUtils.checkPasswordsMatch.mockReturnValue(false);

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      expect(mockPasswordUtils.checkPasswordsMatch).toHaveBeenCalled();
      expect(result.current.passwordsMatch).toBe(false);
    });
  });

  describe("Form Submission - Success", () => {
    it("should handle successful registration without newsletter", async () => {
      const mockRegister = jest.fn().mockResolvedValue(true);
      mockUseAuth.register = mockRegister;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockRegister).toHaveBeenCalledWith({
        username: mockFormData.username,
        email: mockFormData.email,
        first_name: mockFormData.first_name,
        last_name: mockFormData.last_name,
        password: mockFormData.password,
        password_confirm: mockFormData.password_confirm,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
      expect(console.log).not.toHaveBeenCalledWith(
        "User subscribed to newsletter"
      );
    });

    it("should handle successful registration with newsletter subscription", async () => {
      const mockRegister = jest.fn().mockResolvedValue(true);
      mockUseAuth.register = mockRegister;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      const formDataWithNewsletter = {
        ...mockFormData,
        subscribeNewsletter: true,
      };

      await act(async () => {
        await result.current.onSubmit(formDataWithNewsletter);
      });

      expect(mockRegister).toHaveBeenCalledWith({
        username: mockFormData.username,
        email: mockFormData.email,
        first_name: mockFormData.first_name,
        last_name: mockFormData.last_name,
        password: mockFormData.password,
        password_confirm: mockFormData.password_confirm,
      });
      expect(console.log).toHaveBeenCalledWith("User subscribed to newsletter");
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    it("should reset form after successful registration", async () => {
      const mockRegisterUser = jest.fn().mockResolvedValue(true);
      
      // Set up the mock to return true for successful registration
      mockUseAuth.register = mockRegisterUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;

      // Clear previous calls
      mockReset.mockClear();
      mockNavigate.mockClear();

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockRegisterUser).toHaveBeenCalledWith({
        username: mockFormData.username,
        email: mockFormData.email,
        first_name: mockFormData.first_name,
        last_name: mockFormData.last_name,
        password: mockFormData.password,
        password_confirm: mockFormData.password_confirm,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  describe("Form Submission - Validation Errors", () => {
    it("should not submit when terms are not accepted", async () => {
      const mockRegister = jest.fn();
      mockUseAuth.register = mockRegister;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      const invalidFormData = {
        ...mockFormData,
        acceptTerms: false,
      };

      await act(async () => {
        await result.current.onSubmit(invalidFormData);
      });

      expect(mockRegister).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Terms must be accepted");
    });
  });

  describe("Form Submission - Registration Errors", () => {
    it("should handle registration failure", async () => {
      const mockRegister = jest.fn().mockResolvedValue(false);
      mockUseAuth.register = mockRegister;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = mockAuthError;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockRegister).toHaveBeenCalledWith({
        username: mockFormData.username,
        email: mockFormData.email,
        first_name: mockFormData.first_name,
        last_name: mockFormData.last_name,
        password: mockFormData.password,
        password_confirm: mockFormData.password_confirm,
      });
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.error).toEqual(mockAuthError);
    });

    it("should handle registration exception", async () => {
      const mockRegister = jest
        .fn()
        .mockRejectedValue(new Error("Network error"));
      mockUseAuth.register = mockRegister;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.onSubmit(mockFormData);
      });

      expect(mockRegister).toHaveBeenCalledWith({
        username: mockFormData.username,
        email: mockFormData.email,
        first_name: mockFormData.first_name,
        last_name: mockFormData.last_name,
        password: mockFormData.password,
        password_confirm: mockFormData.password_confirm,
      });
      expect(console.error).toHaveBeenCalledWith(
        "Registration error:",
        expect.any(Error)
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Auth State Integration", () => {
    it("should reflect loading state from useAuth", () => {
      mockUseAuth.isLoading = true;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("should reflect error state from useAuth", () => {
      mockUseAuth.error = mockAuthError;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      expect(result.current.error).toEqual(mockAuthError);
    });
  });

  describe("Form Data Transformation", () => {
    it("should correctly transform form data to RegisterData", async () => {
      const mockRegister = jest.fn().mockResolvedValue(true);
      mockUseAuth.register = mockRegister;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;

      const { result } = renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      const formDataWithExtra = {
        ...mockFormData,
        subscribeNewsletter: true,
        acceptTerms: true,
      };

      await act(async () => {
        await result.current.onSubmit(formDataWithExtra);
      });

      // Verify that subscribeNewsletter and acceptTerms are excluded from RegisterData
      expect(mockRegister).toHaveBeenCalledWith({
        username: mockFormData.username,
        email: mockFormData.email,
        first_name: mockFormData.first_name,
        last_name: mockFormData.last_name,
        password: mockFormData.password,
        password_confirm: mockFormData.password_confirm,
      });
    });
  });

  describe("Password Utils Integration", () => {
    it("should call password utility functions with correct parameters", () => {
      renderHook(() => useRegisterForm(), {
        wrapper: TestWrapper,
      });

      // Verify password utils are called with empty strings initially
      expect(mockPasswordUtils.calculatePasswordStrength).toHaveBeenCalledWith(
        ""
      );
      expect(mockPasswordUtils.getPasswordStrengthInfo).toHaveBeenCalledWith(
        85
      );
      expect(mockPasswordUtils.checkPasswordsMatch).toHaveBeenCalledWith(
        "",
        ""
      );
    });
  });
});
