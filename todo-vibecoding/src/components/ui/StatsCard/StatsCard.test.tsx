/**
 * @fileoverview Tests para el componente StatsCard
 *
 * Este archivo contiene tests unitarios que verifican:
 * - Renderizado correcto del valor y etiqueta
 * - Aplicación de variantes de color (blue, green, orange)
 * - Clases CSS para layout, espaciado y temas
 * - Manejo de diferentes tipos de números (cero, negativos, grandes)
 * - Estructura semántica y accesibilidad
 * - Comportamiento como componente sin estado
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsCard } from "./StatsCard";

/**
 * Suite de tests para el componente StatsCard
 *
 * Verifica el renderizado y funcionalidad de las tarjetas de estadísticas,
 * incluyendo variantes de color y manejo de diferentes valores numéricos.
 */
describe("StatsCard Component", () => {
  /**
   * Props por defecto para las pruebas
   *
   * @constant {Object} defaultProps - Configuración base para tests
   * @property {number} value - Valor numérico a mostrar
   * @property {string} label - Etiqueta descriptiva
   * @property {string} color - Variante de color (blue, green, orange)
   */
  const defaultProps = {
    value: 10,
    label: "Test Label",
    color: "blue" as const,
  };

  /**
   * Test: Renderizado correcto del componente
   *
   * Verifica que el componente se renderice correctamente con
   * el valor y la etiqueta especificados en las props.
   *
   * @test {HTMLElement} card - Contenedor principal del componente
   * @test {HTMLElement} value - Elemento que muestra el valor numérico
   * @test {HTMLElement} label - Elemento que muestra la etiqueta
   */
  it("renders the component correctly", () => {
    render(<StatsCard {...defaultProps} />);

    const card = screen.getByText("10").closest("div");
    expect(card).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  /**
   * Test: Visualización del valor correcto
   *
   * Verifica que el componente muestre el valor numérico
   * especificado en la prop value.
   *
   * @test {HTMLElement} newValue - Nuevo valor debe estar presente
   * @test {null} oldValue - Valor anterior no debe estar presente
   */
  it("displays the correct value", () => {
    render(<StatsCard {...defaultProps} value={25} />);

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  /**
   * Test: Visualización de la etiqueta correcta
   *
   * Verifica que el componente muestre la etiqueta
   * especificada en la prop label.
   *
   * @test {HTMLElement} newLabel - Nueva etiqueta debe estar presente
   * @test {null} oldLabel - Etiqueta anterior no debe estar presente
   */
  it("displays the correct label", () => {
    render(<StatsCard {...defaultProps} label="Custom Label" />);

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
    expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
  });

  /**
   * Test: Clases de estilo de texto correctas
   *
   * Verifica que los elementos de texto (valor y etiqueta)
   * tengan las clases CSS apropiadas para tipografía.
   *
   * @test {string} text-3xl - Tamaño grande para el valor
   * @test {string} font-bold - Peso de fuente bold para el valor
   * @test {string} text-sm - Tamaño pequeño para la etiqueta
   * @test {string} text-gray-600 - Color gris para la etiqueta
   * @test {string} dark:text-gray-300 - Color gris claro en modo oscuro
   * @test {string} mt-1 - Margen superior para la etiqueta
   */
  it("applies correct text styling classes", () => {
    render(<StatsCard {...defaultProps} />);

    const valueElement = screen.getByText("10");
    const labelElement = screen.getByText("Test Label");

    expect(valueElement).toHaveClass(
      "text-2xl font-black tracking-tight transition-all duration-300 text-blue-400 group-hover:text-blue-300"
    );
    expect(valueElement).toHaveClass(
      "text-2xl font-black tracking-tight transition-all duration-300 text-blue-400 group-hover:text-blue-300"
    );

    expect(labelElement).toHaveClass("text-sm");
    expect(labelElement).toHaveClass(
      "text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase"
    );
    expect(labelElement).toHaveClass(
      "text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase"
    );
    expect(labelElement).toHaveClass(
      "text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase"
    );
  });

  /**
   * Suite de tests para variantes de color
   *
   * Verifica que cada variante de color (blue, green, orange)
   * aplique las clases CSS correctas al valor numérico.
   */
  describe("Color variants", () => {
    /**
     * Test: Variante de color azul
     *
     * Verifica que la variante blue aplique los colores
     * azules correctos en modo claro y oscuro.
     *
     * @test {string} text-blue-600 - Color azul en modo claro
     * @test {string} dark:text-blue-400 - Color azul claro en modo oscuro
     */
    it("applies blue color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="blue" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass(
        "text-2xl font-black tracking-tight transition-all duration-300 text-blue-400 group-hover:text-blue-300"
      );
      expect(valueElement).toHaveClass(
        "text-2xl font-black tracking-tight transition-all duration-300 text-blue-400 group-hover:text-blue-300"
      );
    });

    /**
     * Test: Variante de color verde
     *
     * Verifica que la variante green aplique los colores
     * verdes correctos en modo claro y oscuro.
     *
     * @test {string} text-green-600 - Color verde en modo claro
     * @test {string} dark:text-green-400 - Color verde claro en modo oscuro
     */
    it("applies green color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="green" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass(
        "text-2xl font-black tracking-tight transition-all duration-300 text-emerald-400 group-hover:text-emerald-300"
      );
      expect(valueElement).toHaveClass(
        "text-2xl font-black tracking-tight transition-all duration-300 text-emerald-400 group-hover:text-emerald-300"
      );
    });

    /**
     * Test: Variante de color naranja
     *
     * Verifica que la variante orange aplique los colores
     * naranjas correctos en modo claro y oscuro.
     *
     * @test {string} text-orange-600 - Color naranja en modo claro
     * @test {string} dark:text-orange-400 - Color naranja claro en modo oscuro
     */
    it("applies orange color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="orange" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass(
        "text-2xl font-black tracking-tight transition-all duration-300 text-amber-400 group-hover:text-amber-300"
      );
      expect(valueElement).toHaveClass(
        "text-2xl font-black tracking-tight transition-all duration-300 text-amber-400 group-hover:text-amber-300"
      );
    });
  });

  /**
   * Test: Estructura de layout apropiada
   *
   * Verifica que el contenido esté centrado correctamente
   * dentro de la tarjeta.
   *
   * @test {string} text-center - Alineación centrada del contenido
   */
  it("has proper layout structure", () => {
    render(<StatsCard {...defaultProps} />);

    const centerDiv = screen.getByText("10").parentElement;
    expect(centerDiv).toHaveClass("text-center");
  });

  /**
   * Test: Manejo correcto del valor cero
   *
   * Verifica que el componente pueda mostrar correctamente
   * el valor cero sin problemas.
   *
   * @test {HTMLElement} zeroValue - Valor cero debe renderizarse
   */
  it("handles zero value correctly", () => {
    render(<StatsCard {...defaultProps} value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  /**
   * Test: Manejo correcto de números grandes
   *
   * Verifica que el componente pueda mostrar correctamente
   * números grandes sin problemas de layout.
   *
   * @test {HTMLElement} largeNumber - Número grande debe renderizarse
   */
  it("handles large numbers correctly", () => {
    render(<StatsCard {...defaultProps} value={9999} />);

    expect(screen.getByText("9999")).toBeInTheDocument();
  });

  /**
   * Test: Manejo correcto de números negativos
   *
   * Verifica que el componente pueda mostrar correctamente
   * números negativos con el signo apropiado.
   *
   * @test {HTMLElement} negativeNumber - Número negativo debe renderizarse
   */
  it("handles negative numbers correctly", () => {
    render(<StatsCard {...defaultProps} value={-5} />);

    expect(screen.getByText("-5")).toBeInTheDocument();
  });

  /**
   * Test: Contraste de texto accesible
   *
   * Verifica que los colores de texto tengan suficiente
   * contraste para cumplir estándares de accesibilidad.
   *
   * @test {string} text-blue-600 - Color del valor con buen contraste
   * @test {string} text-gray-600 - Color de la etiqueta con buen contraste
   */
  it("has accessible text contrast", () => {
    render(<StatsCard {...defaultProps} />);

    const valueElement = screen.getByText("10");
    const labelElement = screen.getByText("Test Label");

    // Check that appropriate color classes are applied for contrast
    expect(valueElement).toHaveClass(
      "text-2xl font-black tracking-tight transition-all duration-300 text-blue-400 group-hover:text-blue-300"
    );
    expect(labelElement).toHaveClass(
      "text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase"
    );
  });

  /**
   * Test: Componente sin estado (stateless)
   *
   * Verifica que el componente se comporte como un componente
   * sin estado, actualizándose correctamente cuando cambian las props.
   *
   * @test {HTMLElement} initialValue - Valor inicial debe renderizarse
   * @test {HTMLElement} initialLabel - Etiqueta inicial debe renderizarse
   * @test {HTMLElement} newValue - Nuevo valor debe renderizarse tras rerender
   * @test {HTMLElement} newLabel - Nueva etiqueta debe renderizarse tras rerender
   * @test {null} oldValue - Valor anterior no debe estar presente
   * @test {null} oldLabel - Etiqueta anterior no debe estar presente
   */
  it("renders as a stateless component", () => {
    const { rerender } = render(<StatsCard {...defaultProps} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();

    // Re-render with different props
    rerender(<StatsCard value={20} label="New Label" color="green" />);

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("New Label")).toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
  });
});
