/**
 * Password utility functions
 * Funciones utilitarias para manejo de contraseñas
 */

export interface PasswordStrengthInfo {
  color: 'destructive' | 'warning' | 'success';
  text: string;
}

/**
 * Calculate password strength based on various criteria
 * @param password - The password to evaluate
 * @returns A number between 0 and 100 representing password strength
 */
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;

  // Length check - minimum 8 characters
  if (password.length >= 8) strength += 25;

  // Uppercase letter check
  if (/[A-Z]/.test(password)) strength += 25;

  // Lowercase letter check
  if (/[a-z]/.test(password)) strength += 25;

  // Number check
  if (/\d/.test(password)) strength += 12.5;

  // Special character check
  if (/[@$!%*?&]/.test(password)) strength += 12.5;

  return Math.min(strength, 100);
};

/**
 * Get password strength information including color and descriptive text
 * @param strength - Password strength value (0-100)
 * @returns Object with color variant and descriptive text
 */
export const getPasswordStrengthInfo = (strength: number): PasswordStrengthInfo => {
  if (strength < 25) return { color: 'destructive', text: 'Muy débil' };
  if (strength < 50) return { color: 'warning', text: 'Débil' };
  if (strength < 75) return { color: 'warning', text: 'Moderada' };
  return { color: 'success', text: 'Fuerte' };
};

/**
 * Check if two passwords match
 * @param password - First password
 * @param confirmPassword - Second password to compare
 * @returns Boolean indicating if passwords match
 */
export const checkPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return Boolean(password && confirmPassword && password === confirmPassword);
};

/**
 * Validate password meets minimum requirements
 * @param password - Password to validate
 * @returns Object with validation result and error messages
 */
export const validatePassword = (password: string) => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial (@$!%*?&)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};