/**
 * TodoItem component for displaying individual todo items
 * Minimalist vertical design with checkbox, title, and delete button
 */

import { Check, Trash2 } from "lucide-react";
import type { Todo } from "../../../todos";

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const isCompleted = todo.is_finished;

  const handleToggle = () => {
    onToggle?.(todo.id);
  };

  const handleDelete = () => {
    onDelete?.(todo.id);
  };

  return (
    <div
      className={`
      group relative p-4 rounded-xl border transition-all duration-200
      ${
        isCompleted
          ? "bg-slate-800/20 border-slate-700/30 opacity-75"
          : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/60"
      }
    `}
    >
      {/* Vertical Layout */}
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200
            flex items-center justify-center
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

        {/* Task Title */}
        <p
          className={`
          flex-1 text-sm transition-all duration-200
          ${isCompleted ? "text-slate-400 line-through" : "text-slate-200"}
        `}
        >
          {todo.name}
        </p>

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
