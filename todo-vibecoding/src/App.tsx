import { AppRouter } from "./routes";

/**
 * Main App component with React Router configuration
 * Entry point for the Todo application with modern glassmorphism layout
 * Features dark mode as default with responsive design and subtle animations
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Background decorative elements with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main content with glassmorphism container */}
      <div className="relative z-10 min-h-screen">
        <div className="backdrop-blur-sm bg-slate-900/20 min-h-screen">
          <AppRouter />
        </div>
      </div>
    </div>
  );
}

export default App;
