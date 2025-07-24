import { useTodo } from "./hooks/useTodo";
import {
  Header,
  StatsSection,
  FilterButtons,
  TodoList,
  Footer,
} from "./components/ui";

/**
 * Modern Todo List App with responsive design
 * Features clean UI, accessibility, and Tailwind CSS v4
 */
function App() {
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
}

export default App;
