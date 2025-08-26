/**
 * Validation Schemas
 * Zod schemas for form validation with React Hook Form integration
 */

import { z } from 'zod';

/**
 * Common validation patterns
 */
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Custom error messages in Spanish
 */
const errorMessages = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  password: {
    min: 'La contraseña debe tener al menos 8 caracteres',
    pattern: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
  },
  confirmPassword: 'Las contraseñas no coinciden',
  name: {
    min: 'Debe tener al menos 2 caracteres',
    max: 'No puede exceder 50 caracteres',
  },
  text: {
    min: 'Debe tener al menos 1 carácter',
    max: 'No puede exceder 500 caracteres',
  },
  terms: 'Debes aceptar los términos y condiciones',
};

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string({ message: errorMessages.required })
    .min(1, errorMessages.required)
    .regex(emailRegex, errorMessages.email),
  
  password: z
    .string({ message: errorMessages.required })
    .min(1, errorMessages.required),
  
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Registration form validation schema
 */
export const registerSchema = z
  .object({
    username: z
      .string({ message: errorMessages.required })
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos')
      .trim(),
    
    email: z
      .string({ message: errorMessages.required })
      .min(1, errorMessages.required)
      .regex(emailRegex, errorMessages.email),
    
    first_name: z
      .string({ message: errorMessages.required })
      .min(2, errorMessages.name.min)
      .max(50, errorMessages.name.max)
      .trim(),
    
    last_name: z
      .string({ message: errorMessages.required })
      .min(2, errorMessages.name.min)
      .max(50, errorMessages.name.max)
      .trim(),
    
    password: z
      .string({ message: errorMessages.required })
      .min(8, errorMessages.password.min)
      .regex(passwordRegex, errorMessages.password.pattern),
    
    password_confirm: z
      .string({ message: errorMessages.required })
      .min(1, errorMessages.required),
    
    acceptTerms: z
      .boolean({ message: errorMessages.terms })
      .refine((val) => val === true, {
        message: errorMessages.terms,
      }),
    
    subscribeNewsletter: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: errorMessages.confirmPassword,
    path: ['password_confirm'],
  });

/**
 * Task creation/update validation schema
 */
export const taskSchema = z.object({
  text: z
    .string({ message: errorMessages.required })
    .min(1, errorMessages.text.min)
    .max(500, errorMessages.text.max)
    .trim(),
  
  priority: z
    .enum(['low', 'medium', 'high'], { message: 'Selecciona una prioridad' })
    .default('medium'),
  
  completed: z.boolean().optional().default(false),
});

/**
 * Task filters validation schema
 */
export const taskFiltersSchema = z.object({
  status: z
    .enum(['all', 'completed', 'pending'], { message: 'Selecciona un estado' })
    .default('all'),
  
  priority: z
    .enum(['low', 'medium', 'high'])
    .optional(),
  
  search: z
    .string()
    .max(100, 'La búsqueda no puede exceder 100 caracteres')
    .optional(),
  
  sortBy: z
    .enum(['createdAt', 'priority', 'text'], { message: 'Selecciona un criterio de ordenamiento' })
    .default('createdAt'),
  
  sortOrder: z
    .enum(['asc', 'desc'], { message: 'Selecciona un orden' })
    .default('desc'),
});

/**
 * User profile update validation schema
 */
export const userProfileSchema = z.object({
  firstName: z
    .string({
      message: errorMessages.required,
    })
    .min(2, errorMessages.name.min)
    .max(50, errorMessages.name.max)
    .trim(),
  
  lastName: z
    .string({
      message: errorMessages.required,
    })
    .min(2, errorMessages.name.min)
    .max(50, errorMessages.name.max)
    .trim(),
  
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
  
  phone: z
    .string()
    .regex(/^[+]?[1-9]\d{1,14}$/, 'Ingresa un número de teléfono válido')
    .optional()
    .or(z.literal('')),
  
  timezone: z
    .string()
    .optional(),
  
  language: z
    .enum(['es', 'en'], {
      message: 'Selecciona un idioma',
    })
    .default('es'),
  
  notifications: z
    .object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      sms: z.boolean().default(false),
      taskReminders: z.boolean().default(true),
      weeklyDigest: z.boolean().default(true),
    })
    .optional(),
});

/**
 * Password change validation schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string({
        message: errorMessages.required,
      })
      .min(1, errorMessages.required),
    
    newPassword: z
      .string({
        message: errorMessages.required,
      })
      .min(8, errorMessages.password.min)
      .regex(passwordRegex, errorMessages.password.pattern),
    
    confirmNewPassword: z
      .string({
        message: errorMessages.required,
      })
      .min(1, errorMessages.required),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: errorMessages.confirmPassword,
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual',
    path: ['newPassword'],
  });

/**
 * Password reset validation schema
 */
export const passwordResetSchema = z.object({
  email: z
    .string({
      message: errorMessages.required,
    })
    .min(1, errorMessages.required)
    .regex(emailRegex, errorMessages.email),
});

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z
  .object({
    token: z
      .string({
        message: 'Token de recuperación requerido',
      })
      .min(1, 'Token de recuperación requerido'),
    
    newPassword: z
      .string({
        message: errorMessages.required,
      })
      .min(8, errorMessages.password.min)
      .regex(passwordRegex, errorMessages.password.pattern),
    
    confirmNewPassword: z
      .string({
        message: errorMessages.required,
      })
      .min(1, errorMessages.required),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: errorMessages.confirmPassword,
    path: ['confirmNewPassword'],
  });

/**
 * Pagination validation schema
 */
export const paginationSchema = z.object({
  page: z
    .number({
      message: 'Número de página requerido',
    })
    .int('Debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0')
    .default(1),
  
  limit: z
    .number({
      message: 'Límite requerido',
    })
    .int('Debe ser un número entero')
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite no puede exceder 100')
    .default(10),
});

/**
 * Search validation schema
 */
export const searchSchema = z.object({
  query: z
    .string()
    .max(100, 'La búsqueda no puede exceder 100 caracteres')
    .optional(),
  
  filters: taskFiltersSchema.optional(),
  pagination: paginationSchema.optional(),
});

/**
 * Type exports for TypeScript integration
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskFiltersData = z.infer<typeof taskFiltersSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type SearchData = z.infer<typeof searchSchema>;

/**
 * Schema validation utilities
 */
export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
};

/**
 * Get field errors from Zod validation
 */
export const getFieldErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join('.');
    if (path) {
      fieldErrors[path] = err.message;
    }
  });
  
  return fieldErrors;
};

/**
 * Transform Zod errors for React Hook Form
 */
export const transformZodErrors = (error: z.ZodError) => {
  return error.issues.reduce((acc, curr: z.ZodIssue) => {
    const path = curr.path.join('.');
    if (path) {
      acc[path] = {
        type: 'validation',
        message: curr.message,
      };
    }
    return acc;
  }, {} as Record<string, { type: string; message: string }>);
};

/**
 * Utility function to validate data with a schema and return formatted errors
 */
export const validateWithSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: formatZodErrors(result.error),
  };
};

/**
 * Transform Zod errors to a more user-friendly format
 */
export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });
  
  return formattedErrors;
};

/**
 * Get the first error message from a ZodError
 */
export const getFirstZodError = (error: z.ZodError): string => {
  if (error.issues.length === 0) {
    return 'Error de validación';
  }
  
  return error.issues.reduce((acc: string, curr: z.ZodIssue) => {
     return acc.length < curr.message.length ? acc : curr.message;
   }, error.issues[0].message);
 };

/**
 * Default export with all schemas
 */
export default {
  loginSchema,
  registerSchema,
  taskSchema,
  taskFiltersSchema,
  userProfileSchema,
  passwordChangeSchema,
  passwordResetSchema,
  passwordResetConfirmSchema,
  paginationSchema,
  searchSchema,
};