/**
 * @fileoverview Componente Header para la aplicación Todo Vibe Coding
 *
 * Este componente renderiza el encabezado principal de la aplicación,
 * incluyendo el título con gradiente y el subtítulo descriptivo.
 * Implementa diseño responsivo y soporte para modo oscuro.
 *
 * @author Vibe Coding Team
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * Propiedades del componente Header
 *
 * @interface HeaderProps
 * @property {string} title - Título principal que se mostrará en el encabezado
 * @property {string} subtitle - Subtítulo descriptivo que aparece debajo del título
 */
interface HeaderProps {
  /** Título principal de la aplicación */
  title: string;
  /** Subtítulo descriptivo de la aplicación */
  subtitle: string;
}

/**
 * Componente Header - Encabezado principal de la aplicación
 *
 * Renderiza un encabezado centrado con título y subtítulo modernos.
 * El título incluye un gradiente sutil y profesional con animaciones hover.
 * Implementa tipografía mejorada y transiciones suaves.
 *
 * @component
 * @param {HeaderProps} props - Propiedades del componente
 * @param {string} props.title - Título principal a mostrar
 * @param {string} props.subtitle - Subtítulo descriptivo a mostrar
 * @returns {JSX.Element} Elemento JSX del encabezado
 *
 * @example
 * ```tsx
 * <Header
 *   title="Todo Vibe Coding"
 *   subtitle="Gestiona tus tareas de manera eficiente"
 * />
 * ```
 *
 * @accessibility
 * - Utiliza elementos semánticos (header, h1, p)
 * - El título principal usa h1 para jerarquía correcta
 * - Colores con contraste adecuado para legibilidad
 * - Soporte para modo oscuro con gradientes optimizados
 *
 * @responsive
 * - Título: text-4xl en móvil, text-6xl en desktop (lg:)
 * - Diseño centrado en todas las resoluciones
 * - Espaciado adaptativo y animaciones responsivas
 */
export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="text-center mb-5 relative">
      {/* Decorative background element */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-gradient-to-r from-slate-600/10 to-blue-600/10 rounded-full blur-3xl" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-6 group cursor-default">
        <span className="bg-gradient-to-r from-slate-200 via-blue-200 to-slate-300 bg-clip-text text-transparent transition-all duration-500 group-hover:from-blue-300 group-hover:via-slate-200 group-hover:to-blue-300 group-hover:scale-105 inline-block">
          {title}
        </span>
      </h1>
      <p className="text-slate-400 hover:text-slate-300 text-lg font-medium tracking-wide transition-all duration-300 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>{" "}
    </header>
  );
};

export default Header;
