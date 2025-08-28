/**
 * RegisterForm Component
 * Formulario de registro de usuario con validación completa
 */

import React from "react";
import { Controller } from "react-hook-form";
import { Link } from "react-router";
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook
import { useRegisterForm } from "./hooks";

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
 * RegisterForm component
 */
export const RegisterForm: React.FC = () => {
  const {
    // Form methods
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },

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
  } = useRegisterForm();

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm font-medium">
                Nombre de usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="tu_usuario"
                  className="pl-10 h-12"
                  {...register("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                />
              </div>
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10 h-12"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* First Name Field */}
            <div className="space-y-1">
              <Label htmlFor="first_name" className="text-sm font-medium">
                Nombre
              </Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="first_name"
                  type="text"
                  placeholder="Tu nombre"
                  className="pl-10 h-12"
                  {...register("first_name")}
                  aria-invalid={errors.first_name ? "true" : "false"}
                />
              </div>
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.first_name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.first_name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Last Name Field */}
            <div className="space-y-1">
              <Label htmlFor="last_name" className="text-sm font-medium">
                Apellido
              </Label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="last_name"
                  type="text"
                  placeholder="Tu apellido"
                  className="pl-10 h-12"
                  {...register("last_name")}
                  aria-invalid={errors.last_name ? "true" : "false"}
                />
              </div>
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.last_name && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.last_name.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-12 h-12"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Error message with fixed height */}
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Fortaleza de la contraseña:</span>
                    <span
                      className={`font-medium ${
                        strengthInfo.color === "success"
                          ? "text-green-600"
                          : strengthInfo.color === "warning"
                          ? "text-yellow-600"
                          : "text-burnt_sienna-600"
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
                    className="h-1.5"
                  />
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password_confirm" className="text-sm font-medium">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password_confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-12 h-12"
                  {...register("password_confirm")}
                  aria-invalid={errors.password_confirm ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Error message with fixed height */}
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.password_confirm && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.password_confirm.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Match Indicator */}
              {password && passwordConfirm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs font-medium mt-1 ${
                    passwordsMatch
                      ? "text-persian_green-600"
                      : "text-burnt_sienna-600"
                  }`}
                >
                  {passwordsMatch
                    ? "✓ Las contraseñas coinciden"
                    : "✗ Las contraseñas no coinciden"}
                </motion.div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-invalid={errors.acceptTerms ? "true" : "false"}
                      className="mt-0.5"
                    />
                  )}
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-5">
                  Acepto los{" "}
                  <Link
                    to="/terms"
                    className="text-charcoal-600 hover:underline"
                  >
                    términos y condiciones
                  </Link>
                </Label>
              </div>
              <div className="min-h-[16px]">
                <AnimatePresence>
                  {errors.acceptTerms && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-burnt_sienna-600 mt-1"
                    >
                      {errors.acceptTerms.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="flex items-center space-x-2 mt-2">
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
                className="text-charcoal-600 hover:underline font-medium"
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
