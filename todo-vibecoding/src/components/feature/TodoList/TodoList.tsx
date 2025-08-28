/**
 * TodoList component - Enhanced todo list with modern design
 * Improved empty states, better visual hierarchy and shadcn/ui integration
 */

import type { Todo } from "../../../types/todo";
import { TodoItem } from "../TodoItem";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Plus, FileText, Sparkles } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  emptyMessage?: string;
  onToggleTodo: (id: number | string) => void;
  onDeleteTodo: (id: number | string) => void;
  onCreateNew?: () => void;
}

/**
 * TodoList component
 * Modern todo list with enhanced empty states and improved user experience
 * Features: Header with count, better spacing, and call-to-action for empty state
 */
export const TodoList = ({
  todos,
  emptyMessage = "No hay tareas para mostrar",
  onToggleTodo,
  onDeleteTodo,
  onCreateNew,
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Enhanced Empty State Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                <Sparkles className="w-3 h-3 text-yellow-600" />
              </div>
            </div>

            {/* Empty State Content */}
            <div className="space-y-3 max-w-md">
              <h3 className="text-xl font-semibold text-gray-900">
                ¡Comienza tu productividad!
              </h3>
              <p className="text-gray-600 leading-relaxed">{emptyMessage}</p>
            </div>

            {/* Call to Action */}
            {onCreateNew && (
              <Button
                onClick={onCreateNew}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear primera tarea
              </Button>
            )}

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Todo Items */}
      <div className="space-y-3">
        {todos.map((todo, index) => (
          <div
            key={todo.id}
            className="transform transition-all duration-200 hover:scale-[1.01]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TodoItem
              todo={todo}
              onToggle={() => onToggleTodo(todo.id)}
              onDelete={() => onDeleteTodo(todo.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
