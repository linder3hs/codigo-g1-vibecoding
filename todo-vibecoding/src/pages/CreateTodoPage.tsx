/**
 * CreateTodoPage component - Form to create new todos
 * Simple form with input and button for creating new tasks
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { Header, Footer } from "../components";
import { useTodo } from "../hooks/useTodo";

/**
 * CreateTodoPage - Page for creating new todos
 * Contains a simple form with input and submit button
 */
export const CreateTodoPage = () => {
  const [todoText, setTodoText] = useState("");
  const { addTodo } = useTodo();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (todoText.trim()) {
      addTodo({
        name: todoText.trim(),
        is_finished: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
      
      // Reset form and navigate back to home
      setTodoText("");
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Header
          title="Crear Nueva Tarea"
          subtitle="Agrega una nueva tarea a tu lista"
        />

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="todoInput" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Descripción de la tarea
              </label>
              <input
                id="todoInput"
                type="text"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                placeholder="Escribe tu nueva tarea aquí..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                autoFocus
                required
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!todoText.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CreateTodoPage;