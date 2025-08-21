/**
 * useForm Hook
 * Generic form hook with React Hook Form integration, Zod validation,
 * submit states management, auto-reset, and server error handling
 */

import { useCallback, useState } from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import type {
  FieldValues,
  Path,
  UseFormReturn as RHFUseFormReturn,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";

/**
 * Form submission states
 */
export type FormSubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Server error structure
 */
export interface ServerError {
  message: string;
  field?: string;
  code?: string;
}

/**
 * Form configuration options
 */
export interface UseFormConfig<TFormData extends FieldValues> {
  /** Zod validation schema */
  schema: ZodSchema<TFormData>;
  /** Auto-reset form after successful submission */
  autoReset?: boolean;
  /** Reset delay in milliseconds (default: 1000ms) */
  resetDelay?: number;
  /** Default values for the form */
  defaultValues?: DefaultValues<TFormData>;
}

/**
 * Form submission function type
 */
export type FormSubmitFunction<
  TFormData extends FieldValues,
  TResponse = unknown
> = (data: TFormData) => Promise<TResponse>;

/**
 * Hook return type
 */
export interface UseFormReturn<TFormData extends FieldValues> {
  // React Hook Form methods
  register: RHFUseFormReturn<TFormData>["register"];
  handleSubmit: RHFUseFormReturn<TFormData>["handleSubmit"];
  watch: RHFUseFormReturn<TFormData>["watch"];
  setValue: RHFUseFormReturn<TFormData>["setValue"];
  getValues: RHFUseFormReturn<TFormData>["getValues"];
  reset: RHFUseFormReturn<TFormData>["reset"];
  clearErrors: RHFUseFormReturn<TFormData>["clearErrors"];
  setError: RHFUseFormReturn<TFormData>["setError"];
  trigger: RHFUseFormReturn<TFormData>["trigger"];

  // Form state
  formState: RHFUseFormReturn<TFormData>["formState"];

  // Submit states
  submitState: FormSubmitState;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;

  // Server errors
  serverError: ServerError | null;
  serverErrors: ServerError[];

  // Submit function
  onSubmit: <TResponse = unknown>(
    submitFn: FormSubmitFunction<TFormData, TResponse>
  ) => (data: TFormData) => Promise<void>;

  // Utility functions
  resetForm: () => void;
  clearServerErrors: () => void;
  setServerError: (error: ServerError) => void;
  setServerErrors: (errors: ServerError[]) => void;
}

/**
 * Generic form hook with comprehensive form management
 *
 * @template TFormData - The form data type
 *
 * @param config - Form configuration options
 * @returns Form management object with all necessary methods and state
 *
 * @example
 * ```tsx
 * const loginForm = useForm({
 *   schema: loginSchema,
 *   defaultValues: { email: '', password: '', rememberMe: false },
 *   autoReset: false
 * });
 *
 * const handleLogin = loginForm.onSubmit(async (data) => {
 *   return await authService.login(data);
 * });
 *
 * return (
 *   <form onSubmit={loginForm.handleSubmit(handleLogin)}>
 *     <input {...loginForm.register('email')} />
 *     <input {...loginForm.register('password')} type="password" />
 *     <button type="submit" disabled={loginForm.isSubmitting}>
 *       {loginForm.isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
 *     </button>
 *   </form>
 * );
 * ```
 */
export function useForm<TFormData extends FieldValues>({
  schema,
  autoReset = true,
  resetDelay = 1000,
  defaultValues,
}: UseFormConfig<TFormData>): UseFormReturn<TFormData> {
  // React Hook Form setup with compatibility resolver
  const form = useReactHookForm<TFormData>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: defaultValues as DefaultValues<TFormData>,
    mode: "onChange",
  });

  // Submit state management
  const [submitState, setSubmitState] = useState<FormSubmitState>("idle");
  const [serverError, setServerErrorState] = useState<ServerError | null>(null);
  const [serverErrors, setServerErrorsState] = useState<ServerError[]>([]);

  // Computed states
  const isSubmitting = submitState === "submitting";
  const isSuccess = submitState === "success";
  const isError = submitState === "error";

  /**
   * Clear all server errors
   */
  const clearServerErrors = useCallback(() => {
    setServerErrorState(null);
    setServerErrorsState([]);
  }, []);

  /**
   * Set a single server error
   */
  const setServerError = useCallback(
    (error: ServerError) => {
      setServerErrorState(error);

      // If error has a field, set it as a form error
      if (error.field) {
        form.setError(error.field as Path<TFormData>, {
          type: "server",
          message: error.message,
        });
      }
    },
    [form]
  );

  /**
   * Set multiple server errors
   */
  const setServerErrors = useCallback(
    (errors: ServerError[]) => {
      setServerErrorsState(errors);

      // Set form errors for fields
      errors.forEach((error) => {
        if (error.field) {
          form.setError(error.field as Path<TFormData>, {
            type: "server",
            message: error.message,
          });
        }
      });

      // Set the first error as the main server error
      if (errors.length > 0) {
        setServerErrorState(errors[0]);
      }
    },
    [form]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    form.reset(defaultValues as DefaultValues<TFormData>);
    setSubmitState("idle");
    clearServerErrors();
  }, [form, defaultValues, clearServerErrors]);

  /**
   * Create submit handler with error handling and state management
   */
  const onSubmit = useCallback(
    <TResponse = unknown>(
      submitFn: FormSubmitFunction<TFormData, TResponse>
    ) => {
      return async (data: TFormData): Promise<void> => {
        try {
          // Clear previous errors
          clearServerErrors();

          // Set submitting state
          setSubmitState("submitting");

          // Execute submit function
          await submitFn(data);

          // Set success state
          setSubmitState("success");

          // Auto-reset if enabled
          if (autoReset) {
            setTimeout(() => {
              resetForm();
            }, resetDelay);
          }
        } catch (error: unknown) {
          // Set error state
          setSubmitState("error");

          // Handle different error types
          const errorObj = error as {
            response?: {
              data?: {
                errors?: ServerError[];
                message?: string;
                field?: string;
                code?: string;
              };
            };
            message?: string;
          };

          if (errorObj?.response?.data) {
            const errorData = errorObj.response.data;

            // Handle validation errors (array of field errors)
            if (Array.isArray(errorData.errors)) {
              setServerErrors(errorData.errors);
            }
            // Handle single error with field
            else if (errorData.field && errorData.message) {
              setServerError({
                message: errorData.message,
                field: errorData.field,
                code: errorData.code,
              });
            }
            // Handle general error message
            else if (errorData.message) {
              setServerError({
                message: errorData.message,
                code: errorData.code,
              });
            }
            // Fallback error
            else {
              setServerError({
                message:
                  "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
              });
            }
          }
          // Handle network or other errors
          else if (errorObj?.message) {
            setServerError({
              message: errorObj.message,
            });
          }
          // Fallback for unknown errors
          else {
            setServerError({
              message:
                "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
            });
          }

          // Re-throw error for additional handling if needed
          throw error;
        }
      };
    },
    [
      clearServerErrors,
      autoReset,
      resetDelay,
      resetForm,
      setServerError,
      setServerErrors,
    ]
  );

  return {
    // React Hook Form methods
    register: form.register,
    handleSubmit:
      form.handleSubmit as RHFUseFormReturn<TFormData>["handleSubmit"],
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    reset: form.reset,
    clearErrors: form.clearErrors,
    setError: form.setError,
    trigger: form.trigger,

    // Form state
    formState: form.formState,

    // Submit states
    submitState,
    isSubmitting,
    isSuccess,
    isError,

    // Server errors
    serverError,
    serverErrors,

    // Submit function
    onSubmit,

    // Utility functions
    resetForm,
    clearServerErrors,
    setServerError,
    setServerErrors,
  };
}

export default useForm;
