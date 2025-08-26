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
      group relative p-5 rounded-xl border transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/20
      ${
        isCompleted
          ? "bg-slate-800/20 border-slate-700/30 opacity-75"
          : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/60 hover:bg-slate-800/60"
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
                ? "bg-emerald-500 border-emerald-500"
                : "border-slate-500 hover:border-emerald-400"
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
            ${isCompleted ? "text-slate-400 line-through" : "text-slate-100"}
          `}
          >
            {title}
          </h3>

          {/* Task Description */}
          {todo.description && (
            <p
              className={`
                text-sm leading-relaxed mb-3 transition-all duration-200
                ${
                  isCompleted ? "text-slate-500 line-through" : "text-slate-300"
                }
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
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-amber-400 bg-amber-500/10"
                }
              `}
            >
              {todo.status_display ||
                (isCompleted ? "Completada" : "Pendiente")}
            </span>

            {/* Creation Date */}
            {createdAt && (
              <div className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(new Date(createdAt))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          aria-label="Eliminar tarea"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
