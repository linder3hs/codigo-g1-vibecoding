/**
 * TodoList component for displaying a list of todos
 * Handles empty states and renders TodoItem components
 */

import type { Todo } from "../../../types/todo";
import { TodoItem } from "../TodoItem";

interface TodoListProps {
  todos: Todo[];
  emptyMessage?: string;
  onToggleTodo: (id: number | string) => void;
  onDeleteTodo: (id: number | string) => void;
}

export const TodoList = ({
  todos,
  emptyMessage = "No hay tareas para mostrar",
  onToggleTodo,
  onDeleteTodo,
}: TodoListProps) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <div className="text-8xl opacity-20 animate-pulse">📝</div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent rounded-full blur-xl" />
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold text-slate-300">
            No hay tareas
          </h3>
          <p className="text-slate-400 max-w-md leading-relaxed">
            {emptyMessage}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-auto mt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </div>
  );
};

export default TodoList;
