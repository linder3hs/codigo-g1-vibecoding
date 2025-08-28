/**
 * Filter component - Autonomous filter component for todo status filtering
 * Encapsulated styling and compact design that doesn't take full screen height
 */

import { useState } from "react";
import { FilterButtons } from "../FilterButtons";
import type { FilterType } from "../../../types";
import { ChevronDown, ChevronUp, Filter as FilterIcon } from "lucide-react";

interface FilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

/**
 * Filter component
 * Provides filtering functionality with responsive design
 * Desktop: Compact filter panel
 * Mobile: Collapsible filter section
 */
export const Filter = ({
  currentFilter,
  onFilterChange,
  className = "",
}: FilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`filter-component ${className}`}>
      {/* Desktop Filter Panel */}
      <div className="hidden lg:block">
        <div className=" bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
          </div>

          {/* Filter Buttons */}
          <div className="space-y-2">
            <FilterButtons
              currentFilter={currentFilter}
              onFilterChange={onFilterChange}
              layout="vertical"
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Section */}
      <div className="lg:hidden">
        {/* Toggle Button */}
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between p-4  bg-slate-800 rounded-xl border border-slate-700/40 text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200 mb-4"
        >
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros de tareas</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Expandable Filter Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="backdrop-blur-md bg-slate-800 rounded-xl p-4 border border-slate-700/25">
            <div className="space-y-3">
              <FilterButtons
                currentFilter={currentFilter}
                onFilterChange={(filter) => {
                  onFilterChange(filter);
                  setIsExpanded(false); // Auto-collapse after selection
                }}
                layout="vertical"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
