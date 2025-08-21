/**
 * Task Service
 * Service for handling CRUD operations on tasks/todos
 */

import httpClient from './httpClient';
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
  TodoPagination,
  TodoError,
  TodoFilterStatus,
} from '../types/todo';
import type { AxiosResponse } from 'axios';

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
  private readonly baseEndpoint = '/tasks';

  /**
   * Get tasks with optional filters and pagination
   * @param filters - Optional filters to apply
   * @param pagination - Optional pagination parameters
   * @returns Promise with tasks and pagination info
   */
  async getTasks(
    filters?: Partial<TodoFilters>,
    pagination?: Partial<Pick<TodoPagination, 'page' | 'limit'>>
  ): Promise<TaskServiceResponse<TaskListResponse>> {
    try {
      const params = new URLSearchParams();

      // Add filter parameters
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          params.append('status', filters.status);
        }
        if (filters.priority) {
          params.append('priority', filters.priority);
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
        if (filters.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
          params.append('sortOrder', filters.sortOrder);
        }
      }

      // Add pagination parameters
      if (pagination) {
        if (pagination.page) {
          params.append('page', pagination.page.toString());
        }
        if (pagination.limit) {
          params.append('limit', pagination.limit.toString());
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${this.baseEndpoint}?${queryString}` : this.baseEndpoint;

      const response: AxiosResponse<TaskServiceResponse<TaskListResponse>> = await httpClient.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error fetching tasks');
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
        throw new Error('Task ID is required');
      }

      const response: AxiosResponse<TaskServiceResponse<TaskResponse>> = await httpClient.get(
        `${this.baseEndpoint}/${id}`
      );
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
  async createTask(taskData: CreateTodoInput): Promise<TaskServiceResponse<TaskResponse>> {
    try {
      if (!taskData.text || taskData.text.trim().length === 0) {
        throw new Error('Task text is required');
      }

      const response: AxiosResponse<TaskServiceResponse<TaskResponse>> = await httpClient.post(
        this.baseEndpoint,
        taskData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Error creating task');
    }
  }

  /**
   * Update an existing task
   * @param id - Task ID
   * @param taskData - Task update data
   * @returns Promise with updated task
   */
  async updateTask(id: string, taskData: UpdateTodoInput): Promise<TaskServiceResponse<TaskResponse>> {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      if (Object.keys(taskData).length === 0) {
        throw new Error('At least one field must be provided for update');
      }

      const response: AxiosResponse<TaskServiceResponse<TaskResponse>> = await httpClient.put(
        `${this.baseEndpoint}/${id}`,
        taskData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Error updating task with ID: ${id}`);
    }
  }

  /**
   * Delete a task
   * @param id - Task ID
   * @returns Promise with deletion confirmation
   */
  async deleteTask(id: string): Promise<TaskServiceResponse<TaskDeleteResponse>> {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }

      const response: AxiosResponse<TaskServiceResponse<TaskDeleteResponse>> = await httpClient.delete(
        `${this.baseEndpoint}/${id}`
      );
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
        throw new Error('Task ID is required');
      }

      const response: AxiosResponse<TaskServiceResponse<TaskResponse>> = await httpClient.patch(
        `${this.baseEndpoint}/${id}/complete`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error, `Error marking task as completed with ID: ${id}`);
    }
  }

  /**
   * Get tasks filtered by status
   * @param status - Task status to filter by
   * @returns Promise with filtered tasks
   */
  async getTasksByStatus(status: TodoFilterStatus): Promise<TaskServiceResponse<TaskListResponse>> {
    try {
      if (!status) {
        throw new Error('Status is required');
      }

      return this.getTasks({ status });
    } catch (error) {
      throw this.handleError(error, `Error fetching tasks with status: ${status}`);
    }
  }

  /**
   * Handle and format service errors
   * @param error - Original error
   * @param defaultMessage - Default error message
   * @returns Formatted TaskServiceError
   */
  private handleError(error: unknown, defaultMessage: string): TaskServiceError {
    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes('required') || error.message.includes('must be provided')) {
        return {
          message: error.message,
          code: 'VALIDATION_ERROR',
          status: 400,
        };
      }

      // Handle axios errors
      if ('response' in error && error.response) {
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
          code: axiosError.response.data?.code || 'API_ERROR',
          status: axiosError.response.status,
          details: axiosError.response.data?.details,
        };
      }

      // Handle network errors
      if ('code' in error && error.code === 'NETWORK_ERROR') {
        return {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          status: 0,
        };
      }

      return {
        message: error.message || defaultMessage,
        code: 'UNKNOWN_ERROR',
      };
    }

    return {
      message: defaultMessage,
      code: 'UNKNOWN_ERROR',
    };
  }
}

// Create and export service instance
const taskService = new TaskService();
export default taskService;