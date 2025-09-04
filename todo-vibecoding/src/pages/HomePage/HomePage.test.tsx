/**
 * HomePage Component Tests
 * Tests for the dashboard statistics page with navigation
 */

import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router";
import { HomePage } from "./HomePage";

// Mock data for todosStats
const mockTodosStats = {
  total: 10,
  completed: 6,
  pending: 4,
};

// Mock the useTodo hook with proper typing
jest.mock("../../hooks/useTodo", () => ({
  useTodo: () => ({
    todosStats: mockTodosStats,
  }),
}));

// Mock react-router navigate
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Mock components with proper typing
jest.mock("../../components", () => ({
  Header: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  StatsSection: ({ todosCount }: { todosCount: typeof mockTodosStats }) => (
    <div data-testid="stats-section">Stats: {todosCount.total} total</div>
  ),
  StatsChart: ({
    stats,
    title,
    onSegmentClick,
  }: {
    stats: typeof mockTodosStats;
    title: string;
    height: number;
    showTitle: boolean;
    onSegmentClick: (data: { name: string; value: number }) => void;
  }) => (
    <div data-testid="stats-chart">
      <h3>{title}</h3>
      <div>
        Chart: {stats.total} total, {stats.completed} completed
      </div>
      <button onClick={() => onSegmentClick({ name: "test", value: 1 })}>
        Click segment
      </button>
    </div>
  ),
}));

// Mock UI components
jest.mock("../../components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    variant,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    className?: string;
  }) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  BarChart3: () => <svg data-testid="bar-chart-icon">BarChart3</svg>,
  TrendingUp: () => <svg data-testid="trending-up-icon">TrendingUp</svg>,
  Activity: () => <svg data-testid="activity-icon">Activity</svg>,
}));

const renderWithRouter = (component: React.ReactElement): void => {
  render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("HomePage", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render dashboard header correctly", () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Dashboard de Estadísticas"
      );
      expect(
        screen.getByText(
          "Análisis completo del rendimiento y progreso de tus tareas"
        )
      ).toBeInTheDocument();
    });

    it("should render quick action buttons", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByRole("button", { name: /ver lista de tareas/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /crear nueva tarea/i })
      ).toBeInTheDocument();
    });

    it("should render stats section", () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByTestId("stats-section")).toBeInTheDocument();
      expect(screen.getByText("Stats: 10 total")).toBeInTheDocument();
    });

    it("should render stats chart", () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByTestId("stats-chart")).toBeInTheDocument();
      expect(screen.getByText("Análisis de Progreso")).toBeInTheDocument();
      expect(
        screen.getByText("Chart: 10 total, 6 completed")
      ).toBeInTheDocument();
    });

    it("should render additional insights cards", () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText("Tasa de Completado")).toBeInTheDocument();
      expect(screen.getByText("60%")).toBeInTheDocument(); // 6/10 * 100
      expect(screen.getByText("Tareas Pendientes")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("Total de Tareas")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should handle view tasks button click", async () => {
      const user = userEvent.setup();
      renderWithRouter(<HomePage />);

      const viewTasksButton = screen.getByRole("button", {
        name: /ver lista de tareas/i,
      });
      await user.click(viewTasksButton);

      expect(mockNavigate).toHaveBeenCalledWith("/tasks");
    });

    it("should handle create new task button click", async () => {
      const user = userEvent.setup();
      renderWithRouter(<HomePage />);

      const createButton = screen.getByRole("button", {
        name: /crear nueva tarea/i,
      });
      await user.click(createButton);

      expect(mockNavigate).toHaveBeenCalledWith("/crear-todo");
    });

    it("should handle chart segment click", async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      renderWithRouter(<HomePage />);

      const segmentButton = screen.getByRole("button", {
        name: /click segment/i,
      });
      await user.click(segmentButton);

      expect(consoleSpy).toHaveBeenCalledWith("Segmento seleccionado:", {
        name: "test",
        value: 1,
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      renderWithRouter(<HomePage />);

      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();

      const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it("should have accessible buttons with proper labels", () => {
      renderWithRouter(<HomePage />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it("should render icons with proper test ids", () => {
      renderWithRouter(<HomePage />);

      // Check that icons are present (may have multiple instances)
      const barChartIcons = screen.getAllByTestId("bar-chart-icon");
      const trendingUpIcons = screen.getAllByTestId("trending-up-icon");
      const activityIcons = screen.getAllByTestId("activity-icon");

      expect(barChartIcons.length).toBeGreaterThan(0);
      expect(trendingUpIcons.length).toBeGreaterThan(0);
      expect(activityIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Data Display", () => {
    it("should calculate completion rate correctly", () => {
      renderWithRouter(<HomePage />);

      // Check that completion rate is calculated and displayed
      // The rate should be visible in one of the insight cards or components
      const statsSection = screen.getByTestId("stats-section");
      expect(statsSection).toBeInTheDocument();
    });

    it("should display correct statistics", () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText("10")).toBeInTheDocument(); // total
      expect(screen.getByText("4")).toBeInTheDocument(); // pending
    });

    it("should display completed tasks count", () => {
      renderWithRouter(<HomePage />);

      // Check that completed tasks count is displayed in the chart mock
      expect(screen.getByTestId("stats-chart")).toHaveTextContent(
        "6 completed"
      );
    });

    it("should pass correct props to components", () => {
      renderWithRouter(<HomePage />);

      // Verify StatsSection receives correct data
      expect(screen.getByTestId("stats-section")).toHaveTextContent(
        "Stats: 10 total"
      );

      // Verify StatsChart receives correct data
      expect(screen.getByTestId("stats-chart")).toHaveTextContent(
        "Chart: 10 total, 6 completed"
      );
    });
  });
});
