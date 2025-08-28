import { AppRouter } from "./routes";

/**
 * Main App component with React Router configuration
 * Entry point for the Todo application with modern glassmorphism layout
 * Features dark mode as default with responsive design and subtle animations
 */
function App() {
  return (
    <div className="min-h-screen bg-charcoal-950 relative overflow-hidden">
      {/* Main content with glassmorphism container */}
      <div className="relative z-10 min-h-screen">
        <div className="min-h-screen">
          <AppRouter />
        </div>
      </div>
    </div>
  );
}

export default App;
