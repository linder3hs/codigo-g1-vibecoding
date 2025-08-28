/**
 * LoginForm Component
 * Modern login form with React Hook Form, Zod validation, and Tailwind CSS
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth";
import { loginSchema } from "@/schemas";

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginForm component props
 */
interface LoginFormProps {
  className?: string;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

/**
 * Animation variants for form elements
 */
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * LoginForm Component
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  className = "",
  onSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearAuthError, isAuthenticated } =
    useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  /**
   * Handle successful authentication
   */
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess?.();
      navigate("/");
    }
  }, [isAuthenticated, onSuccess, navigate]);

  /**
   * Clear auth error when component unmounts or when starting new login
   */
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      // Clear any previous errors
      clearAuthError();

      // Convert form data to LoginCredentials
      const credentials: LoginCredentials = {
        username: data.username,
        password: data.password,
      };

      const success = await login(credentials);

      if (success) {
        reset(); // Clear form on success
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className={`w-full max-w-md mx-auto ${className}`}
    >
      <Card className="p-8 shadow-2xl border-0 bg-white/95 ">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700 text-sm font-medium">{error.message}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Username Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Usuario
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="username"
                type="text"
                placeholder="tu_usuario"
                className={`pl-10 h-12 transition-all duration-200 ${
                  errors.username
                    ? "border-burnt_sienna-300 focus:border-burnt_sienna-500 focus:ring-burnt_sienna-200"
                    : "border-gray-300 focus:border-charcoal-500 focus:ring-charcoal-200"
                }`}
                {...register("username")}
                disabled={isFormLoading}
              />
            </div>
            {errors.username && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-burnt_sienna-600 text-sm font-medium"
              >
                {errors.username.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 pr-12 h-12 transition-all duration-200 ${
                  errors.password
                    ? "border-burnt_sienna-300 focus:border-burnt_sienna-500 focus:ring-burnt_sienna-200"
                    : "border-gray-300 focus:border-charcoal-500 focus:ring-charcoal-200"
                }`}
                {...register("password")}
                disabled={isFormLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={isFormLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-burnt_sienna-600 text-sm font-medium"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Remember Me */}
          <motion.div variants={itemVariants} className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-charcoal-600 focus:ring-charcoal-500 border-gray-300 rounded transition-colors duration-200"
              {...register("rememberMe")}
              disabled={isFormLoading}
            />
            <Label
              htmlFor="rememberMe"
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              Recordarme
            </Label>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              disabled={isFormLoading}
              className="w-full h-12 bg-gradient-to-r from-charcoal-600 to-charcoal-700 hover:from-charcoal-700 hover:to-charcoal-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isFormLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div variants={itemVariants} className="text-center">
            <button
              type="button"
              className="text-sm text-charcoal-600 hover:text-charcoal-800 font-medium transition-colors duration-200"
              disabled={isFormLoading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-charcoal-600 hover:text-charcoal-800 font-medium transition-colors duration-200"
              disabled={isFormLoading}
            >
              Regístrate aquí
            </button>
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
