import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { Footer } from "./Footer";

// Mock para react-router
const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Footer", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render footer with correct structure", () => {
      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getByText("Todo VibeCoding")).toBeInTheDocument();
      expect(
        screen.getByText(/Gestiona tus tareas de manera eficiente/)
      ).toBeInTheDocument();
    });

    it("should display current year in copyright", () => {
      const currentYear = new Date().getFullYear();

      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      expect(
        screen.getByText(new RegExp(`© ${currentYear} Todo VibeCoding`))
      ).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("should render all navigation links correctly", () => {
      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      // Navigation section
      expect(screen.getByText("Navegación")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute(
        "href",
        "/"
      );
      expect(screen.getByRole("link", { name: "Mis Tareas" })).toHaveAttribute(
        "href",
        "/tasks"
      );
      expect(screen.getByRole("link", { name: "Crear Tarea" })).toHaveAttribute(
        "href",
        "/crear-todo"
      );
    });

    it("should render all support links correctly", () => {
      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      // Support section
      expect(screen.getByText("Soporte")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Ayuda" })).toHaveAttribute(
        "href",
        "/help"
      );
      expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute(
        "href",
        "/contact"
      );
      expect(screen.getByRole("link", { name: "Privacidad" })).toHaveAttribute(
        "href",
        "/privacy"
      );
      expect(screen.getByRole("link", { name: "Términos" })).toHaveAttribute(
        "href",
        "/terms"
      );
    });
  });

  describe("Social Links", () => {
    it("should render social media links with correct attributes", () => {
      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      expect(screen.getByText("Síguenos")).toBeInTheDocument();

      const githubLink = screen.getByLabelText("GitHub");
      expect(githubLink).toHaveAttribute("href", "https://github.com");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

      const twitterLink = screen.getByLabelText("Twitter");
      expect(twitterLink).toHaveAttribute("href", "https://twitter.com");
      expect(twitterLink).toHaveAttribute("target", "_blank");
      expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");

      const emailLink = screen.getByLabelText("Email");
      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:contact@todovibecoding.com"
      );
    });
  });

  describe("Brand Section", () => {
    it("should render brand logo and description", () => {
      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      const brandLink = screen.getByRole("link", { name: /Todo VibeCoding/ });
      expect(brandLink).toHaveAttribute("href", "/");
      expect(brandLink).toHaveClass(
        "flex",
        "items-center",
        "gap-2",
        "font-bold",
        "text-lg"
      );

      expect(
        screen.getByText(/Gestiona tus tareas de manera eficiente/)
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility attributes", () => {
      render(
        <MockRouter>
          <Footer />
        </MockRouter>
      );

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();

      // Check aria-labels for social links
      expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });
  });
});
