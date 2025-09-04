/**
 * @fileoverview Tests para el componente TodoItem con diseño minimalista
 *
 * Este archivo contiene tests que verifican:
 * - Renderizado correcto de todos completados y pendientes
 * - Funcionalidad de checkbox y botón de eliminar
 * - Aplicación correcta de estilos según el estado
 * - Estructura semántica y accesibilidad
 * - Comportamiento de hover y transiciones
 * - Integración con callbacks onToggle y onDelete
 *
 * @author Vibe Coding Team
 * @version 2.0.0
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TodoItem } from "./TodoItem";
import type { Task } from "../../../types/todo";

/**
 * Suite de tests para el componente TodoItem
 *
 * Verifica el renderizado y funcionalidad del componente minimalista
 * que muestra checkbox, título y botón de eliminar para cada todo.
 */
describe("TodoItem Component", () => {
  // Mock functions para los callbacks
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Todo de prueba en estado completado
   *
   * @constant {Task} completedTodo - Todo marcado como finalizado
   */
  const completedTodo: Task = {
    id: 1,
    title: "Implementar autenticación de usuarios",
    is_completed: true,
    created_at: "2023-01-01T00:00:00Z",
    completed_at: "2023-01-02T00:00:00Z",
    description: "Crear sistema de login y registro con JWT",
    status: "completada",
    status_display: "Completada",
    user_username: "user1",
  };

  /**
   * Todo de prueba en estado pendiente
   *
   * @constant {Task} pendingTodo - Todo marcado como no finalizado
   */
  const pendingTodo: Task = {
    id: 2,
    title: "Crear componentes reutilizables",
    is_completed: false,
    created_at: "2023-01-01T00:00:00Z",
    completed_at: null,
    description: "Desarrollar biblioteca de componentes UI",
    status: "pendiente",
    status_display: "Pendiente",
    user_username: "user1",
  };

  /**
   * Test: Renderizado correcto de todo completado
   *
   * Verifica que un todo completado se renderice con:
   * - Nombre del todo visible con estilo tachado
   * - Checkbox marcado con ícono de check
   * - Botón de eliminar visible
   * - Estilos de opacidad reducida
   *
   * @test {HTMLElement} todoName - Título del todo
   * @test {HTMLElement} checkbox - Checkbox completado
   * @test {HTMLElement} deleteButton - Botón de eliminar
   */
  it("renders completed todo correctly", () => {
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Verifica el nombre del todo
    expect(
      screen.getByText("Implementar autenticación de usuarios")
    ).toBeInTheDocument();

    // Verifica el checkbox completado
    const checkbox = screen.getByRole("button", {
      name: /marcar como pendiente/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass("bg-green-500");

    // Verifica que el texto tenga estilo tachado
    const todoText = screen.getByText("Implementar autenticación de usuarios");
    expect(todoText).toHaveClass("text-gray-500", "line-through");

    // Verifica el botón de eliminar
    const deleteButton = screen.getByRole("button", {
      name: /eliminar tarea/i,
    });
    expect(deleteButton).toBeInTheDocument();
  });

  /**
   * Test: Renderizado correcto de todo pendiente
   *
   * Verifica que un todo pendiente se renderice con:
   * - Nombre del todo visible sin tachado
   * - Checkbox vacío sin ícono de check
   * - Botón de eliminar visible
   * - Estilos normales sin opacidad reducida
   *
   * @test {HTMLElement} todoName - Título del todo
   * @test {HTMLElement} checkbox - Checkbox pendiente
   * @test {HTMLElement} deleteButton - Botón de eliminar
   */
  it("renders pending todo correctly", () => {
    render(
      <TodoItem
        todo={pendingTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Verifica el nombre del todo
    expect(
      screen.getByText("Crear componentes reutilizables")
    ).toBeInTheDocument();

    // Verifica el checkbox pendiente
    const checkbox = screen.getByRole("button", {
      name: /marcar como completada/i,
    });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass("border-gray-400");
    expect(checkbox).not.toHaveClass("bg-green-500");

    // Verifica que el texto no tenga estilo tachado
    const todoText = screen.getByText("Crear componentes reutilizables");
    expect(todoText).toHaveClass("text-gray-900");
    expect(todoText).not.toHaveClass("line-through");

    // Verifica el botón de eliminar
    const deleteButton = screen.getByRole("button", {
      name: /eliminar tarea/i,
    });
    expect(deleteButton).toBeInTheDocument();
  });

  /**
   * Test: Aplicación correcta de clases CSS para todo completado
   *
   * Verifica que los estilos de estado completado se apliquen correctamente:
   * - Contenedor con opacidad reducida
   * - Checkbox con colores emerald
   * - Texto con color slate y tachado
   *
   * @test {HTMLElement} container - Contenedor con clases de completado
   * @test {HTMLElement} checkbox - Checkbox con clases de completado
   * @test {HTMLElement} text - Texto con clases de completado
   */
  it("applies correct CSS classes for completed todo", () => {
    const { container } = render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Verifica el contenedor principal
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass(
      "bg-white",
      "border-gray-200",
      "opacity-75"
    );

    // Verifica el checkbox
    const checkbox = screen.getByRole("button", {
      name: /marcar como pendiente/i,
    });
    expect(checkbox).toHaveClass("bg-green-500");

    // Verifica el texto
    const todoText = screen.getByText("Implementar autenticación de usuarios");
    expect(todoText).toHaveClass("text-gray-500", "line-through");
  });

  /**
   * Test: Aplicación correcta de clases CSS para todo pendiente
   *
   * Verifica que los estilos de estado pendiente se apliquen correctamente:
   * - Contenedor con fondo normal y hover
   * - Checkbox con borde slate
   * - Texto con color slate normal
   *
   * @test {HTMLElement} container - Contenedor con clases de pendiente
   * @test {HTMLElement} checkbox - Checkbox con clases de pendiente
   * @test {HTMLElement} text - Texto con clases de pendiente
   */
  it("applies correct CSS classes for pending todo", () => {
    const { container } = render(
      <TodoItem
        todo={pendingTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Verifica el contenedor principal
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("bg-white", "border-gray-200");
    expect(mainContainer).not.toHaveClass("opacity-75");

    // Verifica el checkbox
    const checkbox = screen.getByRole("button", {
      name: /marcar como completada/i,
    });
    expect(checkbox).toHaveClass("border-gray-400");
    expect(checkbox).not.toHaveClass("bg-green-500");

    // Verifica el texto
    const todoText = screen.getByText("Crear componentes reutilizables");
    expect(todoText).toHaveClass("text-gray-900");
    expect(todoText).not.toHaveClass("line-through");
  });

  /**
   * Test: Funcionalidad del callback onToggle
   *
   * Verifica que el callback onToggle se ejecute correctamente
   * cuando se hace clic en el checkbox.
   *
   * @test {Function} onToggle - Callback de toggle
   */
  it("calls onToggle when checkbox is clicked", () => {
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("button", {
      name: /marcar como pendiente/i,
    });
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  /**
   * Test: Funcionalidad del callback onDelete
   *
   * Verifica que el callback onDelete se ejecute correctamente
   * cuando se hace clic en el botón de eliminar.
   *
   * @test {Function} onDelete - Callback de delete
   */
  it("calls onDelete when delete button is clicked", () => {
    render(
      <TodoItem
        todo={pendingTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", {
      name: /eliminar tarea/i,
    });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(2);
  });

  /**
   * Test: Estructura semántica correcta
   *
   * Verifica que el componente mantenga una estructura HTML semántica:
   * - Contenedor principal con clases apropiadas
   * - Botones con aria-labels apropiados
   * - Elementos de información bien estructurados
   *
   * @test {HTMLElement} container - Contenedor principal del componente
   * @test {HTMLElement} buttons - Botones con accesibilidad
   */
  it("has proper semantic structure", () => {
    const { container } = render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Verifica el contenedor principal
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("rounded-xl", "border", "transition-all");

    // Verifica que los botones tengan aria-labels
    const checkbox = screen.getByRole("button", {
      name: /marcar como pendiente/i,
    });
    const deleteButton = screen.getByRole("button", {
      name: /eliminar tarea/i,
    });

    expect(checkbox).toHaveAttribute("aria-label");
    expect(deleteButton).toHaveAttribute("aria-label");
  });

  /**
   * Test: Renderizado sin callbacks opcionales
   *
   * Verifica que el componente se renderice correctamente
   * cuando no se proporcionan los callbacks opcionales.
   *
   * @test {HTMLElement} component - Componente sin callbacks
   */
  it("renders correctly without optional callbacks", () => {
    render(<TodoItem todo={completedTodo} />);

    // Verifica que el componente se renderice
    expect(
      screen.getByText("Implementar autenticación de usuarios")
    ).toBeInTheDocument();

    // Verifica que los botones estén presentes
    const checkbox = screen.getByRole("button", {
      name: /marcar como pendiente/i,
    });
    const deleteButton = screen.getByRole("button", {
      name: /eliminar tarea/i,
    });

    expect(checkbox).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  /**
   * Test: Clases de hover y transición
   *
   * Verifica que el componente tenga las clases CSS necesarias
   * para efectos de hover y transiciones suaves.
   *
   * @test {HTMLElement} container - Contenedor con clases de hover
   */
  it("has hover and transition classes", () => {
    const { container } = render(
      <TodoItem
        todo={pendingTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("transition-all", "duration-200");

    // Para todos pendientes, verifica clases de hover
    expect(mainContainer).toHaveClass(
      "hover:shadow-md", "hover:border-gray-300"
    );
  });

  /**
   * Test: Accesibilidad del checkbox
   *
   * Verifica que el checkbox tenga los atributos de accesibilidad
   * correctos para usuarios con discapacidades.
   *
   * @test {HTMLElement} checkbox - Checkbox con atributos de accesibilidad
   */
  it("has proper accessibility attributes for checkbox", () => {
    render(
      <TodoItem
        todo={pendingTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole("button", {
      name: /marcar como completada/i,
    });
    expect(checkbox).toHaveAttribute("aria-label", "Marcar como completada");
  });

  /**
   * Test: Accesibilidad del botón de eliminar
   *
   * Verifica que el botón de eliminar tenga los atributos de accesibilidad
   * correctos para usuarios con discapacidades.
   *
   * @test {HTMLElement} deleteButton - Botón de eliminar con atributos de accesibilidad
   */
  it("has proper accessibility attributes for delete button", () => {
    render(
      <TodoItem
        todo={pendingTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", {
      name: /eliminar tarea/i,
    });
    expect(deleteButton).toHaveAttribute("aria-label", "Eliminar tarea");
  });
});
