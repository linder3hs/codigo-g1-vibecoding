/**
 * Filter component - Modern filter component with shadcn/ui integration
 * Enhanced styling and improved user experience with Card and Button components
 */

import { useState } from "react";
import { FilterButtons } from "../FilterButtons";
import type { FilterType } from "../../../types";
import { ChevronDown, ChevronUp, Filter as FilterIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";

interface FilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
}

/**
 * Filter component
 * Modern design with shadcn/ui components and improved responsive layout
 * Desktop: Elegant card-based filter panel
 * Mobile: Collapsible filter section with smooth animations
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
        <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FilterIcon className="w-5 h-5 text-gray-600" />
              <span className="text-lg font-semibold">Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <FilterButtons
                currentFilter={currentFilter}
                onFilterChange={onFilterChange}
                layout="vertical"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filter Section */}
      <div className="lg:hidden">
        {/* Toggle Button */}
        <Button
          variant="outline"
          onClick={toggleExpanded}
          className="w-full justify-between p-4 h-auto bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-4 shadow-sm hover:shadow-md"
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
        </Button>

        {/* Expandable Filter Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Filter;
