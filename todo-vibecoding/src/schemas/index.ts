/**
 * Central export file for all validation schemas
 * This file provides a single entry point for importing validation schemas
 * throughout the application.
 */

// Import all schemas from validationSchemas.ts
export {
  // Authentication schemas
  loginSchema,
  registerSchema,
  
  // Task schemas
  taskSchema,
  taskFiltersSchema,
  
  // User profile schemas
  userProfileSchema,
  passwordChangeSchema,
  passwordResetSchema,
  passwordResetConfirmSchema,
  
  // Utility schemas
  paginationSchema,
  searchSchema,
  
  // Utility functions
  validateWithSchema,
  formatZodErrors,
  getFirstZodError,
  transformZodErrors,
  
  // Default export
  default as validationSchemas
} from './validationSchemas';

// Type exports for better TypeScript integration
export type {
  LoginFormData,
  RegisterFormData,
  TaskFormData,
  TaskFiltersData,
  UserProfileFormData,
  PasswordChangeFormData,
  PasswordResetFormData,
  PasswordResetConfirmFormData,
  PaginationData,
  SearchData
} from './validationSchemas';

/**
 * Re-export commonly used Zod types for convenience
 */
export { z } from 'zod';

/**
 * Schema validation result types
 */
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

/**
 * Common validation error type
 */
export type ValidationError = {
  field: string;
  message: string;
};

/**
 * Validation options type
 */
export type ValidationOptions = {
  abortEarly?: boolean;
  stripUnknown?: boolean;
};