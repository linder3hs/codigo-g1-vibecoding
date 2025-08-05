import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "../components/ui/Footer";

describe("Footer Component", () => {
  it("renders the footer element correctly", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("displays the Tailwind CSS badge text", () => {
    render(<Footer />);

    const badgeText = screen.getByText("Powered by Tailwind CSS v4");
    expect(badgeText).toBeInTheDocument();
  });



  it("applies correct CSS classes to footer element", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("text-center");
    expect(footer).toHaveClass("mt-12");
    expect(footer).toHaveClass("pt-8");
    expect(footer).toHaveClass("border-t");
    expect(footer).toHaveClass("border-gray-200");
    expect(footer).toHaveClass("dark:border-slate-700");
  });

  it("applies correct CSS classes to badge container", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText("Powered by Tailwind CSS v4").closest('div');
    expect(badgeContainer).toHaveClass("inline-flex");
    expect(badgeContainer).toHaveClass("items-center");
    expect(badgeContainer).toHaveClass("gap-2");
    expect(badgeContainer).toHaveClass("bg-blue-50");
    expect(badgeContainer).toHaveClass("dark:bg-blue-900/20");
    expect(badgeContainer).toHaveClass("text-blue-700");
    expect(badgeContainer).toHaveClass("dark:text-blue-300");
    expect(badgeContainer).toHaveClass("px-4");
    expect(badgeContainer).toHaveClass("py-2");
    expect(badgeContainer).toHaveClass("rounded-full");
    expect(badgeContainer).toHaveClass("text-sm");
    expect(badgeContainer).toHaveClass("font-medium");
  });

  it("has proper semantic structure", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer.tagName).toBe("FOOTER");
  });





  it("maintains consistent styling across themes", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    const badgeContainer = screen.getByText("Powered by Tailwind CSS v4").closest('div');

    // Check dark mode classes are present
    expect(footer).toHaveClass("dark:border-slate-700");
    expect(badgeContainer).toHaveClass("dark:bg-blue-900/20");
    expect(badgeContainer).toHaveClass("dark:text-blue-300");
  });

  it("has accessible color contrast", () => {
    render(<Footer />);

    const badgeContainer = screen.getByText("Powered by Tailwind CSS v4").closest('div');
    
    // Check that appropriate color classes are applied for contrast
    expect(badgeContainer).toHaveClass("text-blue-700");
    expect(badgeContainer).toHaveClass("bg-blue-50");
  });

  it("renders without any props (stateless component)", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    const badgeText = screen.getByText("Powered by Tailwind CSS v4");

    expect(footer).toBeInTheDocument();
    expect(badgeText).toBeInTheDocument();
  });

  it("has proper spacing and layout classes", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    const badgeContainer = screen.getByText("Powered by Tailwind CSS v4").closest('div');

    // Check spacing classes
    expect(footer).toHaveClass("mt-12"); // Margin top
    expect(footer).toHaveClass("pt-8");  // Padding top
    expect(badgeContainer).toHaveClass("px-4"); // Horizontal padding
    expect(badgeContainer).toHaveClass("py-2"); // Vertical padding
    expect(badgeContainer).toHaveClass("gap-2"); // Gap between items
  });

  it("maintains proper text hierarchy", () => {
    render(<Footer />);

    const badgeText = screen.getByText("Powered by Tailwind CSS v4");
    expect(badgeText).toHaveClass("text-sm");
    expect(badgeText).toHaveClass("font-medium");
  });

  it("has proper border styling", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("border-t");
    expect(footer).toHaveClass("border-gray-200");
    expect(footer).toHaveClass("dark:border-slate-700");
  });
});
