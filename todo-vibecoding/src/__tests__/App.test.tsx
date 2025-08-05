import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("App Component", () => {
  it("renders the main title correctly", () => {
    render(<App />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Lista de Tareas");
  });

  it("renders the subtitle correctly", () => {
    render(<App />);

    const subtitle = screen.getByText(
      "Gestiona tus tareas de manera eficiente"
    );
    expect(subtitle).toBeInTheDocument();
  });

  it("displays statistics section with correct values", () => {
    render(<App />);

    // Check for stats cards - there should be multiple elements with these texts
    const totalLabels = screen.getAllByText("Total");
    const completedLabels = screen.getAllByText("Completadas");
    const pendingLabels = screen.getAllByText("Pendientes");

    expect(totalLabels.length).toBeGreaterThan(0);
    expect(completedLabels.length).toBeGreaterThan(0);
    expect(pendingLabels.length).toBeGreaterThan(0);
  });

  it("renders filter buttons with correct labels", () => {
    render(<App />);

    const allButton = screen.getByLabelText("Mostrar todas las tareas");
    const pendingButton = screen.getByLabelText("Mostrar tareas pendientes");
    const completedButton = screen.getByLabelText("Mostrar tareas completadas");

    expect(allButton).toBeInTheDocument();
    expect(pendingButton).toBeInTheDocument();
    expect(completedButton).toBeInTheDocument();

    expect(allButton).toHaveTextContent("Todas");
    expect(pendingButton).toHaveTextContent("Pendientes");
    expect(completedButton).toHaveTextContent("Completadas");
  });

  it("changes filter when filter buttons are clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const pendingButton = screen.getByLabelText("Mostrar tareas pendientes");
    const completedButton = screen.getByLabelText("Mostrar tareas completadas");
    const allButton = screen.getByLabelText("Mostrar todas las tareas");

    // Click pending filter
    await user.click(pendingButton);
    expect(pendingButton).toHaveClass("bg-orange-600");

    // Click completed filter
    await user.click(completedButton);
    expect(completedButton).toHaveClass("bg-green-600");

    // Click all filter
    await user.click(allButton);
    expect(allButton).toHaveClass("bg-blue-600");
  });

  it("displays Tailwind CSS badge in footer", () => {
    render(<App />);

    const badge = screen.getByText("Powered by Tailwind CSS v4");
    expect(badge).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<App />);

    // Check for header
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Check for heading hierarchy
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();

    // Check for footer
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("applies correct gradient background classes", () => {
    const { container } = render(<App />);

    // Check the root div has the gradient classes
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass("min-h-screen");
    expect(rootDiv).toHaveClass("bg-gradient-to-br");
  });

  it("renders todo list with existing todos", () => {
    render(<App />);

    // Since we have todos in the data, we should see todo items
    // Look for todo names from our test data
    const todoItem = screen.getByText("Implementar autenticación de usuarios");
    expect(todoItem).toBeInTheDocument();
  });

  it("has proper accessibility attributes on filter buttons", () => {
    render(<App />);

    const filterButtons = screen.getAllByRole("button");

    filterButtons.forEach((button) => {
      expect(button).toHaveAttribute("aria-label");
    });
  });
});
