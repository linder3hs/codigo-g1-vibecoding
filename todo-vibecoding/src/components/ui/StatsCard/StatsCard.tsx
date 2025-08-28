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
 * @property {"charcoal" | "persian-green" | "saffron"} color - Variante de color para el valor
 */
interface StatsCardProps {
  /** Valor numérico a mostrar (ej: cantidad de todos) */
  value: number;
  /** Etiqueta descriptiva del valor (ej: "Total", "Completadas") */
  label: string;
  /** Variante de color: charcoal para total, persian-green para completadas, saffron para pendientes */
  color: "charcoal" | "persian-green" | "saffron";
}

/**
 * Mapeo de colores para las variantes del componente
 *
 * Define las clases CSS de Tailwind para cada variante de color,
 * incluyendo gradientes sutiles y efectos hover premium.
 *
 * @constant {Object} colorClasses
 * @property {Object} charcoal - Clases para variante charcoal (total)
 * @property {Object} persian-green - Clases para variante persian-green (completadas)
 * @property {Object} saffron - Clases para variante saffron (pendientes)
 */
const colorClasses = {
  /** Charcoal para estadísticas totales */
  charcoal: {
    text: "text-charcoal-600 group-hover:text-charcoal-700",
    accent: "bg-charcoal-500/10 group-hover:bg-charcoal-500/20",
    border: "border-charcoal-500/20 group-hover:border-charcoal-500/30",
  },
  /** Persian Green para tareas completadas */
  "persian-green": {
    text: "text-persian-green-400 group-hover:text-persian-green-300",
    accent: "bg-persian-green-500/10 group-hover:bg-persian-green-500/20",
    border:
      "border-persian-green-500/20 group-hover:border-persian-green-500/30",
  },
  /** Saffron para tareas pendientes */
  saffron: {
    text: "text-saffron-400 group-hover:text-saffron-300",
    accent: "bg-saffron-500/10 group-hover:bg-saffron-500/20",
    border: "border-saffron-500/20 group-hover:border-saffron-500/30",
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
 * @param {"charcoal" | "persian-green" | "saffron"} props.color - Variante de color
 * @returns {JSX.Element} Elemento JSX de la tarjeta de estadísticas
 *
 * @example
 * ```tsx
 * // Tarjeta para total de todos
 * <StatsCard value={10} label="Total" color="charcoal" />
 *
 * // Tarjeta para todos completados
 * <StatsCard value={7} label="Completadas" color="persian-green" />
 *
 * // Tarjeta para todos pendientes
 * <StatsCard value={3} label="Pendientes" color="saffron" />
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
      className={`group relative backdrop-blur-md bg-slate-800 rounded-2xl p-4 shadow-2xl hover:shadow-3xl border transition-all duration-500 hover:scale-105 hover:-translate-y-1 cursor-default ${colorConfig.border}`}
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
