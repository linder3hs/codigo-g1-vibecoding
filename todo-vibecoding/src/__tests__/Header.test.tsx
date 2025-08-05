import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Header } from "../components/ui/Header";

describe("Header Component", () => {
  const defaultProps = {
    title: "Lista de Tareas",
    subtitle: "Gestiona tus tareas de manera eficiente",
  };

  it("renders the title correctly", () => {
    render(<Header {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Lista de Tareas");
  });

  it("renders the subtitle correctly", () => {
    render(<Header {...defaultProps} />);

    const subtitle = screen.getByText(
      "Gestiona tus tareas de manera eficiente"
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("applies correct CSS classes for title styling", () => {
    render(<Header {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("text-4xl");
    expect(title).toHaveClass("md:text-5xl");
    expect(title).toHaveClass("font-bold");
    expect(title).toHaveClass("bg-gradient-to-r");
    expect(title).toHaveClass("from-blue-600");
    expect(title).toHaveClass("to-purple-600");
    expect(title).toHaveClass("bg-clip-text");
    expect(title).toHaveClass("text-transparent");
  });

  it("applies correct CSS classes for subtitle styling", () => {
    render(<Header {...defaultProps} />);

    const subtitle = screen.getByText(
      "Gestiona tus tareas de manera eficiente"
    );
    expect(subtitle).toHaveClass("text-gray-600");
    expect(subtitle).toHaveClass("dark:text-gray-300");
    expect(subtitle).toHaveClass("text-lg");
  });

  it("has proper semantic structure with header element", () => {
    render(<Header {...defaultProps} />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("text-center");
    expect(header).toHaveClass("mb-12");
  });

  it("renders with custom title and subtitle", () => {
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

  it("maintains proper heading hierarchy", () => {
    render(<Header {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.tagName).toBe("H1");
  });

  it("has accessible text content", () => {
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

  it("renders correctly with empty strings", () => {
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

  it("handles long text content properly", () => {
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

  it("maintains responsive design classes", () => {
    render(<Header {...defaultProps} />);

    const title = screen.getByRole("heading", { level: 1 });

    // Check responsive classes are present
    expect(title).toHaveClass("text-4xl"); // Base size
    expect(title).toHaveClass("md:text-5xl"); // Medium screen size
  });
});
