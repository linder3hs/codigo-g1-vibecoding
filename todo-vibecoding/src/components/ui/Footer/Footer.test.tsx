/**
 * @fileoverview Tests para el componente Footer
 *
 * Este archivo contiene tests unitarios que verifican:
 * - Renderizado correcto del footer y badge de Tailwind
 * - Aplicación de clases CSS y estilos de tema
 * - Estructura semántica y accesibilidad
 * - Espaciado y layout responsivo
 * - Contraste de colores y legibilidad
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "./Footer";

/**
 * Suite de tests para el componente Footer
 *
 * Verifica el renderizado y funcionalidad del footer de la aplicación,
 * incluyendo el badge de Tailwind CSS y estilos de tema.
 */
describe("Footer Component", () => {
  /**
   * Test: Renderizado correcto del elemento footer
   *
   * Verifica que el footer se renderice correctamente como un
   * elemento semántico con role="contentinfo".
   *
   * @test {HTMLElement} footer - Elemento footer con role contentinfo
   */
  it("renders the footer element correctly", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  /**
   * Test: Texto del badge de Tailwind CSS
   *
   * Verifica que el badge muestre correctamente el texto
   * "Powered by Tailwind CSS v4".
   *
   * @test {HTMLElement} badgeText - Elemento con el texto del badge
   */
  it("displays the Tailwind CSS badge text", () => {
    render(<Footer />);

    const badgeText = screen.getByText(/Powered by/);
    expect(badgeText).toBeInTheDocument();
  });

  /**
   * Test: Clases CSS del elemento footer
   *
   * Verifica que el footer tenga todas las clases CSS necesarias
   * para el layout, espaciado y posicionamiento.
   *
   * @test {string} relative - Posicionamiento relativo
   * @test {string} text-center - Alineación centrada del contenido
   * @test {string} mt-16 - Margen superior
   * @test {string} pt-12 - Padding superior
   */
  it("applies correct CSS classes to footer element", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("relative");
    expect(footer).toHaveClass("text-center");
    expect(footer).toHaveClass("mt-16");
    expect(footer).toHaveClass("pt-12");
  });

  /**
   * Test: Clases CSS del contenedor del badge
   *
   * Verifica que el contenedor del badge tenga todas las clases
   * necesarias para el diseño minimalista, efectos y espaciado.
   *
   * @test {string} group - Grupo para efectos hover
   * @test {string} inline-flex - Display flex inline
   * @test {string} items-center - Alineación vertical centrada
   * @test {string} gap-3 - Espacio entre elementos
   * @test {string}  - Efecto de desenfoque
   * @test {string} bg-slate-800 - Fondo con opacidad
   * @test {string} border - Borde
   * @test {string} border-slate-700/30 - Color del borde
   * @test {string} text-slate-400 - Color de texto
   * @test {string} px-6 - Padding horizontal
   * @test {string} py-3 - Padding vertical
   * @test {string} rounded-full - Bordes completamente redondeados
   * @test {string} text-sm - Tamaño de texto pequeño
   * @test {string} font-medium - Peso de fuente medio
   */
  it("applies correct CSS classes to badge container", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText(/Powered by/).closest("div");
    expect(badgeContainer).toHaveClass("group");
    expect(badgeContainer).toHaveClass("inline-flex");
    expect(badgeContainer).toHaveClass("items-center");
    expect(badgeContainer).toHaveClass("gap-3");
    expect(badgeContainer).toHaveClass("");
    expect(badgeContainer).toHaveClass("bg-slate-800");
    expect(badgeContainer).toHaveClass("border");
    expect(badgeContainer).toHaveClass("border-slate-700/30");
    expect(badgeContainer).toHaveClass("text-slate-400");
    expect(badgeContainer).toHaveClass("px-6");
    expect(badgeContainer).toHaveClass("py-3");
    expect(badgeContainer).toHaveClass("rounded-full");
    expect(badgeContainer).toHaveClass("text-sm");
    expect(badgeContainer).toHaveClass("font-medium");
  });

  /**
   * Test: Estructura semántica correcta
   *
   * Verifica que el componente use el elemento semántico FOOTER
   * apropiado para la estructura HTML.
   *
   * @test {HTMLElement} footer - Elemento footer semántico
   * @test {string} tagName - Debe ser "FOOTER"
   */
  it("has proper semantic structure", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer.tagName).toBe("FOOTER");
  });

  /**
   * Test: Efectos de transición y hover
   *
   * Verifica que el componente tenga las clases CSS necesarias
   * para efectos de transición y hover del diseño minimalista.
   *
   * @test {string} transition-all - Transición suave
   * @test {string} duration-300 - Duración de transición
   * @test {string} hover:bg-slate-700/30 - Fondo en hover
   * @test {string} hover:text-slate-300 - Color de texto en hover
   */
  it("has transition and hover effects", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText(/Powered by/).closest("div");

    // Check transition and hover classes are present
    expect(badgeContainer).toHaveClass("transition-all");
    expect(badgeContainer).toHaveClass("duration-300");
    expect(badgeContainer).toHaveClass("hover:bg-slate-700/30");
    expect(badgeContainer).toHaveClass("hover:text-slate-300");
  });

  /**
   * Test: Contraste de colores del diseño minimalista
   *
   * Verifica que el badge tenga colores apropiados
   * para el diseño minimalista con buen contraste.
   *
   * @test {string} text-slate-400 - Color de texto principal
   * @test {string} bg-slate-800 - Fondo con opacidad
   */
  it("has appropriate minimalist color scheme", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText(/Powered by/).closest("div");

    // Check that appropriate color classes are applied for minimalist design
    expect(badgeContainer).toHaveClass("text-slate-400");
    expect(badgeContainer).toHaveClass("bg-slate-800");
  });

  /**
   * Test: Componente sin estado (stateless)
   *
   * Verifica que el componente se renderice correctamente sin
   * necesidad de props, siendo completamente autónomo.
   *
   * @test {HTMLElement} footer - Footer se renderiza sin props
   * @test {HTMLElement} badgeText - Badge se renderiza sin props
   */
  it("renders without any props (stateless component)", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    const badgeText = screen.getByText(/Powered by/);

    expect(footer).toBeInTheDocument();
    expect(badgeText).toBeInTheDocument();
  });

  /**
   * Test: Clases de espaciado y layout del diseño minimalista
   *
   * Verifica que el footer y el badge tengan el espaciado
   * correcto para el diseño minimalista con mayor separación.
   *
   * @test {string} mt-16 - Margen superior aumentado
   * @test {string} pt-12 - Padding superior aumentado
   * @test {string} px-6 - Padding horizontal del badge
   * @test {string} py-3 - Padding vertical del badge
   * @test {string} gap-3 - Espacio entre elementos del badge
   */
  it("has proper spacing and layout classes", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    const badgeContainer = screen.getByText(/Powered by/).closest("div");

    // Check spacing classes for minimalist design
    expect(footer).toHaveClass("mt-16"); // Margin top
    expect(footer).toHaveClass("pt-12"); // Padding top
    expect(badgeContainer).toHaveClass("px-6"); // Horizontal padding
    expect(badgeContainer).toHaveClass("py-3"); // Vertical padding
    expect(badgeContainer).toHaveClass("gap-3"); // Gap between items
  });

  /**
   * Test: Jerarquía de texto del diseño minimalista
   *
   * Verifica que el texto del badge tenga el tamaño y peso
   * de fuente apropiados para el diseño minimalista.
   *
   * @test {string} text-sm - Tamaño de texto pequeño
   * @test {string} font-medium - Peso de fuente medio
   */
  it("has appropriate text hierarchy", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText(/Powered by/).closest("div");
    expect(badgeContainer).toHaveClass("text-sm");
    expect(badgeContainer).toHaveClass("font-medium");
  });

  /**
   * Test: Efectos visuales del diseño minimalista
   *
   * Verifica que el badge tenga los efectos visuales
   * apropiados para el diseño minimalista.
   *
   * @test {string}  - Efecto de desenfoque
   * @test {string} border - Borde del badge
   * @test {string} border-slate-700/30 - Color del borde con opacidad
   * @test {string} rounded-full - Bordes redondeados
   */
  it("has proper visual effects", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText(/Powered by/).closest("div");

    // Check visual effect classes
    expect(badgeContainer).toHaveClass("");
    expect(badgeContainer).toHaveClass("border");
    expect(badgeContainer).toHaveClass("border-slate-700/30");
    expect(badgeContainer).toHaveClass("rounded-full");
  });
});
