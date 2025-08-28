/**
 * StatsSection component for displaying todo statistics
 * Groups multiple StatsCard components in a responsive grid
 */

import { StatsCard } from "../../ui/StatsCard";

interface StatsSectionProps {
  todosCount: {
    total: number;
    completed: number;
    pending: number;
  };
}

export const StatsSection = ({ todosCount }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatsCard value={todosCount.total} label="Total" color="charcoal" />
      <StatsCard
        value={todosCount.completed}
        label="Completadas"
        color="persian-green"
      />
      <StatsCard value={todosCount.pending} label="Pendientes" color="saffron" />
    </div>
  );
};

export default StatsSection;
