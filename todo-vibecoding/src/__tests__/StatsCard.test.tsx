import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsCard } from "../components/ui/StatsCard";

describe("StatsCard Component", () => {
  const defaultProps = {
    value: 10,
    label: "Test Label",
    color: "blue" as const,
  };

  it("renders the component correctly", () => {
    render(<StatsCard {...defaultProps} />);

    const card = screen.getByText("10").closest('div');
    expect(card).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("displays the correct value", () => {
    render(<StatsCard {...defaultProps} value={25} />);

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  it("displays the correct label", () => {
    render(<StatsCard {...defaultProps} label="Custom Label" />);

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
    expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
  });

  it("applies correct base CSS classes", () => {
    render(<StatsCard {...defaultProps} />);

    const card = screen.getByText("10").closest('.bg-white');
    expect(card).toHaveClass("bg-white");
    expect(card).toHaveClass("dark:bg-slate-800");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("p-6");
    expect(card).toHaveClass("shadow-lg");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("border-gray-200");
    expect(card).toHaveClass("dark:border-slate-700");
  });

  it("applies correct text styling classes", () => {
    render(<StatsCard {...defaultProps} />);

    const valueElement = screen.getByText("10");
    const labelElement = screen.getByText("Test Label");

    expect(valueElement).toHaveClass("text-3xl");
    expect(valueElement).toHaveClass("font-bold");
    
    expect(labelElement).toHaveClass("text-sm");
    expect(labelElement).toHaveClass("text-gray-600");
    expect(labelElement).toHaveClass("dark:text-gray-300");
    expect(labelElement).toHaveClass("mt-1");
  });

  describe("Color variants", () => {
    it("applies blue color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="blue" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass("text-blue-600");
      expect(valueElement).toHaveClass("dark:text-blue-400");
    });

    it("applies green color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="green" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass("text-green-600");
      expect(valueElement).toHaveClass("dark:text-green-400");
    });

    it("applies orange color classes correctly", () => {
      render(<StatsCard {...defaultProps} color="orange" />);

      const valueElement = screen.getByText("10");
      expect(valueElement).toHaveClass("text-orange-600");
      expect(valueElement).toHaveClass("dark:text-orange-400");
    });
  });

  it("has proper layout structure", () => {
    render(<StatsCard {...defaultProps} />);

    const centerDiv = screen.getByText("10").parentElement;
    expect(centerDiv).toHaveClass("text-center");
  });

  it("handles zero value correctly", () => {
    render(<StatsCard {...defaultProps} value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles large numbers correctly", () => {
    render(<StatsCard {...defaultProps} value={9999} />);

    expect(screen.getByText("9999")).toBeInTheDocument();
  });

  it("handles negative numbers correctly", () => {
    render(<StatsCard {...defaultProps} value={-5} />);

    expect(screen.getByText("-5")).toBeInTheDocument();
  });

  it("applies dark mode styling correctly", () => {
    render(<StatsCard value={42} label="Test" color="blue" />);
    
    // Find the main container (the outermost div)
    const containerElement = screen.getByText("42").closest('.bg-white');
    const labelElement = screen.getByText("Test");
    const valueElement = screen.getByText("42");
    
    expect(containerElement).toHaveClass("dark:bg-slate-800");
    expect(containerElement).toHaveClass("dark:border-slate-700");
    expect(labelElement).toHaveClass("dark:text-gray-300");
    expect(valueElement).toHaveClass("dark:text-blue-400");
  });

  it("has accessible text contrast", () => {
    render(<StatsCard {...defaultProps} />);

    const valueElement = screen.getByText("10");
    const labelElement = screen.getByText("Test Label");

    // Check that appropriate color classes are applied for contrast
    expect(valueElement).toHaveClass("text-blue-600");
    expect(labelElement).toHaveClass("text-gray-600");
  });

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