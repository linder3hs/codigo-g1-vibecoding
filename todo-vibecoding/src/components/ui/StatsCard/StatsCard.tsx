/**
 * @fileoverview Componente StatsCard para mostrar estadísticas de todos
 *
 * Este componente renderiza una tarjeta de estadísticas reutilizable
 * que muestra un valor numérico y una etiqueta descriptiva.
 * Incluye variantes de color y soporte para modo oscuro.
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * Propiedades del componente StatsCard
 *
 * @interface StatsCardProps
 * @property {number} value - Valor numérico a mostrar en la tarjeta
 * @property {string} label - Etiqueta descriptiva del valor
 * @property {"blue" | "green" | "orange"} color - Variante de color para el valor
 */
interface StatsCardProps {
  /** Valor numérico a mostrar (ej: cantidad de todos) */
  value: number;
  /** Etiqueta descriptiva del valor (ej: "Total", "Completadas") */
  label: string;
  /** Variante de color: azul para total, verde para completadas, naranja para pendientes */
  color: "blue" | "green" | "orange";
}

/**
 * Mapeo de colores para las variantes del componente
 *
 * Define las clases CSS de Tailwind para cada variante de color,
 * incluyendo gradientes sutiles y efectos hover premium.
 *
 * @constant {Object} colorClasses
 * @property {Object} blue - Clases para variante azul (total)
 * @property {Object} green - Clases para variante verde (completadas)
 * @property {Object} orange - Clases para variante naranja (pendientes)
 */
const colorClasses = {
  /** Azul para estadísticas totales */
  blue: {
    text: "text-blue-400 group-hover:text-blue-300",
    accent: "bg-blue-500/10 group-hover:bg-blue-500/20",
    border: "border-blue-500/20 group-hover:border-blue-500/30",
  },
  /** Verde para tareas completadas */
  green: {
    text: "text-emerald-400 group-hover:text-emerald-300",
    accent: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    border: "border-emerald-500/20 group-hover:border-emerald-500/30",
  },
  /** Naranja para tareas pendientes */
  orange: {
    text: "text-amber-400 group-hover:text-amber-300",
    accent: "bg-amber-500/10 group-hover:bg-amber-500/20",
    border: "border-amber-500/20 group-hover:border-amber-500/30",
  },
};

/**
 * Componente StatsCard - Tarjeta de estadísticas
 *
 * Renderiza una tarjeta elegante que muestra un valor numérico prominente
 * y una etiqueta descriptiva. El componente es completamente reutilizable
 * y soporta diferentes variantes de color según el tipo de estadística.
 *
 * @component
 * @param {StatsCardProps} props - Propiedades del componente
 * @param {number} props.value - Valor numérico a mostrar
 * @param {string} props.label - Etiqueta descriptiva
 * @param {"blue" | "green" | "orange"} props.color - Variante de color
 * @returns {JSX.Element} Elemento JSX de la tarjeta de estadísticas
 *
 * @example
 * ```tsx
 * // Tarjeta para total de todos
 * <StatsCard value={10} label="Total" color="blue" />
 *
 * // Tarjeta para todos completados
 * <StatsCard value={7} label="Completadas" color="green" />
 *
 * // Tarjeta para todos pendientes
 * <StatsCard value={3} label="Pendientes" color="orange" />
 * ```
 *
 * @accessibility
 * - Estructura semántica con divs apropiados
 * - Contraste de colores adecuado en modo claro y oscuro
 * - Tamaños de fuente legibles
 * - Espaciado apropiado para facilitar la lectura
 *
 * @design
 * - Diseño premium con glassmorphism y gradientes sutiles
 * - Bordes redondeados (rounded-2xl) con efectos hover
 * - Shadows refinados con múltiples capas
 * - Padding interno optimizado para mejor distribución
 * - Animaciones hover suaves y elegantes
 * - Valor prominente con tipografía mejorada
 * - Etiqueta con mejor contraste y spacing
 * - Efectos de acento de color dinámicos
 */
export const StatsCard = ({ value, label, color }: StatsCardProps) => {
  const colorConfig = colorClasses[color];

  return (
    <div
      className={`group relative backdrop-blur-md bg-slate-800/40 rounded-2xl p-4 shadow-2xl hover:shadow-3xl border transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-default ${colorConfig.border}`}
    >
      {/* Decorative accent background */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 ${colorConfig.accent}`}
      />

      {/* Content container */}
      <div className="relative z-10 text-center space-y-3">
        {/* Value display with enhanced typography */}
        <div
          className={`text-2xl font-black tracking-tight transition-all duration-300 ${colorConfig.text}`}
        >
          {value}
        </div>

        {/* Label with improved styling */}
        <div className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-300 tracking-wide uppercase">
          {label}
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${colorConfig.accent} blur-xl`}
      />
    </div>
  );
};

export default StatsCard;
