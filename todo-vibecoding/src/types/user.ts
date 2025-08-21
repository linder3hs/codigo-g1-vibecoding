/**
 * User Types
 * Type definitions for user-related data structures
 */

/**
 * Complete user information interface
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's full name (computed) */
  fullName?: string;
  /** User's avatar URL */
  avatar?: string;
  /** User's role in the system */
  role: UserRole;
  /** Whether the user's email is verified */
  emailVerified: boolean;
  /** When the user was created */
  createdAt: Date;
  /** When the user was last updated */
  updatedAt: Date;
  /** User's last login timestamp */
  lastLoginAt?: Date;
  /** Whether the user account is active */
  isActive: boolean;
}

/**
 * User roles in the system
 */
export type UserRole = 'user' | 'admin' | 'moderator';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Whether to remember the user session */
  rememberMe?: boolean;
}

/**
 * User registration data interface
 */
export interface RegisterData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** Password confirmation */
  confirmPassword: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** Terms and conditions acceptance */
  acceptTerms: boolean;
  /** Newsletter subscription opt-in */
  subscribeNewsletter?: boolean;
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  /** Authentication success status */
  success: boolean;
  /** User information */
  user: User;
  /** Access token */
  accessToken: string;
  /** Refresh token */
  refreshToken: string;
  /** Token expiration time in seconds */
  expiresIn: number;
  /** Token type (usually 'Bearer') */
  tokenType: string;
  /** Additional response message */
  message?: string;
}

/**
 * User profile interface (for profile updates)
 */
export interface UserProfile {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's avatar URL */
  avatar?: string;
  /** User's bio or description */
  bio?: string;
  /** User's phone number */
  phone?: string;
  /** User's timezone */
  timezone?: string;
  /** User's preferred language */
  language?: string;
  /** User's notification preferences */
  notifications?: UserNotificationPreferences;
}

/**
 * User notification preferences
 */
export interface UserNotificationPreferences {
  /** Email notifications enabled */
  email: boolean;
  /** Push notifications enabled */
  push: boolean;
  /** SMS notifications enabled */
  sms: boolean;
  /** Task reminders enabled */
  taskReminders: boolean;
  /** Weekly digest enabled */
  weeklyDigest: boolean;
}

/**
 * Password change data interface
 */
export interface PasswordChangeData {
  /** Current password */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** New password confirmation */
  confirmNewPassword: string;
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  /** User's email address */
  email: string;
}

/**
 * Password reset data interface
 */
export interface PasswordResetData {
  /** Reset token */
  token: string;
  /** New password */
  newPassword: string;
  /** New password confirmation */
  confirmNewPassword: string;
}

/**
 * User search filters interface
 */
export interface UserFilters {
  /** Search by name or email */
  search?: string;
  /** Filter by role */
  role?: UserRole;
  /** Filter by active status */
  isActive?: boolean;
  /** Filter by email verification status */
  emailVerified?: boolean;
  /** Filter by creation date range */
  createdAfter?: Date;
  /** Filter by creation date range */
  createdBefore?: Date;
}

/**
 * User pagination interface
 */
export interface UserPagination {
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrev: boolean;
}

/**
 * User error interface
 */
export interface UserError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Field that caused the error */
  field?: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * User state interface (for Redux store)
 */
export interface UserState {
  /** Current authenticated user */
  currentUser: User | null;
  /** List of users (for admin views) */
  users: User[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: UserError | null;
  /** Pagination information */
  pagination: UserPagination;
  /** Current filters */
  filters: UserFilters;
}

/**
 * User session information
 */
export interface UserSession {
  /** Session ID */
  id: string;
  /** User ID */
  userId: string;
  /** Device information */
  device?: string;
  /** IP address */
  ipAddress?: string;
  /** User agent */
  userAgent?: string;
  /** Session creation time */
  createdAt: Date;
  /** Session last activity */
  lastActivity: Date;
  /** Whether session is active */
  isActive: boolean;
}

/**
 * User activity log entry
 */
export interface UserActivity {
  /** Activity ID */
  id: string;
  /** User ID */
  userId: string;
  /** Activity type */
  type: UserActivityType;
  /** Activity description */
  description: string;
  /** Activity metadata */
  metadata?: Record<string, unknown>;
  /** IP address */
  ipAddress?: string;
  /** User agent */
  userAgent?: string;
  /** Activity timestamp */
  timestamp: Date;
}

/**
 * User activity types
 */
export type UserActivityType = 
  | 'login'
  | 'logout'
  | 'register'
  | 'password_change'
  | 'password_reset'
  | 'profile_update'
  | 'email_verification'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'task_completed';

/**
 * User statistics interface
 */
export interface UserStats {
  /** Total number of tasks created */
  totalTasks: number;
  /** Number of completed tasks */
  completedTasks: number;
  /** Number of pending tasks */
  pendingTasks: number;
  /** Task completion rate (percentage) */
  completionRate: number;
  /** Average tasks per day */
  averageTasksPerDay: number;
  /** Most productive day of week */
  mostProductiveDay?: string;
  /** Current streak of daily task completion */
  currentStreak: number;
  /** Longest streak of daily task completion */
  longestStreak: number;
}