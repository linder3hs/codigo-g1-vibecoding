/**
 * TodoItem component for displaying individual todo items
 * Handles todo completion toggle and displays todo information
 */

import type { Todo } from "../../../todos";

interface TodoItemProps {
  todo: Todo;
  formatDate: (date: Date) => string;
}

export const TodoItem = ({ todo, formatDate }: TodoItemProps) => {
  const statusClasses = todo.is_finished
    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
    : "bg-gradient-to-r from-amber-500 to-orange-600 text-white";

  const statusText = todo.is_finished ? "Completada" : "Pendiente";
  const statusIcon = todo.is_finished ? "✓" : "⏳";

  const cardClasses = todo.is_finished
    ? "bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50"
    : "bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-blue-200/50 dark:border-slate-600/50";

  return (
    <div
      className={`
      p-6 rounded-lg border transition-all duration-200 hover:shadow-md
      ${
        todo.is_finished
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }
    `}
    >
      <div className="flex items-start gap-4">
        <button
          className={`
            flex-shrink-0 w-5 h-5 rounded border-2 transition-colors
            flex items-center justify-center
            ${
              todo.is_finished
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 dark:border-gray-600 hover:border-green-400"
            }
          `}
          aria-label={
            todo.is_finished
              ? "Marcar como pendiente"
              : "Marcar como completada"
          }
        >
          {todo.is_finished && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 space-y-3">
          <p
            className={`
            text-lg
            ${
              todo.is_finished
                ? "text-gray-500 dark:text-gray-400 line-through"
                : "text-gray-900 dark:text-gray-100"
            }
          `}
          >
            {todo.text}
          </p>

          <div className="flex items-center justify-between">
            <span
              className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${
                todo.is_finished
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
              }
            `}
            >
              {todo.is_finished ? "Completada" : "Pendiente"}
            </span>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div>Creada: {formatDate(todo.created_at)}</div>
              {todo.updated_at && (
                <div>Actualizada: {formatDate(todo.updated_at)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
