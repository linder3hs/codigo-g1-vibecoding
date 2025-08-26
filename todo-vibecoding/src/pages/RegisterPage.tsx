/**
 * RegisterPage Component
 * Página de registro de usuario
 */

import React from 'react';
import { RegisterForm } from '../components/feature/RegisterForm';

/**
 * RegisterPage - Página principal de registro
 * Contiene el formulario de registro de usuario
 */
export const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;