/**
 * TodoPage Component Tests
 * Tests for the main todo management page with event handling
 */

import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { TodoPage } from "./TodoPage";
import type { FilterType } from "../../types/filter";
import type { Todo } from "../../types/todo";

// Mock the useTodo hook
const mockUseTodo = {
  filters: { status: "all" as FilterType },
  updateFilters: jest.fn(),
  filteredTodos: [
    {
      id: 1,
      title: "Test Todo 1",
      description: "Test description 1",
      is_completed: false,
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      title: "Test Todo 2",
      description: "Test description 2",
      is_completed: true,
      created_at: "2024-01-01T00:00:00Z",
    },
  ] as Todo[],
  todosStats: {
    total: 2,
    completed: 1,
    pending: 1,
  },
  toggleTodoStatus: jest.fn(),
  deleteExistingTodo: jest.fn(),
};

const mockNavigate = jest.fn();

// Mock the hooks
jest.mock("../../hooks/useTodo", () => ({
  useTodo: () => mockUseTodo,
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Mock the components
jest.mock("../../components", () => ({
  Header: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div role="banner">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  StatsSection: ({
    todosCount,
  }: {
    todosCount: { total: number; completed: number; pending: number };
  }) => (
    <div role="region" aria-label="estadísticas">
      <span>Total: {todosCount.total}</span>
      <span>Completadas: {todosCount.completed}</span>
      <span>Pendientes: {todosCount.pending}</span>
    </div>
  ),
  TodoList: ({
    todos,
    onToggleTodo,
    onDeleteTodo,
    onCreateNew,
    emptyMessage,
  }: {
    todos: Todo[];
    onToggleTodo: (id: number | string) => void;
    onDeleteTodo: (id: number | string) => void;
    onCreateNew: () => void;
    emptyMessage: string;
  }) => (
    <div role="list">
      {todos.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        todos.map((todo: Todo) => (
          <div key={todo.id} role="listitem">
            <span>{todo.title}</span>
            <button onClick={() => onToggleTodo(todo.id)}>Toggle</button>
            <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
          </div>
        ))
      )}
      <button onClick={onCreateNew}>Crear Nueva Tarea</button>
    </div>
  ),
  Filter: ({
    currentFilter,
    onFilterChange,
  }: {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
  }) => (
    <div role="group" aria-label="filtros">
      <button
        onClick={() => onFilterChange("all")}
        className={currentFilter === "all" ? "active" : ""}
      >
        Todas
      </button>
      <button
        onClick={() => onFilterChange("completed")}
        className={currentFilter === "completed" ? "active" : ""}
      >
        Completadas
      </button>
      <button
        onClick={() => onFilterChange("pending")}
        className={currentFilter === "pending" ? "active" : ""}
      >
        Pendientes
      </button>
    </div>
  ),
}));

// Mock UI components
jest.mock("../../components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react
jest.mock("lucide-react", () => ({
  Plus: () => <span>+</span>,
}));

const renderTodoPage = () => {
  return render(
    <BrowserRouter>
      <TodoPage />
    </BrowserRouter>
  );
};

describe("TodoPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the main page structure correctly", () => {
      renderTodoPage();

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByText("Lista de Tareas")).toBeInTheDocument();
      expect(
        screen.getByText("Gestiona tus tareas de manera eficiente con estilo")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("group", { name: /filtros/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("region", { name: /estadísticas/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should display todo statistics correctly", () => {
      renderTodoPage();

      expect(screen.getByText("Total: 2")).toBeInTheDocument();
      expect(screen.getByText("Completadas: 1")).toBeInTheDocument();
      expect(screen.getByText("Pendientes: 1")).toBeInTheDocument();
    });

    it("should render todo list with items", () => {
      renderTodoPage();

      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
      expect(screen.getAllByText("Toggle")).toHaveLength(2);
      expect(screen.getAllByText("Delete")).toHaveLength(2);
    });
  });

  describe("Filter Interactions", () => {
    it("should handle filter change to completed", async () => {
      const user = userEvent.setup();
      renderTodoPage();

      const completedButton = screen.getByText("Completadas");
      await user.click(completedButton);

      expect(mockUseTodo.updateFilters).toHaveBeenCalledWith({
        status: "completed",
      });
    });

    it("should handle filter change to pending", async () => {
      const user = userEvent.setup();
      renderTodoPage();

      const pendingButton = screen.getByText("Pendientes");
      await user.click(pendingButton);

      expect(mockUseTodo.updateFilters).toHaveBeenCalledWith({
        status: "pending",
      });
    });

    it("should handle filter change to all", async () => {
      const user = userEvent.setup();
      renderTodoPage();

      const allButton = screen.getByText("Todas");
      await user.click(allButton);

      expect(mockUseTodo.updateFilters).toHaveBeenCalledWith({
        status: "all",
      });
    });
  });

  describe("Todo Interactions", () => {
    it("should handle todo toggle action", async () => {
      const user = userEvent.setup();
      renderTodoPage();

      const toggleButtons = screen.getAllByText("Toggle");
      await user.click(toggleButtons[0]);

      expect(mockUseTodo.toggleTodoStatus).toHaveBeenCalledWith(1);
    });

    it("should handle todo delete action", async () => {
      const user = userEvent.setup();
      renderTodoPage();

      const deleteButtons = screen.getAllByText("Delete");
      await user.click(deleteButtons[0]);

      expect(mockUseTodo.deleteExistingTodo).toHaveBeenCalledWith(1);
    });

    it("should handle create new todo navigation", async () => {
      const user = userEvent.setup();
      renderTodoPage();

      const createButton = screen.getByText("Crear Nueva Tarea");
      await user.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith("/crear-todo");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      renderTodoPage();

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(
        screen.getByRole("group", { name: /filtros/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("region", { name: /estadísticas/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("list")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });
});
