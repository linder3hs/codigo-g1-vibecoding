/**
 * CreateTodoPage component - Todo creation form
 * Provides a form interface for creating new todos with validation
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTodo } from "../../hooks/useTodo";
import { Header, Footer } from "../../components";

/**
 * CreateTodoPage - Form page for creating new todos
 * Features input validation, form submission, and navigation back to home
 */
export const CreateTodoPage = () => {
  const [todoText, setTodoText] = useState<string>("");
  const { addTodo } = useTodo();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const trimmedText = todoText.trim();
    if (trimmedText) {
      addTodo({
        name: trimmedText,
        is_finished: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
      setTodoText("");
      navigate("/");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTodoText(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header
          title="Crear Nueva Tarea"
          subtitle="Agrega una nueva tarea a tu lista"
        />

        {/* Back to home navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Volver al inicio
          </Link>
        </div>

        {/* Todo creation form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="todoText"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Descripción de la tarea
              </label>
              <input
                type="text"
                id="todoText"
                value={todoText}
                onChange={handleInputChange}
                placeholder="Escribe tu nueva tarea..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!todoText.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                Crear Tarea
              </button>

              <Link
                to="/"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CreateTodoPage;
