/**
 * Todo Types
 * Type definitions for todo-related data structures
 */

/**
 * Priority levels for todos
 */
export type TodoPriority = "low" | "medium" | "high";

/**
 * Todo item interface
 */
export interface Todo {
  /** Unique identifier for the todo */
  id: string;
  /** Text content of the todo */
  text: string;
  /** Whether the todo is completed */
  completed: boolean;
  /** When the todo was created */
  createdAt: Date;
  /** Priority level of the todo */
  priority: TodoPriority;
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
 * Todo creation input (without id and createdAt)
 */
export interface CreateTodoInput {
  /** Text content of the todo */
  text: string;
  /** Priority level of the todo */
  priority?: TodoPriority;
}

/**
 * Todo update input (partial todo without id)
 */
export interface UpdateTodoInput {
  /** Text content of the todo */
  text?: string;
  /** Whether the todo is completed */
  completed?: boolean;
  /** Priority level of the todo */
  priority?: TodoPriority;
}

/**
 * Todo filter status options
 */
export type TodoFilterStatus = 'all' | 'completed' | 'pending';

/**
 * Todo sort options
 */
export type TodoSortBy = 'createdAt' | 'priority' | 'text';
export type TodoSortOrder = 'asc' | 'desc';

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
  pagination?: Partial<Pick<TodoPagination, 'page' | 'limit'>>;
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
  id: string;
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
  id: string;
}

/**
 * Delete todo success payload
 */
export interface DeleteTodoSuccessPayload {
  /** Deleted todo ID */
  id: string;
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