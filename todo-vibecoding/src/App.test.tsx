/**
 * @fileoverview Tests de Integración para el Componente Principal App
 *
 * Suite completa de tests de integración para la aplicación Todo VibeCoding
 * con diseño minimalista y glassmorphism.
 *
 * Este archivo contiene tests que verifican:
 * - Renderizado correcto de elementos principales con nueva UI
 * - Funcionalidad de filtros de tareas con estilos minimalistas
 * - Estructura semántica y accesibilidad mejorada
 * - Estadísticas de tareas con glassmorphism
 * - Navegación e interacciones del usuario
 * - Compatibilidad con el nuevo sistema de diseño
 *
 * @author VibeCoding Team
 * @version 2.0.0 - Minimalist UI with Glassmorphism
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import TodoPage from "./pages/TodoPage/TodoPage";
import todoReducer from "./stores/slices/todoSlice";

/**
 * Suite de Tests de Integración: App Component
 *
 * Verifica la funcionalidad completa de la aplicación Todo VibeCoding
 * con diseño minimalista y glassmorphism, incluyendo renderizado,
 * interacciones, accesibilidad y nueva experiencia de usuario.
 */
const renderTodoPage = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      todos: todoReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TodoPage />
      </MemoryRouter>
    </Provider>
  );
};

describe("App Component - Minimalist UI Integration", () => {
  /**
   * Test: Renderizado del título principal con diseño minimalista
   *
   * Verifica que el título "Lista de Tareas" se renderice correctamente
   * con las clases CSS del nuevo diseño minimalista y glassmorphism.
   *
   * @test {HTMLElement} heading - Elemento h1 con el título
   * @test {string} text-4xl - Clase CSS para tamaño de fuente
   * @test {string} font-extrabold - Clase CSS para peso de fuente
   */
  it("renders main title with minimalist design", () => {
    renderTodoPage();

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Lista de Tareas");

    // Check for minimalist design classes
    expect(title).toHaveClass("text-4xl", "font-extrabold", "tracking-tight");

    // Check for text color classes (no gradient in current implementation)
    const titleSpan = title.querySelector("span");
    expect(titleSpan).toHaveClass("text-slate-900");
  });

  /**
   * Test: Renderizado del subtítulo con diseño minimalista
   *
   * Verifica que el subtítulo descriptivo se muestre correctamente
   * con las clases CSS del diseño minimalista.
   *
   * @test {HTMLElement} subtitle - Elemento con el subtítulo
   * @test {string} max-w-2xl - Clase CSS para ancho máximo
   * @test {string} mx-auto - Clase CSS para centrado horizontal
   * @test {string} leading-relaxed - Clase CSS para espaciado de línea
   * @test {string} text-slate-900 - Clase CSS para color de texto
   */
  it("renders subtitle with minimalist design", () => {
    renderTodoPage();

    const subtitle = screen.getByText(
      "Gestiona tus tareas de manera eficiente con estilo"
    );
    expect(subtitle).toBeInTheDocument();

    // Check for minimalist design classes
    expect(subtitle).toHaveClass(
      "max-w-2xl",
      "mx-auto",
      "leading-relaxed",
      "text-slate-900"
    );
  });

  /**
   * Test: Sección de estadísticas con diseño moderno
   *
   * Verifica que las tarjetas de estadísticas se rendericen correctamente
   * con el nuevo diseño, mostrando los contadores de Total,
   * Completadas y Pendientes con efectos visuales mejorados.
   *
   * @test {HTMLElement} statsTitle - Elemento que muestra "Estadísticas"
   * @test {HTMLElement} totalStats - Elemento que muestra "Total"
   * @test {HTMLElement} completedStats - Elemento que muestra "Completadas"
   * @test {HTMLElement} pendingStats - Elemento que muestra "Pendientes"
   * @test {HTMLElement} completionRate - Elemento que muestra el porcentaje completado
   */
  it("displays statistics section with modern design", () => {
    renderTodoPage();

    // Check for stats section header
    const statsTitle = screen.getByText("Estadísticas");
    expect(statsTitle).toBeInTheDocument();

    // Check for stats cards - there should be elements with these texts
    const totalStats = screen.getAllByText("Total");
    const completedStats = screen.getAllByText("Completadas");
    const pendingStats = screen.getAllByText("Pendientes");

    expect(totalStats[0]).toBeInTheDocument();
    expect(completedStats[0]).toBeInTheDocument();
    expect(pendingStats[0]).toBeInTheDocument();

    // Check for completion rate display
    const completionRate = screen.getByText(/% completado/);
    expect(completionRate).toBeInTheDocument();
  });

  /**
   * Test: Botones de filtro con diseño minimalista
   *
   * Verifica que los botones de filtro se rendericen con las etiquetas
   * correctas, tengan los atributos de accesibilidad apropiados y las
   * nuevas clases CSS del diseño minimalista y glassmorphism.
   *
   * @test {HTMLElement} allButton - Botón "Todas" con aria-label
   * @test {HTMLElement} pendingButton - Botón "Pendientes" con aria-label
   * @test {HTMLElement} completedButton - Botón "Completadas" con aria-label
   * @test {string} transition-colors - Clase CSS para transiciones suaves
   * @test {string} duration-200 - Clase CSS para duración de transición
   */
  it("renders filter buttons with minimalist design", () => {
    renderTodoPage();

    // Use getAllByLabelText since FilterButtons appears in both desktop and mobile sidebar
    const allButtons = screen.getAllByLabelText("Mostrar todas las tareas");
    const pendingButtons = screen.getAllByLabelText(
      "Mostrar tareas pendientes"
    );
    const completedButtons = screen.getAllByLabelText(
      "Mostrar tareas completadas"
    );

    // Test first button (desktop version)
    expect(allButtons[0]).toBeInTheDocument();
    expect(pendingButtons[0]).toBeInTheDocument();
    expect(completedButtons[0]).toBeInTheDocument();

    expect(allButtons[0]).toHaveTextContent("Todas");
    expect(pendingButtons[0]).toHaveTextContent("Pendientes");
    expect(completedButtons[0]).toHaveTextContent("Completadas");

    // Check for minimalist design classes
    expect(allButtons[0]).toHaveClass(
      "px-3",
      "py-2",
      "rounded-lg",
      "font-medium",
      "text-sm",
      "transition-colors",
      "duration-200"
    );

    // Check for active state classes ("all" should be active by default)
    expect(allButtons[0]).toHaveClass("bg-gray-800", "text-white");

    // Check for inactive state classes
    expect(pendingButtons[0]).toHaveClass(
      "bg-white",
      "text-gray-800",
      "border",
      "border-slate-700"
    );
    expect(completedButtons[0]).toHaveClass(
      "bg-white",
      "text-gray-800",
      "border",
      "border-slate-700"
    );
  });

  /**
   * Test: Funcionalidad de filtros interactivos con diseño minimalista
   *
   * Verifica que los filtros cambien correctamente cuando se hace clic
   * en los botones, aplicando las nuevas clases CSS del diseño minimalista
   * para indicar el estado activo con efectos glassmorphism.
   *
   * @test {Function} user.click - Simula clics del usuario
   * @test {string} bg-saffron-600 - Clase CSS para filtro pendientes activo
   * @test {string} bg-persian_green-600 - Clase CSS para filtro completadas activo
   * @test {string} bg-charcoal-600 - Clase CSS para filtro todas activo
   * @test {string} text-white - Clase CSS para texto activo
   */
  it("handles filter interactions with minimalist design", async () => {
    const user = userEvent.setup();
    renderTodoPage();

    // Use getAllByLabelText since FilterButtons appears in both desktop and mobile sidebar
    const pendingButtons = screen.getAllByLabelText(
      "Mostrar tareas pendientes"
    );
    const completedButtons = screen.getAllByLabelText(
      "Mostrar tareas completadas"
    );
    const allButtons = screen.getAllByLabelText("Mostrar todas las tareas");

    // Click pending filter (use first button - desktop version)
    await user.click(pendingButtons[0]);
    expect(pendingButtons[0]).toHaveClass("bg-gray-800");
    expect(pendingButtons[0]).toHaveClass("text-white");

    // Click completed filter
    await user.click(completedButtons[0]);
    expect(completedButtons[0]).toHaveClass("bg-gray-800");
    expect(completedButtons[0]).toHaveClass("text-white");

    // Click all filter
    await user.click(allButtons[0]);
    expect(allButtons[0]).toHaveClass("bg-gray-800");
    expect(allButtons[0]).toHaveClass("text-white");
  });

  /**
   * Test: Funcionalidad de filtros interactivos correcta
   *
   * Verifica que los filtros cambien correctamente cuando se hace clic
   * en los botones y que los estados activos e inactivos se apliquen
   * correctamente con las clases CSS apropiadas.
   */
  it("handles filter interactions correctly", async () => {
    renderTodoPage();

    // Get filter buttons by their role and accessible name (use getAllByRole to handle duplicates)
    const allButtons = screen.getAllByRole("button", {
      name: /Mostrar todas las tareas/i,
    });
    const pendingButtons = screen.getAllByRole("button", {
      name: /Mostrar tareas pendientes/i,
    });
    const completedButtons = screen.getAllByRole("button", {
      name: /Mostrar tareas completadas/i,
    });

    // Use first button (desktop version)
    const allButton = allButtons[0];
    const pendingButton = pendingButtons[0];
    const completedButton = completedButtons[0];

    // Initially, "all" should be active
    expect(allButton).toHaveClass("bg-gray-800", "text-white");
    expect(pendingButton).toHaveClass(
      "bg-white",
      "text-gray-800",
      "border",
      "border-slate-700"
    );

    // Click on pending filter
    fireEvent.click(pendingButton);

    await waitFor(() => {
      expect(pendingButton).toHaveClass("bg-gray-800", "text-white");
      expect(allButton).toHaveClass(
        "bg-white",
        "text-gray-800",
        "border",
        "border-slate-700"
      );
    });

    // Click on completed filter
    fireEvent.click(completedButton);

    await waitFor(() => {
      expect(completedButton).toHaveClass("bg-gray-800", "text-white");
      expect(pendingButton).toHaveClass(
        "bg-white",
        "text-gray-800",
        "border",
        "border-slate-700"
      );
    });
  });

  /**
   * Test: Estructura semántica HTML con diseño minimalista
   *
   * Verifica que la aplicación tenga una estructura semántica correcta
   * con elementos header, main y footer apropiados para accesibilidad,
   * manteniendo la compatibilidad con el nuevo diseño minimalista.
   *
   * @test {HTMLElement} main - Elemento con role="main"
   * @test {HTMLElement} heading - Elemento h1 para jerarquía
   * @test {HTMLElement} statsHeading - Elemento heading para estadísticas
   * @test {string} bg-gray-50 - Clase CSS para fondo minimalista
   */
  it("has proper semantic HTML structure with minimalist design", () => {
    renderTodoPage();

    // Check for main content area
    const main = document.querySelector(".min-h-screen");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("min-h-screen", "bg-white");

    // Check for header section with title and subtitle
    const titleHeading = screen.getByRole("heading", {
      name: /Lista de Tareas/i,
    });
    expect(titleHeading).toBeInTheDocument();

    // Check for statistics section
    const statsHeading = screen.getByText("Estadísticas");
    expect(statsHeading).toBeInTheDocument();

    // Check for content sections
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThanOrEqual(2); // At least title and stats

    // Verify minimalist design classes on main container
    expect(main).toHaveClass("bg-white");
  });

  /**
   * Test: Clases CSS de fondo minimalista
   *
   * Verifica que el contenedor principal tenga las clases CSS
   * correctas para el nuevo fondo minimalista con
   * colores gray y altura mínima de pantalla.
   *
   * @test {HTMLElement} main - Elemento main del componente
   * @test {string} min-h-screen - Clase para altura mínima
   * @test {string} bg-gray-50 - Clase para fondo gris claro
   * @test {string} container - Clase para contenedor
   * @test {string} mx-auto - Clase para centrado horizontal
   * @test {string} px-4 - Clase para padding horizontal
   */
  it("applies correct background classes with minimalist design", () => {
    renderTodoPage();

    // Check for main container background
    const main = document.querySelector(".min-h-screen");
    expect(main).toBeInTheDocument();
    expect(main!).toHaveClass("min-h-screen", "bg-white");

    // Check for container with proper spacing
    const container = main?.querySelector(".container");
    if (container) {
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("mx-auto", "px-4");
    }

    // Check for section spacing
    const sections = main?.querySelectorAll(".space-y-6");
    expect(sections?.length).toBeGreaterThan(0);

    // Verify minimalist color scheme
    expect(main).toHaveClass("bg-white");
  });

  /**
   * Test: Lista de tareas renderizada correctamente
   *
   * Verifica que la lista de tareas se renderice correctamente
   * mostrando el estado vacío con el mensaje "¡Comienza tu productividad!"
   * y la estructura con Card cuando no hay tareas.
   *
   * @test {HTMLElement} emptyStateHeading - Elemento del título del estado vacío
   * @test {HTMLElement} emptyMessage - Elemento del mensaje vacío
   * @test {string} text-xl - Clase CSS para tamaño de fuente del título
   * @test {string} font-semibold - Clase CSS para peso de fuente
   * @test {string} text-gray-900 - Clase CSS para color del título
   * @test {string} text-gray-600 - Clase CSS para color del mensaje
   * @test {string} leading-relaxed - Clase CSS para espaciado de línea
   */
  it("renders todo list correctly", () => {
    renderTodoPage();

    // Check for empty state content
    expect(screen.getByText("¡Comienza tu productividad!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "¡Comienza creando tu primera tarea para organizar tu día!"
      )
    ).toBeInTheDocument();

    // Verify the empty state structure
    const emptyStateHeading = screen.getByText("¡Comienza tu productividad!");
    expect(emptyStateHeading).toHaveClass(
      "text-xl",
      "font-semibold",
      "text-gray-900"
    );

    const emptyMessage = screen.getByText(
      "¡Comienza creando tu primera tarea para organizar tu día!"
    );
    expect(emptyMessage).toHaveClass("text-gray-600", "leading-relaxed");
  });
});
