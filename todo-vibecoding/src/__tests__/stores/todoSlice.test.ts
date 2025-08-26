/**
 * Tests for todoSlice
 * Verifies Redux slice functionality with new backend data structure
 */

import { configureStore } from '@reduxjs/toolkit';
import todoSlice, {
  fetchTodos,
  fetchTodosSuccess,
  fetchTodosFailure,
  createTodoSuccess,
  updateTodoSuccess,
  deleteTodoSuccess,
  toggleTodoOptimistic,
  setFilters,
  clearFilters,
  selectFilteredTodos,
  selectTodoStats,
  selectTodoById,
} from '../../stores/slices/todoSlice';
import type { Todo, TodoState, TodoError } from '../../types/todo';

// Mock data with new backend structure
const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  status: 'pendiente',
  status_display: 'Pendiente',
  user_username: 'testuser',
  is_completed: false,
  created_at: '2024-01-15T10:00:00Z',
  completed_at: null,
  // Legacy fields for backward compatibility
  text: 'Test Todo',
  completed: false,
  createdAt: new Date('2024-01-15T10:00:00Z'),
  priority: 'medium',
};

const mockCompletedTodo: Todo = {
  ...mockTodo,
  id: 2,
  title: 'Completed Todo',
  status: 'completada',
  status_display: 'Completada',
  is_completed: true,
  completed_at: '2024-01-15T11:00:00Z',
  text: 'Completed Todo',
  completed: true,
};

const mockError: TodoError = {
  message: 'Test error',
  code: 'TEST_ERROR',
};

// Helper function to create store
const createTestStore = (initialState?: Partial<TodoState>) => {
  const defaultState: TodoState = {
    todos: [],
    currentTodo: null,
    filters: {
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
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

  return configureStore({
    reducer: {
      todos: todoSlice,
    },
    preloadedState: {
      todos: {
        ...defaultState,
        ...initialState,
      },
    },
  });
};

describe('todoSlice', () => {
  describe('fetchTodos actions', () => {
    it('should handle fetchTodos', () => {
      const store = createTestStore();
      
      store.dispatch(fetchTodos({ 
        filters: { status: 'completed' },
        pagination: { page: 2, limit: 20 }
      }));
      
      const state = store.getState().todos;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.filters.status).toBe('completed');
      expect(state.pagination.page).toBe(2);
      expect(state.pagination.limit).toBe(20);
    });

    it('should handle fetchTodosSuccess', () => {
      const store = createTestStore({ isLoading: true });
      
      store.dispatch(fetchTodosSuccess({
        todos: [mockTodo, mockCompletedTodo],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      }));
      
      const state = store.getState().todos;
      expect(state.isLoading).toBe(false);
      expect(state.todos).toHaveLength(2);
      expect(state.todos[0]).toEqual(mockTodo);
      expect(state.pagination.total).toBe(2);
      expect(state.error).toBe(null);
    });

    it('should handle fetchTodosFailure', () => {
      const store = createTestStore({ isLoading: true });
      
      store.dispatch(fetchTodosFailure({ error: mockError }));
      
      const state = store.getState().todos;
      expect(state.isLoading).toBe(false);
      expect(state.error).toEqual(mockError);
    });
  });

  describe('createTodoSuccess', () => {
    it('should add new todo to the beginning of the list', () => {
      const store = createTestStore({ 
        todos: [mockCompletedTodo],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNext: false, hasPrev: false }
      });
      
      store.dispatch(createTodoSuccess({ todo: mockTodo }));
      
      const state = store.getState().todos;
      expect(state.todos).toHaveLength(2);
      expect(state.todos[0]).toEqual(mockTodo);
      expect(state.pagination.total).toBe(2);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('updateTodoSuccess', () => {
    it('should update existing todo with new backend fields', () => {
      const store = createTestStore({ todos: [mockTodo] });
      
      const updatedTodo: Todo = {
        ...mockTodo,
        title: 'Updated Title',
        status: 'completada',
        status_display: 'Completada',
        is_completed: true,
        completed_at: '2024-01-15T12:00:00Z',
      };
      
      store.dispatch(updateTodoSuccess({ todo: updatedTodo }));
      
      const state = store.getState().todos;
      expect(state.todos[0]).toEqual(updatedTodo);
      expect(state.todos[0].title).toBe('Updated Title');
      expect(state.todos[0].is_completed).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should update currentTodo if it matches', () => {
      const store = createTestStore({ 
        todos: [mockTodo],
        currentTodo: mockTodo
      });
      
      const updatedTodo: Todo = {
        ...mockTodo,
        title: 'Updated Current Todo',
        is_completed: true,
      };
      
      store.dispatch(updateTodoSuccess({ todo: updatedTodo }));
      
      const state = store.getState().todos;
      expect(state.currentTodo).toEqual(updatedTodo);
    });
  });

  describe('deleteTodoSuccess', () => {
    it('should remove todo with string ID', () => {
      const store = createTestStore({ 
        todos: [mockTodo, mockCompletedTodo],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false }
      });
      
      store.dispatch(deleteTodoSuccess({ id: '1' }));
      
      const state = store.getState().todos;
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].id).toBe(2);
      expect(state.pagination.total).toBe(1);
    });

    it('should remove todo with number ID', () => {
      const store = createTestStore({ 
        todos: [mockTodo, mockCompletedTodo],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1, hasNext: false, hasPrev: false }
      });
      
      store.dispatch(deleteTodoSuccess({ id: String(1) }));
      
      const state = store.getState().todos;
      expect(state.todos).toHaveLength(1);
      expect(state.todos[0].id).toBe(2);
    });

    it('should clear currentTodo if it matches deleted todo', () => {
      const store = createTestStore({ 
        todos: [mockTodo],
        currentTodo: mockTodo
      });
      
      store.dispatch(deleteTodoSuccess({ id: '1' }));
      
      const state = store.getState().todos;
      expect(state.currentTodo).toBe(null);
    });
  });

  describe('toggleTodoOptimistic', () => {
    it('should toggle is_completed field for new backend structure', () => {
      const store = createTestStore({ todos: [mockTodo] });
      
      store.dispatch(toggleTodoOptimistic({ id: 1 }));
      
      const state = store.getState().todos;
      expect(state.todos[0].is_completed).toBe(true);
    });

    it('should toggle completed field for legacy structure', () => {
      const legacyTodo = {
        ...mockTodo,
        is_completed: false, // Set to false instead of undefined
        completed: false,
      };
      
      const store = createTestStore({ todos: [legacyTodo] });
      
      store.dispatch(toggleTodoOptimistic({ id: '1' }));
      
      const state = store.getState().todos;
      expect(state.todos[0].completed).toBe(true);
    });

    it('should toggle currentTodo if it matches', () => {
      const store = createTestStore({ 
        todos: [mockTodo],
        currentTodo: mockTodo
      });
      
      store.dispatch(toggleTodoOptimistic({ id: 1 }));
      
      const state = store.getState().todos;
      expect(state.currentTodo?.is_completed).toBe(true);
    });
  });

  describe('filters', () => {
    it('should handle setFilters', () => {
      const store = createTestStore();
      
      store.dispatch(setFilters({ 
        filters: { 
          status: 'completed',
          sortBy: 'title',
          search: 'test'
        }
      }));
      
      const state = store.getState().todos;
      expect(state.filters.status).toBe('completed');
      expect(state.filters.sortBy).toBe('title');
      expect(state.filters.search).toBe('test');
      expect(state.pagination.page).toBe(1); // Should reset to page 1
    });

    it('should handle clearFilters', () => {
      const store = createTestStore({
        filters: {
          status: 'completed',
          sortBy: 'title',
          sortOrder: 'asc',
          search: 'test',
          priority: 'high',
        },
        pagination: { page: 3, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
      });
      
      store.dispatch(clearFilters());
      
      const state = store.getState().todos;
      expect(state.filters.status).toBe('all');
      expect(state.filters.sortBy).toBe('createdAt');
      expect(state.filters.sortOrder).toBe('desc');
      expect(state.filters.search).toBeUndefined();
      expect(state.pagination.page).toBe(1);
    });
  });

  describe('selectors', () => {
    describe('selectFilteredTodos', () => {
      const testState = {
        todos: {
          todos: [mockTodo, mockCompletedTodo],
          filters: {
            status: 'all' as const,
            sortBy: 'createdAt' as const,
            sortOrder: 'desc' as const,
          },
        } as TodoState,
      };

      it('should filter by completion status using new fields', () => {
        const completedState = {
          ...testState,
          todos: {
            ...testState.todos,
            filters: { ...testState.todos.filters, status: 'completed' as const },
          },
        };
        
        const filtered = selectFilteredTodos(completedState);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].is_completed).toBe(true);
      });

      it('should filter by search text using title field', () => {
        const searchState = {
          ...testState,
          todos: {
            ...testState.todos,
            filters: { ...testState.todos.filters, search: 'Completed' },
          },
        };
        
        const filtered = selectFilteredTodos(searchState);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].title).toBe('Completed Todo');
      });

      it('should sort by title', () => {
        const sortState = {
          ...testState,
          todos: {
            ...testState.todos,
            filters: { ...testState.todos.filters, sortBy: 'title' as const, sortOrder: 'asc' as const },
          },
        };
        
        const filtered = selectFilteredTodos(sortState);
        expect(filtered[0].title).toBe('Completed Todo');
        expect(filtered[1].title).toBe('Test Todo');
      });

      it('should sort by created_at field', () => {
        const sortState = {
          ...testState,
          todos: {
            ...testState.todos,
            filters: { ...testState.todos.filters, sortBy: 'createdAt' as const, sortOrder: 'asc' as const },
          },
        };
        
        const filtered = selectFilteredTodos(sortState);
        expect(filtered).toHaveLength(2);
      });
    });

    describe('selectTodoStats', () => {
      it('should calculate stats using new is_completed field', () => {
        const testState = {
          todos: {
            todos: [mockTodo, mockCompletedTodo],
          } as TodoState,
        };
        
        const stats = selectTodoStats(testState);
        expect(stats.total).toBe(2);
        expect(stats.completed).toBe(1);
        expect(stats.pending).toBe(1);
      });

      it('should fallback to completed field for legacy todos', () => {
        const legacyTodo = {
          ...mockTodo,
          is_completed: false, // Set to false to test fallback logic
          completed: true,
        };
        
        const testState = {
          todos: {
            todos: [legacyTodo],
          } as TodoState,
        };
        
        const stats = selectTodoStats(testState);
        expect(stats.completed).toBe(0); // Should use is_completed (false) not completed (true)
      });
    });

    describe('selectTodoById', () => {
      const testState = {
        todos: {
          todos: [mockTodo, mockCompletedTodo],
        } as TodoState,
      };

      it('should find todo by number ID', () => {
        const todo = selectTodoById(testState, 1);
        expect(todo).toEqual(mockTodo);
      });

      it('should find todo by string ID', () => {
        const todo = selectTodoById(testState, '2');
        expect(todo).toEqual(mockCompletedTodo);
      });

      it('should return null for non-existent ID', () => {
        const todo = selectTodoById(testState, 999);
        expect(todo).toBe(null);
      });
    });
  });
});