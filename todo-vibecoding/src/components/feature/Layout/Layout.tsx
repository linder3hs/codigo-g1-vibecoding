/**
 * Layout Component
 * Main layout component that wraps the entire application
 * Provides consistent structure with header, main content, and footer
 */

import type { ReactNode } from "react";
import { Navigation } from "../Navigation/Navigation";

import { cn } from "@/lib/utils";
import Footer from "./Footer";
import NotificationSystem from "./NotificationSystem";

/**
 * Layout component props
 */
interface LayoutProps {
  children: ReactNode;
  className?: string;
  showNavigation?: boolean;
  showFooter?: boolean;
  fullWidth?: boolean;
}

/**
 * Main Layout component
 *
 * @param children - Content to render in the main area
 * @param className - Additional CSS classes
 * @param showNavigation - Whether to show navigation (default: true)
 * @param showFooter - Whether to show footer (default: true)
 * @param fullWidth - Whether to use full width layout (default: false)
 *
 * @example
 * <Layout>
 *   <HomePage />
 * </Layout>
 *
 * @example
 * <Layout fullWidth showFooter={false}>
 *   <AuthPage />
 * </Layout>
 */
export const Layout = ({
  children,
  className,
  showNavigation = true,
  showFooter = true,
  fullWidth = false,
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      {showNavigation && <Navigation />}

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 flex flex-col",
          !fullWidth && "container mx-auto px-4 py-6",
          fullWidth && "w-full",
          className
        )}
        role="main"
      >
        {children}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
};

/**
 * Centered Layout for auth pages and similar
 */
export const CenteredLayout = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Layout showNavigation={false} showFooter={false} fullWidth>
      <div
        className={cn(
          "min-h-screen flex items-center justify-center p-4",
          className
        )}
      >
        <div className="w-full max-w-md">{children}</div>
      </div>
    </Layout>
  );
};

/**
 * Dashboard Layout with optional sidebar
 */
export const DashboardLayout = ({
  children,
  sidebar,
  className,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
}) => {
  return (
    <Layout className={cn("flex-row", className)}>
      {sidebar && (
        <aside className="w-64 border-r bg-muted/30 p-4">{sidebar}</aside>
      )}
      <div className="flex-1 p-6">{children}</div>
    </Layout>
  );
};

export default Layout;
