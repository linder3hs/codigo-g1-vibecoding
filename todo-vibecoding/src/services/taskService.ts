/**
 * Task Service
 * Service for handling CRUD operations on tasks/todos
 */

import httpClient from "./httpClient";
import { apiEndpoints } from "../config/env";
import type {
  Todo,
  Task,
  TaskListResponse as BackendTaskListResponse,
  CreateTodoInput,
  CreateTaskInput,
  UpdateTodoInput,
  UpdateTaskInput,
  TodoFilters,
  TodoPagination,
  TodoError,
  TodoFilterStatus,
} from "../types/todo";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

/**
 * API response interfaces for task operations
 */
export interface TaskServiceResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TaskListResponse {
  todos: Todo[];
  pagination: TodoPagination;
}

export interface TaskResponse {
  todo: Todo;
}

export interface TaskDeleteResponse {
  id: string;
  message: string;
}

/**
 * Task service error interface
 */
export interface TaskServiceError extends TodoError {
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * Task Service Class
 * Handles all task-related API operations
 */
class TaskService {
  private readonly baseEndpoint = apiEndpoints.todos.list;

  /**
   * Get tasks with optional filters and pagination
   * @param filters - Optional filters to apply
   * @param pagination - Optional pagination parameters
   * @returns Promise with tasks and pagination info
   */
  async getTasks(
    filters?: Partial<TodoFilters>,
    pagination?: Partial<Pick<TodoPagination, "page" | "limit">>
  ): Promise<TaskServiceResponse<TaskListResponse>> {
    try {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters) {
        if (filters.status && filters.status !== "all") {
          params.append("status", filters.status);
        }
        if (filters.priority) {
          params.append("priority", filters.priority);
        }
        if (filters.search) {
          params.append("search", filters.search);
        }
        if (filters.sortBy) {
          params.append("sortBy", filters.sortBy);
        }
        if (filters.sortOrder) {
          params.append("sortOrder", filters.sortOrder);
        }
      }

      // Add pagination parameters
      if (pagination) {
        if (pagination.page) {
          params.append("page", pagination.page.toString());
        }
        if (pagination.limit) {
          params.append("limit", pagination.limit.toString());
        }
      }

      const queryString = params.toString();
      const url = queryString
        ? `${this.baseEndpoint}/?${queryString}`
        : `${this.baseEndpoint}/`;

      // Get backend response with Task structure
      const response: AxiosResponse<BackendTaskListResponse> =
        await httpClient.get(url);

      // Convert backend Task[] to frontend Todo[]
      const todos: Todo[] = response.data.results.map(this.convertTaskToTodo);

      // Create pagination info from backend response
      const paginationInfo: TodoPagination = {
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        total: response.data.count,
        totalPages: Math.ceil(response.data.count / (pagination?.limit || 10)),
        hasNext: response.data.next !== null,
        hasPrev: response.data.previous !== null,
      };

      return {
        success: true,
        data: {
          todos,
          pagination: paginationInfo,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Error fetching tasks");
    }
  }

  /**
   * Get a specific task by ID
   * @param id - Task ID
   * @returns Promise with task data
   */
  async getTaskById(id: string): Promise<TaskServiceResponse<TaskResponse>> {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const response: AxiosResponse<TaskServiceResponse<TaskResponse>> =
        await httpClient.get(apiEndpoints.todos.update(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Error fetching task with ID: ${id}`);
    }
  }

  /**
   * Create a new task
   * @param taskData - Task creation data
   * @returns Promise with created task
   */
  async createTask(
    taskData: CreateTodoInput
  ): Promise<TaskServiceResponse<TaskResponse>> {
    try {
      // Support both new (title) and legacy (text) fields
      const title = taskData.title || taskData.text;
      if (!title || title.trim().length === 0) {
        throw new Error("Task title is required");
      }

      // Convert frontend CreateTodoInput to backend CreateTaskInput
      const backendTaskData: CreateTaskInput = {
        title: title,
        description: taskData.description || "",
        status: taskData.status || "pendiente", // Use provided status or default
      };

      const response: AxiosResponse<Task> = await httpClient.post(
        apiEndpoints.todos.create,
        backendTaskData
      );

      // Convert backend Task to frontend Todo
      const todo = this.convertTaskToTodo(response.data);

      toast.success("Tarea creada con éxito");

      return {
        success: true,
        data: {
          todo,
        },
      };
    } catch (error) {
      throw this.handleError(error, "Error creating task");
    }
  }

  /**
   * Update an existing task
   * @param id - Task ID
   * @param taskData - Task update data
   * @returns Promise with updated task
   */
  async updateTask(
    id: string,
    taskData: UpdateTodoInput
  ): Promise<TaskServiceResponse<TaskResponse>> {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      if (Object.keys(taskData).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      // Convert frontend UpdateTodoInput to backend UpdateTaskInput
      const backendTaskData: UpdateTaskInput = {};

      // Support both new (title) and legacy (text) fields
      const title = taskData.title || taskData.text;
      if (title) {
        backendTaskData.title = title;
      }

      if (taskData.description !== undefined) {
        backendTaskData.description = taskData.description;
      }

      if (taskData.status !== undefined) {
        backendTaskData.status = taskData.status;
      }

      // Support both new (is_completed) and legacy (completed) fields
      const isCompleted = taskData.is_completed ?? taskData.completed;
      if (isCompleted !== undefined) {
        backendTaskData.is_completed = isCompleted;
        // Only update status if not explicitly provided
        if (taskData.status === undefined) {
          backendTaskData.status = isCompleted ? "completada" : "pendiente";
        }
      }

      const response: AxiosResponse<Task> = await httpClient.put(
        apiEndpoints.todos.update(id),
        backendTaskData
      );

      // Convert backend Task to frontend Todo
      const todo = this.convertTaskToTodo(response.data);

      return {
        success: true,
        data: {
          todo,
        },
      };
    } catch (error) {
      throw this.handleError(error, `Error updating task with ID: ${id}`);
    }
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @returns Promise with deletion confirmation
   */
  async deleteTask(
    id: string
  ): Promise<TaskServiceResponse<TaskDeleteResponse>> {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const response: AxiosResponse<TaskServiceResponse<TaskDeleteResponse>> =
        await httpClient.delete(apiEndpoints.todos.delete(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Error deleting task with ID: ${id}`);
    }
  }

  /**
   * Mark a task as completed
   * @param id - Task ID
   * @returns Promise with updated task
   */
  async markCompleted(id: string): Promise<TaskServiceResponse<TaskResponse>> {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const response: AxiosResponse<TaskServiceResponse<TaskResponse>> =
        await httpClient.patch(apiEndpoints.todos.toggle(id));
      return response.data;
    } catch (error) {
      throw this.handleError(
        error,
        `Error marking task as completed with ID: ${id}`
      );
    }
  }

  /**
   * Get tasks filtered by status
   * @param status - Task status to filter by
   * @returns Promise with filtered tasks
   */
  async getTasksByStatus(
    status: TodoFilterStatus
  ): Promise<TaskServiceResponse<TaskListResponse>> {
    try {
      if (!status) {
        throw new Error("Status is required");
      }

      return this.getTasks({ status });
    } catch (error) {
      throw this.handleError(
        error,
        `Error fetching tasks with status: ${status}`
      );
    }
  }

  /**
   * Handle and format service errors
   * @param error - Original error
   * @param defaultMessage - Default error message
   * @returns Formatted TaskServiceError
   */
  /**
   * Convert backend Task to frontend Todo
   * @param task - Backend task object
   * @returns Frontend todo object
   */
  private convertTaskToTodo(task: Task): Todo {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      status_display: task.status_display,
      user_username: task.user_username,
      is_completed: task.is_completed,
      created_at: task.created_at,
      completed_at: task.completed_at,
      // Legacy fields for backward compatibility
      text: task.title,
      completed: task.is_completed,
      createdAt: new Date(task.created_at),
      priority: "medium", // Default priority since backend doesn't have this field
    };
  }

  private handleError(
    error: unknown,
    defaultMessage: string
  ): TaskServiceError {
    if (error instanceof Error) {
      // Handle validation errors
      if (
        error.message.includes("required") ||
        error.message.includes("must be provided")
      ) {
        return {
          message: error.message,
          code: "VALIDATION_ERROR",
          status: 400,
        };
      }

      // Handle axios errors
      if ("response" in error && error.response) {
        const axiosError = error as {
          response: {
            status: number;
            data?: {
              message?: string;
              code?: string;
              details?: Record<string, unknown>;
            };
          };
        };

        return {
          message: axiosError.response.data?.message || defaultMessage,
          code: axiosError.response.data?.code || "API_ERROR",
          status: axiosError.response.status,
          details: axiosError.response.data?.details,
        };
      }

      // Handle network errors
      if ("code" in error && error.code === "NETWORK_ERROR") {
        return {
          message: "Network error. Please check your connection.",
          code: "NETWORK_ERROR",
          status: 0,
        };
      }

      return {
        message: error.message || defaultMessage,
        code: "UNKNOWN_ERROR",
      };
    }

    return {
      message: defaultMessage,
      code: "UNKNOWN_ERROR",
    };
  }
}

// Create and export service instance
const taskService = new TaskService();
export default taskService;
