/**
 * StatsCard component for displaying todo statistics
 * Reusable card component for metrics display
 */

interface StatsCardProps {
  value: number;
  label: string;
  color: "blue" | "green" | "orange";
}

const colorClasses = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  orange: "text-orange-600 dark:text-orange-400",
};

export const StatsCard = ({ value, label, color }: StatsCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
      <div className="text-center">
        <div className={`text-3xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
