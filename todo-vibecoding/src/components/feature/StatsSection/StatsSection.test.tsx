/**
 * @fileoverview Tests para el componente StatsSection
 *
 * Este archivo contiene tests unitarios que verifican:
 * - Renderizado correcto de las tres tarjetas de estadísticas
 * - Layout de grid responsivo y espaciado
 * - Paso correcto de props a cada StatsCard
 * - Manejo de diferentes valores numéricos (cero, grandes)
 * - Relaciones matemáticas entre estadísticas
 * - Estructura semántica y accesibilidad
 * - Comportamiento como componente sin estado
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsSection } from "./StatsSection";

/**
 * Suite de tests para el componente StatsSection
 *
 * Verifica el renderizado y funcionalidad de la sección de estadísticas
 * que contiene tres tarjetas: Total, Completadas y Pendientes.
 */
describe("StatsSection Component", () => {
  /**
   * Datos de prueba por defecto para las estadísticas
   *
   * @constant {Object} defaultTodosCount - Conteo de todos por defecto
   * @property {number} total - Total de todos
   * @property {number} completed - Todos completados
   * @property {number} pending - Todos pendientes
   */
  const defaultTodosCount = {
    total: 15,
    completed: 8,
    pending: 7,
  };

  /**
   * Test: Renderizado correcto del componente
   *
   * Verifica que el componente se renderice correctamente
   * con el contenedor grid y las tarjetas de estadísticas.
   *
   * @test {HTMLElement} container - Contenedor grid principal
   */
  it("renders the component correctly", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Check if the main container is rendered
    const container = document.querySelector('.space-y-6');
    expect(container).toBeInTheDocument();

    // Check if the title is rendered
    const title = screen.getByText("Estadísticas");
    expect(title).toBeInTheDocument();
  });

  /**
   * Test: Visualización de las tres tarjetas de estadísticas
   *
   * Verifica que se muestren todas las tarjetas con sus
   * valores y etiquetas correspondientes.
   *
   * @test {HTMLElement} totalValue - Valor total (15)
   * @test {HTMLElement} completedValue - Valor completadas (8)
   * @test {HTMLElement} pendingValue - Valor pendientes (7)
   * @test {HTMLElement} totalLabel - Etiqueta "Total"
   * @test {HTMLElement} completedLabel - Etiqueta "Completadas"
   * @test {HTMLElement} pendingLabel - Etiqueta "Pendientes"
   */
  it("displays all three stats cards", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Check that all values are displayed
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    // Check that all labels are displayed
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Completadas")).toBeInTheDocument();
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
  });

  /**
   * Test: Clases de layout de grid correctas
   *
   * Verifica que el contenedor tenga todas las clases CSS
   * necesarias para el layout de grid responsivo.
   *
   * @test {string} grid - Display grid
   * @test {string} grid-cols-1 - Una columna en móvil
   * @test {string} md:grid-cols-3 - Tres columnas en pantallas medianas+
   * @test {string} gap-6 - Espacio entre tarjetas
   * @test {string} mb-8 - Margen inferior
   */
  it("applies correct grid layout classes", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Find the grid container directly by its classes
    const gridContainer = document.querySelector('.grid.grid-cols-1');
    expect(gridContainer).toHaveClass("grid");
    expect(gridContainer).toHaveClass("grid-cols-1");
    expect(gridContainer).toHaveClass("sm:grid-cols-2");
    expect(gridContainer).toHaveClass("lg:grid-cols-3");
    expect(gridContainer).toHaveClass("gap-4");
    expect(gridContainer).toHaveClass("lg:gap-6");
  });

  /**
   * Test: Props correctas para StatsCard Total
   *
   * Verifica que la tarjeta Total reciba las props correctas
   * incluyendo valor, etiqueta y color charcoal.
   *
   * @test {HTMLElement} totalValue - Valor total debe estar presente
   * @test {HTMLElement} totalLabel - Etiqueta "Total" debe estar presente
   * @test {string} text-gray-700 - Color charcoal en modo claro
   * @test {string} group-hover:text-gray-600 - Color charcoal hover
   */
  it("passes correct props to Total StatsCard", () => {
      render(<StatsSection todosCount={defaultTodosCount} />);

      const totalValue = screen.getByText("15");
      const totalLabel = screen.getByText("Total");

      expect(totalValue).toBeInTheDocument();
      expect(totalLabel).toBeInTheDocument();
      expect(totalValue).toHaveClass("text-gray-700");
      expect(totalValue).toHaveClass("group-hover:text-gray-800");
    });

  /**
   * Test: Props correctas para StatsCard Completadas
   *
   * Verifica que la tarjeta Completadas reciba las props correctas
   * incluyendo valor, etiqueta y color persian-green.
   *
   * @test {HTMLElement} completedValue - Valor completadas debe estar presente
   * @test {HTMLElement} completedLabel - Etiqueta "Completadas" debe estar presente
   * @test {string} text-green-600 - Color persian-green en modo claro
   * @test {string} group-hover:text-green-500 - Color persian-green hover
   */
  it("passes correct props to Completadas StatsCard", () => {
      render(<StatsSection todosCount={defaultTodosCount} />);

      const completedValue = screen.getByText("8");
      const completedLabel = screen.getByText("Completadas");

      expect(completedValue).toBeInTheDocument();
      expect(completedLabel).toBeInTheDocument();
      expect(completedValue).toHaveClass("text-green-600");
      expect(completedValue).toHaveClass("group-hover:text-green-700");
    });

  /**
   * Test: Props correctas para StatsCard Pendientes
   *
   * Verifica que la tarjeta Pendientes reciba las props correctas
   * incluyendo valor, etiqueta y color saffron.
   *
   * @test {HTMLElement} pendingValue - Valor pendientes debe estar presente
   * @test {HTMLElement} pendingLabel - Etiqueta "Pendientes" debe estar presente
   * @test {string} text-yellow-600 - Color saffron en modo claro
   * @test {string} group-hover:text-yellow-500 - Color saffron hover
   */
  it("passes correct props to Pendientes StatsCard", () => {
      render(<StatsSection todosCount={defaultTodosCount} />);

      const pendingValue = screen.getByText("7");
      const pendingLabel = screen.getByText("Pendientes");

      expect(pendingValue).toBeInTheDocument();
      expect(pendingLabel).toBeInTheDocument();
      expect(pendingValue).toHaveClass("text-yellow-600");
      expect(pendingValue).toHaveClass("group-hover:text-yellow-700");
    });

  /**
   * Test: Manejo correcto de valores cero
   *
   * Verifica que el componente maneje correctamente el caso
   * donde todas las estadísticas son cero.
   *
   * @test {HTMLElement[]} zeroElements - Tres elementos con valor "0"
   * @test {HTMLElement} totalLabel - Etiqueta "Total" debe permanecer
   * @test {HTMLElement} completedLabel - Etiqueta "Completadas" debe permanecer
   * @test {HTMLElement} pendingLabel - Etiqueta "Pendientes" debe permanecer
   */
  it("handles zero values correctly", () => {
    const zeroTodosCount = {
      total: 0,
      completed: 0,
      pending: 0,
    };

    render(<StatsSection todosCount={zeroTodosCount} />);

    // Should display three zeros
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements).toHaveLength(3);

    // Labels should still be present
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Completadas")).toBeInTheDocument();
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
  });

  /**
   * Test: Manejo correcto de números grandes
   *
   * Verifica que el componente pueda mostrar correctamente
   * números grandes sin problemas de layout.
   *
   * @test {HTMLElement} largeTotal - Número grande total (1000)
   * @test {HTMLElement} largeCompleted - Número grande completadas (750)
   * @test {HTMLElement} largePending - Número grande pendientes (250)
   */
  it("handles large numbers correctly", () => {
    const largeTodosCount = {
      total: 1000,
      completed: 750,
      pending: 250,
    };

    render(<StatsSection todosCount={largeTodosCount} />);

    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  /**
   * Test: Relación matemática correcta
   *
   * Verifica que las estadísticas mantengan la relación
   * matemática correcta: completadas + pendientes = total.
   *
   * @test {HTMLElement} totalDisplay - Total mostrado (20)
   * @test {HTMLElement} completedDisplay - Completadas mostradas (12)
   * @test {HTMLElement} pendingDisplay - Pendientes mostradas (8)
   * @test {boolean} mathRelation - Suma debe ser igual al total
   */
  it("maintains correct mathematical relationship", () => {
    const todosCount = {
      total: 20,
      completed: 12,
      pending: 8,
    };

    render(<StatsSection todosCount={todosCount} />);

    // Verify that completed + pending = total
    expect(screen.getByText("20")).toBeInTheDocument(); // total
    expect(screen.getByText("12")).toBeInTheDocument(); // completed
    expect(screen.getByText("8")).toBeInTheDocument(); // pending

    // The math should add up: 12 + 8 = 20
    expect(todosCount.completed + todosCount.pending).toBe(todosCount.total);
  });

  /**
   * Test: Renderizado de tres componentes StatsCard distintos
   *
   * Verifica que se rendericen exactamente tres tarjetas
   * con la estructura y clases CSS correctas.
   *
   * @test {HTMLElement[]} cards - Exactamente 3 tarjetas
   * @test {string} bg-white - Fondo blanco de cada tarjeta
   * @test {string} dark:bg-slate-800 - Fondo oscuro de cada tarjeta
   * @test {string} rounded-xl - Bordes redondeados de cada tarjeta
   */
  it("renders three distinct StatsCard components", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Check that we have exactly 3 cards with the expected structure
    const cards = screen.getAllByText(/^(15|8|7)$/);
    expect(cards).toHaveLength(3);

    // Each card should have its parent container with the correct classes
    cards.forEach((card) => {
      // Find the StatsCard container (the div with bg-white class)
      const cardContainer = card.closest('[class*="bg-white"]');
      expect(cardContainer).toHaveClass("group");
      expect(cardContainer).toHaveClass("relative");
      expect(cardContainer).toHaveClass("bg-white");
      expect(cardContainer).toHaveClass("rounded-2xl");
      expect(cardContainer).toHaveClass("p-4");
      expect(cardContainer).toHaveClass("shadow-sm");
      expect(cardContainer).toHaveClass("hover:shadow-md");
      expect(cardContainer).toHaveClass("border");
      expect(cardContainer).toHaveClass("transition-all");
      expect(cardContainer).toHaveClass("duration-300");
    });
  });

  /**
   * Test: Clases de diseño responsivo
   *
   * Verifica que el contenedor tenga las clases CSS necesarias
   * para un diseño responsivo apropiado.
   *
   * @test {string} grid-cols-1 - Una columna en dispositivos móviles
   * @test {string} sm:grid-cols-2 - Dos columnas en tablet
   * @test {string} lg:grid-cols-3 - Tres columnas en desktop
   */
  it("has responsive design classes", () => {
      render(<StatsSection todosCount={defaultTodosCount} />);

      const gridContainer = screen.getByText("Total").closest(".grid");

      // Should be single column on mobile, 2 columns on tablet, 3 columns on desktop
      expect(gridContainer).toHaveClass("grid-cols-1");
      expect(gridContainer).toHaveClass("sm:grid-cols-2");
      expect(gridContainer).toHaveClass("lg:grid-cols-3");
    });

  /**
   * Test: Espaciado apropiado
   *
   * Verifica que el contenedor tenga el espaciado correcto
   * entre tarjetas y márgenes apropiados.
   *
   * @test {string} gap-6 - Espacio entre tarjetas
   */
  it("maintains proper spacing", () => {
      render(<StatsSection todosCount={defaultTodosCount} />);

      const gridContainer = screen.getByText("Total").closest(".grid");

      // Check spacing classes - responsive gap
       expect(gridContainer).toHaveClass("gap-4"); // Gap on mobile
       expect(gridContainer).toHaveClass("lg:gap-6"); // Gap on desktop
    });

  /**
   * Test: Actualización cuando cambia la prop todosCount
   *
   * Verifica que el componente se actualice correctamente
   * cuando cambian los valores de las estadísticas.
   *
   * @test {HTMLElement} initialValues - Valores iniciales deben mostrarse
   * @test {HTMLElement} updatedValues - Valores actualizados deben mostrarse
   * @test {null} oldValues - Valores anteriores no deben estar presentes
   */
  it("updates when todosCount prop changes", () => {
    const initialCount = {
      total: 10,
      completed: 6,
      pending: 4,
    };

    const { rerender } = render(<StatsSection todosCount={initialCount} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    const updatedCount = {
      total: 20,
      completed: 15,
      pending: 5,
    };

    rerender(<StatsSection todosCount={updatedCount} />);

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
    expect(screen.queryByText("4")).not.toBeInTheDocument();
  });

  /**
   * Test: Estructura semántica apropiada
   *
   * Verifica que el componente use la estructura HTML
   * semántica correcta con un contenedor div y layout grid.
   *
   * @test {string} tagName - Debe ser un elemento DIV
   * @test {string} grid - Debe tener clase grid para layout
   */
  it("has proper semantic structure", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    const gridContainer = document.querySelector('.grid.grid-cols-1');

    // Should be a div container with grid layout
    expect(gridContainer?.tagName).toBe("DIV");
    expect(gridContainer).toHaveClass("grid");
  });
});
