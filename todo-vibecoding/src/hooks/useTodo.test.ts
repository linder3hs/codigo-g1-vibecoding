import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useTodo } from "./useTodo";
import taskService from "../services/taskService";
import todoSlice from "../stores/slices/todoSlice";
import { formatDate } from "../utils/dateUtils";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo";

// Mock the task service
jest.mock("../services/taskService");
const mockTaskService = taskService as jest.Mocked<typeof taskService>;

// Mock date utils
jest.mock("../utils", () => ({
  formatDate: jest.fn((date: Date) => date.toISOString().split("T")[0]),
}));

// Test store setup
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      todos: todoSlice,
    },
    preloadedState: initialState,
  });
};

// Wrapper component for testing hooks with Redux
const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, { store, children });
  };
  return Wrapper;
};

// Mock data
const mockTodo: Todo = {
  id: 1,
  title: "Test Todo",
  description: "Test Description",
  status: "pendiente",
  status_display: "Pendiente",
  user_username: "testuser",
  is_completed: false,
  created_at: "2024-01-01T00:00:00.000Z",
  completed_at: null,
};

const mockTodos: Todo[] = [
  mockTodo,
  {
    id: 2,
    title: "Completed Todo",
    description: "Completed Description",
    status: "completada",
    status_display: "Completada",
    user_username: "testuser",
    is_completed: true,
    created_at: "2024-01-02T00:00:00.000Z",
    completed_at: "2024-01-02T10:00:00.000Z",
  },
];

describe("useTodo Hook", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Initial State", () => {
    it("should return initial state correctly", async () => {
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      expect(result.current.todos).toEqual([]);
      expect(result.current.currentTodo).toBeNull();
      // isLoading becomes true initially due to useEffect calling fetchTodosList
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.filteredTodos).toEqual([]);
      expect(result.current.todosStats).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
      });
    });

    it("should provide all required functions", () => {
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      // CRUD operations
      expect(typeof result.current.fetchTodosList).toBe("function");
      expect(typeof result.current.createNewTodo).toBe("function");
      expect(typeof result.current.updateExistingTodo).toBe("function");
      expect(typeof result.current.deleteExistingTodo).toBe("function");
      expect(typeof result.current.toggleTodoStatus).toBe("function");
      expect(typeof result.current.markTodoCompleted).toBe("function");

      // Utility functions
      expect(typeof result.current.updateFilters).toBe("function");
      expect(typeof result.current.resetFilters).toBe("function");
      expect(typeof result.current.setCurrentTodoItem).toBe("function");
      expect(typeof result.current.getTodoById).toBe("function");
      expect(typeof result.current.clearTodoError).toBe("function");
      expect(typeof result.current.formatDate).toBe("function");
    });
  });

  describe("Fetch Todos", () => {
    it("should fetch todos successfully", async () => {
      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          todos: mockTodos,
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
        message: "Success",
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.fetchTodosList();
      });

      await waitFor(() => {
        expect(result.current.todos).toHaveLength(2);
        expect(result.current.todos[0].title).toBe("Test Todo");
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should handle fetch todos failure", async () => {
      mockTaskService.getTasks.mockResolvedValue({
        success: false,
        message: "Failed to fetch todos",
        data: {
          todos: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.fetchTodosList();
      });

      await waitFor(() => {
        expect(result.current.error?.message).toBe("Failed to fetch todos");
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should fetch todos with filters and pagination", async () => {
      const filters = { status: "pending" as const, search: "" };
      const pagination = { page: 2, limit: 5 };

      mockTaskService.getTasks.mockResolvedValue({
        success: true,
        data: {
          todos: [mockTodo],
          pagination: {
            page: 2,
            limit: 5,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: true,
          },
        },
        message: "Success",
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.fetchTodosList(filters, pagination);
      });

      expect(mockTaskService.getTasks).toHaveBeenCalledWith(
        filters,
        pagination
      );
    });
  });

  describe("Create Todo", () => {
    it("should create todo successfully", async () => {
      const newTodoData: CreateTodoInput = {
        title: "New Todo",
        description: "New Description",
        status: "pendiente",
      };

      const createdTodo: Todo = {
        ...mockTodo,
        id: 3,
        title: "New Todo",
        description: "New Description",
      };

      mockTaskService.createTask.mockResolvedValue({
        success: true,
        data: { todo: createdTodo },
        message: "Todo created successfully",
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.createNewTodo(newTodoData);
      });

      expect(mockTaskService.createTask).toHaveBeenCalledWith(newTodoData);
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should handle create todo failure", async () => {
      const newTodoData: CreateTodoInput = {
        title: "New Todo",
        description: "New Description",
        status: "pendiente",
      };

      mockTaskService.createTask.mockResolvedValue({
        success: false,
        message: "Failed to create todo",
        data: { todo: mockTodo },
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.createNewTodo(newTodoData);
      });

      await waitFor(() => {
        expect(result.current.error?.message).toBe("Failed to create todo");
      });
    });
  });

  describe("Update Todo", () => {
    it("should update todo successfully", async () => {
      const updates: UpdateTodoInput = {
        title: "Updated Todo",
        description: "Updated Description",
      };

      const updatedTodo: Todo = {
        ...mockTodo,
        title: "Updated Todo",
        description: "Updated Description",
      };

      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: { todo: updatedTodo },
        message: "Todo updated successfully",
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.updateExistingTodo(1, updates);
      });

      expect(mockTaskService.updateTask).toHaveBeenCalledWith("1", updates);
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should handle update todo failure", async () => {
      const updates: UpdateTodoInput = { title: "Updated Todo" };

      mockTaskService.updateTask.mockResolvedValue({
        success: false,
        message: "Failed to update todo",
        data: { todo: mockTodo },
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.updateExistingTodo(1, updates);
      });

      await waitFor(() => {
        expect(result.current.error?.message).toBe("Failed to update todo");
      });
    });
  });

  describe("Delete Todo", () => {
    it("should delete todo successfully", async () => {
      mockTaskService.deleteTask.mockResolvedValue({
        success: true,
        message: "Todo deleted successfully",
        data: {
          id: "1",
          message: "Todo deleted successfully",
        },
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.deleteExistingTodo(1);
      });

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith("1");
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should handle delete todo failure", async () => {
      mockTaskService.deleteTask.mockResolvedValue({
        success: false,
        message: "Failed to delete todo",
        data: {
          id: "1",
          message: "Failed to delete todo",
        },
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.deleteExistingTodo(1);
      });

      await waitFor(() => {
        expect(result.current.error?.message).toBe("Failed to delete todo");
      });
    });
  });

  describe("Toggle Todo Status", () => {
    it("should toggle todo status with optimistic update", async () => {
      // Setup initial state with a todo
      const initialState = {
        todos: {
          todos: [mockTodo],
          currentTodo: null,
          filters: { status: "all" as const, search: "" },
          isLoading: false,
          error: null,
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        },
      };

      store = createTestStore(initialState);

      const toggledTodo: Todo = {
        ...mockTodo,
        is_completed: true,
        status: "completada",
      };

      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: { todo: toggledTodo },
        message: "Todo toggled successfully",
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.toggleTodoStatus(1);
      });

      expect(mockTaskService.updateTask).toHaveBeenCalledWith("1", {
        is_completed: true,
      });
    });

    it("should revert optimistic update on toggle failure", async () => {
      // Setup initial state with a todo
      const initialState = {
        todos: {
          todos: [mockTodo],
          currentTodo: null,
          filters: { status: "all" as const, search: "" },
          isLoading: false,
          error: null,
          pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        },
      };

      store = createTestStore(initialState);

      mockTaskService.updateTask.mockResolvedValue({
        success: false,
        message: "Failed to toggle todo",
        data: { todo: mockTodo },
      });

      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      await act(async () => {
        await result.current.toggleTodoStatus(1);
      });

      await waitFor(() => {
        expect(result.current.error?.message).toBe("Failed to toggle todo");
      });
    });
  });

  describe("Utility Functions", () => {
    it("should update filters correctly", () => {
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      act(() => {
        result.current.updateFilters({ status: "completed", search: "test" });
      });

      expect(result.current.filters.status).toBe("completed");
      expect(result.current.filters.search).toBe("test");
    });

    it("should reset filters correctly", () => {
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      // First set some filters
      act(() => {
        result.current.updateFilters({ status: "completed", search: "test" });
      });

      // Then reset them
      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters.status).toBe("all");
      // search is undefined in initial state, not empty string
      expect(result.current.filters.search).toBeUndefined();
    });

    it("should set current todo item", () => {
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      act(() => {
        result.current.setCurrentTodoItem(mockTodo);
      });

      expect(result.current.currentTodo).toEqual(mockTodo);
    });

    it("should clear todo error", () => {
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => useTodo(), { wrapper });

      act(() => {
        result.current.clearTodoError();
      });

      expect(result.current.error).toBeNull();
    });

    it("should format date correctly", () => {
      // Test the formatDate utility function directly
      const testDate = new Date("2024-01-15T10:00:00.000Z");
      const formattedDate = formatDate(testDate);

      // formatDate function should return a formatted string in Spanish format
      expect(typeof formattedDate).toBe("string");
      expect(formattedDate).toMatch(/\d{2}\s\w{3}\s\d{4}/);
    });
  });
});
