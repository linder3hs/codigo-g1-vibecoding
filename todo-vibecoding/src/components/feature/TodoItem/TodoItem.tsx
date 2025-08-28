/**
 * TodoItem component for displaying individual todo items
 * Enhanced design with priority, dates, and status information
 */

import { Check, Trash2, Calendar } from "lucide-react";
import type { Todo } from "../../../types/todo";
import { formatDate } from "../../../utils";

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  // Support both new and legacy fields
  const isCompleted = todo.is_completed ?? todo.completed ?? false;
  const title = todo.title || todo.text || "";
  const createdAt =
    todo.created_at ||
    (todo.createdAt ? new Date(todo.createdAt).toISOString() : "");

  const handleToggle = () => {
    onToggle?.(todo.id);
  };

  const handleDelete = () => {
    onDelete?.(todo.id);
  };

  return (
    <div
      className={`
      group relative p-5 rounded-xl border transition-all duration-200 hover:shadow-md
      ${
        isCompleted
          ? "bg-white border-gray-200 opacity-75"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg"
      }
    `}
    >
      {/* Main Content */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200
            flex items-center justify-center mt-0.5
            ${
              isCompleted
                ? "bg-green-500 border-green-500"
                : "border-gray-400 hover:border-green-500"
            }
          `}
          aria-label={
            isCompleted ? "Marcar como pendiente" : "Marcar como completada"
          }
        >
          {isCompleted && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Task Title */}
          <h3
            className={`
            text-base font-semibold transition-all duration-200 mb-1
            ${isCompleted ? "text-gray-500 line-through" : "text-gray-900"}
          `}
          >
            {title}
          </h3>

          {/* Task Description */}
          {todo.description && (
            <p
              className={`
                text-sm leading-relaxed mb-3 transition-all duration-200
                ${isCompleted ? "text-gray-500 line-through" : "text-gray-700"}
              `}
            >
              {todo.description}
            </p>
          )}

          {/* Task Metadata */}
          <div className="flex items-center gap-3 text-xs">
            {/* Status Badge */}
            <span
              className={`
                px-2 py-1 rounded-full font-medium text-xs
                ${
                  isCompleted
                    ? "text-green-600 bg-green-100"
                    : "text-yellow-600 bg-yellow-100"
                }
              `}
            >
              {todo.status_display ||
                (isCompleted ? "Completada" : "Pendiente")}
            </span>

            {/* Creation Date */}
            {createdAt && (
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(new Date(createdAt))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
          aria-label="Eliminar tarea"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
