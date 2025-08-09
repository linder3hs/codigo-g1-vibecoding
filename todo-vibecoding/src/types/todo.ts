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