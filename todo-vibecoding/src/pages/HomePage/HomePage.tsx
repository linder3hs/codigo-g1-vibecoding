/**
 * HomePage component - Modern minimalist todo list view
 * Features a clean, responsive design with glassmorphism effects and smooth animations
 */

import { Link } from "react-router";
import { useTodo } from "../../hooks/useTodo";
import {
  Header,
  Footer,
  StatsSection,
  FilterButtons,
  TodoList,
} from "../../components";

/**
 * HomePage - Main page component for todo list management
 * Modern minimalist design with glassmorphism, smooth animations and full responsiveness
 */
export const HomePage = () => {
  const { filter, setFilter, filteredTodos, todosCount, formatDate } =
    useTodo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main content container */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <Header
              title="Lista de Tareas"
              subtitle="Gestiona tus tareas de manera eficiente con estilo"
            />
          </div>

          {/* Stats Section with glassmorphism */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-slate-700/50">
              <StatsSection todosCount={todosCount} />
            </div>
          </div>

          {/* Create Todo Button - Enhanced with modern styling */}
          <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
            <Link
              to="/crear-todo"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm border border-white/20"
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-lg">Crear Nueva Tarea</span>
              <div className="w-2 h-2 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors duration-300" />
            </Link>
          </div>

          {/* Filter Section with glassmorphism */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="backdrop-blur-sm bg-white/50 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/30">
              <FilterButtons
                currentFilter={filter}
                onFilterChange={setFilter}
              />
            </div>
          </div>

          {/* Todo List Section */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="backdrop-blur-sm bg-white/60 dark:bg-slate-800/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-white/20 dark:border-slate-700/40">
              <TodoList
                todos={filteredTodos}
                formatDate={formatDate}
                emptyMessage="No hay tareas para mostrar"
              />
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
