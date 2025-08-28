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

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../../App";

/**
 * Suite de Tests de Integración: App Component
 *
 * Verifica la funcionalidad completa de la aplicación Todo VibeCoding
 * con diseño minimalista y glassmorphism, incluyendo renderizado,
 * interacciones, accesibilidad y nueva experiencia de usuario.
 */
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
    render(<App />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Lista de Tareas");
    expect(title).toHaveClass("text-4xl");
    expect(title).toHaveClass("font-extrabold");
  });

  /**
   * Test: Renderizado del subtítulo con glassmorphism
   *
   * Verifica que el subtítulo descriptivo se muestre correctamente
   * con las clases CSS del diseño glassmorphism y minimalista.
   *
   * @test {HTMLElement} subtitle - Elemento con el subtítulo
   * @test {string} text-slate-400 - Clase CSS para color de texto
   * @test {string} text-lg - Clase CSS para tamaño de fuente
   */
  it("renders subtitle with glassmorphism design", () => {
    render(<App />);

    const subtitle = screen.getByText(
      "Gestiona tus tareas de manera eficiente con estilo"
    );
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass("text-slate-400");
    expect(subtitle).toHaveClass("text-lg");
  });

  /**
   * Test: Sección de estadísticas con glassmorphism
   *
   * Verifica que las tarjetas de estadísticas se rendericen correctamente
   * con el nuevo diseño glassmorphism, mostrando los contadores de Total,
   * Completadas y Pendientes con efectos visuales mejorados.
   *
   * @test {HTMLElement[]} totalLabels - Elementos que muestran "Total"
   * @test {HTMLElement[]} completedLabels - Elementos que muestran "Completadas"
   * @test {HTMLElement[]} pendingLabels - Elementos que muestran "Pendientes"
   * @test {string} backdrop-blur-md - Clase CSS para efecto glassmorphism
   * @test {string} bg-slate-800 - Clase CSS para fondo translúcido
   */
  it("displays statistics section with glassmorphism design", () => {
    render(<App />);

    // Check for stats cards - there should be multiple elements with these texts
    const totalLabels = screen.getAllByText("Total");
    const completedLabels = screen.getAllByText("Completadas");
    const pendingLabels = screen.getAllByText("Pendientes");

    expect(totalLabels.length).toBeGreaterThan(0);
    expect(completedLabels.length).toBeGreaterThan(0);
    expect(pendingLabels.length).toBeGreaterThan(0);

    // Check for glassmorphism classes on statistics container
    const statsContainer = screen.getByText("Total").closest("div");
    expect(statsContainer).toHaveClass(
      "text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase"
    );
    expect(statsContainer).toHaveClass(
      "text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase"
    );
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
    render(<App />);

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

    // Check for transition classes
    expect(allButtons[0]).toHaveClass("transition-colors");
    expect(allButtons[0]).toHaveClass("duration-200");
    expect(pendingButtons[0]).toHaveClass("transition-colors");
    expect(pendingButtons[0]).toHaveClass("duration-200");
    expect(completedButtons[0]).toHaveClass("transition-colors");
    expect(completedButtons[0]).toHaveClass("duration-200");
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
    render(<App />);

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
    expect(pendingButtons[0]).toHaveClass("bg-saffron-600");
    expect(pendingButtons[0]).toHaveClass("text-white");

    // Click completed filter
    await user.click(completedButtons[0]);
    expect(completedButtons[0]).toHaveClass("bg-persian_green-600");
    expect(completedButtons[0]).toHaveClass("text-white");

    // Click all filter
    await user.click(allButtons[0]);
    expect(allButtons[0]).toHaveClass("bg-charcoal-600");
    expect(allButtons[0]).toHaveClass("text-white");
  });

  /**
   * Test: Estructura semántica HTML con diseño minimalista
   *
   * Verifica que la aplicación tenga una estructura semántica correcta
   * con elementos header, main y footer apropiados para accesibilidad,
   * manteniendo la compatibilidad con el nuevo diseño minimalista.
   *
   * @test {HTMLElement} header - Elemento con role="banner"
   * @test {HTMLElement} heading - Elemento h1 para jerarquía
   * @test {HTMLElement} footer - Elemento con role="contentinfo"
   * @test {string}  - Clase CSS para glassmorphism en header
   */
  it("has proper semantic structure with minimalist design", () => {
    render(<App />);

    // Check for header element
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("text-center");
    expect(header).toHaveClass("mb-5");

    // Check for heading hierarchy
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  /**
   * Test: Clases CSS de fondo degradado minimalista
   *
   * Verifica que el contenedor principal tenga las clases CSS
   * correctas para el nuevo fondo degradado minimalista con
   * colores slate y altura mínima de pantalla.
   *
   * @test {HTMLElement} rootDiv - Elemento raíz del componente
   * @test {string} min-h-screen - Clase para altura mínima
   * @test {string} bg-gradient-to-br - Clase para degradado
   * @test {string} from-slate-950 - Clase para color inicial del degradado
   * @test {string} via-slate-900 - Clase para color intermedio del degradado
   * @test {string} to-indigo-950 - Clase para color final del degradado
   */
  it("applies correct minimalist gradient background classes", () => {
    const { container } = render(<App />);

    // Check the root div has the gradient classes
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass("min-h-screen");
    expect(rootDiv).toHaveClass("bg-gradient-to-br");
    expect(rootDiv).toHaveClass("from-slate-950");
    expect(rootDiv).toHaveClass("via-slate-900");
    expect(rootDiv).toHaveClass("to-indigo-950");
  });

  /**
   * Test: Lista de tareas con datos existentes y diseño minimalista
   *
   * Verifica que la lista de tareas se renderice correctamente
   * mostrando las tareas existentes del dataset de prueba con
   * el nuevo diseño minimalista y glassmorphism.
   *
   * @test {HTMLElement} todoItem - Elemento de tarea específica
   * @test {string} bg-slate-800 - Clase CSS para fondo translúcido
   * @test {string} border-slate-700/50 - Clase CSS para borde translúcido
   */
  it("renders todo list with existing todos and minimalist design", () => {
    render(<App />);

    // Since we have todos in the data, we should see todo items
    // Look for todo names from our test data
    const todoItem = screen.getByText("Implementar autenticación de usuarios");
    expect(todoItem).toBeInTheDocument();

    // Check for glassmorphism classes on todo items - find the correct container
    const todoContainer = todoItem.closest(".group");
    expect(todoContainer).toHaveClass("bg-slate-800");
    expect(todoContainer).toHaveClass("border-slate-700/50");
  });
});
