/**
 * Navigation Component
 * Main navigation component with responsive design and user functionality
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  Plus,
  User,
  LogOut,
  Settings,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Navigation item interface
 */
interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requireAuth?: boolean;
}

/**
 * Navigation items configuration
 */
const navigationItems: NavigationItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
    requireAuth: false,
  },
  {
    label: "Mis Tareas",
    href: "/tasks",
    icon: CheckSquare,
    requireAuth: true,
  },
  {
    label: "Crear Tarea",
    href: "/crear-todo",
    icon: Plus,
    requireAuth: true,
  },
];

/**
 * Breadcrumb component
 */
const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbLabel = (path: string): string => {
    const routes: Record<string, string> = {
      "": "Inicio",
      tasks: "Mis Tareas",
      "crear-todo": "Crear Tarea",
      login: "Iniciar Sesión",
      register: "Registrarse",
    };
    return routes[path] || path;
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        to="/"
        className="hover:text-foreground transition-colors"
        aria-label="Ir al inicio"
      >
        Inicio
      </Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <span key={pathname} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="text-foreground font-medium">
                {getBreadcrumbLabel(pathname)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-foreground transition-colors"
              >
                {getBreadcrumbLabel(pathname)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

/**
 * User menu component
 */
const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{user.username || user.email}</span>
      </Button>

      {isOpen && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* User menu dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg z-20">
            <div className="p-3 border-b">
              <p className="font-medium text-sm">
                {`${user.first_name} ${user.last_name}`.trim() || user.username}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>

            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/profile");
                }}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Mobile navigation menu
 */
const MobileMenu = ({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  const filteredItems = items.filter(
    (item) => !item.requireAuth || isAuthenticated
  );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile menu */}
      <div className="fixed top-0 right-0 h-full w-64 bg-background border-l z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Menú</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

/**
 * Main Navigation component
 */
export const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredItems = navigationItems.filter(
    (item) => !item.requireAuth || isAuthenticated
  );

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span>Todo VibeCoding</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="pb-3">
          <Breadcrumbs />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navigationItems}
      />
    </header>
  );
};

export default Navigation;
