/**
 * HomePage component - Main todo list view
 * Displays the complete todo management interface with navigation
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
 * Features todo list display, filtering, statistics, and navigation to create new todos
 */
export const HomePage = () => {
  const { filter, setFilter, filteredTodos, todosCount, formatDate } =
    useTodo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header
          title="Lista de Tareas"
          subtitle="Gestiona tus tareas de manera eficiente"
        />

        <StatsSection todosCount={todosCount} />

        {/* Navigation to create todo */}
        <div className="mb-6 text-center">
          <Link
            to="/crear-todo"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Nueva Tarea
          </Link>
        </div>

        <FilterButtons currentFilter={filter} onFilterChange={setFilter} />

        <TodoList
          todos={filteredTodos}
          formatDate={formatDate}
          emptyMessage="No hay tareas para mostrar"
        />

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;