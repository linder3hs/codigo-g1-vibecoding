/**
 * CreateTodoPage Component Tests
 * Tests for the todo creation form page
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { CreateTodoPage } from "./CreateTodoPage";

// Mock the useTodo hook with proper typing
interface CreateTodoInput {
  title: string;
  description?: string;
  status: string;
}

const mockCreateNewTodo = jest.fn<void, [CreateTodoInput]>();
jest.mock("../../hooks/useTodo", () => ({
  useTodo: () => ({
    createNewTodo: mockCreateNewTodo,
    isLoading: false,
  }),
}));

// Mock react-router navigation with proper typing
const mockNavigate = jest.fn<void, [string]>();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: (): ((path: string) => void) => mockNavigate,
}));

// Mock components with proper typing
jest.mock("../../components", () => ({
  Header: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  TaskForm: () => (
    <div>
      <h2>Nueva Tarea</h2>
      <form>
        <label htmlFor="title">Título *</label>
        <input id="title" placeholder="Escribe el título de la tarea..." />
        <label htmlFor="description">Descripción</label>
        <input id="description" placeholder="Describe la tarea (opcional)..." />
        <button type="submit">Crear Tarea</button>
        <button type="button">Cancelar</button>
      </form>
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement): void => {
  render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CreateTodoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the create todo form", () => {
    renderWithRouter(<CreateTodoPage />);

    expect(screen.getByText("Crear Nueva Tarea")).toBeInTheDocument();
    expect(
      screen.getByText("Agrega una nueva tarea a tu lista")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Escribe el título de la tarea...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /crear tarea/i })
    ).toBeInTheDocument();
  });

  it("renders the back to home link with modern styling", () => {
    renderWithRouter(<CreateTodoPage />);

    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
    expect(backLink).toHaveClass(
      "inline-flex",
      "items-center",
      "text-charcoal-400",
      "hover:text-charcoal-300",
      "transition-all",
      "duration-300",
      "font-medium",
      "group"
    );
  });

  it("renders the cancel button with proper styling", () => {
    renderWithRouter(<CreateTodoPage />);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute("type", "button");
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText(
      "Escribe el título de la tarea..."
    ) as HTMLInputElement;

    await user.type(input, "Nueva tarea de prueba");

    expect(input.value).toBe("Nueva tarea de prueba");
  });















  it("has proper accessibility attributes", () => {
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe el título de la tarea...");
    const submitButton = screen.getByRole("button", {
      name: /crear tarea/i,
    });

    expect(input).toHaveAttribute("id", "title");
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("renders form elements with correct attributes", () => {
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe el título de la tarea...");
    const submitButton = screen.getByRole("button", { name: /crear tarea/i });
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });

    expect(input).toHaveAttribute("id", "title");
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(cancelButton).toHaveAttribute("type", "button");
  });

  it("renders with correct page structure", () => {
    renderWithRouter(<CreateTodoPage />);

    // Check that the page renders the main heading
    const heading = screen.getByText("Crear Nueva Tarea");
    expect(heading).toBeInTheDocument();

    // Check that the back link is present
    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("displays proper form structure with labels", () => {
    renderWithRouter(<CreateTodoPage />);

    const titleLabel = screen.getByText("Título *");
    const descriptionLabel = screen.getByText("Descripción");
    const titleInput = screen.getByPlaceholderText("Escribe el título de la tarea...");
    const descriptionInput = screen.getByPlaceholderText("Describe la tarea (opcional)...");

    expect(titleLabel).toBeInTheDocument();
    expect(descriptionLabel).toBeInTheDocument();
    expect(titleInput).toHaveAttribute("id", "title");
    expect(descriptionInput).toHaveAttribute("id", "description");
  });
});
