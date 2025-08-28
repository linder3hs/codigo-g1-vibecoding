/**
 * StatsSection component - Modern statistics display with enhanced layout
 * Improved responsive design and visual hierarchy using shadcn/ui components
 */

import { StatsCard } from "../../ui/StatsCard";
import { Card, CardHeader, CardTitle } from "../../ui/card";
import { BarChart3, CheckCircle2, Clock, Target } from "lucide-react";

interface StatsSectionProps {
  todosCount: {
    total: number;
    completed: number;
    pending: number;
  };
}

/**
 * StatsSection component
 * Enhanced statistics display with improved visual hierarchy and responsive design
 * Features: Header with icon, better spacing, and optimized grid layout
 */
export const StatsSection = ({ todosCount }: StatsSectionProps) => {
  const completionRate =
    todosCount.total > 0
      ? Math.round((todosCount.completed / todosCount.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold">Estadísticas</span>
            <div className="ml-auto flex items-center gap-1 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>{completionRate}% completado</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-100 z-10 rounded-full flex items-center justify-center shadow-sm">
            <Target className="w-3 h-3 text-gray-600" />
          </div>
          <StatsCard value={todosCount.total} label="Total" color="charcoal" />
        </div>

        <div className="relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-100 z-10 rounded-full flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
          </div>
          <StatsCard
            value={todosCount.completed}
            label="Completadas"
            color="persian-green"
          />
        </div>

        <div className="relative sm:col-span-2 lg:col-span-1">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-100 z-10 rounded-full flex items-center justify-center shadow-sm">
            <Clock className="w-3 h-3 text-yellow-600" />
          </div>
          <StatsCard
            value={todosCount.pending}
            label="Pendientes"
            color="saffron"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
