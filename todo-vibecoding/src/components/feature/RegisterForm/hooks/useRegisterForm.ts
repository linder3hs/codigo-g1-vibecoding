/**
 * useRegisterForm Hook
 * Custom hook para manejar la lógica del formulario de registro
 */

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

// Types and schemas
import { registerSchema } from "@/schemas/validationSchemas";
import type { RegisterData, AuthError } from "@/types/auth";

// Hooks
import { useAuth } from "@/hooks/useAuth";

// Utils
import {
  calculatePasswordStrength,
  getPasswordStrengthInfo,
  checkPasswordsMatch,
} from "@/utils/passwordUtils";

// Form type that matches the schema exactly
export type FormData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
};

export interface UseRegisterFormReturn {
  // Form methods
  register: ReturnType<typeof useForm<FormData>>["register"];
  handleSubmit: ReturnType<typeof useForm<FormData>>["handleSubmit"];
  control: ReturnType<typeof useForm<FormData>>["control"];
  formState: ReturnType<typeof useForm<FormData>>["formState"];
  reset: ReturnType<typeof useForm<FormData>>["reset"];

  // Form submission
  onSubmit: SubmitHandler<FormData>;

  // Password visibility state
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;

  // Password validation
  password: string;
  passwordConfirm: string;
  passwordStrength: number;
  strengthInfo: ReturnType<typeof getPasswordStrengthInfo>;
  passwordsMatch: boolean;

  // Auth state
  isLoading: boolean;
  error: AuthError | null;
}

/**
 * Custom hook for register form logic
 */
export const useRegisterForm = (): UseRegisterFormReturn => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    isLoading,
    error,
    clearAuthError,
  } = useAuth();

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form setup
  const { register, handleSubmit, formState, watch, reset, control } =
    useForm<FormData>({
      resolver: zodResolver(registerSchema),
      mode: "onChange",
      defaultValues: {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password_confirm: "",
        subscribeNewsletter: false,
        acceptTerms: false,
      },
    });

  // Watch password fields for validation
  const password = watch("password") || "";
  const passwordConfirm = watch("password_confirm") || "";

  // Password strength calculation
  const passwordStrength = calculatePasswordStrength(password);
  const strengthInfo = getPasswordStrengthInfo(passwordStrength);

  // Check if passwords match
  const passwordsMatch = checkPasswordsMatch(password, passwordConfirm);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  /**
   * Handle form submission
   */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Extract subscribeNewsletter and acceptTerms from form data
      const { subscribeNewsletter, acceptTerms, ...registerData } = data;

      // Validate terms acceptance (additional check)
      if (!acceptTerms) {
        console.error("Terms must be accepted");
        return;
      }

      // Transform to RegisterData type
      const userData: RegisterData = {
        username: registerData.username,
        email: registerData.email,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        password: registerData.password,
        password_confirm: registerData.password_confirm,
      };

      // Register user
      const success = await registerUser(userData);

      if (success) {
        // Reset form
        reset();

        // Handle newsletter subscription if needed
        if (subscribeNewsletter) {
          // TODO: Implement newsletter subscription logic
          console.log("User subscribed to newsletter");
        }

        // Navigate to home page
        navigate("/", { replace: true });
      }
    } catch (error) {
      // Error handled by useAuth hook
      console.error("Registration error:", error);
    }
  };

  return {
    // Form methods
    register,
    handleSubmit,
    control,
    formState,
    reset,

    // Form submission
    onSubmit,

    // Password visibility state
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,

    // Password validation
    password,
    passwordConfirm,
    passwordStrength,
    strengthInfo,
    passwordsMatch,

    // Auth state
    isLoading,
    error,
  };
};
