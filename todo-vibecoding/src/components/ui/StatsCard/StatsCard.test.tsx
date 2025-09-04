/**
 * @fileoverview Tests para el componente StatsCard
 *
 * Este archivo contiene tests unitarios que verifican:
 * - Renderizado correcto del valor y etiqueta
 * - Aplicación de variantes de color (charcoal, persian-green, saffron)
 * - Clases CSS para layout, espaciado y efectos hover
 * - Manejo de diferentes tipos de números (cero, negativos, grandes)
 * - Estructura semántica y accesibilidad
 * - Comportamiento como componente sin estado
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
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
   * @property {string} color - Variante de color (charcoal, persian-green, saffron)
   */
  const defaultProps = {
    value: 10,
    label: "Test Label",
    color: "charcoal" as const,
  };

  afterEach(() => {
    // Clean up after each test
  });

  describe("Rendering", () => {
    /**
     * Test: Renderizado correcto del componente
     *
     * Verifica que el componente se renderice correctamente con
     * el valor y la etiqueta especificados en las props.
     */
    it("should render the component correctly", () => {
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
     */
    it("should display the correct value", () => {
      render(<StatsCard {...defaultProps} value={25} />);

      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.queryByText("10")).not.toBeInTheDocument();
    });

    /**
     * Test: Visualización de la etiqueta correcta
     *
     * Verifica que el componente muestre la etiqueta
     * especificada en la prop label.
     */
    it("should display the correct label", () => {
      render(<StatsCard {...defaultProps} label="Custom Label" />);

      expect(screen.getByText("Custom Label")).toBeInTheDocument();
      expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
    });

    /**
     * Test: Estructura del contenedor principal
     *
     * Verifica que el contenedor principal tenga las clases CSS correctas
     * para el layout y efectos hover.
     */
    it("should have correct container structure", () => {
      const { container } = render(<StatsCard {...defaultProps} />);

      const mainContainer = container.querySelector(".group.relative.bg-white");
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass(
        "group",
        "relative",
        "bg-white",
        "rounded-2xl",
        "p-4",
        "shadow-sm",
        "hover:shadow-md",
        "border",
        "transition-all",
        "duration-300",
        "hover:scale-105",
        "hover:-translate-y-1",
        "cursor-default"
      );
    });

    /**
     * Test: Elemento decorativo de fondo
     *
     * Verifica que el elemento decorativo de fondo esté presente
     * con las clases CSS correctas.
     */
    it("should render decorative background element", () => {
      const { container } = render(<StatsCard {...defaultProps} />);

      const decorativeElement = container.querySelector(
        ".absolute.inset-0.rounded-2xl"
      );
      expect(decorativeElement).toBeInTheDocument();
      expect(decorativeElement).toHaveClass(
        "absolute",
        "inset-0",
        "rounded-2xl",
        "transition-all",
        "duration-500"
      );
    });
  });

  describe("Styling", () => {
    /**
     * Test: Clases de estilo de texto correctas
     *
     * Verifica que los elementos de texto (valor y etiqueta)
     * tengan las clases CSS apropiadas para tipografía.
     */
    it("should apply correct text styling classes", () => {
      render(<StatsCard {...defaultProps} />);

      const valueElement = screen.getByText("10");
      const labelElement = screen.getByText("Test Label");

      expect(valueElement).toHaveClass(
        "text-2xl",
        "font-black",
        "tracking-tight",
        "transition-all",
        "duration-300"
      );

      expect(labelElement).toHaveClass(
        "text-sm",
        "font-medium",
        "text-gray-600",
        "group-hover:text-gray-700",
        "transition-colors",
        "duration-300",
        "tracking-wide",
        "uppercase"
      );
    });

    /**
     * Test: Contenedor de contenido
     *
     * Verifica que el contenedor de contenido tenga las clases correctas
     * para centrado y espaciado.
     */
    it("should have proper content container styling", () => {
      const { container } = render(<StatsCard {...defaultProps} />);

      const contentContainer = container.querySelector(".relative.z-10.text-center.space-y-3");
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass(
        "relative",
        "z-10",
        "text-center",
        "space-y-3"
      );
    });

    /**
     * Test: Efecto de brillo en hover
     *
     * Verifica que el efecto de brillo en hover esté presente
     * con las clases CSS correctas.
     */
    it("should render glow effect element", () => {
      const { container } = render(<StatsCard {...defaultProps} />);

      const glowElement = container.querySelector(
        ".absolute.inset-0.rounded-2xl.opacity-0.group-hover\\:opacity-20"
      );
      expect(glowElement).toBeInTheDocument();
      expect(glowElement).toHaveClass(
        "absolute",
        "inset-0",
        "rounded-2xl",
        "opacity-0",
        "group-hover:opacity-20",
        "transition-opacity",
        "duration-500",
        "blur-xl"
      );
    });
  });

  describe("Color Variants", () => {
    /**
     * Test: Variante de color charcoal
     *
     * Verifica que la variante charcoal aplique los colores
     * grises correctos para estadísticas totales.
     */
    it("should apply charcoal color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="charcoal" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass(
        "text-gray-700",
        "group-hover:text-gray-800"
      );
    });

    /**
     * Test: Variante de color persian-green
     *
     * Verifica que la variante persian-green aplique los colores
     * verdes correctos para tareas completadas.
     */
    it("should apply persian-green color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="persian-green" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass(
        "text-green-600",
        "group-hover:text-green-700"
      );
    });

    /**
     * Test: Variante de color saffron
     *
     * Verifica que la variante saffron aplique los colores
     * amarillos correctos para tareas pendientes.
     */
    it("should apply saffron color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="saffron" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass(
        "text-yellow-600",
        "group-hover:text-yellow-700"
      );
    });

    /**
     * Test: Clases de borde por variante
     *
     * Verifica que cada variante de color aplique las clases
     * de borde correctas.
     */
    it("should apply correct border classes for each variant", () => {
      const { container: charcoalContainer } = render(
        <StatsCard {...defaultProps} color="charcoal" />
      );
      const { container: greenContainer } = render(
        <StatsCard {...defaultProps} color="persian-green" />
      );
      const { container: saffronContainer } = render(
        <StatsCard {...defaultProps} color="saffron" />
      );

      const charcoalCard = charcoalContainer.querySelector(".group.relative");
      const greenCard = greenContainer.querySelector(".group.relative");
      const saffronCard = saffronContainer.querySelector(".group.relative");

      expect(charcoalCard).toHaveClass(
        "border-gray-200",
        "group-hover:border-gray-300"
      );
      expect(greenCard).toHaveClass(
        "border-green-200",
        "group-hover:border-green-300"
      );
      expect(saffronCard).toHaveClass(
        "border-yellow-200",
        "group-hover:border-yellow-300"
      );
    });
  });

  describe("Value Handling", () => {
    /**
     * Test: Manejo correcto del valor cero
     *
     * Verifica que el componente pueda mostrar correctamente
     * el valor cero sin problemas.
     */
    it("should handle zero value correctly", () => {
      render(<StatsCard {...defaultProps} value={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    /**
     * Test: Manejo correcto de números grandes
     *
     * Verifica que el componente pueda mostrar correctamente
     * números grandes sin problemas de layout.
     */
    it("should handle large numbers correctly", () => {
      render(<StatsCard {...defaultProps} value={9999} />);

      expect(screen.getByText("9999")).toBeInTheDocument();
    });

    /**
     * Test: Manejo correcto de números negativos
     *
     * Verifica que el componente pueda mostrar correctamente
     * números negativos con el signo apropiado.
     */
    it("should handle negative numbers correctly", () => {
      render(<StatsCard {...defaultProps} value={-5} />);

      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    /**
     * Test: Manejo de números decimales
     *
     * Verifica que el componente pueda mostrar correctamente
     * números decimales si se proporcionan.
     */
    it("should handle decimal numbers correctly", () => {
      render(<StatsCard {...defaultProps} value={3.14} />);

      expect(screen.getByText("3.14")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    /**
     * Test: Contraste de texto accesible
     *
     * Verifica que los colores de texto tengan suficiente
     * contraste para cumplir estándares de accesibilidad.
     */
    it("should have accessible text contrast", () => {
      render(<StatsCard {...defaultProps} />);

      const valueElement = screen.getByText("10");
      const labelElement = screen.getByText("Test Label");

      // Check that appropriate color classes are applied for contrast
      expect(valueElement).toHaveClass("text-gray-700");
      expect(labelElement).toHaveClass("text-gray-600");
    });

    /**
     * Test: Contenido de texto accesible
     *
     * Verifica que el contenido de texto sea accesible y no esté vacío,
     * importante para lectores de pantalla.
     */
    it("should have accessible text content", () => {
      render(<StatsCard {...defaultProps} />);

      const valueElement = screen.getByText("10");
      const labelElement = screen.getByText("Test Label");

      // Check that text is accessible and not empty
      expect(valueElement.textContent).toBeTruthy();
      expect(labelElement.textContent).toBeTruthy();
      expect(valueElement.textContent?.trim()).not.toBe("");
      expect(labelElement.textContent?.trim()).not.toBe("");
    });

    /**
     * Test: Estructura semántica
     *
     * Verifica que el componente use una estructura semántica apropiada
     * para lectores de pantalla.
     */
    it("should have proper semantic structure", () => {
      const { container } = render(<StatsCard {...defaultProps} />);

      const valueElement = screen.getByText("10");
      const labelElement = screen.getByText("Test Label");

      // Check that elements are properly structured
      expect(valueElement.tagName).toBe("DIV");
      expect(labelElement.tagName).toBe("DIV");

      // Check that they are within the same container
      const contentContainer = container.querySelector(".text-center.space-y-3");
      expect(contentContainer).toContainElement(valueElement);
      expect(contentContainer).toContainElement(labelElement);
    });
  });

  describe("Props Handling", () => {
    /**
     * Test: Componente sin estado (stateless)
     *
     * Verifica que el componente se comporte como un componente
     * sin estado, actualizándose correctamente cuando cambian las props.
     */
    it("should render as a stateless component", () => {
      const { rerender } = render(<StatsCard {...defaultProps} />);

      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("Test Label")).toBeInTheDocument();

      // Re-render with different props
      rerender(
        <StatsCard value={20} label="New Label" color="persian-green" />
      );

      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("New Label")).toBeInTheDocument();
      expect(screen.queryByText("10")).not.toBeInTheDocument();
      expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
    });

    /**
     * Test: Manejo de etiquetas largas
     *
     * Verifica que el componente maneje correctamente etiquetas
     * de texto largo sin romper el layout.
     */
    it("should handle long labels correctly", () => {
      const longLabel = "Esta es una etiqueta muy larga que debería manejarse correctamente";
      render(<StatsCard {...defaultProps} label={longLabel} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    /**
     * Test: Manejo de etiquetas vacías
     *
     * Verifica que el componente maneje correctamente etiquetas vacías
     * sin causar errores.
     */
    it("should handle empty labels correctly", () => {
      render(<StatsCard {...defaultProps} label="" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toBeInTheDocument();

      // The empty label should still render as an element
      const { container } = render(<StatsCard {...defaultProps} label="" />);
      const labelElements = container.querySelectorAll(".text-sm");
      expect(labelElements).toHaveLength(1);
    });
  });
});
