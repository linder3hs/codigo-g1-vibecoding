import "@testing-library/jest-dom";
import { render, screen, cleanup, act } from "@testing-library/react";
import { NotificationSystem } from "./NotificationSystem";
import { toast } from "sonner";

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock Toaster component
interface MockToasterProps {
  position?: string;
  expand?: boolean;
  richColors?: boolean;
  closeButton?: boolean;
  toastOptions?: {
    duration?: number;
    style?: Record<string, string>;
  };
  [key: string]: unknown;
}

jest.mock("@/components/ui/sonner", () => ({
  Toaster: ({
    position,
    expand,
    richColors,
    closeButton,
    toastOptions,
    ...props
  }: MockToasterProps) => (
    <div
      data-testid="notification-toaster"
      data-position={position}
      data-expand={expand}
      data-rich-colors={richColors}
      data-close-button={closeButton}
      data-duration={toastOptions?.duration}
      {...props}
    >
      Toaster Component
    </div>
  ),
}));

describe("NotificationSystem", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render Toaster component correctly", () => {
      render(<NotificationSystem />);

      const toaster = screen.getByTestId("notification-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveTextContent("Toaster Component");
    });

    it("should render with correct configuration props", () => {
      render(<NotificationSystem />);

      const toaster = screen.getByTestId("notification-toaster");
      expect(toaster).toHaveAttribute("data-position", "bottom-right");
      expect(toaster).toHaveAttribute("data-expand", "true");
      expect(toaster).toHaveAttribute("data-rich-colors", "true");
      expect(toaster).toHaveAttribute("data-close-button", "true");
      expect(toaster).toHaveAttribute("data-duration", "4000");
    });
  });

  describe("Toast Integration", () => {
    it("should allow toast.success to be called", async () => {
      render(<NotificationSystem />);

      await act(async () => {
        toast.success("Test success message");
      });

      expect(toast.success).toHaveBeenCalledWith("Test success message");
    });

    it("should allow toast.error to be called", async () => {
      render(<NotificationSystem />);

      await act(async () => {
        toast.error("Test error message");
      });

      expect(toast.error).toHaveBeenCalledWith("Test error message");
    });

    it("should allow multiple toast types to be called", async () => {
      render(<NotificationSystem />);

      await act(async () => {
        toast.info("Info message");
        toast.warning("Warning message");
        toast.loading("Loading message");
      });

      expect(toast.info).toHaveBeenCalledWith("Info message");
      expect(toast.warning).toHaveBeenCalledWith("Warning message");
      expect(toast.loading).toHaveBeenCalledWith("Loading message");
    });
  });

  describe("Configuration", () => {
    it("should have correct default styling configuration", () => {
      render(<NotificationSystem />);

      const toaster = screen.getByTestId("notification-toaster");
      expect(toaster).toHaveAttribute("data-position", "bottom-right");
      expect(toaster).toHaveAttribute("data-duration", "4000");
    });
  });
});
