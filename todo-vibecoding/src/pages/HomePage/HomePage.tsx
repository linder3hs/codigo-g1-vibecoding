/**
 * HomePage component - Dashboard de estadísticas de tareas
 * Vista exclusiva para visualización de métricas y análisis de datos
 * Diseño optimizado para mostrar estadísticas de manera clara y efectiva
 */

import { useTodo } from "../../hooks/useTodo";
import { Header, StatsSection, StatsChart } from "../../components";
import { useNavigate } from "react-router";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import { Button } from "../../components/ui/button";

/**
 * HomePage - Dashboard principal de estadísticas de tareas
 * Vista centrada en métricas, análisis y visualización de datos
 */
export const HomePage = () => {
  const { todosStats } = useTodo();
  const navigate = useNavigate();

  // Navigate to tasks list
  const handleViewTasks = () => {
    navigate("/tasks");
  };

  // Navigate to create new task
  const handleCreateNew = () => {
    navigate("/crear-todo");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 lg:mb-12">
          <Header
            title="Dashboard de Estadísticas"
            subtitle="Análisis completo del rendimiento y progreso de tus tareas"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleViewTasks}
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <Activity className="w-4 h-4" />
              Ver Lista de Tareas
            </Button>
            <Button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-green-600 hover:from-gray-700 hover:to-green-700"
            >
              <TrendingUp className="w-4 h-4" />
              Crear Nueva Tarea
            </Button>
          </div>
        </div>

        {/* Main Statistics Grid */}
        <div className="space-y-8">
          {/* Primary Stats Cards */}
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Métricas Principales
            </h2>
            <StatsSection todosCount={todosStats} />
          </div>

          {/* Interactive Chart Section */}
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Distribución Visual
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <StatsChart
                stats={{
                  total: todosStats.total,
                  completed: todosStats.completed,
                  pending: todosStats.pending,
                }}
                title="Análisis de Progreso"
                height={400}
                showTitle={true}
                onSegmentClick={(data) => {
                  console.log("Segmento seleccionado:", data);
                  // Implementar navegación basada en filtros
                }}
              />
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Tasa de Completado
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {todosStats.total > 0
                      ? Math.round(
                          (todosStats.completed / todosStats.total) * 100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">
                    Tareas Pendientes
                  </p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {todosStats.pending}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total de Tareas
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {todosStats.total}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
