import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Layout, CenteredLayout, DashboardLayout } from "./Layout";

// Mock child components
jest.mock("../Navigation/Navigation", () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}));

jest.mock("./Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("./NotificationSystem", () => ({
  __esModule: true,
  default: () => <div data-testid="notification-system">Notifications</div>,
}));

// Mock cn utility
jest.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" "),
}));

const TestContent = () => <div data-testid="test-content">Test Content</div>;

describe("Layout Components", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Layout - Basic Rendering", () => {
    it("should render with default props and all sections", () => {
      render(
        <Layout>
          <TestContent />
        </Layout>
      );

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByTestId("navigation")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("notification-system")).toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });

    it("should render children correctly in main content area", () => {
      render(
        <Layout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Layout>
      );

      const main = screen.getByRole("main");
      expect(main).toContainElement(screen.getByTestId("child-1"));
      expect(main).toContainElement(screen.getByTestId("child-2"));
      expect(screen.getByText("Child 1")).toBeInTheDocument();
      expect(screen.getByText("Child 2")).toBeInTheDocument();
    });
  });

  describe("Layout - Conditional Rendering", () => {
    it("should hide navigation when showNavigation is false", () => {
      render(
        <Layout showNavigation={false}>
          <TestContent />
        </Layout>
      );

      expect(screen.queryByTestId("navigation")).not.toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });

    it("should hide footer when showFooter is false", () => {
      render(
        <Layout showFooter={false}>
          <TestContent />
        </Layout>
      );

      expect(screen.getByTestId("navigation")).toBeInTheDocument();
      expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });

    it("should apply fullWidth layout correctly", () => {
      render(
        <Layout fullWidth className="custom-class">
          <TestContent />
        </Layout>
      );

      const main = screen.getByRole("main");
      expect(main).toHaveClass(
        "flex-1",
        "flex",
        "flex-col",
        "w-full",
        "custom-class"
      );
      expect(main).not.toHaveClass("container", "mx-auto", "px-4", "py-6");
    });
  });

  describe("CenteredLayout", () => {
    it("should render centered layout without navigation and footer", () => {
      render(
        <CenteredLayout className="centered-custom">
          <TestContent />
        </CenteredLayout>
      );

      expect(screen.queryByTestId("navigation")).not.toBeInTheDocument();
      expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
      expect(screen.getByTestId("notification-system")).toBeInTheDocument();

      // Check that main has fullWidth layout
      const main = screen.getByRole("main");
      expect(main).toHaveClass("w-full");
    });
  });

  describe("DashboardLayout", () => {
    it("should render dashboard layout with sidebar", () => {
      const Sidebar = () => <div data-testid="sidebar">Sidebar Content</div>;

      render(
        <DashboardLayout sidebar={<Sidebar />} className="dashboard-custom">
          <TestContent />
        </DashboardLayout>
      );

      expect(screen.getByTestId("navigation")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();

      // Check sidebar structure
      const aside = screen.getByRole("complementary");
      expect(aside).toHaveClass("w-64", "border-r", "bg-muted/30", "p-4");
      expect(aside).toContainElement(screen.getByTestId("sidebar"));
    });

    it("should render dashboard layout without sidebar", () => {
      render(
        <DashboardLayout>
          <TestContent />
        </DashboardLayout>
      );

      expect(screen.getByTestId("navigation")).toBeInTheDocument();
      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
      expect(screen.getByTestId("test-content")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure and ARIA roles", () => {
      render(
        <Layout>
          <TestContent />
        </Layout>
      );

      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("role", "main");
      expect(main).toBeInTheDocument();

      // Check that content is properly nested within main
      expect(main).toContainElement(screen.getByTestId("test-content"));
    });
  });
});
