/**
 * Barrel file for utility functions
 * Centralizes exports for cleaner imports
 */

// Export all date utilities
export {
  formatDate,
  formatDateISO,
  formatRelativeTime,
  isToday,
  isWithinLastWeek,
} from "./dateUtils";

// Export all password utilities
export {
  calculatePasswordStrength,
  getPasswordStrengthInfo,
  checkPasswordsMatch,
  validatePassword,
  type PasswordStrengthInfo,
} from "./passwordUtils";

// Future utility exports can be added here
// export * from './stringUtils';
// export * from './arrayUtils';
// export * from './validationUtils';
