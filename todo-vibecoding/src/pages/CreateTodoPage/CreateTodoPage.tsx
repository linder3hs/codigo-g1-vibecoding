/**
 * CreateTodoPage component - Todo creation form
 * Provides a form interface for creating new todos with validation
 */

import { Link } from "react-router";
import { Header, TaskForm } from "../../components";

/**
 * CreateTodoPage - Form page for creating new todos
 * Features input validation, form submission, and navigation back to home
 */
export const CreateTodoPage = () => {
  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <Header
          title="Crear Nueva Tarea"
          subtitle="Agrega una nueva tarea a tu lista"
        />

        {/* Back to home navigation with modern styling */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-charcoal-400 hover:text-charcoal-300 transition-all duration-300 font-medium group"
          >
            <div className="p-1 rounded-lg group-hover:bg-charcoal-500/10 transition-colors duration-300 mr-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
            Volver al inicio
          </Link>
        </div>

        <TaskForm />
      </div>
    </div>
  );
};

export default CreateTodoPage;
