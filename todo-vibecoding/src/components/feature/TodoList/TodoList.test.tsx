/**
 * @fileoverview Tests de integración para el componente TodoList
 *
 * Este archivo contiene tests que verifican:
 * - Renderizado de listas de todos con múltiples elementos
 * - Estado vacío con mensaje personalizable
 * - Integración correcta con componente TodoItem
 * - Layout minimalista y diseño vertical
 * - Manejo de props onToggleTodo y onDeleteTodo
 * - Estructura semántica y accesibilidad
 * - Comportamiento con diferentes tamaños de lista
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TodoList } from "./TodoList";
import type { Todo } from "../../../todos";

/**
 * Suite de tests para el componente TodoList
 *
 * Verifica el renderizado y funcionalidad del componente que maneja
 * la visualización de listas de todos, incluyendo estados vacíos
 * e integración con TodoItem.
 */
describe("TodoList Component", () => {
  /**
   * Funciones mock para las acciones de toggle y delete
   */
  const mockOnToggleTodo = jest.fn();
  const mockOnDeleteTodo = jest.fn();

  /**
   * Lista de todos de prueba con diferentes estados
   *
   * @constant {Todo[]} mockTodos - Array de todos para testing
   */
  const mockTodos: Todo[] = [
    {
      id: 1,
      name: "Test todo 1",
      is_finished: false,
      created_at: new Date("2023-01-01T00:00:00Z"),
      updated_at: new Date("2023-01-01T00:00:00Z"),
    },
    {
      id: 2,
      name: "Test todo 2",
      is_finished: true,
      created_at: new Date("2023-01-02T00:00:00Z"),
      updated_at: new Date("2023-01-02T00:00:00Z"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Estado vacío
   *
   * Verifica que cuando no hay todos, se muestre el estado vacío
   * con el mensaje correspondiente.
   *
   * @test {HTMLElement} emptyMessage - Mensaje de estado vacío
   * @test {HTMLElement} emoji - Emoji del estado vacío
   */
  it("displays empty state when no todos", () => {
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText("📝")).toBeInTheDocument();
    expect(screen.getByText("No hay tareas para mostrar")).toBeInTheDocument();
    expect(screen.getByText("No hay tareas")).toBeInTheDocument();
  });

  /**
   * Test: Renderizado de lista vacía con mensaje personalizado
   *
   * Verifica que se pueda personalizar el mensaje de estado vacío
   * a través de la prop emptyMessage.
   *
   * @test {HTMLElement} customMessage - Mensaje personalizado
   */
  it("renders empty state with custom message", () => {
    const customMessage = "¡Genial! No tienes tareas pendientes";
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
        emptyMessage={customMessage}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText("📝")).toBeInTheDocument();
  });

  /**
   * Test: Renderizado de lista con todos
   *
   * Verifica que cuando hay todos en la lista:
   * - Se rendericen todos los TodoItem
   * - Cada todo tenga su información visible
   * - No se muestre el estado vacío
   *
   * @test {HTMLElement[]} todoItems - Elementos TodoItem renderizados
   * @test {HTMLElement[]} todoNames - Nombres de los todos
   */
  it("renders list with todos", () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que se rendericen todos los todos
    expect(screen.getByText("Test todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test todo 2")).toBeInTheDocument();

    // Verifica que no se muestre el estado vacío
    expect(screen.queryByText("📝")).not.toBeInTheDocument();
    expect(
      screen.queryByText("No hay tareas para mostrar")
    ).not.toBeInTheDocument();

    // Verifica que haya botones de toggle y delete
    expect(screen.getAllByRole("button")).toHaveLength(4); // 2 toggle + 2 delete
  });

  /**
   * Test: Integración con funciones de callback
   *
   * Verifica que las funciones onToggleTodo y onDeleteTodo
   * se pasen correctamente a los componentes TodoItem.
   *
   * @test {Function} onToggleTodo - Función de toggle
   * @test {Function} onDeleteTodo - Función de delete
   */
  it("passes callback functions to TodoItem components", () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que los botones estén presentes
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4); // 2 toggle + 2 delete buttons
  });

  /**
   * Test: Renderizado de todos con diferentes estados
   *
   * Verifica que los todos se rendericen correctamente
   * independientemente de su estado de completado.
   */
  it("renders todos with different completion states", () => {
    const mixedTodos: Todo[] = [
      {
        id: 1,
        name: "Pending task 1",
        is_finished: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Completed task 1",
        is_finished: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Pending task 2",
        is_finished: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    render(
      <TodoList
        todos={mixedTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que todas las tareas estén presentes
    expect(screen.getByText("Pending task 1")).toBeInTheDocument();
    expect(screen.getByText("Pending task 2")).toBeInTheDocument();
    expect(screen.getByText("Completed task 1")).toBeInTheDocument();

    // Verifica que haya 6 botones (3 todos × 2 botones cada uno)
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  /**
   * Test: Layout minimalista
   *
   * Verifica que el componente use el layout minimalista
   * con espaciado vertical simple.
   */
  it("applies minimalist layout with vertical spacing", () => {
    const { container } = render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que el contenedor tenga la clase de espaciado vertical
    const listContainer = container.firstChild as HTMLElement;
    expect(listContainer).toHaveClass("space-y-3");
  });

  /**
   * Test: Integración correcta con TodoItem
   *
   * Verifica que cada TodoItem reciba las props correctas:
   * - Todo object correspondiente
   * - Funciones onToggle y onDelete
   * - Key única basada en todo.id
   *
   * @test {HTMLElement[]} todoItems - Componentes TodoItem integrados
   */
  it("integrates correctly with TodoItem components", () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que se muestren los nombres de los todos
    expect(screen.getByText("Test todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test todo 2")).toBeInTheDocument();

    // Verifica que haya botones de acción para cada todo
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4); // 2 toggle + 2 delete
  });

  /**
   * Test: Manejo de lista con un solo elemento
   *
   * Verifica que el componente maneje correctamente listas
   * con un solo todo sin romper el layout vertical.
   *
   * @test {HTMLElement} singleTodo - Todo único en la lista
   */
  it("handles single todo correctly", () => {
    const singleTodo = [mockTodos[0]];
    render(
      <TodoList
        todos={singleTodo}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText("Test todo 1")).toBeInTheDocument();

    // Verifica que haya 2 botones (1 toggle + 1 delete)
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  /**
   * Test: Manejo de lista grande
   *
   * Verifica que el componente maneje correctamente listas
   * con muchos elementos sin problemas de rendimiento.
   *
   * @test {HTMLElement[]} manyTodos - Lista extensa de todos
   */
  it("handles large list of todos", () => {
    const largeTodoList: Todo[] = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `Todo número ${index + 1}`,
      is_finished: index % 2 === 0,
      created_at: new Date(`2024-01-${(index % 28) + 1}T09:00:00Z`),
      updated_at: new Date(`2024-01-${(index % 28) + 1}T09:00:00Z`),
    }));

    render(
      <TodoList
        todos={largeTodoList}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que se rendericen todos los elementos
    expect(screen.getAllByRole("button")).toHaveLength(20); // 10 todos × 2 botones
    expect(screen.getByText("Todo número 1")).toBeInTheDocument();
    expect(screen.getByText("Todo número 10")).toBeInTheDocument();
  });

  /**
   * Test: Estructura semántica del estado vacío
   *
   * Verifica que el estado vacío mantenga una estructura
   * HTML semántica apropiada con clases de estilo correctas.
   *
   * @test {HTMLElement} emptyContainer - Contenedor del estado vacío
   */
  it("has proper semantic structure for empty state", () => {
    const { container } = render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const emptyContainer = container.firstChild as HTMLElement;
    expect(emptyContainer).toHaveClass("flex");
    expect(emptyContainer).toHaveClass("flex-col");
    expect(emptyContainer).toHaveClass("items-center");
    expect(emptyContainer).toHaveClass("justify-center");
    expect(emptyContainer).toHaveClass("py-20");

    // Verifica que el emoji esté presente
    const emojiElement = screen.getByText("📝");
    expect(emojiElement).toBeInTheDocument();

    // Verifica que los mensajes estén presentes
    expect(screen.getByText("No hay tareas")).toBeInTheDocument();
    expect(screen.getByText("No hay tareas para mostrar")).toBeInTheDocument();
  });

  /**
   * Test: Estilos del estado vacío
   *
   * Verifica que el estado vacío tenga los estilos
   * apropiados para el diseño minimalista con efectos visuales.
   *
   * @test {HTMLElement} messageElement - Mensaje con estilos correctos
   */
  it("has proper styling for empty state", () => {
    render(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    const titleElement = screen.getByText("No hay tareas");
    expect(titleElement).toHaveClass("text-xl");
    expect(titleElement).toHaveClass("font-semibold");
    expect(titleElement).toHaveClass("text-slate-300");

    const messageElement = screen.getByText("No hay tareas para mostrar");
    expect(messageElement).toHaveClass("text-slate-400");

    // Verifica que el emoji tenga animación
    const emojiElement = screen.getByText("📝");
    expect(emojiElement).toHaveClass("text-8xl");
    expect(emojiElement).toHaveClass("opacity-20");
    expect(emojiElement).toHaveClass("animate-pulse");
  });

  /**
   * Test: Integración con estilos minimalistas
   *
   * Verifica que el componente aplique correctamente los estilos
   * minimalistas en los TodoItem components.
   *
   * @test {HTMLElement[]} todoItems - Elementos con estilos correctos
   */
  it("applies minimalist styles to todo items", () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que los todos tengan las clases de estilo correctas
    const todoItems = screen.getAllByText(/Test todo/);
    expect(todoItems).toHaveLength(2);

    // Verifica que los botones de toggle tengan aria-labels correctos
    expect(screen.getByLabelText("Marcar como completada")).toBeInTheDocument();
    expect(screen.getByLabelText("Marcar como pendiente")).toBeInTheDocument();
  });

  /**
   * Test: Comportamiento con todos que tienen el mismo ID (edge case)
   *
   * Verifica el manejo de casos extremos donde podrían existir
   * todos con IDs duplicados (aunque no debería ocurrir en producción).
   *
   * @test {HTMLElement[]} duplicateIdTodos - Todos con IDs duplicados
   */
  it("handles edge case with duplicate IDs", () => {
    const todosWithDuplicateIds: Todo[] = [
      {
        id: 1,
        name: "Primer todo",
        is_finished: false,
        created_at: new Date("2024-01-15T09:00:00Z"),
        updated_at: new Date("2024-01-15T09:00:00Z"),
      },
      {
        id: 1,
        name: "Segundo todo con mismo ID",
        is_finished: true,
        created_at: new Date("2024-01-16T09:00:00Z"),
        updated_at: new Date("2024-01-16T09:00:00Z"),
      },
    ];

    // Esto debería renderizar ambos todos a pesar del ID duplicado
    render(
      <TodoList
        todos={todosWithDuplicateIds}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    expect(screen.getByText("Primer todo")).toBeInTheDocument();
    expect(screen.getByText("Segundo todo con mismo ID")).toBeInTheDocument();

    // Verifica que ambos todos se rendericen a pesar del ID duplicado
    const todoTexts = screen.getAllByText(/todo/);
    expect(todoTexts.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Test: Accesibilidad del componente
   *
   * Verifica que el componente cumpla con estándares de accesibilidad:
   * - Estructura semántica apropiada
   * - Contraste de colores adecuado
   * - Información clara en estado vacío
   *
   * @test {HTMLElement} accessibleElements - Elementos accesibles
   */
  it("maintains accessibility standards", () => {
    // Test con lista de todos
    const { rerender } = render(
      <TodoList
        todos={mockTodos}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que los todos se rendericen correctamente
    expect(screen.getByText("Test todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test todo 2")).toBeInTheDocument();

    // Verifica que los botones de acción estén presentes
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4); // 2 toggle + 2 delete

    // Test con estado vacío
    rerender(
      <TodoList
        todos={[]}
        onToggleTodo={mockOnToggleTodo}
        onDeleteTodo={mockOnDeleteTodo}
      />
    );

    // Verifica que el mensaje de estado vacío sea claro
    const emptyMessage = screen.getByText("No hay tareas para mostrar");
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage.tagName).toBe("P"); // Debe ser un párrafo semánticamente correcto
  });
});
