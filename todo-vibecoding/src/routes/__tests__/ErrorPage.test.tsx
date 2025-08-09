/**
 * ErrorPage Component Tests
 * Tests for the 404 and error handling page
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router";
import { ErrorPage } from "../ErrorPage";

// Mock react-router's useRouteError hook
const mockUseRouteError = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useRouteError: () => mockUseRouteError(),
}));

// Mock components
jest.mock("../../components", () => ({
  Header: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  Footer: () => <footer>Footer</footer>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("ErrorPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the error page elements", () => {
    mockUseRouteError.mockReturnValue(null);
    renderWithRouter(<ErrorPage />);

    expect(screen.getByText("¡Oops! Algo salió mal")).toBeInTheDocument();
    expect(
      screen.getByText("La página que buscas no existe")
    ).toBeInTheDocument();
    expect(screen.getByText("Página no encontrada")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Lo sentimos, la página que estás buscando no existe o ha sido movida."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders the back to home link", () => {
    mockUseRouteError.mockReturnValue(null);
    renderWithRouter(<ErrorPage />);

    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("displays error message when error is present", () => {
    const mockError = new Error("Test error message");
    mockUseRouteError.mockReturnValue(mockError);

    renderWithRouter(<ErrorPage />);

    expect(screen.getByText("Test error message")).toBeInTheDocument();
    expect(screen.getByText("Error:")).toBeInTheDocument();
  });

  it("displays unknown error message when error has no message", () => {
    const mockError = { message: "" };
    mockUseRouteError.mockReturnValue(mockError);

    renderWithRouter(<ErrorPage />);

    expect(screen.getByText("Error desconocido")).toBeInTheDocument();
    expect(screen.getByText("Error:")).toBeInTheDocument();
  });

  it("does not display error section when no error is present", () => {
    mockUseRouteError.mockReturnValue(null);
    renderWithRouter(<ErrorPage />);

    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  it("displays the search emoji icon", () => {
    mockUseRouteError.mockReturnValue(null);
    renderWithRouter(<ErrorPage />);

    expect(screen.getByText("🔍")).toBeInTheDocument();
  });

  it("applies correct CSS classes to the back button", () => {
    mockUseRouteError.mockReturnValue(null);
    renderWithRouter(<ErrorPage />);

    const backButton = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backButton).toHaveClass(
      "inline-block",
      "px-6",
      "py-3",
      "bg-blue-600",
      "text-white",
      "rounded-lg"
    );
  });

  it("handles error objects without message property", () => {
    const mockError = { someOtherProperty: "value" };
    mockUseRouteError.mockReturnValue(mockError);

    renderWithRouter(<ErrorPage />);

    expect(screen.getByText("Error desconocido")).toBeInTheDocument();
    expect(screen.getByText("Error:")).toBeInTheDocument();
  });
});
