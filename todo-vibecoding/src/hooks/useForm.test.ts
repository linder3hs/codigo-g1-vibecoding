import { renderHook, act } from "@testing-library/react";
import { z } from "zod";
import { useForm } from "./useForm";
import type { ServerError, FormSubmitFunction } from "./useForm";

// Test schema for validation
const testSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  rememberMe: z.boolean().optional(),
});

type TestFormData = z.infer<typeof testSchema>;

// Mock submit functions
const mockSuccessSubmit: FormSubmitFunction<TestFormData> = jest
  .fn()
  .mockResolvedValue({ success: true });
const mockFailureSubmit: FormSubmitFunction<TestFormData> = jest
  .fn()
  .mockRejectedValue(new Error("Network error"));
const mockServerErrorSubmit: FormSubmitFunction<TestFormData> = jest
  .fn()
  .mockRejectedValue({
    response: {
      data: {
        message: "Email ya está en uso",
        field: "email",
        code: "DUPLICATE_EMAIL",
      },
    },
  });
const mockValidationErrorsSubmit: FormSubmitFunction<TestFormData> = jest
  .fn()
  .mockRejectedValue({
    response: {
      data: {
        errors: [
          { message: "Email inválido", field: "email" },
          { message: "Contraseña muy débil", field: "password" },
        ],
      },
    },
  });

describe("useForm Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe("Initialization", () => {
    it("should initialize with correct default values and state", () => {
      const defaultValues = {
        email: "test@example.com",
        password: "",
        name: "",
        rememberMe: false,
      };

      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
          defaultValues,
          autoReset: false,
        })
      );

      // Check initial state
      expect(result.current.submitState).toBe("idle");
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.serverError).toBeNull();
      expect(result.current.serverErrors).toEqual([]);

      // Check form methods are available
      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.handleSubmit).toBe("function");
      expect(typeof result.current.onSubmit).toBe("function");
      expect(typeof result.current.resetForm).toBe("function");

      // Check default values
      expect(result.current.getValues("email")).toBe("test@example.com");
      expect(result.current.getValues("rememberMe")).toBe(false);
    });

    it("should initialize with empty default values when not provided", () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      expect(result.current.submitState).toBe("idle");
      expect(result.current.formState.isDirty).toBe(false);
    });
  });

  describe("Form Validation", () => {
    it('should validate form fields according to schema', async () => {
      const mockSubmit = jest.fn();
      const { result } = renderHook(() => useForm({
        schema: testSchema,
        defaultValues: { email: '', password: '', name: '' }
      }));

      // Set invalid data
      act(() => {
        result.current.setValue('email', 'invalid-email');
        result.current.setValue('password', '123');
        result.current.setValue('name', 'Test User');
      });

      // Try to submit with invalid data
      const submitHandler = result.current.handleSubmit(mockSubmit);
      
      await act(async () => {
        await submitHandler();
      });

      // Submit should not be called due to validation errors
      expect(mockSubmit).not.toHaveBeenCalled();
      expect(result.current.formState.isValid).toBe(false);
    });

    it('should allow valid form submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue({ success: true });
      const { result } = renderHook(() => useForm({
        schema: testSchema,
        defaultValues: { email: '', password: '', name: '' }
      }));

      // Set valid data
      act(() => {
        result.current.setValue('email', 'test@example.com');
        result.current.setValue('password', 'password123');
        result.current.setValue('name', 'Test User');
      });

      // Submit with valid data
      const submitHandler = result.current.handleSubmit(mockSubmit);
      
      await act(async () => {
        await submitHandler();
      });

      // Submit should be called with valid data
       expect(mockSubmit).toHaveBeenCalledTimes(1);
       const callArgs = mockSubmit.mock.calls[0];
       expect(callArgs[0]).toEqual({
         email: 'test@example.com',
         password: 'password123',
         name: 'Test User'
       });
    });
  });

  describe("Form Submission - Success", () => {
    it("should handle successful form submission", async () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
          autoReset: false,
        })
      );

      const formData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const submitHandler = result.current.onSubmit(mockSuccessSubmit);

      await act(async () => {
        await submitHandler(formData);
      });

      expect(mockSuccessSubmit).toHaveBeenCalledWith(formData);
      expect(result.current.submitState).toBe("success");
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.serverError).toBeNull();
    });

    it("should auto-reset form after successful submission when enabled", async () => {
      jest.useFakeTimers();

      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
          autoReset: true,
          resetDelay: 500,
        })
      );

      const formData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      // Set form values
      act(() => {
        result.current.setValue("email", formData.email);
        result.current.setValue("password", formData.password);
        result.current.setValue("name", formData.name);
      });

      const submitHandler = result.current.onSubmit(mockSuccessSubmit);

      await act(async () => {
        await submitHandler(formData);
      });

      expect(result.current.submitState).toBe("success");

      // Fast-forward time to trigger auto-reset
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.submitState).toBe("idle");

      jest.useRealTimers();
    });
  });

  describe("Form Submission - Errors", () => {
    it("should handle network errors during submission", async () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      const formData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const submitHandler = result.current.onSubmit(mockFailureSubmit);

      await act(async () => {
        try {
          await submitHandler(formData);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.submitState).toBe("error");
      expect(result.current.isError).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.serverError?.message).toBe("Network error");
    });

    it("should handle server validation errors with field mapping", async () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      const formData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const submitHandler = result.current.onSubmit(mockServerErrorSubmit);

      await act(async () => {
        try {
          await submitHandler(formData);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.submitState).toBe("error");
      expect(result.current.serverError?.message).toBe("Email ya está en uso");
      expect(result.current.serverError?.field).toBe("email");
      expect(result.current.serverError?.code).toBe("DUPLICATE_EMAIL");
    });

    it("should handle multiple server validation errors", async () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      const formData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const submitHandler = result.current.onSubmit(mockValidationErrorsSubmit);

      await act(async () => {
        try {
          await submitHandler(formData);
        } catch {
          // Expected to throw
        }
      });

      expect(result.current.submitState).toBe("error");
      expect(result.current.serverErrors).toHaveLength(2);
      expect(result.current.serverErrors[0].message).toBe("Email inválido");
      expect(result.current.serverErrors[1].message).toBe(
        "Contraseña muy débil"
      );
      expect(result.current.serverError?.message).toBe("Email inválido");
    });
  });

  describe("Server Error Management", () => {
    it("should set and clear server errors manually", () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      const testError: ServerError = {
        message: "Test error",
        field: "email",
        code: "TEST_ERROR",
      };

      // Set server error
      act(() => {
        result.current.setServerError(testError);
      });

      expect(result.current.serverError).toEqual(testError);

      // Clear server errors
      act(() => {
        result.current.clearServerErrors();
      });

      expect(result.current.serverError).toBeNull();
      expect(result.current.serverErrors).toEqual([]);
    });

    it("should set multiple server errors manually", () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      const testErrors: ServerError[] = [
        { message: "Error 1", field: "email" },
        { message: "Error 2", field: "password" },
      ];

      act(() => {
        result.current.setServerErrors(testErrors);
      });

      expect(result.current.serverErrors).toEqual(testErrors);
      expect(result.current.serverError).toEqual(testErrors[0]);
    });
  });

  describe("Form Reset", () => {
    it("should reset form to initial state", () => {
      const defaultValues = {
        email: "initial@example.com",
        password: "",
        name: "Initial Name",
        rememberMe: true,
      };

      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
          defaultValues,
        })
      );

      // Modify form values and state
      act(() => {
        result.current.setValue("email", "changed@example.com");
        result.current.setValue("name", "Changed Name");
        result.current.setServerError({ message: "Test error" });
      });

      // Reset form
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.getValues("email")).toBe("initial@example.com");
      expect(result.current.getValues("name")).toBe("Initial Name");
      expect(result.current.submitState).toBe("idle");
      expect(result.current.serverError).toBeNull();
      expect(result.current.serverErrors).toEqual([]);
    });
  });

  describe("Form State Management", () => {
    it("should track submit states correctly during submission lifecycle", async () => {
      const { result } = renderHook(() =>
        useForm({
          schema: testSchema,
        })
      );

      const formData: TestFormData = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const submitHandler = result.current.onSubmit(mockSuccessSubmit);

      // Initial state
      expect(result.current.submitState).toBe("idle");
      expect(result.current.isSubmitting).toBe(false);

      // Start submission and wait for completion
      await act(async () => {
        await submitHandler(formData);
      });

      // Check final success state
      expect(result.current.submitState).toBe("success");
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
