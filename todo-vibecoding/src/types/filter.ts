/**
 * Filter Types
 * Type definitions for todo filtering functionality
 */

/**
 * Available filter types for todos
 */
export type FilterType = "all" | "pending" | "completed";

/**
 * Filter option interface for UI components
 */
export interface FilterOption {
  /** Filter value */
  value: FilterType;
  /** Display label for the filter */
  label: string;
  /** Optional icon for the filter */
  icon?: string;
}

/**
 * Filter state interface
 */
export interface FilterState {
  /** Current active filter */
  current: FilterType;
  /** Available filter options */
  options: FilterOption[];
}