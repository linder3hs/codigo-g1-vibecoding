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

  it("renders the back to home link with modern styling", () => {
    renderWithRouter(<CreateTodoPage />);

    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
    expect(backLink).toHaveClass(
      "inline-flex",
      "items-center",
      "text-blue-400",
      "hover:text-blue-300",
      "transition-all",
      "duration-300",
      "font-medium",
      "group"
    );
  });

  it("renders the cancel link with proper styling", () => {
    renderWithRouter(<CreateTodoPage />);

    const cancelLink = screen.getByRole("link", { name: /cancelar/i });
    expect(cancelLink).toBeInTheDocument();
    expect(cancelLink).toHaveAttribute("href", "/");
    expect(cancelLink).toHaveClass(
      "px-6",
      "py-3",
      "bg-slate-700/50",
      "hover:bg-slate-600/50",
      "text-slate-300",
      "hover:text-white",
      "rounded-xl",
      "font-medium",
      "text-center",
      "transition-all",
      "duration-300",
      "border",
      "border-slate-600/30",
      "hover:border-slate-500/50"
    );
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
    expect(submitButton).toHaveClass(
      "disabled:from-slate-600", 
      "disabled:to-slate-600",
      "disabled:cursor-not-allowed",
      "disabled:hover:scale-100"
    );
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
    expect(submitButton).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-600",
      "to-indigo-600",
      "hover:from-blue-700",
      "hover:to-indigo-700",
      "transform",
      "hover:scale-105"
    );
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
      "bg-slate-700/50",
      "border",
      "border-slate-600/50",
      "rounded-xl"
    );

    expect(submitButton).toHaveClass(
      "flex-1",
      "px-6",
      "py-3",
      "bg-gradient-to-r",
      "from-blue-600",
      "to-indigo-600",
      "text-white",
      "rounded-xl"
    );

    expect(cancelLink).toHaveClass(
      "px-6", 
      "py-3", 
      "bg-slate-700/50", 
      "text-slate-300", 
      "rounded-xl"
    );
  });

  it("renders with correct container structure and glassmorphism styling", () => {
    renderWithRouter(<CreateTodoPage />);

    // Check main container
    const mainContainer = document.querySelector('.min-h-screen.relative');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("min-h-screen", "relative");
    
    // Check inner container
    const innerContainer = document.querySelector('.container.mx-auto.px-4.py-8.max-w-2xl.relative.z-10');
    expect(innerContainer).toBeInTheDocument();
    expect(innerContainer).toHaveClass(
      "container",
      "mx-auto",
      "px-4",
      "py-8",
      "max-w-2xl",
      "relative",
      "z-10"
    );
    
    // Check form container with glassmorphism
    const formContainer = document.querySelector('.backdrop-blur-md');
    expect(formContainer).toBeInTheDocument();
    expect(formContainer).toHaveClass(
      "backdrop-blur-md",
      "bg-slate-800/40",
      "rounded-2xl",
      "shadow-2xl",
      "p-8",
      "mb-8",
      "border",
      "border-slate-700/30"
    );
  });

  it("displays proper form structure with labels and glassmorphism styling", () => {
    renderWithRouter(<CreateTodoPage />);

    const label = screen.getByText("Descripción de la tarea");
    const input = screen.getByPlaceholderText("Escribe tu nueva tarea...");

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "todoText");
    expect(input).toHaveAttribute("id", "todoText");
    
    // Verify label styling
    expect(label).toHaveClass(
      "block",
      "text-sm",
      "font-medium",
      "text-slate-300",
      "mb-3"
    );
    
    // Verify input has autofocus
    expect(input).toHaveFocus();
  });
});
