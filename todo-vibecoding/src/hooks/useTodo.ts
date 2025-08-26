/**
 * Custom hook for managing todo list logic with Redux integration
 * Encapsulates CRUD operations, filtering, pagination, and state management
 */

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  fetchTodosSuccess,
  fetchTodosFailure,
  createTodo,
  createTodoSuccess,
  createTodoFailure,
  updateTodo,
  updateTodoSuccess,
  updateTodoFailure,
  deleteTodo,
  deleteTodoSuccess,
  deleteTodoFailure,
  setFilters,
  clearFilters,
  setCurrentTodo,
  clearError,
  toggleTodoOptimistic,
  selectTodosArray,
  selectCurrentTodo,
  selectTodoFilters,
  selectTodoIsLoading,
  selectTodoError,
  selectTodoPagination,
  selectFilteredTodos,
  selectTodoStats,
  selectTodoById,
} from "../stores/slices/todoSlice";
import taskService from "../services/taskService";
import { formatDate } from "../utils";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
  TodoPagination,
  TodoError,
} from "../types/todo";

/**
 * Return type for the useTodo hook
 */
export interface UseTodoReturn {
  // State from Redux
  todos: Todo[];
  currentTodo: Todo | null;
  filters: TodoFilters;
  isLoading: boolean;
  error: TodoError | null;
  pagination: TodoPagination;

  // Computed values
  filteredTodos: Todo[];
  todosStats: {
    total: number;
    completed: number;
    pending: number;
  };

  // CRUD Actions
  fetchTodosList: (
    filters?: Partial<TodoFilters>,
    pagination?: Partial<Pick<TodoPagination, "page" | "limit">>
  ) => Promise<void>;
  createNewTodo: (todoData: CreateTodoInput) => Promise<void>;
  updateExistingTodo: (id: number | string, updates: UpdateTodoInput) => Promise<void>;
  deleteExistingTodo: (id: number | string) => Promise<void>;
  toggleTodoStatus: (id: number | string) => Promise<void>;
  markTodoCompleted: (id: number | string) => Promise<void>;

  // Filter and pagination actions
  updateFilters: (filters: Partial<TodoFilters>) => void;
  resetFilters: () => void;
  setCurrentTodoItem: (todo: Todo | null) => void;
  getTodoById: (id: number | string) => Todo | undefined;

  // Utility functions
  clearTodoError: () => void;
  formatDate: (date: Date) => string;
}

/**
 * Custom hook that manages todo list state with Redux integration
 * Provides CRUD operations, filtering, pagination, and optimistic updates
 *
 * @returns {UseTodoReturn} Object containing state, computed values, and utility functions
 */
export const useTodo = (): UseTodoReturn => {
  const dispatch = useDispatch();

  // Redux state selectors
  const todos = useSelector(selectTodosArray);
  const currentTodo = useSelector(selectCurrentTodo);
  const filters = useSelector(selectTodoFilters);
  const isLoading = useSelector(selectTodoIsLoading);
  const error = useSelector(selectTodoError);
  const pagination = useSelector(selectTodoPagination);
  const filteredTodos = useSelector(selectFilteredTodos);
  const todosStats = useSelector(selectTodoStats);

  /**
   * Fetch todos from API with optional filters and pagination
   * @param filters - Optional filters to apply
   * @param pagination - Optional pagination parameters
   */
  const fetchTodosList = useCallback(
    async (
      filters?: Partial<TodoFilters>,
      pagination?: Partial<Pick<TodoPagination, "page" | "limit">>
    ): Promise<void> => {
      try {
        dispatch(fetchTodos({ filters, pagination }));
        const response = await taskService.getTasks(filters, pagination);

        if (response.success) {
          dispatch(
            fetchTodosSuccess({
              todos: response.data.todos,
              pagination: response.data.pagination,
            })
          );
        } else {
          dispatch(
            fetchTodosFailure({
              error: { message: response.message || "Failed to fetch todos" },
            })
          );
        }
      } catch (err) {
        dispatch(
          fetchTodosFailure({
            error: {
              message:
                err instanceof Error ? err.message : "Unknown error occurred",
            },
          })
        );
      }
    },
    [dispatch]
  );

  /**
   * Create a new todo with optimistic update
   * @param todoData - Data for the new todo
   */
  const createNewTodo = useCallback(
    async (todoData: CreateTodoInput): Promise<void> => {
      try {
        dispatch(createTodo());
        const response = await taskService.createTask(todoData);

        if (response.success) {
          dispatch(createTodoSuccess({ todo: response.data.todo }));
        } else {
          dispatch(
            createTodoFailure({
              error: { message: response.message || "Failed to create todo" },
            })
          );
        }
      } catch (err) {
        dispatch(
          createTodoFailure({
            error: {
              message:
                err instanceof Error ? err.message : "Unknown error occurred",
            },
          })
        );
      }
    },
    [dispatch]
  );

  /**
   * Update an existing todo
   * @param id - Todo ID
   * @param updates - Updates to apply
   */
  const updateExistingTodo = useCallback(
    async (id: number | string, updates: UpdateTodoInput): Promise<void> => {
      try {
        dispatch(updateTodo());
        const response = await taskService.updateTask(String(id), updates);

        if (response.success) {
          dispatch(updateTodoSuccess({ todo: response.data.todo }));
        } else {
          dispatch(
            updateTodoFailure({
              error: { message: response.message || "Failed to update todo" },
            })
          );
        }
      } catch (err) {
        dispatch(
          updateTodoFailure({
            error: {
              message:
                err instanceof Error ? err.message : "Unknown error occurred",
            },
          })
        );
      }
    },
    [dispatch]
  );

  /**
   * Delete a todo
   * @param id - Todo ID to delete
   */
  const deleteExistingTodo = useCallback(
    async (id: number | string): Promise<void> => {
      try {
        dispatch(deleteTodo());
        const response = await taskService.deleteTask(String(id));

        if (response.success) {
          dispatch(deleteTodoSuccess({ id: String(id) }));
        } else {
          dispatch(
            deleteTodoFailure({
              error: { message: response.message || "Failed to delete todo" },
            })
          );
        }
      } catch (err) {
        dispatch(
          deleteTodoFailure({
            error: {
              message:
                err instanceof Error ? err.message : "Unknown error occurred",
            },
          })
        );
      }
    },
    [dispatch]
  );

  /**
   * Toggle todo completion status with optimistic update
   * @param id - Todo ID to toggle
   */
  const toggleTodoStatus = useCallback(
    async (id: number | string): Promise<void> => {
      try {
        // Optimistic update
        dispatch(toggleTodoOptimistic({ id: String(id) }));

        const todo = todos.find((t) => t.id === Number(id));
        if (!todo) return;

        const response = await taskService.updateTask(String(id), {
          is_completed: !todo.is_completed,
        });

        if (response.success) {
          dispatch(updateTodoSuccess({ todo: response.data.todo }));
        } else {
          // Revert optimistic update on failure
          dispatch(toggleTodoOptimistic({ id: String(id) }));
          dispatch(
            updateTodoFailure({
              error: { message: response.message || "Failed to toggle todo" },
            })
          );
        }
      } catch (err) {
        // Revert optimistic update on error
        dispatch(toggleTodoOptimistic({ id: String(id) }));
        dispatch(
          updateTodoFailure({
            error: {
              message:
                err instanceof Error ? err.message : "Unknown error occurred",
            },
          })
        );
      }
    },
    [dispatch, todos]
  );

  /**
   * Mark a todo as completed
   * @param id - Todo ID to mark as completed
   */
  const markTodoCompleted = useCallback(
    async (id: number | string): Promise<void> => {
      try {
        const response = await taskService.markCompleted(String(id));

        if (response.success) {
          dispatch(updateTodoSuccess({ todo: response.data.todo }));
        } else {
          dispatch(
            updateTodoFailure({
              error: {
                message: response.message || "Failed to mark todo as completed",
              },
            })
          );
        }
      } catch (err) {
        dispatch(
          updateTodoFailure({
            error: {
              message:
                err instanceof Error ? err.message : "Unknown error occurred",
            },
          })
        );
      }
    },
    [dispatch]
  );

  /**
   * Update filters
   * @param newFilters - Filters to update
   */
  const updateFilters = useCallback(
    (newFilters: Partial<TodoFilters>): void => {
      dispatch(setFilters({ filters: newFilters }));
    },
    [dispatch]
  );

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback((): void => {
    dispatch(clearFilters());
  }, [dispatch]);

  /**
   * Set current todo item
   * @param todo - Todo to set as current
   */
  const setCurrentTodoItem = useCallback(
    (todo: Todo | null): void => {
      dispatch(setCurrentTodo({ todo }));
    },
    [dispatch]
  );

  /**
   * Get todo by ID using selector
   * @param id - Todo ID
   * @returns Todo or undefined
   */
  const getTodoById = useCallback(
    (id: number | string): Todo | undefined => {
      const result = selectTodoById(
        {
          todos: { todos, currentTodo, filters, isLoading, error, pagination },
        },
        String(id)
      );
      return result || undefined;
    },
    [todos, currentTodo, filters, isLoading, error, pagination]
  );

  /**
   * Clear todo error
   */
  const clearTodoError = useCallback((): void => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-fetch todos on mount if none exist
  useEffect(() => {
    fetchTodosList();
  }, [fetchTodosList]);

  return {
    // State from Redux
    todos,
    currentTodo,
    filters,
    isLoading,
    error,
    pagination,

    // Computed values
    filteredTodos,
    todosStats,

    // CRUD Actions
    fetchTodosList,
    createNewTodo,
    updateExistingTodo,
    deleteExistingTodo,
    toggleTodoStatus,
    markTodoCompleted,

    // Filter and pagination actions
    updateFilters,
    resetFilters,
    setCurrentTodoItem,
    getTodoById,

    // Utility functions
    clearTodoError,
    formatDate,
  };
};

export default useTodo;
