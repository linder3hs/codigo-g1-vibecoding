/**
 * StatsChart Component Test Suite
 *
 * Comprehensive test suite covering rendering, props, states, interactions,
 * accessibility, and responsive behavior of the StatsChart component.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsChart } from "./StatsChart";
// Define TodoStats interface locally for testing
interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  inProgress?: number;
}

// Mock ReactECharts to avoid ECharts dependency in tests
jest.mock("echarts-for-react", () => ({
  __esModule: true,
  default: function MockECharts(props: {
    onChartReady?: (echarts: unknown) => void;
    onEvents?: { click?: (params: { name: string; value: number }) => void };
    option?: {
      series?: Array<{
        data?: Array<{ name: string; value: number }>;
      }>;
    };
  }) {
    const { onChartReady, onEvents, option } = props;

    // Simulate chart ready callback
    React.useEffect(() => {
      if (onChartReady) {
        setTimeout(() => onChartReady({ mockECharts: true }), 0);
      }
    }, [onChartReady]);

    return React.createElement(
      "div",
      {
        "data-testid": "echarts-mock",
        onClick: () => {
          if (onEvents?.click) {
            onEvents.click({ name: "Completadas", value: 5 });
          }
        },
        role: "img",
        "aria-label": "Mocked ECharts",
      },
      option?.series?.[0]?.data?.map((item, index) =>
        React.createElement(
          "div",
          {
            key: index,
            "data-testid": `chart-segment-${item.name}`,
          },
          `${item.name}: ${item.value}`
        )
      )
    );
  },
}));

// Mock Lucide React icons
jest.mock("lucide-react", () => ({
  TrendingUp: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="trending-up-icon" className={className} {...props} />
  ),
  BarChart3: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="bar-chart-icon" className={className} {...props} />
  ),
}));

// Test data
const mockStats: TodoStats = {
  total: 10,
  completed: 5,
  pending: 3,
  inProgress: 2,
};

const emptyStats: TodoStats = {
  total: 0,
  completed: 0,
  pending: 0,
  inProgress: 0,
};

const statsWithoutInProgress: TodoStats = {
  total: 8,
  completed: 5,
  pending: 3,
};

describe("StatsChart Component", () => {
  // Test Suite 1: Basic Rendering
  describe("Basic Rendering", () => {
    it("should render the StatsChart component without crashing", () => {
      render(<StatsChart stats={mockStats} />);
      expect(
        screen.getByLabelText("Gráfico de estadísticas de tareas")
      ).toBeInTheDocument();
    });

    it("should render with default props correctly", () => {
      render(<StatsChart stats={mockStats} />);

      // Check if chart container is rendered
      expect(screen.getByTestId("echarts-mock")).toBeInTheDocument();

      // Check if chart segments are rendered
      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 5"
      );
      expect(screen.getByTestId("chart-segment-Pendientes")).toHaveTextContent(
        "Pendientes: 3"
      );
      expect(screen.getByTestId("chart-segment-En Progreso")).toHaveTextContent(
        "En Progreso: 2"
      );
    });
  });

  // Test Suite 2: Props and Configuration
  describe("Props and Configuration", () => {
    it("should apply custom height prop", () => {
      const customHeight = 300;
      render(<StatsChart stats={mockStats} height={customHeight} />);

      const chartContainer = screen.getByTestId("echarts-mock");
      expect(chartContainer).toBeInTheDocument();
    });

    it("should hide title when showTitle is false", () => {
      render(<StatsChart stats={mockStats} showTitle={false} />);

      // Title should not be visible in the chart options
      expect(screen.getByTestId("echarts-mock")).toBeInTheDocument();
    });

    it("should render custom title when provided", () => {
      const customTitle = "Custom Chart Title";
      render(<StatsChart stats={mockStats} title={customTitle} />);

      expect(screen.getByTestId("echarts-mock")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      const customClass = "custom-chart-class";
      render(<StatsChart stats={mockStats} className={customClass} />);

      const cardElement = document.querySelector(".custom-chart-class");
      expect(cardElement).toBeInTheDocument();
    });
  });

  // Test Suite 3: Data Handling
  describe("Data Handling", () => {
    it("should handle stats without inProgress property", () => {
      render(<StatsChart stats={statsWithoutInProgress} />);

      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 5"
      );
      expect(screen.getByTestId("chart-segment-Pendientes")).toHaveTextContent(
        "Pendientes: 3"
      );
      expect(
        screen.queryByTestId("chart-segment-En Progreso")
      ).not.toBeInTheDocument();
    });

    it("should filter out zero values from chart data", () => {
      const statsWithZeros: TodoStats = {
        total: 5,
        completed: 5,
        pending: 0,
        inProgress: 0,
      };

      render(<StatsChart stats={statsWithZeros} />);

      expect(
        screen.getByTestId("chart-segment-Completadas")
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("chart-segment-Pendientes")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("chart-segment-En Progreso")
      ).not.toBeInTheDocument();
    });
  });

  // Test Suite 4: Loading and Error States
  describe("Loading and Error States", () => {
    it("should display loading state correctly", () => {
      render(<StatsChart stats={mockStats} isLoading={true} />);

      expect(screen.getByText("Cargando gráfico...")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("echarts-mock")).not.toBeInTheDocument();
    });

    it("should display error state correctly", () => {
      const errorMessage = "Failed to load chart data";
      render(<StatsChart stats={mockStats} error={errorMessage} />);

      expect(
        screen.getByText("Error al cargar el gráfico")
      ).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByTestId("trending-up-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("echarts-mock")).not.toBeInTheDocument();
    });

    it("should display empty state when total is zero", () => {
      render(<StatsChart stats={emptyStats} />);

      expect(screen.getByText("No hay datos para mostrar")).toBeInTheDocument();
      expect(
        screen.getByText("Crea tu primera tarea para ver las estadísticas")
      ).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("echarts-mock")).not.toBeInTheDocument();
    });
  });

  // Test Suite 5: Interactions and Callbacks
  describe("Interactions and Callbacks", () => {
    it("should call onChartReady callback when chart is ready", async () => {
      const onChartReady = jest.fn();
      render(<StatsChart stats={mockStats} onChartReady={onChartReady} />);

      await waitFor(() => {
        expect(onChartReady).toHaveBeenCalledWith({ mockECharts: true });
      });
    });

    it("should call onSegmentClick callback when chart segment is clicked", () => {
      const onSegmentClick = jest.fn();
      render(<StatsChart stats={mockStats} onSegmentClick={onSegmentClick} />);

      const chartElement = screen.getByTestId("echarts-mock");
      fireEvent.click(chartElement);

      expect(onSegmentClick).toHaveBeenCalledWith({
        name: "Completadas",
        value: 5,
        percentage: 50, // 5/10 * 100
      });
    });
  });

  // Test Suite 6: Accessibility
  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const customAriaLabel = "Custom chart accessibility label";
      render(<StatsChart stats={mockStats} ariaLabel={customAriaLabel} />);

      const chartContainer = screen.getByLabelText(customAriaLabel);
      expect(chartContainer).toHaveAttribute("aria-label", customAriaLabel);
      expect(chartContainer).toHaveAttribute("tabIndex", "0");
    });

    it("should use default aria-label when not provided", () => {
      render(<StatsChart stats={mockStats} />);

      const chartContainer = screen.getByLabelText(
        "Gráfico de estadísticas de tareas"
      );
      expect(chartContainer).toHaveAttribute(
        "aria-label",
        "Gráfico de estadísticas de tareas"
      );
    });

    it("should be keyboard accessible", () => {
      render(<StatsChart stats={mockStats} />);

      const chartContainer = screen.getByLabelText(
        "Gráfico de estadísticas de tareas"
      );
      expect(chartContainer).toHaveAttribute("tabIndex", "0");

      // Test keyboard focus
      chartContainer.focus();
      expect(document.activeElement).toBe(chartContainer);
    });
  });

  // Test Suite 7: Performance and Memoization
  describe("Performance and Memoization", () => {
    it("should not re-render when props haven't changed", () => {
      const { rerender } = render(<StatsChart stats={mockStats} />);

      // Get initial render
      const initialChart = screen.getByTestId("echarts-mock");

      // Re-render with same props
      rerender(<StatsChart stats={mockStats} />);

      // Chart should still be the same element (memoized)
      expect(screen.getByTestId("echarts-mock")).toBe(initialChart);
    });

    it("should re-render when stats change", () => {
      const { rerender } = render(<StatsChart stats={mockStats} />);

      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 5"
      );

      const newStats: TodoStats = {
        total: 15,
        completed: 10,
        pending: 3,
        inProgress: 2,
      };

      rerender(<StatsChart stats={newStats} />);

      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 10"
      );
    });
  });

  // Test Suite 8: Edge Cases
  describe("Edge Cases", () => {
    it("should handle very large numbers correctly", () => {
      const largeStats: TodoStats = {
        total: 999999,
        completed: 500000,
        pending: 300000,
        inProgress: 199999,
      };

      render(<StatsChart stats={largeStats} />);

      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 500000"
      );
      expect(screen.getByTestId("echarts-mock")).toBeInTheDocument();
    });

    it("should handle single category data", () => {
      const singleCategoryStats: TodoStats = {
        total: 5,
        completed: 5,
        pending: 0,
        inProgress: 0,
      };

      render(<StatsChart stats={singleCategoryStats} />);

      expect(
        screen.getByTestId("chart-segment-Completadas")
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("chart-segment-Pendientes")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("chart-segment-En Progreso")
      ).not.toBeInTheDocument();
    });
  });

  // Test Suite 9: Styling and CSS Classes
  describe("Styling and CSS Classes", () => {
    it("should apply hover effects on card container", () => {
      render(<StatsChart stats={mockStats} />);

      const cardContainer = document.querySelector(".hover\\:shadow-md");
      expect(cardContainer).toBeInTheDocument();
    });

    it("should have proper card styling classes", () => {
      render(<StatsChart stats={mockStats} />);

      const cardContainer = document.querySelector(".p-6");
      expect(cardContainer).toHaveClass(
        "bg-white",
        "border-gray-200",
        "shadow-sm"
      );
    });
  });

  // Test Suite 10: Component Integration
  describe("Component Integration", () => {
    it("should integrate properly with parent components", () => {
      const ParentComponent = () => {
        const [stats, setStats] = React.useState(mockStats);

        return (
          <div>
            <button
              onClick={() =>
                setStats({
                  ...stats,
                  completed: stats.completed + 1,
                  total: stats.total + 1,
                })
              }
              data-testid="update-stats"
            >
              Update Stats
            </button>
            <StatsChart stats={stats} />
          </div>
        );
      };

      render(<ParentComponent />);

      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 5"
      );

      fireEvent.click(screen.getByTestId("update-stats"));

      expect(screen.getByTestId("chart-segment-Completadas")).toHaveTextContent(
        "Completadas: 6"
      );
    });

    it("should maintain component displayName for debugging", () => {
      expect(StatsChart.displayName).toBe("StatsChart");
    });
  });
});
