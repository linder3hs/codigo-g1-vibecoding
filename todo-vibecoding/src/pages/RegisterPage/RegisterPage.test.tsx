import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router';
import { RegisterPage } from './RegisterPage';

// Mock RegisterForm component
jest.mock('../../components/feature/RegisterForm', () => ({
  RegisterForm: () => (
    <div data-testid="register-form">
      <h2>Crear cuenta</h2>
      <form role="form">
        <input placeholder="Nombre de usuario" />
        <input placeholder="Email" type="email" />
        <input placeholder="Nombre" />
        <input placeholder="Apellido" />
        <input placeholder="Contraseña" type="password" />
        <input placeholder="Confirmar contraseña" type="password" />
        <button type="submit">Registrarse</button>
      </form>
      <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
    </div>
  ),
}));

// Wrapper component for router context
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('RegisterPage', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render correctly with proper structure', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
      expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
    });

    it('should have register-page CSS class', () => {
      const { container } = render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      const registerPageDiv = container.querySelector('.register-page');
      expect(registerPageDiv).toBeInTheDocument();
      expect(registerPageDiv).toHaveClass('register-page');
    });

    it('should render RegisterForm component', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });
  });

  describe('Form Integration', () => {
    it('should display all required form fields', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      expect(screen.getByPlaceholderText('Nombre de usuario')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirmar contraseña')).toBeInTheDocument();
    });

    it('should display submit button', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('should display login navigation link', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      const loginLink = screen.getByText('¿Ya tienes cuenta? Inicia sesión');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in form fields', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      const usernameInput = screen.getByPlaceholderText('Nombre de usuario');
      const emailInput = screen.getByPlaceholderText('Email');

      await user.type(usernameInput, 'testuser');
      await user.type(emailInput, 'test@example.com');

      expect(usernameInput).toHaveValue('testuser');
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should handle form submission', async () => {
      const user = userEvent.setup();
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      await user.click(submitButton);

      // Form should still be present (no navigation in mock)
      expect(screen.getByTestId('register-form')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ya tienes cuenta/i })).toBeInTheDocument();
    });

    it('should have proper input types for form fields', () => {
      render(
        <RouterWrapper>
          <RegisterPage />
        </RouterWrapper>
      );

      expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
      expect(screen.getByPlaceholderText('Contraseña')).toHaveAttribute('type', 'password');
      expect(screen.getByPlaceholderText('Confirmar contraseña')).toHaveAttribute('type', 'password');
    });
  });
});