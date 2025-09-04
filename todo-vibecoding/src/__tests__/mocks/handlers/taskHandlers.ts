/**
 * MSW Handlers for Task/Todo API endpoints
 * Provides mock responses for all task-related operations
 */

import { http, HttpResponse } from "msw";
import type {
  Todo,
  Task,
  TaskStatus,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilterStatus,
  TodoPagination,
} from "../../../types/todo";

// Mock data for testing
const mockTodos: Todo[] = [
  {
    id: 1,
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the todo app",
    status: "pendiente",
    status_display: "Pendiente",
    user_username: "testuser",
    is_completed: false,
    created_at: "2024-01-15T10:00:00Z",
    completed_at: null,
  },
  {
    id: 2,
    title: "Review code changes",
    description: "Review and approve pending pull requests",
    status: "en_progreso",
    status_display: "En Progreso",
    user_username: "testuser",
    is_completed: false,
    created_at: "2024-01-14T09:30:00Z",
    completed_at: null,
  },
  {
    id: 3,
    title: "Deploy to production",
    description: "Deploy the latest version to production environment",
    status: "completada",
    status_display: "Completada",
    user_username: "testuser",
    is_completed: true,
    created_at: "2024-01-13T14:20:00Z",
    completed_at: "2024-01-14T16:45:00Z",
  },
];

// Helper function to convert Todo to Task format (backend format)
const convertTodoToTask = (todo: Todo): Task => ({
  id: todo.id,
  title: todo.title,
  description: todo.description,
  status: todo.status,
  status_display: todo.status_display,
  user_username: todo.user_username,
  is_completed: todo.is_completed,
  created_at: todo.created_at,
  completed_at: todo.completed_at,
});

// Helper function to generate new ID
const generateId = (): number => {
  return mockTodos.length + 1;
};

// Helper function to filter todos by status
const filterTodosByStatus = (
  todos: Todo[],
  status?: TodoFilterStatus
): Todo[] => {
  if (!status || status === "all") {
    return todos;
  }

  // Map frontend filter status to backend status
  const statusMap: Record<string, TaskStatus> = {
    pending: "pendiente",
    completed: "completada",
  };

  const backendStatus = statusMap[status];
  if (!backendStatus) {
    return todos;
  }

  return todos.filter((todo) => todo.status === backendStatus);
};

// Helper function to paginate results
const paginateResults = (
  todos: Todo[],
  page: number = 1,
  limit: number = 10
): { todos: Todo[]; pagination: TodoPagination } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTodos = todos.slice(startIndex, endIndex);

  return {
    todos: paginatedTodos,
    pagination: {
      page,
      limit,
      total: todos.length,
      totalPages: Math.ceil(todos.length / limit),
      hasNext: endIndex < todos.length,
      hasPrev: page > 1,
    },
  };
};

export const taskHandlers = [
  // GET /api/tasks - Get all tasks with optional filtering and pagination
  http.get("http://localhost:8000/api/tasks", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as TodoFilterStatus | null;
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const search = url.searchParams.get("search");

    let filteredTodos = filterTodosByStatus(mockTodos, status || undefined);

    // Apply search filter if provided
    if (search) {
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(search.toLowerCase()) ||
          todo.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const result = paginateResults(filteredTodos, page, limit);

    // Convert to backend format
    const backendResponse = {
      success: true,
      data: {
        tasks: result.todos.map(convertTodoToTask),
        pagination: result.pagination,
      },
    };

    return HttpResponse.json(backendResponse);
  }),

  // GET /api/tasks/:id - Get a specific task by ID
  http.get("http://localhost:8000/api/tasks/:id", ({ params }) => {
    const { id } = params;
    const todoId = typeof id === "string" ? parseInt(id, 10) : id;
    const todo = mockTodos.find((t) => t.id === todoId);

    if (!todo) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Task not found",
            code: "TASK_NOT_FOUND",
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        task: convertTodoToTask(todo),
      },
    });
  }),

  // POST /api/tasks/ - Create a new task
  http.post("http://localhost:8000/api/tasks/", async ({ request }) => {
    try {
      const body = (await request.json()) as CreateTodoInput;

      // Validate required fields
      if (!body.title || body.title.trim() === "") {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Title is required",
              code: "VALIDATION_ERROR",
              status: 400,
              details: { title: ["Title field is required"] },
            },
          },
          { status: 400 }
        );
      }

      const newTodo: Todo = {
        id: generateId(),
        title: body.title,
        description: body.description || "",
        status: body.status || "pendiente",
        status_display:
          body.status === "completada"
            ? "Completada"
            : body.status === "en_progreso"
            ? "En Progreso"
            : "Pendiente",
        user_username: "testuser",
        is_completed: body.status === "completada",
        created_at: new Date().toISOString(),
        completed_at:
          body.status === "completada" ? new Date().toISOString() : null,
      };

      // Add to mock data
      mockTodos.push(newTodo);

      return HttpResponse.json(
        {
          success: true,
          data: {
            task: convertTodoToTask(newTodo),
          },
        },
        { status: 201 }
      );
    } catch {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request body",
            code: "INVALID_JSON",
            status: 400,
          },
        },
        { status: 400 }
      );
    }
  }),

  // PUT /api/tasks/:id/ - Update an existing task
  http.put(
    "http://localhost:8000/api/tasks/:id/",
    async ({ params, request }) => {
      try {
        const { id } = params;
        const body = (await request.json()) as UpdateTodoInput;
        const todoId = typeof id === "string" ? parseInt(id, 10) : id;

        const todoIndex = mockTodos.findIndex((t) => t.id === todoId);

        if (todoIndex === -1) {
          return HttpResponse.json(
            {
              success: false,
              error: {
                message: "Task not found",
                code: "TASK_NOT_FOUND",
                status: 404,
              },
            },
            { status: 404 }
          );
        }

        // Update the todo
        const currentTodo = mockTodos[todoIndex];
        const updatedTodo: Todo = {
          ...currentTodo,
          ...body,
          status_display: body.status
            ? body.status === "completada"
              ? "Completada"
              : body.status === "en_progreso"
              ? "En Progreso"
              : "Pendiente"
            : currentTodo.status_display,
          is_completed:
            body.status === "completada" ||
            body.is_completed ||
            currentTodo.is_completed,
          completed_at:
            body.status === "completada" || body.is_completed
              ? new Date().toISOString()
              : body.status && body.status === "pendiente"
              ? null
              : currentTodo.completed_at,
        };

        mockTodos[todoIndex] = updatedTodo;

        return HttpResponse.json({
          success: true,
          data: {
            task: convertTodoToTask(updatedTodo),
          },
        });
      } catch {
        return HttpResponse.json(
          {
            success: false,
            error: {
              message: "Invalid request body",
              code: "INVALID_JSON",
              status: 400,
            },
          },
          { status: 400 }
        );
      }
    }
  ),

  // DELETE /api/tasks/:id/ - Delete a task
  http.delete("http://localhost:8000/api/tasks/:id/", ({ params }) => {
    const { id } = params;
    const todoId = typeof id === "string" ? parseInt(id, 10) : Number(id);
    const todoIndex = mockTodos.findIndex((t) => t.id === todoId);

    if (todoIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Task not found",
            code: "TASK_NOT_FOUND",
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    // Remove the todo
    mockTodos.splice(todoIndex, 1);

    return HttpResponse.json({
      success: true,
      data: {
        id: todoId.toString(),
        message: "Task deleted successfully",
      },
    });
  }),

  // PUT /api/tasks/:id/toggle - Toggle task completion status
  http.put("http://localhost:8000/api/tasks/:id/toggle", ({ params }) => {
    const { id } = params;
    const todoId = typeof id === "string" ? parseInt(id, 10) : id;
    const todoIndex = mockTodos.findIndex((t) => t.id === todoId);

    if (todoIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          error: {
            message: "Task not found",
            code: "TASK_NOT_FOUND",
            status: 404,
          },
        },
        { status: 404 }
      );
    }

    // Toggle completion status
    const currentTodo = mockTodos[todoIndex];
    const newStatus: TaskStatus =
      currentTodo.status === "completada" ? "pendiente" : "completada";
    const isCompleted = newStatus === "completada";

    const updatedTodo: Todo = {
      ...currentTodo,
      status: newStatus,
      status_display: newStatus === "completada" ? "Completada" : "Pendiente",
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    };

    mockTodos[todoIndex] = updatedTodo;

    return HttpResponse.json({
      success: true,
      data: {
        task: convertTodoToTask(updatedTodo),
      },
    });
  }),
];

// Export mock data for testing utilities
export { mockTodos };
