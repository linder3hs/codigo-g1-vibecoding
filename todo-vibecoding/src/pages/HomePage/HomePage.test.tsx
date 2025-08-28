/**
 * HomePage Component Tests
 * Tests for the main todo list page with navigation
 */

import { render, screen, fireEvent } from "@testing-library/react";
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
  Sidebar: ({
    currentFilter,
  }: {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
  }) => <div data-testid="sidebar">Sidebar: {currentFilter}</div>,
  TodoList: ({
    todos,
    emptyMessage,
  }: {
    todos: Todo[];
    emptyMessage: string;
    onToggleTodo?: (id: string) => void;
    onDeleteTodo?: (id: string) => void;
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

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  ChevronDown: () => <svg data-testid="chevron-down">ChevronDown</svg>,
  ChevronUp: () => <svg data-testid="chevron-up">ChevronUp</svg>,
}));

const renderWithRouter = (component: React.ReactElement): void => {
  render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDate.mockReturnValue("01/01/2024");
  });

  it("renders all main sections with minimalist design", () => {
    renderWithRouter(<HomePage />);

    expect(
      screen.getByText("Gestiona tus tareas de manera eficiente con estilo")
    ).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Ver estadísticas")).toBeInTheDocument();

    // Check that TodoList is rendered (it will show empty message from mock)
    const todoListContainer = document.querySelector(".backdrop-blur-md");
    expect(todoListContainer).toBeInTheDocument();
  });

  it("renders the main container with correct minimalist classes", () => {
    renderWithRouter(<HomePage />);

    const container = screen.getByTestId("sidebar");
    expect(container).toBeInTheDocument();

    // Check for main content container with sidebar offset
    const mainContent = document.querySelector(".lg\\:ml-80");
    expect(mainContent).toHaveClass(
      "relative",
      "z-10",
      "lg:ml-80",
      "h-full",
      "lg:h-auto",
      "flex",
      "flex-col"
    );
  });

  it("renders the header section with correct minimalist styling", () => {
    renderWithRouter(<HomePage />);

    const header = screen.getByRole("heading", { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Lista de Tareas");

    const subtitle = screen.getByText(
      "Gestiona tus tareas de manera eficiente con estilo"
    );
    expect(subtitle).toBeInTheDocument();

    // Check for header section margin
    const headerSection = header.closest(".mb-6");
    expect(headerSection).toHaveClass("mb-6", "lg:mb-8");
  });

  it("renders the stats toggle button with glassmorphism effects", () => {
    renderWithRouter(<HomePage />);

    const statsToggle = screen.getByText("Ver estadísticas");
    expect(statsToggle).toBeInTheDocument();

    const toggleButton = statsToggle.closest("button");
    expect(toggleButton).toHaveClass(
      "w-full",
      "mb-4",
      "flex",
      "items-center",
      "justify-between",
      "p-3",
      "",
      "bg-slate-800",
      "rounded-xl",
      "border",
      "border-slate-700/40",
      "text-slate-300",
      "hover:text-white",
      "hover:bg-slate-800",
      "transition-all",
      "duration-200"
    );
  });

  it("toggles stats visibility with chevron icons", () => {
    renderWithRouter(<HomePage />);

    // Initially collapsed, should show ChevronDown
    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
    expect(screen.queryByTestId("chevron-up")).not.toBeInTheDocument();

    // Click to expand
    const toggleButton = screen.getByText("Ver estadísticas");
    fireEvent.click(toggleButton);

    // Should now show ChevronUp
    expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
    expect(screen.queryByTestId("chevron-down")).not.toBeInTheDocument();
  });

  it("renders the stats section with enhanced glassmorphism styling", () => {
    renderWithRouter(<HomePage />);

    // Click to expand stats section
    const toggleButton = screen.getByText("Ver estadísticas");
    fireEvent.click(toggleButton);

    // Check that stats are visible after expansion
    const visibleStats = screen.getByText(/Stats:/);
    expect(visibleStats).toBeInTheDocument();

    // Check glassmorphism classes on stats container
    const statsContainers = document.querySelectorAll(".backdrop-blur-md");
    const statsContainer = Array.from(statsContainers).find((container) =>
      container.classList.contains("bg-slate-800")
    );

    expect(statsContainer).toBeInTheDocument();
    expect(statsContainer).toHaveClass(
      "backdrop-blur-md",
      "bg-slate-800",
      "rounded-2xl",
      "sm:rounded-3xl",
      "p-6",
      "sm:p-8",
      "shadow-2xl",
      "border",
      "border-slate-700/30",
      "hover:border-slate-600/50",
      "transition-all",
      "duration-300"
    );
  });

  it("renders the todo list section with modern glassmorphism styling", () => {
    renderWithRouter(<HomePage />);

    // Check for todo list container with glassmorphism (using more specific selector)
    const todoContainers = document.querySelectorAll(".backdrop-blur-md");
    const todoContainer = Array.from(todoContainers).find((container) =>
      container.classList.contains("bg-slate-800")
    );

    expect(todoContainer).toBeInTheDocument();
    expect(todoContainer).toHaveClass(
      "backdrop-blur-md",
      "bg-slate-800",
      "rounded-2xl",
      "sm:rounded-3xl",
      "p-6",
      "sm:p-8",
      "lg:p-10",
      "shadow-2xl",
      "border",
      "border-slate-700/25",
      "hover:border-slate-600/45",
      "transition-all",
      "duration-300",
      "flex-1",
      "flex",
      "flex-col",
      "lg:block",
      "min-h-0"
    );
  });

  it("renders the mobile FAB with gradient styling", () => {
    renderWithRouter(<HomePage />);

    const fabLink = screen.getByLabelText("Crear nueva tarea");
    expect(fabLink).toBeInTheDocument();
    expect(fabLink).toHaveAttribute("href", "/crear-todo");

    expect(fabLink).toHaveClass(
      "group",
      "flex",
      "items-center",
      "justify-center",
      "w-14",
      "h-14",
      "bg-gradient-to-r",
      "from-blue-600",
      "to-indigo-600",
      "hover:from-blue-700",
      "hover:to-indigo-700",
      "text-white",
      "rounded-full",
      "shadow-2xl",
      "hover:shadow-blue-500/40",
      "transition-all",
      "duration-300",
      "transform",
      "hover:scale-110",
      "active:scale-95"
    );
  });

  it("verifies responsive layout classes", () => {
    renderWithRouter(<HomePage />);

    // Check main container responsive classes
    const mainContainer = document.querySelector(".h-screen");
    expect(mainContainer).toHaveClass(
      "h-screen",
      "overflow-hidden",
      "lg:overflow-auto"
    );

    // Check content wrapper responsive classes
    const contentWrapper = document.querySelector(".mx-auto");
    expect(contentWrapper).toHaveClass(
      "mx-auto",
      "px-4",
      "sm:px-6",
      "lg:px-8",
      "py-6",
      "sm:py-8",
      "lg:py-12",
      "max-w-6xl",
      "flex-1",
      "flex",
      "flex-col",
      "lg:block",
      "min-h-0"
    );
  });

  it("verifies minimalist glassmorphism design elements", () => {
    renderWithRouter(<HomePage />);

    // Check for backdrop blur effects
    const blurElements = document.querySelectorAll("., .backdrop-blur-md");
    expect(blurElements.length).toBeGreaterThan(0);

    // Check for slate color scheme
    const slateElements = document.querySelectorAll('[class*="slate-800"]');
    expect(slateElements.length).toBeGreaterThan(0);

    // Check for transition effects
    const transitionElements = document.querySelectorAll(".transition-all");
    expect(transitionElements.length).toBeGreaterThan(0);
  });
});
