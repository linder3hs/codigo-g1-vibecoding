/**
 * Footer Component
 * Application footer with links and information
 */

import { Link } from "react-router";
import { CheckSquare, Github, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Footer component
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <CheckSquare className="h-6 w-6 text-primary" />
              <span>Todo VibeCoding</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Gestiona tus tareas de manera eficiente con nuestra aplicación
              moderna y fácil de usar.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mis Tareas
                </Link>
              </li>
              <li>
                <Link
                  to="/crear-todo"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Crear Tarea
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ayuda
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Síguenos</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="mailto:contact@todovibecoding.com"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Todo VibeCoding. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground">
            Hecho con ❤️ usando React y TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;