/**
 * FilterButtons component for todo filtering
 * Handles filter state and provides accessible filter controls
 */

import type { FilterType } from "../../../types/filter";

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  layout?: 'horizontal' | 'vertical';
}

interface FilterOption {
  key: FilterType;
  label: string;
  ariaLabel: string;
  activeClasses: string;
  hoverClasses: string;
  focusRing: string;
}

const filterOptions: FilterOption[] = [
  {
    key: "all",
    label: "Todas",
    ariaLabel: "Mostrar todas las tareas",
    activeClasses: "bg-charcoal-600 text-white",
    hoverClasses: "hover:bg-charcoal-700 hover:text-white",
    focusRing: "focus:ring-charcoal-500/50",
  },
  {
    key: "pending",
    label: "Pendientes",
    ariaLabel: "Mostrar tareas pendientes",
    activeClasses: "bg-saffron-600 text-white",
    hoverClasses: "hover:bg-saffron-700 hover:text-white",
    focusRing: "focus:ring-saffron-500/50",
  },
  {
    key: "completed",
    label: "Completadas",
    ariaLabel: "Mostrar tareas completadas",
    activeClasses: "bg-persian_green-600 text-white",
    hoverClasses: "hover:bg-persian_green-700 hover:text-white",
    focusRing: "focus:ring-persian_green-500/50",
  },
];

const baseClasses = "bg-slate-800 text-slate-300 border border-slate-700";
const transitionClasses = "transition-colors duration-200";

export const FilterButtons = ({
  currentFilter,
  onFilterChange,
  layout = 'horizontal',
}: FilterButtonsProps) => {
  const containerClasses = layout === 'vertical' 
    ? "flex flex-col gap-3" 
    : "flex flex-wrap justify-center gap-3";
    
  const buttonClasses = layout === 'vertical'
    ? "w-full justify-start px-3 py-2 rounded-lg text-left"
    : "px-4 py-2 rounded-lg";

  return (
    <div className={containerClasses}>
      {filterOptions.map((option) => {
        const isActive = currentFilter === option.key;

        return (
          <button
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={`
              ${buttonClasses} font-medium text-sm
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
              ${transitionClasses}
              ${option.focusRing}
              ${
                isActive
                  ? option.activeClasses
                  : `${baseClasses} ${option.hoverClasses}`
              }
            `}
            aria-label={option.ariaLabel}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons;
