/**
 * LoginPage - Page for testing the LoginForm component
 */

import React, { useState } from 'react';
import { LoginForm } from '@/components/feature/LoginForm';
import type { LoginFormData } from '@/components/feature/LoginForm';

/**
 * LoginPage Component
 * Test page to visualize and interact with the LoginForm component
 */
export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<LoginFormData | null>(null);

  /**
   * Handle login form submission
   */
  const handleLogin = async (data: LoginFormData) => {
    console.log('Login attempt:', data);
    setError(null);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different scenarios for testing
      if (data.email === 'error@test.com') {
        throw new Error('Credenciales inválidas');
      }
      
      if (data.email === 'slow@test.com') {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      setLastSubmission(data);
      console.log('Login successful:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset demo state
   */
  const resetDemo = () => {
    setError(null);
    setLastSubmission(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* LoginForm */}
        <div className="flex justify-center">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
            className="w-full max-w-md"
          />
        </div>

        {/* Demo Info Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Demo del LoginForm
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Casos de Prueba:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <strong>test@example.com</strong> - Login exitoso
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <strong>error@test.com</strong> - Error de credenciales
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <strong>slow@test.com</strong> - Respuesta lenta (5s)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Funcionalidades:
              </h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✅ Validación en tiempo real con Zod</li>
                <li>✅ Toggle de visibilidad de contraseña</li>
                <li>✅ Estados de loading y error</li>
                <li>✅ Animaciones con Framer Motion</li>
                <li>✅ Diseño responsive con Tailwind CSS</li>
                <li>✅ Accesibilidad completa</li>
              </ul>
            </div>

            {lastSubmission && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Último envío exitoso:
                </h3>
                <pre className="text-sm text-green-700 bg-green-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(lastSubmission, null, 2)}
                </pre>
              </div>
            )}

            <button
              onClick={resetDemo}
              className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              Resetear Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;