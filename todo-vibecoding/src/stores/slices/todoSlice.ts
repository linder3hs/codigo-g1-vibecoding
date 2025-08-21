/**
 * Todo Slice
 * Redux Toolkit slice for managing todo state
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  TodoState,
  FetchTodosPayload,
  FetchTodosSuccessPayload,
  FetchTodosFailurePayload,
  CreateTodoSuccessPayload,
  CreateTodoFailurePayload,
  UpdateTodoSuccessPayload,
  UpdateTodoFailurePayload,
  DeleteTodoSuccessPayload,
  DeleteTodoFailurePayload,
  SetFiltersPayload,
  SetCurrentTodoPayload,
  TodoError,
} from "@/types";

/**
 * Initial state for todos
 */
const initialState: TodoState = {
  todos: [],
  currentTodo: null,
  filters: {
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

/**
 * Todo slice
 */
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // Fetch todos actions
    fetchTodos: (state, action: PayloadAction<FetchTodosPayload>) => {
      state.isLoading = true;
      state.error = null;

      // Update filters if provided
      if (action.payload.filters) {
        state.filters = { ...state.filters, ...action.payload.filters };
      }

      // Update pagination if provided
      if (action.payload.pagination) {
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      }
    },

    fetchTodosSuccess: (
      state,
      action: PayloadAction<FetchTodosSuccessPayload>
    ) => {
      state.isLoading = false;
      state.todos = action.payload.todos;
      state.pagination = action.payload.pagination;
      state.error = null;
    },

    fetchTodosFailure: (
      state,
      action: PayloadAction<FetchTodosFailurePayload>
    ) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Create todo actions
    createTodo: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    createTodoSuccess: (
      state,
      action: PayloadAction<CreateTodoSuccessPayload>
    ) => {
      state.isLoading = false;
      state.todos.unshift(action.payload.todo); // Add to beginning
      state.pagination.total += 1;
      state.error = null;
    },

    createTodoFailure: (
      state,
      action: PayloadAction<CreateTodoFailurePayload>
    ) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Update todo actions
    updateTodo: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    updateTodoSuccess: (
      state,
      action: PayloadAction<UpdateTodoSuccessPayload>
    ) => {
      state.isLoading = false;
      const updatedTodo = action.payload.todo;
      const index = state.todos.findIndex((todo) => todo.id === updatedTodo.id);

      if (index !== -1) {
        state.todos[index] = updatedTodo;
      }

      // Update currentTodo if it's the same todo
      if (state.currentTodo?.id === updatedTodo.id) {
        state.currentTodo = updatedTodo;
      }

      state.error = null;
    },

    updateTodoFailure: (
      state,
      action: PayloadAction<UpdateTodoFailurePayload>
    ) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Delete todo actions
    deleteTodo: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    deleteTodoSuccess: (
      state,
      action: PayloadAction<DeleteTodoSuccessPayload>
    ) => {
      state.isLoading = false;
      const deletedId = action.payload.id;

      // Remove from todos array
      state.todos = state.todos.filter((todo) => todo.id !== deletedId);

      // Clear currentTodo if it's the deleted todo
      if (state.currentTodo?.id === deletedId) {
        state.currentTodo = null;
      }

      // Update pagination
      state.pagination.total = Math.max(0, state.pagination.total - 1);
      state.error = null;
    },

    deleteTodoFailure: (
      state,
      action: PayloadAction<DeleteTodoFailurePayload>
    ) => {
      state.isLoading = false;
      state.error = action.payload.error;
    },

    // Filter actions
    setFilters: (state, action: PayloadAction<SetFiltersPayload>) => {
      state.filters = { ...state.filters, ...action.payload.filters };
      // Reset to first page when filters change
      state.pagination.page = 1;
    },

    clearFilters: (state) => {
      state.filters = {
        status: "all",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      // Reset to first page when filters are cleared
      state.pagination.page = 1;
    },

    // Current todo action
    setCurrentTodo: (state, action: PayloadAction<SetCurrentTodoPayload>) => {
      state.currentTodo = action.payload.todo;
    },

    // Utility actions
    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<TodoError>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Optimistic updates for better UX
    toggleTodoOptimistic: (state, action: PayloadAction<{ id: string }>) => {
      const todo = state.todos.find((t) => t.id === action.payload.id);
      if (todo) {
        todo.completed = !todo.completed;
      }

      // Update currentTodo if it's the same todo
      if (state.currentTodo?.id === action.payload.id) {
        state.currentTodo.completed = !state.currentTodo.completed;
      }
    },

    // Reset state
    resetTodoState: () => initialState,
  },
});

// Export actions
export const {
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
  setLoading,
  setError,
  toggleTodoOptimistic,
  resetTodoState,
} = todoSlice.actions;

// Selectors
export const selectTodos = (state: { todos: TodoState }) => state.todos;
export const selectTodosArray = (state: { todos: TodoState }) =>
  state.todos.todos;
export const selectCurrentTodo = (state: { todos: TodoState }) =>
  state.todos.currentTodo;
export const selectTodoFilters = (state: { todos: TodoState }) =>
  state.todos.filters;
export const selectTodoIsLoading = (state: { todos: TodoState }) =>
  state.todos.isLoading;
export const selectTodoError = (state: { todos: TodoState }) =>
  state.todos.error;
export const selectTodoPagination = (state: { todos: TodoState }) =>
  state.todos.pagination;

// Computed selectors
export const selectFilteredTodos = (state: { todos: TodoState }) => {
  const { todos, filters } = state.todos;
  let filtered = [...todos];

  // Filter by status
  if (filters.status !== "all") {
    filtered = filtered.filter((todo) =>
      filters.status === "completed" ? todo.completed : !todo.completed
    );
  }

  // Filter by priority
  if (filters.priority) {
    filtered = filtered.filter((todo) => todo.priority === filters.priority);
  }

  // Filter by search text
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((todo) =>
      todo.text.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "text":
        comparison = a.text.localeCompare(b.text);
        break;
      case "priority": {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case "createdAt":
      default:
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return filters.sortOrder === "desc" ? -comparison : comparison;
  });

  return filtered;
};

export const selectTodoStats = (state: { todos: TodoState }) => {
  const todos = state.todos.todos;
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  return { total, completed, pending };
};

export const selectTodoById = (state: { todos: TodoState }, id: string) => {
  return state.todos.todos.find((todo) => todo.id === id) || null;
};

// Export reducer
export default todoSlice.reducer;
