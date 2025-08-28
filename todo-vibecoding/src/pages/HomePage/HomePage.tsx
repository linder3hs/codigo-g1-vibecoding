/**
 * HomePage component - Modern minimalist todo list view
 * Features a clean, responsive design with glassmorphism effects and smooth animations
 */

import { useState } from "react";
import { useTodo } from "../../hooks/useTodo";
import { Header, StatsSection, TodoList, Filter } from "../../components";
import { Link } from "react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { FilterType } from "../../types/filter";
import type { TodoFilters } from "../../types/todo";

/**
 * HomePage - Main page component for todo list management
 * Modern minimalist design with glassmorphism, smooth animations and full responsiveness
 */
export const HomePage = () => {
  const {
    filters,
    updateFilters,
    filteredTodos,
    todosStats,
    toggleTodoStatus,
    deleteExistingTodo,
  } = useTodo();
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true);

  // Convert TodoFilters to FilterType for Sidebar compatibility
  const currentFilter: FilterType = filters.status;

  // Handle filter change from Sidebar
  const handleFilterChange = (filter: FilterType) => {
    const newFilters: Partial<TodoFilters> = {
      status: filter,
    };
    updateFilters(newFilters);
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <Header
            title="Lista de Tareas"
            subtitle="Gestiona tus tareas de manera eficiente con estilo"
          />
        </div>
        <div className="flex justify-center gap-10">
          {/* Filter Section */}
          <div className="mb-6 lg:mb-8">
            <Filter
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div>
            {/* Stats Section with enhanced glassmorphism */}
            <div className="mb-6 lg:mb-8">
              {/* Stats Toggle Button - Always visible */}
              <button
                onClick={() => setIsStatsCollapsed(!isStatsCollapsed)}
                className="w-full mb-4 flex items-center justify-between p-3  bg-slate-800 rounded-xl border border-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
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
                className={`backdrop-blur-md bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 ${
                  isStatsCollapsed ? "hidden" : "block"
                }`}
              >
                <StatsSection todosCount={todosStats} />
              </div>
            </div>

            {/* Todo List Section with modern styling */}
            <div className="mb-8">
              <div className="backdrop-blur-md bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-700/25 hover:border-slate-600/45 transition-all duration-300">
                <TodoList
                  todos={filteredTodos}
                  emptyMessage="No hay tareas para mostrar"
                  onToggleTodo={(id: number | string) => toggleTodoStatus(id)}
                  onDeleteTodo={(id: number | string) => deleteExistingTodo(id)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB - Create Task */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[9999]">
        <Link
          to="/crear-todo"
          className="group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-charcoal-600 to-persian_green-600 hover:from-charcoal-700 hover:to-persian_green-700 text-white rounded-full shadow-2xl hover:shadow-charcoal-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95"
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
