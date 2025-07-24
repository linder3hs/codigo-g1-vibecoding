import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App Component", () => {
  it("renders the main title correctly", () => {
    render(<App />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Vite + React + Tailwind");
  });

  it("renders logos with correct alt text and links", () => {
    render(<App />);

    // Check Vite logo
    const viteLogo = screen.getByAltText("Vite logo");
    expect(viteLogo).toBeInTheDocument();

    // Check React logo
    const reactLogo = screen.getByAltText("React logo");
    expect(reactLogo).toBeInTheDocument();

    // Check links
    const viteLink = screen.getByLabelText("Visit Vite website");
    const reactLink = screen.getByLabelText("Visit React website");

    expect(viteLink).toHaveAttribute("href", "https://vite.dev");
    expect(reactLink).toHaveAttribute("href", "https://react.dev");
    expect(viteLink).toHaveAttribute("target", "_blank");
    expect(reactLink).toHaveAttribute("target", "_blank");
  });

  it("displays initial counter value", () => {
    render(<App />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Count is 0");
  });

  it("increments counter when button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole("button");

    // Initial state
    expect(button).toHaveTextContent("Count is 0");

    // Click once
    await user.click(button);
    expect(button).toHaveTextContent("Count is 1");

    // Click again
    await user.click(button);
    expect(button).toHaveTextContent("Count is 2");
  });

  it("has proper accessibility attributes", () => {
    render(<App />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label");
    expect(button.getAttribute("aria-label")).toContain("Increment counter");

    // Check that links have proper aria-labels
    const viteLink = screen.getByLabelText("Visit Vite website");
    const reactLink = screen.getByLabelText("Visit React website");

    expect(viteLink).toBeInTheDocument();
    expect(reactLink).toBeInTheDocument();
  });

  it("displays HMR instruction text", () => {
    render(<App />);

    const instruction = screen.getByText(
      "Click on the Vite and React logos to learn more"
    );
    expect(instruction).toBeInTheDocument();
  });

  it("displays Tailwind CSS badge", () => {
    render(<App />);

    const badge = screen.getByText("Powered by Tailwind CSS v4");
    expect(badge).toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<App />);

    // Check for main landmark
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Check for heading hierarchy
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("applies correct CSS classes for styling", () => {
    render(<App />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gradient-to-r");
    expect(button).toHaveClass("from-blue-500");
    expect(button).toHaveClass("to-purple-600");
  });
});
