import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { TaskForm } from "./TaskForm";
import type { Todo } from "../../../types/todo";

jest.mock("../../../hooks/useTodo", () => ({
  useTodo: jest.fn(),
}));

const { useTodo } = jest.requireMock("../../../hooks/useTodo");

// Mock UI components
jest.mock("../../ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >) => <button {...props}>{children}</button>,
}));

jest.mock("../../ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));

jest.mock("../../ui/label", () => ({
  Label: ({
    children,
    ...props
  }: React.PropsWithChildren<React.LabelHTMLAttributes<HTMLLabelElement>>) => (
    <label {...props}>{children}</label>
  ),
}));

jest.mock("../../ui/select", () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange?: (value: string) => void;
    value?: string;
  }) => (
    <div data-testid="select-wrapper">
      <select
        onChange={(e) => onValueChange?.(e.target.value)}
        value={value}
        data-testid="status-select"
      >
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span data-testid="select-value">{placeholder}</span>
  ),
}));

jest.mock("../../ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="task-form-card">
      {children}
    </div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="card-title">{children}</h2>
  ),
}));

jest.mock("../../ui/alert", () => ({
  Alert: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => (
    <div data-testid="alert" data-variant={variant}>
      {children}
    </div>
  ),
  AlertDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="alert-description">{children}</div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
  AlertCircle: () => <span data-testid="alert-icon">!</span>,
}));

describe("TaskForm", () => {
  const mockCreateNewTodo = jest.fn();
  const mockUpdateExistingTodo = jest.fn();
  const mockClearTodoError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useTodo.mockReturnValue({
      createNewTodo: mockCreateNewTodo,
      updateExistingTodo: mockUpdateExistingTodo,
      clearTodoError: mockClearTodoError,
      isLoading: false,
      error: null,
      todos: [],
      currentTodo: null,
      filters: {},
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      filteredTodos: [],
      todosStats: { total: 0, completed: 0, pending: 0 },
      fetchTodosList: jest.fn(),
      deleteExistingTodo: jest.fn(),
      toggleTodoStatus: jest.fn(),
      markTodoCompleted: jest.fn(),
      updateFilters: jest.fn(),
      resetFilters: jest.fn(),
      setCurrentTodoItem: jest.fn(),
      getTodoById: jest.fn(),
      formatDate: jest.fn(),
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render create form correctly", () => {
      render(<TaskForm />);

      expect(screen.getByTestId("task-form-card")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Crear Nueva Tarea"
      );
      expect(screen.getByLabelText("Título *")).toBeInTheDocument();
      expect(screen.getByLabelText("Descripción")).toBeInTheDocument();
      expect(screen.getByTestId("select-wrapper")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /crear tarea/i })
      ).toBeInTheDocument();
    });

    it("should render edit form with todo data", () => {
      const mockTodo: Todo = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: "en_progreso",
        status_display: "En Progreso",
        completed_at: null,
        created_at: String(new Date()),
        is_completed: false,
        user_username: "testuser",
      };

      render(<TaskForm todo={mockTodo} mode="edit" />);

      expect(screen.getByTestId("card-title")).toHaveTextContent(
        "Editar Tarea"
      );
      expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /actualizar tarea/i })
      ).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should call createNewTodo when form is submitted with valid data", async () => {
      const user = userEvent.setup();
      render(<TaskForm />);

      const titleInput = screen.getByLabelText("Título *");
      const descriptionInput = screen.getByLabelText("Descripción");
      const submitButton = screen.getByRole("button", { name: /crear tarea/i });

      await user.type(titleInput, "New Task");
      await user.type(descriptionInput, "Task description");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateNewTodo).toHaveBeenCalledWith({
          title: "New Task",
          description: "Task description",
          status: "pendiente",
        });
      });
    });

    it("should call updateExistingTodo when editing existing task", async () => {
      const mockTodo: Todo = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        status: "en_progreso",
        status_display: "En Progreso",
        completed_at: null,
        created_at: String(new Date()),
        is_completed: false,
        user_username: "testuser",
      };

      const user = userEvent.setup();
      render(<TaskForm todo={mockTodo} mode="edit" />);

      const titleInput = screen.getByDisplayValue("Test Task");
      const submitButton = screen.getByRole("button", {
        name: /actualizar tarea/i,
      });

      await user.clear(titleInput);
      await user.type(titleInput, "Updated Task");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateExistingTodo).toHaveBeenCalledWith("1", {
          title: "Updated Task",
          description: "Test Description",
          status: "en_progreso",
        });
      });
    });

    it("should handle status selection change", async () => {
      const user = userEvent.setup();
      render(<TaskForm />);

      const statusSelect = screen.getByTestId("status-select");

      await user.selectOptions(statusSelect, "completada");

      expect(statusSelect).toHaveValue("completada");
    });
  });

  describe("Error Handling", () => {
    it("should display error message when error exists", () => {
      useTodo.mockReturnValue({
        createNewTodo: mockCreateNewTodo,
        updateExistingTodo: mockUpdateExistingTodo,
        clearTodoError: mockClearTodoError,
        isLoading: false,
        error: { message: "Something went wrong" },
        todos: [],
        currentTodo: null,
        filters: {},
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        filteredTodos: [],
        todosStats: { total: 0, completed: 0, pending: 0 },
        fetchTodosList: jest.fn(),
        deleteExistingTodo: jest.fn(),
        toggleTodoStatus: jest.fn(),
        markTodoCompleted: jest.fn(),
        updateFilters: jest.fn(),
        resetFilters: jest.fn(),
        setCurrentTodoItem: jest.fn(),
        getTodoById: jest.fn(),
        formatDate: jest.fn(),
      });

      render(<TaskForm />);

      expect(screen.getByTestId("alert")).toBeInTheDocument();
      expect(screen.getByTestId("alert-description")).toHaveTextContent(
        "Something went wrong"
      );
    });

    it("should show loading state during submission", () => {
      render(<TaskForm isLoading={true} />);

      const submitButton = screen.getByRole("button", { name: /creando/i });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Creando...");
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels and structure", () => {
      render(<TaskForm />);

      expect(screen.getByLabelText("Título *")).toHaveAttribute("id", "title");
      expect(screen.getByLabelText("Descripción")).toHaveAttribute(
        "id",
        "description"
      );
      expect(screen.getByTestId("status-select")).toBeInTheDocument();
    });

    it("should show validation error when title is empty", async () => {
      const user = userEvent.setup();
      render(<TaskForm />);

      const titleInput = screen.getByLabelText(/título/i);

      // Clear the input and trigger validation with onChange
      await user.clear(titleInput);
      await user.type(titleInput, " "); // Add space
      await user.clear(titleInput); // Clear again to trigger validation

      await waitFor(
        () => {
          expect(
            screen.getByText("El título es requerido")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it("should allow valid title input", async () => {
      const user = userEvent.setup();
      render(<TaskForm />);

      const titleInput = screen.getByLabelText(/título/i);

      await user.clear(titleInput);
      await user.type(titleInput, "Valid task title");

      expect(titleInput).toHaveValue("Valid task title");
      expect(
        screen.queryByText("El título es requerido")
      ).not.toBeInTheDocument();
    });

    it("should handle form submission with valid data", async () => {
      const user = userEvent.setup();
      render(<TaskForm />);

      const titleInput = screen.getByLabelText(/título/i);
      const descriptionInput = screen.getByLabelText(/descripción/i);
      const submitButton = screen.getByRole("button", { name: /crear tarea/i });

      await user.clear(titleInput);
      await user.type(titleInput, "Test Task");
      await user.type(descriptionInput, "Test Description");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCreateNewTodo).toHaveBeenCalledWith({
          title: "Test Task",
          description: "Test Description",
          status: "pendiente",
        });
      });
    });
  });
});
