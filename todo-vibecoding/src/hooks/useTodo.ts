/**
 * Custom hook for managing todo list logic
 * Encapsulates filtering, formatting, and state management
 */

import { useState, useMemo } from "react";
import { todos, getTodosCount } from "../todos";
import type { Todo } from "../todos";
import { formatDate } from "../utils";

export type FilterType = "all" | "pending" | "completed";

export interface UseTodoReturn {
  // State
  filter: FilterType;
  setFilter: (filter: FilterType) => void;

  // Computed values
  filteredTodos: Todo[];
  todosCount: {
    total: number;
    completed: number;
    pending: number;
  };

  // Utility functions
  formatDate: (date: Date) => string;
}

/**
 * Custom hook that manages todo list state and provides utility functions
 *
 * @returns {UseTodoReturn} Object containing state, computed values, and utility functions
 */
export const useTodo = (): UseTodoReturn => {
  const [filter, setFilter] = useState<FilterType>("all");

  // Memoized todos count to avoid recalculation on every render
  const todosCount = useMemo(() => getTodosCount(), []);

  // Memoized filtered todos based on current filter
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "completed") return todo.is_finished;
      if (filter === "pending") return !todo.is_finished;
      return true;
    });
  }, [filter]);

  // formatDate is now imported from utils/dateUtils

  return {
    // State
    filter,
    setFilter,

    // Computed values
    filteredTodos,
    todosCount,

    // Utility functions
    formatDate,
  };
};

export default useTodo;
