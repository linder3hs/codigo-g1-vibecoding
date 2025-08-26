/**
 * TaskService Tests
 * Tests for the updated task service with backend integration
 */

import taskService from './taskService';
import httpClient from './httpClient';
import type { Task, TaskListResponse as BackendTaskListResponse, CreateTodoInput, UpdateTodoInput } from '../types/todo';

// Mock httpClient
jest.mock('./httpClient');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch and convert backend tasks to frontend todos', async () => {
      // Mock backend response
      const mockBackendResponse: BackendTaskListResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: 'Test Task 1',
            description: 'Description 1',
            status: 'pendiente',
            status_display: 'Pendiente',
            user_username: 'testuser',
            is_completed: false,
            created_at: '2025-08-20T19:35:10.204125-05:00',
            completed_at: null,
          },
          {
            id: 2,
            title: 'Test Task 2',
            description: 'Description 2',
            status: 'completada',
            status_display: 'Completada',
            user_username: 'testuser',
            is_completed: true,
            created_at: '2025-08-18T23:04:33.731178-05:00',
            completed_at: '2025-08-19T10:00:00.000000-05:00',
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
      expect(firstTodo.id).toBe('1');
      expect(firstTodo.text).toBe('Test Task 1');
      expect(firstTodo.completed).toBe(false);
      expect(firstTodo.priority).toBe('medium');
      expect(firstTodo.createdAt).toBeInstanceOf(Date);
    });

    it('should handle pagination parameters', async () => {
      const mockResponse: BackendTaskListResponse = {
        count: 10,
        next: 'http://api.example.com/tasks/?page=2',
        previous: null,
        results: [],
      };

      mockedHttpClient.get.mockResolvedValue({ data: mockResponse });

      await taskService.getTasks({ status: 'all' }, { page: 1, limit: 5 });

      expect(mockedHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=5')
      );
    });

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockedHttpClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(taskService.getTasks()).rejects.toThrow(errorMessage);
    });
  });

  describe('createTask', () => {
    it('should convert frontend input to backend format and create task', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'New Task',
        description: 'New Task',
        status: 'pendiente',
        status_display: 'Pendiente',
        user_username: 'testuser',
        is_completed: false,
        created_at: '2025-08-20T19:35:10.204125-05:00',
        completed_at: null,
      };

      mockedHttpClient.post.mockResolvedValue({ data: mockTask });

      const createInput: CreateTodoInput = {
        text: 'New Task',
        priority: 'high',
      };

      const result = await taskService.createTask(createInput);

      expect(result.success).toBe(true);
      expect(result.data.todo.text).toBe('New Task');
      expect(result.data.todo.completed).toBe(false);

      // Verify backend call format
      expect(mockedHttpClient.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          title: 'New Task',
          description: 'New Task',
          status: 'pendiente',
        }
      );
    });
  });

  describe('updateTask', () => {
    it('should convert frontend update to backend format', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Task',
        status: 'completada',
        status_display: 'Completada',
        user_username: 'testuser',
        is_completed: true,
        created_at: '2025-08-20T19:35:10.204125-05:00',
        completed_at: '2025-08-20T20:00:00.000000-05:00',
      };

      mockedHttpClient.put.mockResolvedValue({ data: mockTask });

      const updateInput: UpdateTodoInput = {
        text: 'Updated Task',
        completed: true,
      };

      const result = await taskService.updateTask('1', updateInput);

      expect(result.success).toBe(true);
      expect(result.data.todo.text).toBe('Updated Task');
      expect(result.data.todo.completed).toBe(true);

      // Verify backend call format
      expect(mockedHttpClient.put).toHaveBeenCalledWith(
        expect.stringContaining('/1'),
        {
          title: 'Updated Task',
          description: 'Updated Task',
          is_completed: true,
          status: 'completada',
        }
      );
    });
  });

  describe('convertTaskToTodo', () => {
    it('should correctly convert backend Task to frontend Todo', () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'en_progreso',
        status_display: 'En Progreso',
        user_username: 'testuser',
        is_completed: false,
        created_at: '2025-08-20T19:35:10.204125-05:00',
        completed_at: null,
      };

      // Access private method for testing
      const convertedTodo = (taskService as unknown as { convertTaskToTodo: (task: Task) => import('../types/todo').Todo }).convertTaskToTodo(mockTask);

      expect(convertedTodo.id).toBe('1');
      expect(convertedTodo.text).toBe('Test Task');
      expect(convertedTodo.completed).toBe(false);
      expect(convertedTodo.priority).toBe('medium');
      expect(convertedTodo.createdAt).toBeInstanceOf(Date);
    });
  });
});