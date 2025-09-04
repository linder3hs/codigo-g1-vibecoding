/**
 * @fileoverview Tests para el componente Header
 *
 * Este archivo contiene tests unitarios que verifican:
 * - Renderizado correcto del título y subtítulo
 * - Aplicación de clases CSS y estilos responsivos
 * - Estructura semántica y accesibilidad
 * - Manejo de props personalizadas
 * - Comportamiento con diferentes tipos de contenido
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

/**
 * Suite de tests para el componente Header
 *
 * Verifica el renderizado y funcionalidad del header principal
 * de la aplicación, incluyendo título, subtítulo y estilos.
 */
describe("Header Component", () => {
  /**
   * Props por defecto para los tests
   *
   * @type {Object}
   * @property {string} title - Título principal del header
   * @property {string} subtitle - Subtítulo descriptivo
   */
  const defaultProps = {
    title: "Lista de Tareas",
    subtitle: "Gestiona tus tareas de manera eficiente",
  };

  afterEach(() => {
    // Clean up after each test
  });

  describe("Rendering", () => {
    /**
     * Test: Renderizado correcto del título
     *
     * Verifica que el título se renderice como un heading h1
     * con el contenido de texto correcto.
     */
    it("should render the title correctly", () => {
      render(<Header {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("Lista de Tareas");
    });

    /**
     * Test: Renderizado correcto del subtítulo
     *
     * Verifica que el subtítulo se renderice correctamente
     * con el texto descriptivo proporcionado.
     */
    it("should render the subtitle correctly", () => {
      render(<Header {...defaultProps} />);

      const subtitle = screen.getByText(
        "Gestiona tus tareas de manera eficiente"
      );
      expect(subtitle).toBeInTheDocument();
    });

    /**
     * Test: Estructura semántica del header
     *
     * Verifica que el componente use el elemento semántico header
     * con las clases de layout apropiadas.
     */
    it("should have proper semantic structure with header element", () => {
      render(<Header {...defaultProps} />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass("text-center", "mb-5", "relative");
    });

    /**
     * Test: Elemento decorativo de fondo
     *
     * Verifica que el elemento decorativo de fondo esté presente
     * con las clases CSS correctas.
     */
    it("should render decorative background element", () => {
      const { container } = render(<Header {...defaultProps} />);

      const decorativeElement = container.querySelector(
        ".absolute.inset-0.-z-10.opacity-20"
      );
      expect(decorativeElement).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    /**
     * Test: Clases CSS del título
     *
     * Verifica que el título tenga todas las clases CSS necesarias
     * para el diseño responsivo y tipografía.
     */
    it("should apply correct CSS classes for title styling", () => {
      render(<Header {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveClass(
        "text-4xl",
        "font-extrabold",
        "tracking-tight",
        "mb-6",
        "group",
        "cursor-default"
      );
    });

    /**
     * Test: Clases CSS del span interno del título
     *
     * Verifica que el span interno del título tenga las clases correctas.
     */
    it("should apply correct CSS classes for title span", () => {
      const { container } = render(<Header {...defaultProps} />);

      const titleSpan = container.querySelector(
        "h1 span.text-slate-900.inline-block"
      );
      expect(titleSpan).toBeInTheDocument();
      expect(titleSpan).toHaveClass("text-slate-900", "inline-block");
    });

    /**
     * Test: Clases CSS del subtítulo
     *
     * Verifica que el subtítulo tenga las clases CSS correctas
     * para el layout y tipografía.
     */
    it("should apply correct CSS classes for subtitle styling", () => {
      render(<Header {...defaultProps} />);

      const subtitle = screen.getByText(
        "Gestiona tus tareas de manera eficiente"
      );
      expect(subtitle).toHaveClass(
        "max-w-2xl",
        "mx-auto",
        "leading-relaxed",
        "text-slate-900"
      );
    });
  });

  describe("Props Handling", () => {
    /**
     * Test: Props personalizadas
     *
     * Verifica que el componente acepte y renderice correctamente
     * props personalizadas para título y subtítulo.
     */
    it("should render with custom title and subtitle", () => {
      const customProps = {
        title: "Mi Aplicación Custom",
        subtitle: "Descripción personalizada",
      };

      render(<Header {...customProps} />);

      const title = screen.getByRole("heading", { level: 1 });
      const subtitle = screen.getByText("Descripción personalizada");

      expect(title).toHaveTextContent("Mi Aplicación Custom");
      expect(subtitle).toBeInTheDocument();
    });

    /**
     * Test: Manejo de strings vacíos
     *
     * Verifica que el componente maneje correctamente props vacías
     * sin romper la estructura o causar errores.
     */
    it("should render correctly with empty strings", () => {
      const emptyProps = {
        title: "",
        subtitle: "",
      };

      render(<Header {...emptyProps} />);

      const header = screen.getByRole("banner");
      const title = screen.getByRole("heading", { level: 1 });

      expect(header).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent("");
    });

    /**
     * Test: Manejo de texto largo
     *
     * Verifica que el componente maneje correctamente contenido de texto
     * largo sin romper el layout o la legibilidad.
     */
    it("should handle long text content properly", () => {
      const longTextProps = {
        title:
          "Este es un título muy largo que debería manejarse correctamente en diferentes tamaños de pantalla",
        subtitle:
          "Esta es una descripción muy larga que también debería manejarse correctamente y mantener la legibilidad en diferentes dispositivos y tamaños de pantalla",
      };

      render(<Header {...longTextProps} />);

      const title = screen.getByRole("heading", { level: 1 });
      const subtitle = screen.getByText(longTextProps.subtitle);

      expect(title).toHaveTextContent(longTextProps.title);
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    /**
     * Test: Jerarquía de headings
     *
     * Verifica que el componente mantenga la jerarquía semántica
     * correcta usando un elemento H1.
     */
    it("should maintain proper heading hierarchy", () => {
      render(<Header {...defaultProps} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.tagName).toBe("H1");
    });

    /**
     * Test: Contenido de texto accesible
     *
     * Verifica que el contenido de texto sea accesible y no esté vacío,
     * importante para lectores de pantalla y SEO.
     */
    it("should have accessible text content", () => {
      render(<Header {...defaultProps} />);

      const title = screen.getByRole("heading", { level: 1 });
      const subtitle = screen.getByText(
        "Gestiona tus tareas de manera eficiente"
      );

      // Check that text is accessible and not empty
      expect(title.textContent).toBeTruthy();
      expect(subtitle.textContent).toBeTruthy();
      expect(title.textContent?.trim()).not.toBe("");
      expect(subtitle.textContent?.trim()).not.toBe("");
    });

    /**
     * Test: Elementos semánticos correctos
     *
     * Verifica que se usen los elementos HTML semánticos apropiados.
     */
    it("should use correct semantic elements", () => {
      render(<Header {...defaultProps} />);

      const header = screen.getByRole("banner");
      const title = screen.getByRole("heading", { level: 1 });
      const subtitle = screen.getByText(
        "Gestiona tus tareas de manera eficiente"
      );

      expect(header.tagName).toBe("HEADER");
      expect(title.tagName).toBe("H1");
      expect(subtitle.tagName).toBe("P");
    });
  });

  describe("Layout Structure", () => {
    /**
     * Test: Estructura del DOM
     *
     * Verifica que la estructura del DOM sea la esperada
     * con todos los elementos en el orden correcto.
     */
    it("should have correct DOM structure", () => {
      const { container } = render(<Header {...defaultProps} />);

      const header = container.querySelector("header");
      const decorativeDiv = header?.querySelector(".absolute.inset-0");
      const title = header?.querySelector("h1");
      const subtitle = header?.querySelector("p");

      expect(header).toBeInTheDocument();
      expect(decorativeDiv).toBeInTheDocument();
      expect(title).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
    });

    /**
     * Test: Orden de elementos
     *
     * Verifica que los elementos aparezcan en el orden correcto
     * dentro del header.
     */
    it("should render elements in correct order", () => {
      const { container } = render(<Header {...defaultProps} />);

      const header = container.querySelector("header");
      const children = header?.children;

      expect(children).toHaveLength(3);
      expect(children?.[0]).toHaveClass("absolute", "inset-0"); // Decorative element
      expect(children?.[1].tagName).toBe("H1"); // Title
      expect(children?.[2].tagName).toBe("P"); // Subtitle
    });
  });
});
