/**
 * @fileoverview Tests de integración para el sistema completo de TODOs
 *
 * Este archivo contiene tests de integración que verifican:
 * - Interacción entre componentes (TodoList, FilterButtons, StatsSection)
 * - Flujo completo de creación, edición y eliminación de todos
 * - Sincronización de estados entre componentes
 * - Persistencia de datos en localStorage
 * - Filtrado y estadísticas en tiempo real
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../../App";

/**
 * Suite de tests de integración para el sistema completo de TODOs
 *
 * Verifica que todos los componentes trabajen correctamente en conjunto
 * y que el flujo de datos sea consistente a través de la aplicación.
 */
describe("Todo System Integration Tests", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorage.clear();
  });

  /**
   * @test Flujo completo de creación de TODO
   * Verifica que al crear un TODO se actualicen correctamente
   * la lista, las estadísticas y los filtros.
   */
  it("should create a new todo and update all components", async () => {
    render(<App />);

    // Verificar estado inicial
    expect(screen.getByText("Total: 0")).toBeInTheDocument();
    expect(screen.getByText("Pendientes: 0")).toBeInTheDocument();
    expect(screen.getByText("Completadas: 0")).toBeInTheDocument();

    // Crear un nuevo TODO
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");
    await user.type(input, "Test integration todo");
    await user.keyboard("{Enter}");

    // Verificar que se actualicen las estadísticas
    await waitFor(() => {
      expect(screen.getByText("Total: 1")).toBeInTheDocument();
      expect(screen.getByText("Pendientes: 1")).toBeInTheDocument();
      expect(screen.getByText("Completadas: 0")).toBeInTheDocument();
    });

    // Verificar que aparezca en la lista
    expect(screen.getByText("Test integration todo")).toBeInTheDocument();
  });

  /**
   * @test Flujo de completar TODO
   * Verifica que al marcar un TODO como completado se actualicen
   * correctamente las estadísticas y el filtrado.
   */
  it("should complete a todo and update statistics", async () => {
    render(<App />);

    // Crear un TODO
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");
    await user.type(input, "Todo to complete");
    await user.keyboard("{Enter}");

    // Marcar como completado
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // Verificar estadísticas actualizadas
    await waitFor(() => {
      expect(screen.getByText("Total: 1")).toBeInTheDocument();
      expect(screen.getByText("Pendientes: 0")).toBeInTheDocument();
      expect(screen.getByText("Completadas: 1")).toBeInTheDocument();
    });
  });

  /**
   * @test Funcionalidad de filtros
   * Verifica que los filtros funcionen correctamente y muestren
   * solo los TODOs correspondientes al filtro seleccionado.
   */
  it("should filter todos correctly", async () => {
    render(<App />);

    // Crear múltiples TODOs
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");

    await user.type(input, "Pending todo 1");
    await user.keyboard("{Enter}");

    await user.type(input, "Pending todo 2");
    await user.keyboard("{Enter}");

    // Completar uno de los TODOs
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    // Verificar filtro "Todas"
    expect(screen.getByText("Pending todo 1")).toBeInTheDocument();
    expect(screen.getByText("Pending todo 2")).toBeInTheDocument();

    // Filtrar por pendientes
    const pendingButton = screen.getByText("Pendientes");
    await user.click(pendingButton);

    await waitFor(() => {
      expect(screen.queryByText("Pending todo 1")).not.toBeInTheDocument();
      expect(screen.getByText("Pending todo 2")).toBeInTheDocument();
    });

    // Filtrar por completadas
    const completedButton = screen.getByText("Completadas");
    await user.click(completedButton);

    await waitFor(() => {
      expect(screen.getByText("Pending todo 1")).toBeInTheDocument();
      expect(screen.queryByText("Pending todo 2")).not.toBeInTheDocument();
    });
  });

  /**
   * @test Persistencia en localStorage
   * Verifica que los TODOs se guarden y recuperen correctamente
   * del localStorage.
   */
  it("should persist todos in localStorage", async () => {
    const { unmount } = render(<App />);

    // Crear un TODO
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");
    await user.type(input, "Persistent todo");
    await user.keyboard("{Enter}");

    // Verificar que se guardó en localStorage
    const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    expect(savedTodos).toHaveLength(1);
    expect(savedTodos[0].text).toBe("Persistent todo");

    // Desmontar y volver a montar el componente
    unmount();
    render(<App />);

    // Verificar que el TODO persiste
    expect(screen.getByText("Persistent todo")).toBeInTheDocument();
    expect(screen.getByText("Total: 1")).toBeInTheDocument();
  });

  /**
   * @test Eliminación de TODOs
   * Verifica que al eliminar un TODO se actualicen correctamente
   * todas las estadísticas y la lista.
   */
  it("should delete todos and update all components", async () => {
    render(<App />);

    // Crear múltiples TODOs
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");

    await user.type(input, "Todo to delete");
    await user.keyboard("{Enter}");

    await user.type(input, "Todo to keep");
    await user.keyboard("{Enter}");

    // Verificar estado inicial
    expect(screen.getByText("Total: 2")).toBeInTheDocument();

    // Eliminar un TODO
    const deleteButtons = screen.getAllByLabelText(/eliminar/i);
    await user.click(deleteButtons[0]);

    // Verificar que se actualicen las estadísticas
    await waitFor(() => {
      expect(screen.getByText("Total: 1")).toBeInTheDocument();
      expect(screen.queryByText("Todo to delete")).not.toBeInTheDocument();
      expect(screen.getByText("Todo to keep")).toBeInTheDocument();
    });
  });

  /**
   * @test Edición de TODOs
   * Verifica que la funcionalidad de edición funcione correctamente
   * y mantenga la consistencia en todos los componentes.
   */
  it("should edit todos correctly", async () => {
    render(<App />);

    // Crear un TODO
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");
    await user.type(input, "Original text");
    await user.keyboard("{Enter}");

    // Activar modo edición
    const editButton = screen.getByLabelText(/editar/i);
    await user.click(editButton);

    // Editar el texto
    const editInput = screen.getByDisplayValue("Original text");
    await user.clear(editInput);
    await user.type(editInput, "Edited text");
    await user.keyboard("{Enter}");

    // Verificar que el texto se actualizó
    await waitFor(() => {
      expect(screen.getByText("Edited text")).toBeInTheDocument();
      expect(screen.queryByText("Original text")).not.toBeInTheDocument();
    });

    // Verificar que las estadísticas se mantienen
    expect(screen.getByText("Total: 1")).toBeInTheDocument();
  });

  /**
   * @test Accesibilidad del sistema completo
   * Verifica que toda la aplicación sea accesible mediante
   * navegación por teclado y lectores de pantalla.
   */
  it("should be fully accessible via keyboard navigation", async () => {
    render(<App />);

    // Crear un TODO usando solo teclado
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");
    input.focus();
    await user.type(input, "Keyboard accessible todo");
    await user.keyboard("{Enter}");

    // Navegar a los botones de filtro usando Tab
    await user.keyboard("{Tab}");
    await user.keyboard("{Tab}");

    // Verificar que los elementos tengan focus
    const pendingButton = screen.getByText("Pendientes");
    expect(pendingButton).toHaveFocus();

    // Activar filtro con Enter
    await user.keyboard("{Enter}");

    // Verificar que el filtro se aplicó
    expect(screen.getByText("Keyboard accessible todo")).toBeInTheDocument();
  });

  /**
   * @test Manejo de estados edge case
   * Verifica el comportamiento del sistema en casos límite
   * como listas vacías, todos completados, etc.
   */
  it("should handle edge cases correctly", async () => {
    render(<App />);

    // Verificar estado inicial (lista vacía)
    expect(screen.getByText("No hay tareas disponibles")).toBeInTheDocument();

    // Crear y completar todos los TODOs
    const input = screen.getByPlaceholderText("Agregar nueva tarea...");
    await user.type(input, "Todo 1");
    await user.keyboard("{Enter}");

    await user.type(input, "Todo 2");
    await user.keyboard("{Enter}");

    // Completar todos
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Filtrar por pendientes (debería mostrar mensaje vacío)
    const pendingButton = screen.getByText("Pendientes");
    await user.click(pendingButton);

    await waitFor(() => {
      expect(screen.getByText("No hay tareas pendientes")).toBeInTheDocument();
    });

    // Verificar estadísticas finales
    expect(screen.getByText("Total: 2")).toBeInTheDocument();
    expect(screen.getByText("Pendientes: 0")).toBeInTheDocument();
    expect(screen.getByText("Completadas: 2")).toBeInTheDocument();
  });
});
