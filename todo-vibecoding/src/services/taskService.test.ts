/**
 * TaskService Tests
 * Tests for the updated task service with backend integration
 */

import taskService from "./taskService";
import httpClient from "./httpClient";
import type {
  Task,
  TaskListResponse as BackendTaskListResponse,
  CreateTodoInput,
} from "../types/todo";

// Mock httpClient
jest.mock("./httpClient");
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should fetch and convert backend tasks to frontend todos", async () => {
      // Mock backend response
      const mockBackendResponse: BackendTaskListResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Test Task 1",
            description: "Description 1",
            status: "pendiente",
            status_display: "Pendiente",
            user_username: "testuser",
            is_completed: false,
            created_at: "2025-08-20T19:35:10.204125-05:00",
            completed_at: null,
          },
          {
            id: 2,
            title: "Test Task 2",
            description: "Description 2",
            status: "completada",
            status_display: "Completada",
            user_username: "testuser",
            is_completed: true,
            created_at: "2025-08-18T23:04:33.731178-05:00",
            completed_at: "2025-08-19T10:00:00.000000-05:00",
          },
        ],
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockBackendResponse });

      const result = await taskService.getTasks();

      expect(result.success).toBe(true);
      expect(result.data.todos).toHaveLength(2);
      expect(result.data.pagination.total).toBe(2);
      expect(result.data.pagination.hasNext).toBe(false);
      expect(result.data.pagination.hasPrev).toBe(false);

      // Check first todo conversion
      const firstTodo = result.data.todos[0];
      expect(firstTodo.id).toBe(1);
      expect(firstTodo.title).toBe("Test Task 1");
      expect(firstTodo.is_completed).toBe(false);
      expect(new Date(firstTodo.created_at)).toBeInstanceOf(Date);
    });

    it("should handle pagination parameters", async () => {
      const mockResponse: BackendTaskListResponse = {
        count: 10,
        next: "http://api.example.com/tasks/?page=2",
        previous: null,
        results: [],
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockResponse });

      await taskService.getTasks({ status: "all" }, { page: 1, limit: 5 });

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining("page=1&limit=5")
      );
    });

    describe("Error Handling", () => {
      it("should handle network errors gracefully", async () => {
        // Arrange
        const networkError = new Error("Network connection failed");
        mockedHttpClient.get.mockRejectedValue(networkError);

        // Act & Assert
        await expect(taskService.getTasks()).rejects.toMatchObject({
          message: "Network connection failed",
          code: "UNKNOWN_ERROR"
        });
        expect(mockedHttpClient.get).toHaveBeenCalledTimes(1);
      });

      it("should handle HTTP 500 server errors with custom message", async () => {
        // Arrange
        const serverError = Object.assign(new Error(), {
          response: {
            status: 500,
            data: { message: "Internal server error", code: "SERVER_ERROR" }
          }
        });
        mockedHttpClient.get.mockRejectedValue(serverError);

        // Act & Assert
        await expect(taskService.getTasks()).rejects.toMatchObject({
          message: "Internal server error",
          code: "SERVER_ERROR",
          status: 500
        });
      });

      it("should handle HTTP 404 not found errors", async () => {
        // Arrange
        const notFoundError = Object.assign(new Error(), {
          response: {
            status: 404,
            data: { message: "Tasks not found", code: "NOT_FOUND" }
          }
        });
        mockedHttpClient.get.mockRejectedValue(notFoundError);

        // Act & Assert
        await expect(taskService.getTasks()).rejects.toMatchObject({
          message: "Tasks not found",
          code: "NOT_FOUND",
          status: 404
        });
      });

      it("should handle axios errors without custom message", async () => {
        // Arrange
        const axiosError = Object.assign(new Error(), {
          response: {
            status: 400,
            data: {}
          }
        });
        mockedHttpClient.get.mockRejectedValue(axiosError);

        // Act & Assert
        await expect(taskService.getTasks()).rejects.toMatchObject({
          message: "Error fetching tasks",
          code: "API_ERROR",
          status: 400
        });
      });

      it("should handle validation errors", async () => {
        // Arrange
        const validationError = new Error("Title is required");
        mockedHttpClient.get.mockRejectedValue(validationError);

        // Act & Assert
        await expect(taskService.getTasks()).rejects.toMatchObject({
          message: "Title is required",
          code: "VALIDATION_ERROR",
          status: 400
        });
      });

      it("should handle unknown errors with default message", async () => {
        // Arrange
        const unknownError = "Something went wrong";
        mockedHttpClient.get.mockRejectedValue(unknownError);

        // Act & Assert
        await expect(taskService.getTasks()).rejects.toMatchObject({
          message: "Error fetching tasks",
          code: "UNKNOWN_ERROR"
        });
      });
    });
  });

  describe("createTask", () => {
    it("should convert frontend input to backend format and create task", async () => {
      const mockTask: Task = {
        id: 1,
        title: "New Task",
        description: "New Task",
        status: "pendiente",
        status_display: "Pendiente",
        user_username: "testuser",
        is_completed: false,
        created_at: "2025-08-20T19:35:10.204125-05:00",
        completed_at: null,
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockTask });

      const createInput: CreateTodoInput = {
        title: "New Task",
        description: "New Task",
      };

      const result = await taskService.createTask(createInput);

      expect(result.success).toBe(true);
      expect(result.data.todo.text).toBe("New Task");
      expect(result.data.todo.completed).toBe(false);

      // Verify backend call format
      expect(mockedHttpClient.post).toHaveBeenCalledWith(expect.any(String), {
        title: "New Task",
        description: "New Task",
        status: "pendiente",
      });
    });
  });

  describe("convertTaskToTodo", () => {
    it("should correctly convert backend Task to frontend Todo", () => {
      const mockTask: Task = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: "en_progreso",
        status_display: "En Progreso",
        user_username: "testuser",
        is_completed: false,
        created_at: "2025-08-20T19:35:10.204125-05:00",
        completed_at: null,
      };

      // Access private method for testing
      const convertedTodo = (
        taskService as unknown as {
          convertTaskToTodo: (task: Task) => import("../types/todo").Todo;
        }
      ).convertTaskToTodo(mockTask);

      expect(convertedTodo.id).toBe(1);
      expect(convertedTodo.title).toBe("Test Task");
      expect(convertedTodo.is_completed).toBe(false);
      expect(new Date(convertedTodo.created_at)).toBeInstanceOf(Date);
    });
  });
});
