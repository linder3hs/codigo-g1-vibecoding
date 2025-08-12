/**
 * HomePage component - Modern minimalist todo list view
 * Features a clean, responsive design with glassmorphism effects and smooth animations
 */

import { useState } from "react";
import { useTodo } from "../../hooks/useTodo";
import {
  Header,
  Footer,
  StatsSection,
  TodoList,
  Sidebar,
} from "../../components";
import { Link } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * HomePage - Main page component for todo list management
 * Modern minimalist design with glassmorphism, smooth animations and full responsiveness
 */
export const HomePage = () => {
  const {
    filter,
    setFilter,
    filteredTodos,
    todosCount,
    toggleTodo,
    deleteTodo,
  } = useTodo();
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true);

  return (
    <div className="h-screen overflow-hidden lg:overflow-auto">
      {/* Sidebar Component */}
      <Sidebar currentFilter={filter} onFilterChange={setFilter} />

      {/* Main content container with sidebar offset */}
      <div className="relative z-10 lg:ml-80 h-full lg:h-auto flex flex-col">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl flex-1 flex flex-col lg:block min-h-0">
          {/* Header Section */}
          <div className="mb-6 lg:mb-8">
            <Header
              title="Lista de Tareas"
              subtitle="Gestiona tus tareas de manera eficiente con estilo"
            />
          </div>

          {/* Stats Section with enhanced glassmorphism */}
          <div className="mb-6 lg:mb-8">
            {/* Stats Toggle Button - Always visible */}
            <button
              onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
              className="w-full mb-4 flex items-center justify-between p-3 backdrop-blur-sm bg-slate-800/30 rounded-xl border border-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all duration-200"
            >
              <span className="text-sm font-medium">Ver estadísticas</span>
              {isStatsCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>

            {/* Stats Content */}
            <div
              className={`backdrop-blur-md bg-slate-800/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 ${
                isStatsCollapsed ? "hidden" : "block"
              }`}
            >
              <StatsSection todosCount={todosCount} />
            </div>
          </div>

          {/* Todo List Section with modern styling */}
          <div className="flex-1 flex flex-col lg:mb-8 lg:block min-h-0">
            <div className="backdrop-blur-md bg-slate-800/35 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-700/25 hover:border-slate-600/45 transition-all duration-300 flex-1 flex flex-col lg:block min-h-0">
              <div className="flex-1 overflow-y-auto lg:overflow-visible pb-20 lg:pb-0 min-h-0">
                <TodoList
                  todos={filteredTodos}
                  emptyMessage="No hay tareas para mostrar"
                  onToggleTodo={(id) => toggleTodo(Number(id))}
                  onDeleteTodo={(id) => deleteTodo(Number(id))}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="hidden lg:block">
            <Footer />
          </div>
        </div>
      </div>
      {/* Mobile FAB - Create Task */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[9999]">
        <Link
          to="/crear-todo"
          className="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Crear nueva tarea"
        >
          <svg
            className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
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
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
