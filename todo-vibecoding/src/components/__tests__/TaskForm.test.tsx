import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { TaskForm } from '../TaskForm';
import todoSlice from '../../stores/slices/todoSlice';
import taskService from '../../services/taskService';
import type { Todo } from '../../types/todo';

// Mock del servicio de tareas
jest.mock('../../services/taskService');
const mockTaskService = taskService as jest.Mocked<typeof taskService>;

// Mock store para las pruebas
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      todo: todoSlice,
    },
    preloadedState: {
      todo: {
        todos: [],
        currentTodo: null,
        filters: {
          status: 'all' as const,
          sortBy: 'createdAt' as const,
          sortOrder: 'desc' as const,
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
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (component: React.ReactElement, store = createMockStore()) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render create form by default', () => {
      renderWithProvider(<TaskForm />);
      
      expect(screen.getByText('Nueva Tarea')).toBeInTheDocument();
      expect(screen.getByText('Completa los campos para crear una nueva tarea')).toBeInTheDocument();
      expect(screen.getByLabelText('Título *')).toBeInTheDocument();
      expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
      expect(screen.getByLabelText('Estado')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Crear Tarea' })).toBeInTheDocument();
    });

    it('should render edit form when isEditing is true', () => {
      const initialData = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pendiente' as const,
      };

      renderWithProvider(
        <TaskForm 
          isEditing={true} 
          initialData={initialData}
          onCancel={() => {}}
        />
      );
      
      expect(screen.getByText('Editar Tarea')).toBeInTheDocument();
      expect(screen.getByText('Modifica los detalles de la tarea')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actualizar Tarea' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });

    it('should populate form fields with initial data', () => {
      const initialData = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'en_progreso' as const,
      };

      renderWithProvider(
        <TaskForm 
          isEditing={true} 
          initialData={initialData}
        />
      );
      
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty title', async () => {
      renderWithProvider(<TaskForm />);
      
      const submitButton = screen.getByRole('button', { name: 'Crear Tarea' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('El título es obligatorio')).toBeInTheDocument();
      });
    });

    it('should not show validation error for empty description', async () => {
      renderWithProvider(<TaskForm />);
      
      const titleInput = screen.getByLabelText('Título *');
      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      
      const submitButton = screen.getByRole('button', { name: 'Crear Tarea' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/descripción/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should create new task when form is submitted', async () => {
      mockTaskService.createTask.mockResolvedValue({
        success: true,
        data: {
          todo: {
            id: 1,
            title: 'New Task',
            description: 'New Description',
            status: 'pendiente',
            status_display: 'Pendiente',
            user_username: 'testuser',
            is_completed: false,
            created_at: '2024-01-01T00:00:00Z',
            completed_at: null,
          },
        },
      });

      const onSuccess = jest.fn();
      renderWithProvider(<TaskForm onSuccess={onSuccess} />);
      
      const titleInput = screen.getByLabelText('Título *');
      const descriptionInput = screen.getByLabelText('Descripción');
      
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
      
      const submitButton = screen.getByRole('button', { name: 'Crear Tarea' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockTaskService.createTask).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'New Description',
          status: 'pendiente',
        });
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should update existing task when editing', async () => {
      mockTaskService.updateTask.mockResolvedValue({
        success: true,
        data: {
          todo: {
            id: 1,
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'completada',
            status_display: 'Completada',
            user_username: 'testuser',
            is_completed: true,
            created_at: '2024-01-01T00:00:00Z',
            completed_at: '2024-01-02T00:00:00Z',
          },
        },
      });

      const initialData = {
        id: 1,
        title: 'Original Task',
        description: 'Original Description',
        status: 'pendiente' as const,
      };

      const onSuccess = jest.fn();
      renderWithProvider(
        <TaskForm 
          isEditing={true} 
          initialData={initialData}
          onSuccess={onSuccess}
        />
      );
      
      const titleInput = screen.getByDisplayValue('Original Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
      
      const submitButton = screen.getByRole('button', { name: 'Actualizar Tarea' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, {
          title: 'Updated Task',
          description: 'Original Description',
          status: 'pendiente',
        });
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', () => {
      const onCancel = jest.fn();
      renderWithProvider(
        <TaskForm 
          isEditing={true}
          onCancel={onCancel}
        />
      );
      
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
      fireEvent.click(cancelButton);
      
      expect(onCancel).toHaveBeenCalled();
    });

    it('should not show cancel button when onCancel is not provided', () => {
      renderWithProvider(<TaskForm />);
      
      expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during form submission', async () => {
      // Mock a delayed response
      mockTaskService.createTask.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          success: true,
          data: { 
            todo: {
              id: 1,
              title: 'Test Task',
              description: '',
              status: 'pendiente',
              status_display: 'Pendiente',
              user_username: 'testuser',
              is_completed: false,
              created_at: '2024-01-01T00:00:00Z',
              completed_at: null,
            } as Todo
          }
        }), 100))
      );

      renderWithProvider(<TaskForm />);
      
      const titleInput = screen.getByLabelText('Título *');
      fireEvent.change(titleInput, { target: { value: 'Test Task' } });
      
      const submitButton = screen.getByRole('button', { name: 'Crear Tarea' });
      fireEvent.click(submitButton);
      
      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Creando...')).toBeInTheDocument();
      });
    });
  });
});