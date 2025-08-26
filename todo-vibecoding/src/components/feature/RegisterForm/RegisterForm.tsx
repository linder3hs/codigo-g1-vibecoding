/**
 * RegisterForm Component
 * Formulario de registro de usuario con validación completa
 */

import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Shield } from "lucide-react";

// Types and schemas
import { registerSchema } from "../../../schemas/validationSchemas";
import type { RegisterData } from "../../../types/auth";

// Form type that matches the schema exactly
type FormData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  acceptTerms: boolean;
  subscribeNewsletter?: boolean;
};

// Hooks
import { useAuth } from "../../../hooks/useAuth";

// UI Components
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Alert, AlertDescription } from "../../ui/alert";
import { Progress } from "../../ui/progress";

/**
 * Password strength calculation
 */
const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;

  // Uppercase check
  if (/[A-Z]/.test(password)) strength += 25;

  // Lowercase check
  if (/[a-z]/.test(password)) strength += 25;

  // Number check
  if (/\d/.test(password)) strength += 12.5;

  // Special character check
  if (/[@$!%*?&]/.test(password)) strength += 12.5;

  return Math.min(strength, 100);
};

/**
 * Get password strength color and text
 */
const getPasswordStrengthInfo = (strength: number) => {
  if (strength < 25) return { color: "destructive", text: "Muy débil" };
  if (strength < 50) return { color: "warning", text: "Débil" };
  if (strength < 75) return { color: "warning", text: "Moderada" };
  return { color: "success", text: "Fuerte" };
};

/**
 * RegisterForm component
 */
export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register: registerUser,
    isLoading,
    error,
    clearAuthError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormData>({
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

  // Watch password for strength calculation
  const password = watch("password") || "";
  const passwordConfirm = watch("password_confirm") || "";
  const passwordStrength = calculatePasswordStrength(password);
  const strengthInfo = getPasswordStrengthInfo(passwordStrength);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  /**
   * Check if passwords match
   */
  const passwordsMatch =
    password && passwordConfirm && password === passwordConfirm;

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completa los datos para registrarte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {typeof error === "string"
                    ? error
                    : error.message || "Error en el registro"}
                </AlertDescription>
              </Alert>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="tu_usuario"
                  className="pl-10"
                  {...register("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* First Name Field */}
            <div className="space-y-2">
              <Label htmlFor="first_name">Nombre</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Tu nombre"
                  className="pl-10"
                  {...register("first_name")}
                  aria-invalid={errors.first_name ? "true" : "false"}
                />
              </div>
              {errors.first_name && (
                <p className="text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Tu apellido"
                  className="pl-10"
                  {...register("last_name")}
                  aria-invalid={errors.last_name ? "true" : "false"}
                />
              </div>
              {errors.last_name && (
                <p className="text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fortaleza de la contraseña:</span>
                    <span
                      className={`font-medium ${
                        strengthInfo.color === "success"
                          ? "text-green-600"
                          : strengthInfo.color === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {strengthInfo.text}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    variant={
                      strengthInfo.color as
                        | "default"
                        | "success"
                        | "warning"
                        | "destructive"
                    }
                    className="h-2"
                  />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password_confirm">Confirmar contraseña</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password_confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register("password_confirm")}
                  aria-invalid={errors.password_confirm ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {password && passwordConfirm && (
                <div
                  className={`text-sm ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {passwordsMatch
                    ? "✓ Las contraseñas coinciden"
                    : "✗ Las contraseñas no coinciden"}
                </div>
              )}

              {errors.password_confirm && (
                <p className="text-sm text-red-600">
                  {errors.password_confirm.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                {...register("acceptTerms")}
                aria-invalid={errors.acceptTerms ? "true" : "false"}
              />
              <Label htmlFor="acceptTerms" className="text-sm">
                Acepto los{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  términos y condiciones
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">
                {errors.acceptTerms.message}
              </p>
            )}

            {/* Newsletter Subscription */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="subscribeNewsletter"
                {...register("subscribeNewsletter")}
              />
              <Label htmlFor="subscribeNewsletter" className="text-sm">
                Quiero recibir noticias y actualizaciones por email
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
