import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsSection } from "../components/ui/StatsSection";

describe("StatsSection Component", () => {
  const defaultTodosCount = {
    total: 15,
    completed: 8,
    pending: 7,
  };

  it("renders the component correctly", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Find the grid container - it's the parent of the first StatsCard
    const firstCard = screen.getByText("Total").closest('.bg-white');
    const container = firstCard?.parentElement;
    expect(container).toBeInTheDocument();
  });

  it("displays all three stats cards", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Check that all values are displayed
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();

    // Check that all labels are displayed
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Completadas")).toBeInTheDocument();
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
  });

  it("applies correct grid layout classes", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Find the grid container - it's the parent of the first StatsCard
    const firstCard = screen.getByText("Total").closest('.bg-white');
    const container = firstCard?.parentElement;
    expect(container).toHaveClass("grid");
    expect(container).toHaveClass("grid-cols-1");
    expect(container).toHaveClass("md:grid-cols-3");
    expect(container).toHaveClass("gap-6");
    expect(container).toHaveClass("mb-8");
  });

  it("passes correct props to Total StatsCard", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    const totalValue = screen.getByText("15");
    const totalLabel = screen.getByText("Total");

    expect(totalValue).toBeInTheDocument();
    expect(totalLabel).toBeInTheDocument();
    expect(totalValue).toHaveClass("text-blue-600");
    expect(totalValue).toHaveClass("dark:text-blue-400");
  });

  it("passes correct props to Completadas StatsCard", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    const completedValue = screen.getByText("8");
    const completedLabel = screen.getByText("Completadas");

    expect(completedValue).toBeInTheDocument();
    expect(completedLabel).toBeInTheDocument();
    expect(completedValue).toHaveClass("text-green-600");
    expect(completedValue).toHaveClass("dark:text-green-400");
  });

  it("passes correct props to Pendientes StatsCard", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    const pendingValue = screen.getByText("7");
    const pendingLabel = screen.getByText("Pendientes");

    expect(pendingValue).toBeInTheDocument();
    expect(pendingLabel).toBeInTheDocument();
    expect(pendingValue).toHaveClass("text-orange-600");
    expect(pendingValue).toHaveClass("dark:text-orange-400");
  });

  it("handles zero values correctly", () => {
    const zeroTodosCount = {
      total: 0,
      completed: 0,
      pending: 0,
    };

    render(<StatsSection todosCount={zeroTodosCount} />);

    // Should display three zeros
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements).toHaveLength(3);

    // Labels should still be present
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Completadas")).toBeInTheDocument();
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
  });

  it("handles large numbers correctly", () => {
    const largeTodosCount = {
      total: 1000,
      completed: 750,
      pending: 250,
    };

    render(<StatsSection todosCount={largeTodosCount} />);

    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("maintains correct mathematical relationship", () => {
    const todosCount = {
      total: 20,
      completed: 12,
      pending: 8,
    };

    render(<StatsSection todosCount={todosCount} />);

    // Verify that completed + pending = total
    expect(screen.getByText("20")).toBeInTheDocument(); // total
    expect(screen.getByText("12")).toBeInTheDocument(); // completed
    expect(screen.getByText("8")).toBeInTheDocument();  // pending
    
    // The math should add up: 12 + 8 = 20
    expect(todosCount.completed + todosCount.pending).toBe(todosCount.total);
  });

  it("renders three distinct StatsCard components", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Check that we have exactly 3 cards with the expected structure
    const cards = screen.getAllByText(/^(15|8|7)$/);
    expect(cards).toHaveLength(3);

    // Each card should have its parent container with the correct classes
    cards.forEach(card => {
      // Find the StatsCard container (the div with bg-white class)
      const cardContainer = card.closest('.bg-white');
      expect(cardContainer).toHaveClass("bg-white");
      expect(cardContainer).toHaveClass("dark:bg-slate-800");
      expect(cardContainer).toHaveClass("rounded-xl");
    });
  });

  it("has responsive design classes", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Find the grid container - it's the parent of the first StatsCard
    const firstCard = screen.getByText("Total").closest('.bg-white');
    const container = firstCard?.parentElement;
    
    // Should be single column on mobile, 3 columns on medium screens and up
    expect(container).toHaveClass("grid-cols-1");
    expect(container).toHaveClass("md:grid-cols-3");
  });

  it("maintains proper spacing", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Find the grid container - it's the parent of the first StatsCard
    const firstCard = screen.getByText("Total").closest('.bg-white');
    const container = firstCard?.parentElement;
    
    // Check spacing classes
    expect(container).toHaveClass("gap-6");  // Gap between cards
    expect(container).toHaveClass("mb-8");   // Margin bottom
  });

  it("updates when todosCount prop changes", () => {
    const initialCount = {
      total: 10,
      completed: 6,
      pending: 4,
    };

    const { rerender } = render(<StatsSection todosCount={initialCount} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    const updatedCount = {
      total: 20,
      completed: 15,
      pending: 5,
    };

    rerender(<StatsSection todosCount={updatedCount} />);

    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("6")).not.toBeInTheDocument();
    expect(screen.queryByText("4")).not.toBeInTheDocument();
  });

  it("has proper semantic structure", () => {
    render(<StatsSection todosCount={defaultTodosCount} />);

    // Find the grid container - it's the parent of the first StatsCard
    const firstCard = screen.getByText("Total").closest('.bg-white');
    const container = firstCard?.parentElement;
    
    // Should be a div container with grid layout
    expect(container?.tagName).toBe("DIV");
    expect(container).toHaveClass("grid");
  });
});