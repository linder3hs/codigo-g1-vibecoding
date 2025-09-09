/**
 * Todo Types
 * Type definitions for todo-related data structures
 */

/**
 * Task status from backend
 */
export type TaskStatus = "pendiente" | "en_progreso" | "completada";

/**
 * Priority levels for todos
 */
export type TodoPriority = "low" | "medium" | "high";

/**
 * Task interface from backend API
 */
export interface Task {
  /** Unique identifier for the task */
  id: number;
  /** Title of the task */
  title: string;
  /** Description of the task */
  description: string;
  /** Status of the task */
  status: TaskStatus;
  /** Human readable status */
  status_display: string;
  /** Username of the task owner */
  user_username: string;
  /** Whether the task is completed */
  is_completed: boolean;
  /** When the task was created */
  created_at: string;
  /** When the task was completed */
  completed_at: string | null;
}

/**
 * Paginated response from backend
 */
export interface TaskListResponse {
  /** Total count of tasks */
  count: number;
  /** URL for next page */
  next: string | null;
  /** URL for previous page */
  previous: string | null;
  /** Array of tasks */
  results: Task[];
}

/**
 * Todo item interface (frontend representation)
 * Aligned with backend Task structure
 */
export interface Todo {
  /** Unique identifier for the todo */
  id: number;
  /** Title of the todo */
  title: string;
  /** Description of the todo */
  description: string;
  /** Status of the todo */
  status: TaskStatus;
  /** Display name for the status */
  status_display: string;
  /** Username of the user who created the todo */
  user_username: string;
  /** Whether the todo is completed */
  is_completed: boolean;
  /** When the todo was created (ISO string) */
  created_at: string;
  /** When the todo was completed (ISO string or null) */
  completed_at: string | null;

  // Legacy fields for backward compatibility
  /** @deprecated Use title instead */
  text?: string;
  /** @deprecated Use is_completed instead */
  completed?: boolean;
  /** @deprecated Use created_at instead */
  createdAt?: Date;
  /** @deprecated Priority is not used in current backend */
  priority?: TodoPriority;
}

/**
 * Todo statistics interface
 */
export interface TodosCount {
  /** Total number of todos */
  total: number;
  /** Number of completed todos */
  completed: number;
  /** Number of pending todos */
  pending: number;
}

/**
 * Task creation input for backend API
 */
export interface CreateTaskInput {
  /** Title of the task */
  title: string;
  /** Description of the task */
  description: string;
  /** Status of the task */
  status?: TaskStatus;
}

/**
 * Task update input for backend API
 */
export interface UpdateTaskInput {
  /** Title of the task */
  title?: string;
  /** Description of the task */
  description?: string;
  /** Status of the task */
  status?: TaskStatus;
  /** Whether the task is completed */
  is_completed?: boolean;
}

/**
 * Todo creation input (without id and createdAt)
 */
export interface CreateTodoInput {
  /** Title of the todo */
  title: string;
  /** Description of the todo */
  description: string;
  /** Status of the todo */
  status?: TaskStatus;
  /** @deprecated Use title instead */
  text?: string;
  /** @deprecated Priority is not used in current backend */
  priority?: TodoPriority;
}

/**
 * Todo update input (partial todo without id)
 */
export interface UpdateTodoInput {
  /** Title of the todo */
  title?: string;
  /** Description of the todo */
  description?: string;
  /** Status of the todo */
  status?: TaskStatus;
  /** Whether the todo is completed */
  is_completed?: boolean;
  /** @deprecated Use title instead */
  text?: string;
  /** @deprecated Use is_completed instead */
  completed?: boolean;
  /** @deprecated Priority is not used in current backend */
  priority?: TodoPriority;
}

/**
 * Todo filter status options
 */
export type TodoFilterStatus = "all" | "completed" | "pending";

/**
 * Todo sort options
 */
export type TodoSortBy = "createdAt" | "priority" | "text" | "title";
export type TodoSortOrder = "asc" | "desc";

/**
 * Todo filters interface
 */
export interface TodoFilters {
  /** Filter by completion status */
  status: TodoFilterStatus;
  /** Filter by priority */
  priority?: TodoPriority;
  /** Search text filter */
  search?: string;
  /** Sort by field */
  sortBy: TodoSortBy;
  /** Sort order */
  sortOrder: TodoSortOrder;
}

/**
 * Pagination interface
 */
export interface TodoPagination {
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
 * Todo error interface
 */
export interface TodoError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Field that caused the error */
  field?: string;
}

/**
 * Todo slice state interface
 */
export interface TodoState {
  /** Array of todos */
  todos: Todo[];
  /** Currently selected todo */
  currentTodo: Todo | null;
  /** Applied filters */
  filters: TodoFilters;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: TodoError | null;
  /** Pagination information */
  pagination: TodoPagination;
}

/**
 * Fetch todos payload
 */
export interface FetchTodosPayload {
  /** Filters to apply */
  filters?: Partial<TodoFilters>;
  /** Pagination options */
  pagination?: Partial<Pick<TodoPagination, "page" | "limit">>;
}

/**
 * Fetch todos success payload
 */
export interface FetchTodosSuccessPayload {
  /** Array of todos */
  todos: Todo[];
  /** Pagination information */
  pagination: TodoPagination;
}

/**
 * Fetch todos failure payload
 */
export interface FetchTodosFailurePayload {
  /** Error information */
  error: TodoError;
}

/**
 * Create todo success payload
 */
export interface CreateTodoSuccessPayload {
  /** Created todo */
  todo: Todo;
}

/**
 * Create todo failure payload
 */
export interface CreateTodoFailurePayload {
  /** Error information */
  error: TodoError;
}

/**
 * Update todo payload
 */
export interface UpdateTodoPayload {
  /** Todo ID */
  id: number;
  /** Update data */
  updates: UpdateTodoInput;
}

/**
 * Update todo success payload
 */
export interface UpdateTodoSuccessPayload {
  /** Updated todo */
  todo: Todo;
}

/**
 * Update todo failure payload
 */
export interface UpdateTodoFailurePayload {
  /** Error information */
  error: TodoError;
}

/**
 * Delete todo payload
 */
export interface DeleteTodoPayload {
  /** Todo ID */
  id: number;
}

/**
 * Delete todo success payload
 */
export interface DeleteTodoSuccessPayload {
  /** Deleted todo ID */
  id: number;
}

/**
 * Delete todo failure payload
 */
export interface DeleteTodoFailurePayload {
  /** Error information */
  error: TodoError;
}

/**
 * Set filters payload
 */
export interface SetFiltersPayload {
  /** Filters to set */
  filters: Partial<TodoFilters>;
}

/**
 * Set current todo payload
 */
export interface SetCurrentTodoPayload {
  /** Todo to set as current */
  todo: Todo | null;
}
