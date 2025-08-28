/**
 * ErrorPage component - 404 and error handling
 * Displays when routes are not found or errors occur
 */

import { useRouteError, Link } from "react-router";
import { Header } from "../components";

/**
 * ErrorPage - Handles routing errors and 404s
 */
export const ErrorPage = () => {
  const error = useRouteError() as Error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header
          title="¡Oops! Algo salió mal"
          subtitle="La página que buscas no existe"
        />

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="text-6xl mb-4">🔍</div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Página no encontrada
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-300 text-sm">
                <strong>Error:</strong> {error.message || "Error desconocido"}
              </p>
            </div>
          )}

          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
