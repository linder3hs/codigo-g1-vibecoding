/**
 * CreateTodoPage Component Tests
 * Tests for the todo creation form page
 */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { CreateTodoPage } from "./CreateTodoPage";

// Mock the useTodo hook with proper typing
interface TodoInput {
  name: string;
  is_finished: boolean;
  created_at: Date;
  updated_at: Date;
}

const mockAddTodo = jest.fn<void, [TodoInput]>();
jest.mock("../../hooks/useTodo", () => ({
  useTodo: () => ({
    addTodo: mockAddTodo,
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
  Footer: () => <footer>Footer</footer>,
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
      screen.getByPlaceholderText("Escribe tu nueva tarea...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /crear tarea/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders the back to home link", () => {
    renderWithRouter(<CreateTodoPage />);

    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders the cancel link", () => {
    renderWithRouter(<CreateTodoPage />);

    const cancelLink = screen.getByRole("link", { name: /cancelar/i });
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink).toHaveAttribute("href", "/");
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText(
      "Escribe tu nueva tarea..."
    ) as HTMLInputElement;

    await user.type(input, "Nueva tarea de prueba");

    expect(input.value).toBe("Nueva tarea de prueba");
  });

  it("creates a todo when form is submitted with valid input", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");
    const submitButton = screen.getByRole("button", { name: /crear tarea/i });

    await user.type(input, "Nueva tarea");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        name: "Nueva tarea",
        is_finished: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("does not submit when input is empty", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const submitButton = screen.getByRole("button", { name: /crear tarea/i });

    await user.click(submitButton);

    expect(mockAddTodo).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("does not submit when input contains only whitespace", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");
    const submitButton = screen.getByRole("button", { name: /crear tarea/i });

    await user.type(input, "   ");
    await user.click(submitButton);

    expect(mockAddTodo).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("clears input after successful submission", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText(
      "Escribe tu nueva tarea..."
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /crear tarea/i });

    await user.type(input, "Nueva tarea");
    await user.click(submitButton);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("handles form submission via Enter key", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");

    await user.type(input, "Nueva tarea{enter}");

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith({
        name: "Nueva tarea",
        is_finished: false,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("disables submit button when input is empty", () => {
    renderWithRouter(<CreateTodoPage />);

    const submitButton = screen.getByRole("button", {
      name: /crear tarea/i,
    }) as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });

  it("enables submit button when input has content", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");
    const submitButton = screen.getByRole("button", {
      name: /crear tarea/i,
    }) as HTMLButtonElement;

    await user.type(input, "Nueva tarea");

    expect(submitButton.disabled).toBe(false);
  });

  it("applies correct CSS classes to form elements", () => {
    renderWithRouter(<CreateTodoPage />);

    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");
    const submitButton = screen.getByRole("button", { name: /crear tarea/i });
    const cancelLink = screen.getByRole("link", { name: /cancelar/i });

    expect(input).toHaveClass(
      "w-full",
      "px-4",
      "py-3",
      "border",
      "border-gray-300",
      "rounded-lg"
    );

    expect(submitButton).toHaveClass(
      "flex-1",
      "px-6",
      "py-3",
      "bg-blue-600",
      "text-white",
      "rounded-lg"
    );

    expect(cancelLink).toHaveClass("px-6", "py-3", "bg-gray-200", "rounded-lg");
  });

  it("displays proper form structure with labels", () => {
    renderWithRouter(<CreateTodoPage />);

    const label = screen.getByText("Descripción de la tarea");
    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "todoText");
    expect(input).toHaveAttribute("id", "todoText");
  });
});
