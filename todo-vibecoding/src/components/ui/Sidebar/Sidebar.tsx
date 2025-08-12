/**
 * Sidebar component - Responsive sidebar with create button and filters
 * Desktop: Fixed left sidebar
 * Mobile: FAB for create + collapsible sidebar for filters
 */

import { useState } from "react";
import { Link } from "react-router";
import { FilterButtons } from "../../feature/FilterButtons";
import type { FilterType } from "../../../types";

interface SidebarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const Sidebar = ({ currentFilter, onFilterChange }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar - Fixed left */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 lg:z-30">
        <div className="flex flex-col h-full backdrop-blur-xl bg-slate-900/80 border-r border-slate-700/50">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white mb-2">
              Gestión de Tareas
            </h2>
            <p className="text-slate-400 text-sm">Organiza tu productividad</p>
          </div>

          {/* Create Task Button - Desktop */}
          <div className="p-6">
            <Link
              to="/crear-todo"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Nueva Tarea</span>
            </Link>
          </div>

          {/* Filters Section - Desktop */}
          <div className="flex-1 p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">Filtros</h3>
            <div className="space-y-2">
              <FilterButtons
                currentFilter={currentFilter}
                onFilterChange={onFilterChange}
                layout="vertical"
              />
            </div>
          </div>

          {/* Footer info */}
          <div className="p-6 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 text-center">
              <p>Todo App v1.0</p>
              <p className="mt-1">Powered by React & Tailwind</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-6 left-6 z-[9998]">
        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center w-10 h-10 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
          aria-label="Abrir menú de filtros"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isMobileMenuOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen w-80 z-[9995] transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full backdrop-blur-xl bg-slate-900/95 border-r border-slate-700/50">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-xl font-bold text-white">Filtros</h2>
              <p className="text-slate-400 text-sm">Organiza tus tareas</p>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-10 h-10 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              aria-label="Cerrar menú"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Filters */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              <FilterButtons
                currentFilter={currentFilter}
                onFilterChange={(filter) => {
                  onFilterChange(filter);
                  setIsMobileMenuOpen(false); // Close menu after selection
                }}
                layout="vertical"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
