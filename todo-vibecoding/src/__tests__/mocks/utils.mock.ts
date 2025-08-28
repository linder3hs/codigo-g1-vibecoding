/**
 * Mock for lib/utils
 * Provides a simplified cn function for testing
 */

export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}