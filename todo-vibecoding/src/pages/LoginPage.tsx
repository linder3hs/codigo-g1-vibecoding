/**
 * LoginPage - Page for testing the LoginForm component
 */

import { LoginForm } from "@/components/feature/LoginForm";

/**
 * LoginPage Component
 * Test page to visualize and interact with the LoginForm component
 */
export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* LoginForm */}
        <div className="flex justify-center">
          <LoginForm className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
