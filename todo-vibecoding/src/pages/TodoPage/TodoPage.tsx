/**
 * HomePage component - Enhanced todo management interface
 * Modern design with improved layout, better component integration and optimized UX
 */

import { useTodo } from "../../hooks/useTodo";
import { Header, StatsSection, TodoList, Filter } from "../../components";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import type { FilterType } from "../../types/filter";
import type { TodoFilters } from "../../types/todo";

/**
 * HomePage - Enhanced main page for todo list management
 * Improved layout with better component distribution and modern design patterns
 */
export const TodoPage = () => {
  const {
    filters,
    updateFilters,
    filteredTodos,
    todosStats,
    toggleTodoStatus,
    deleteExistingTodo,
  } = useTodo();
  const navigate = useNavigate();

  // Convert TodoFilters to FilterType for Filter component compatibility
  const currentFilter: FilterType = filters.status;

  // Handle filter change from Filter component
  const handleFilterChange = (filter: FilterType) => {
    const newFilters: Partial<TodoFilters> = {
      status: filter,
    };
    updateFilters(newFilters);
  };

  // Handle navigation to create new todo
  const handleCreateNew = () => {
    navigate("/crear-todo");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6  max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <Header
            title="Lista de Tareas"
            subtitle="Gestiona tus tareas de manera eficiente con estilo"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Filter Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Filter
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6 lg:space-y-8">
            {/* Stats Section */}
            <div>
              <StatsSection todosCount={todosStats} />
            </div>

            {/* Todo List Section */}
            <div>
              <TodoList
                todos={filteredTodos}
                emptyMessage="¡Comienza creando tu primera tarea para organizar tu día!"
                onToggleTodo={(id: number | string) => toggleTodoStatus(id)}
                onDeleteTodo={(id: number | string) => deleteExistingTodo(id)}
                onCreateNew={handleCreateNew}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB - Create Task */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleCreateNew}
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-gray-600 to-green-600 hover:from-gray-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 border-0"
          aria-label="Crear nueva tarea"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default TodoPage;
