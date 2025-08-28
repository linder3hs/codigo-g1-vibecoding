/**
 * Footer component for the todo application
 * Displays branding and technology information
 */

export const Footer = () => {
  return (
    <footer className="relative text-center mt-16 pt-12">
      {/* Subtle gradient divider */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />

      <div className="group inline-flex items-center gap-3  bg-slate-800 border border-slate-700/30 text-slate-400 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-slate-700/30 hover:text-slate-300 hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-900/20">
        {/* Tailwind CSS Icon with subtle animation */}
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
        </svg>

        <span className="tracking-wide">
          Powered by{" "}
          <span className="font-semibold text-slate-300 group-hover:text-white transition-colors duration-300">
            Tailwind CSS v4
          </span>
        </span>

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-charcoal-500/10 to-persian_green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>
    </footer>
  );
};

export default Footer;
