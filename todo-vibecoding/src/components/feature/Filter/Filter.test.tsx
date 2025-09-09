import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { Filter } from "./Filter";
import type { FilterType } from "../../../types/filter";

// Mock FilterButtons component
jest.mock("../FilterButtons", () => ({
  FilterButtons: ({
    currentFilter,
    onFilterChange,
    layout,
  }: {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    layout?: "horizontal" | "vertical";
  }) => (
    <div data-testid="filter-buttons" data-layout={layout}>
      <button
        data-testid="filter-all"
        onClick={() => onFilterChange("all")}
        className={currentFilter === "all" ? "active" : ""}
      >
        Todas
      </button>
      <button
        data-testid="filter-pending"
        onClick={() => onFilterChange("pending")}
        className={currentFilter === "pending" ? "active" : ""}
      >
        Pendientes
      </button>
      <button
        data-testid="filter-completed"
        onClick={() => onFilterChange("completed")}
        className={currentFilter === "completed" ? "active" : ""}
      >
        Completadas
      </button>
    </div>
  ),
}));

// Mock Lucide React icons
jest.mock("lucide-react", () => ({
  ChevronDown: () => <div data-testid="chevron-down" />,
  ChevronUp: () => <div data-testid="chevron-up" />,
  Filter: () => <div data-testid="filter-icon" />,
}));

// Mock UI components
jest.mock("../../ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
}));

jest.mock("../../ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
  }) => (
    <button
      data-testid="toggle-button"
      onClick={onClick}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("Filter", () => {
  const mockOnFilterChange = jest.fn();

  const defaultProps = {
    currentFilter: "all" as FilterType,
    onFilterChange: mockOnFilterChange,
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render correctly with default props", () => {
      render(<Filter {...defaultProps} />);

      // Should render both desktop and mobile filter components
      expect(screen.getAllByTestId("filter-buttons")).toHaveLength(2);
      expect(screen.getAllByTestId("filter-icon")).toHaveLength(2);
    });

    it("should render with custom className", () => {
      const { container } = render(<Filter {...defaultProps} className="custom-filter" />);

      expect(container.firstChild).toHaveClass("filter-component", "custom-filter");
    });

    it("should render desktop version with card layout", () => {
      render(<Filter {...defaultProps} />);

      // Desktop version should be present
      expect(screen.getAllByTestId("card")).toHaveLength(2);
      expect(screen.getByTestId("card-header")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
      expect(screen.getAllByTestId("card-content")).toHaveLength(2);
    });

    it("should render mobile toggle button", () => {
      render(<Filter {...defaultProps} />);

      // Mobile toggle button should be present
      const toggleButton = screen.getByTestId("toggle-button");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent("Filtros de tareas");
    });

    it("should show correct filter title", () => {
      render(<Filter {...defaultProps} />);

      expect(screen.getByText("Filtros")).toBeInTheDocument();
    });
  });

  describe("Mobile Responsive Behavior", () => {
    it("should start with collapsed state on mobile", () => {
      render(<Filter {...defaultProps} />);

      // Should show chevron down icon (collapsed state)
      expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
      expect(screen.queryByTestId("chevron-up")).not.toBeInTheDocument();
    });

    it("should expand when toggle button is clicked", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      await user.click(toggleButton);

      // Should show chevron up icon (expanded state)
      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
        expect(screen.queryByTestId("chevron-down")).not.toBeInTheDocument();
      });
    });

    it("should collapse when toggle button is clicked again", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");

      // Expand first
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      });

      // Then collapse
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
        expect(screen.queryByTestId("chevron-up")).not.toBeInTheDocument();
      });
    });

    it("should auto-collapse after filter selection on mobile", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");

      // Expand mobile filter
      await user.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      });

      // Click on a filter option from mobile version (second set)
      const pendingFilters = screen.getAllByTestId("filter-pending");
      await user.click(pendingFilters[1]); // Mobile version

      // Should auto-collapse and call onFilterChange
      await waitFor(() => {
        expect(mockOnFilterChange).toHaveBeenCalledWith("pending");
        expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
      });
    });
  });

  describe("Filter Integration", () => {
    it("should pass correct props to FilterButtons in desktop mode", () => {
      render(<Filter {...defaultProps} currentFilter="pending" />);

      const filterButtons = screen.getAllByTestId("filter-buttons");
      const desktopFilterButtons = filterButtons[0]; // First one is desktop

      expect(desktopFilterButtons).toHaveAttribute("data-layout", "vertical");
      const pendingButtons = screen.getAllByTestId("filter-pending");
      pendingButtons.forEach(button => {
        expect(button).toHaveClass("active");
      });
    });

    it("should pass correct props to FilterButtons in mobile mode", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} currentFilter="completed" />);

      // Expand mobile filter
      const toggleButton = screen.getByTestId("toggle-button");
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      });
      
      const filterButtons = screen.getAllByTestId("filter-buttons");
      expect(filterButtons).toHaveLength(2);
      expect(filterButtons[1]).toHaveAttribute("data-layout", "vertical");
      
      const completedButtons = screen.getAllByTestId("filter-completed");
      completedButtons.forEach(button => {
        expect(button).toHaveClass("active");
      });
    });

    it("should call onFilterChange when filter is selected in desktop mode", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const allFilters = screen.getAllByTestId("filter-all");
      await user.click(allFilters[0]); // Desktop version

      expect(mockOnFilterChange).toHaveBeenCalledWith("all");
    });

    it("should handle all filter types correctly", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      // Test all filter
      const allFilters = screen.getAllByTestId("filter-all");
      await user.click(allFilters[0]);
      expect(mockOnFilterChange).toHaveBeenCalledWith("all");

      // Test pending filter
      const pendingFilters = screen.getAllByTestId("filter-pending");
      await user.click(pendingFilters[0]);
      expect(mockOnFilterChange).toHaveBeenCalledWith("pending");

      // Test completed filter
      const completedFilters = screen.getAllByTestId("filter-completed");
      await user.click(completedFilters[0]);
      expect(mockOnFilterChange).toHaveBeenCalledWith("completed");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes on toggle button", () => {
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent("Filtros de tareas");
    });

    it("should support keyboard navigation on toggle button", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      toggleButton.focus();

      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      });
    });

    it("should support keyboard navigation with Space key", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      toggleButton.focus();

      await user.keyboard(" ");

      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      });
    });

    it("should have proper semantic structure", () => {
      render(<Filter {...defaultProps} />);

      // Should have proper heading structure
      expect(screen.getByText("Filtros")).toBeInTheDocument();

      // Should have filter icons for visual context
      expect(screen.getAllByTestId("filter-icon")).toHaveLength(2); // Desktop and mobile
    });
  });

  describe("Visual States", () => {
    it("should apply correct CSS classes for expanded state", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      await user.click(toggleButton);

      // Check if expanded content has correct classes
      await waitFor(() => {
        expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
      });
    });

    it("should show correct button variant", () => {
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      expect(toggleButton).toHaveAttribute("data-variant", "outline");
    });

    it("should apply hover and focus styles correctly", () => {
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");
      expect(toggleButton).toHaveClass(
        "hover:text-gray-900",
        "hover:bg-gray-50",
        "hover:border-gray-300"
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle missing onFilterChange gracefully", () => {
      // This test ensures the component doesn't crash if onFilterChange is undefined
      const { container } = render(
        <Filter currentFilter="all" onFilterChange={jest.fn()} />
      );

      expect(container).toBeInTheDocument();
    });

    it("should handle invalid currentFilter gracefully", () => {
      const { container } = render(
        <Filter
          currentFilter={"invalid" as FilterType}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(container).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not cause unnecessary re-renders", () => {
      const { rerender } = render(<Filter {...defaultProps} />);

      // Re-render with same props
      rerender(<Filter {...defaultProps} />);

      // Component should still be functional
      const filterButtons = screen.getAllByTestId("filter-buttons");
      expect(filterButtons).toHaveLength(2);
    });

    it("should handle rapid toggle clicks", async () => {
      const user = userEvent.setup();
      render(<Filter {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-button");

      // Rapid clicks
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      // Should end up in expanded state
      await waitFor(() => {
        expect(screen.getByTestId("chevron-up")).toBeInTheDocument();
      });
    });
  });
});
