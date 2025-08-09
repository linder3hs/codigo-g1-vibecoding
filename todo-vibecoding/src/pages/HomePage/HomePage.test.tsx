/**
 * HomePage Component Tests
 * Tests for the main todo list page with navigation
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router";
import { HomePage } from "./HomePage";
import type { TodosCount, Todo } from "../../types";
import type { FilterType } from "../../types";

// Mock the useTodo hook with proper typing
const mockSetFilter = jest.fn<void, [FilterType]>();
const mockFormatDate = jest.fn<string, [Date]>();

const mockTodosCount: TodosCount = {
  total: 1,
  completed: 0,
  pending: 1,
};

const mockTodos: Todo[] = [
  {
    id: "1",
    text: "Test todo",
    completed: false,
    createdAt: new Date("2024-01-01"),
    priority: "medium",
  },
];

jest.mock("../../hooks/useTodo", () => ({
  useTodo: () => ({
    filter: "all" as FilterType,
    setFilter: mockSetFilter,
    filteredTodos: mockTodos,
    todosCount: mockTodosCount,
    formatDate: mockFormatDate,
  }),
}));

// Mock components with proper typing
jest.mock("../../components", () => ({
  Header: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  Footer: () => <footer>Footer</footer>,
  StatsSection: ({ todosCount }: { todosCount: TodosCount }) => (
    <div>Stats: {todosCount.total} total</div>
  ),
  FilterButtons: ({
    currentFilter,
  }: {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
  }) => <div>Filter: {currentFilter}</div>,
  TodoList: ({
    todos,
    emptyMessage,
  }: {
    todos: Todo[];
    emptyMessage: string;
    formatDate: (date: Date) => string;
  }) => (
    <div>
      {todos.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        todos.map((todo) => <div key={todo.id}>{todo.text}</div>)
      )}
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement): void => {
  render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDate.mockReturnValue("01/01/2024");
  });

  it("renders the main page elements", () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByText("Lista de Tareas")).toBeInTheDocument();
    expect(
      screen.getByText("Gestiona tus tareas de manera eficiente")
    ).toBeInTheDocument();
    expect(screen.getByText("Stats: 1 total")).toBeInTheDocument();
    expect(screen.getByText("Filter: all")).toBeInTheDocument();
    expect(screen.getByText("Test todo")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders the create todo navigation button", () => {
    renderWithRouter(<HomePage />);

    const createButton = screen.getByRole("link", {
      name: /crear nueva tarea/i,
    });
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/crear-todo");
  });

  it("displays the plus icon in the create button", () => {
    renderWithRouter(<HomePage />);

    const createButton = screen.getByRole("link", {
      name: /crear nueva tarea/i,
    });
    const icon = createButton.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("applies correct CSS classes to the create button", () => {
    renderWithRouter(<HomePage />);

    const createButton = screen.getByRole("link", {
      name: /crear nueva tarea/i,
    });
    expect(createButton).toHaveClass(
      "inline-flex",
      "items-center",
      "px-6",
      "py-3",
      "bg-blue-600",
      "text-white",
      "rounded-lg"
    );
  });

  it("renders with proper container structure", () => {
    renderWithRouter(<HomePage />);

    const container = screen.getByText("Lista de Tareas").closest(".container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("mx-auto", "px-4", "py-8", "max-w-4xl");
  });

  it("displays the navigation section with proper styling", () => {
    renderWithRouter(<HomePage />);

    const createButton = screen.getByRole("link", {
      name: /crear nueva tarea/i,
    });
    const navigationDiv = createButton.parentElement;
    expect(navigationDiv).toHaveClass("mb-6", "text-center");
  });
});
