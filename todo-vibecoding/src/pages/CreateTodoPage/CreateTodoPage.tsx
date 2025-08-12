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
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 font-medium group"
          >
            <div className="p-1 rounded-lg group-hover:bg-blue-500/10 transition-colors duration-300 mr-2">
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

        {/* Todo creation form with glassmorphism */}
        <div className="backdrop-blur-md bg-slate-800/40 rounded-2xl shadow-2xl p-8 mb-8 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="todoText"
                className="block text-sm font-medium text-slate-300 mb-3"
              >
                Descripción de la tarea
              </label>
              <input
                type="text"
                id="todoText"
                value={todoText}
                onChange={handleInputChange}
                placeholder="Escribe tu nueva tarea..."
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 text-white placeholder-slate-400 transition-all duration-300 backdrop-blur-sm"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!todoText.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-medium shadow-xl hover:shadow-blue-500/25 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                Crear Tarea
              </button>

              <Link
                to="/"
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl font-medium text-center transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50"
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
