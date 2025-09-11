import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom';
import { Navigation } from './Navigation';

// Mock useAuth hook
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockRegister = jest.fn();
const mockRefreshToken = jest.fn();
const mockClearAuthError = jest.fn();
const mockGetCurrentUser = jest.fn();
const mockCheckAuthStatus = jest.fn();
const mockInitializeAuth = jest.fn();

// Create a mock that can be modified per test
const mockUseAuth = {
  login: mockLogin,
  logout: mockLogout,
  register: mockRegister,
  refreshToken: mockRefreshToken,
  clearAuthError: mockClearAuthError,
  getCurrentUser: mockGetCurrentUser,
  checkAuthStatus: mockCheckAuthStatus,
  initializeAuth: mockInitializeAuth,
  isLoading: false,
  error: null as { message: string } | null,
  isAuthenticated: false,
  user: null as typeof mockUser | null,
  isTokenExpired: false,
  isTokenExpiringSoon: false,
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock react-router
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
);

// Mock user data
const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'user' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('Navigation', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.user = null;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /todo vibecoding/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
    });

    it('should render authenticated user navigation', () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /mis tareas/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /crear tarea/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /testuser/i })).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle user menu interactions', async () => {
      const user = userEvent.setup();
      
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      const userMenuButton = screen.getByRole('button', { name: /testuser/i });
      await user.click(userMenuButton);

      await waitFor(() => {
        expect(screen.getByText('Configuración')).toBeInTheDocument();
        expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
      });
    });

    it('should handle logout functionality', async () => {
      const user = userEvent.setup();
      const mockLogout = jest.fn().mockResolvedValue(undefined);

      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.logout = mockLogout;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      await user.click(screen.getByRole('button', { name: /testuser/i }));
      const logoutButton = await screen.findByText('Cerrar Sesión');
      await user.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to different pages', async () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      const tasksLink = screen.getByRole('link', { name: /mis tareas/i });
      expect(tasksLink).toHaveAttribute('href', '/tasks');
      
      const createTaskLink = screen.getByRole('link', { name: /crear tarea/i });
      expect(createTaskLink).toHaveAttribute('href', '/crear-todo');
    });
  });

  describe('Mobile Menu', () => {
    it('should open and close mobile menu', async () => {
      const user = userEvent.setup();
      
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      const mobileMenuButton = screen.getByRole('button', { name: /abrir menú/i });
      await user.click(mobileMenuButton);

      await waitFor(() => {
        expect(screen.getByText('Menú')).toBeInTheDocument();
      });
    });

    it('should display navigation items in mobile menu', async () => {
      const user = userEvent.setup();
      
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      await user.click(screen.getByRole('button', { name: /abrir menú/i }));

      await waitFor(() => {
        expect(screen.getAllByText('Inicio')).toHaveLength(2);
        expect(screen.getAllByText('Mis Tareas')).toHaveLength(2);
      });
    });
  });

  describe('Active States', () => {
    it('should handle active navigation states', () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      const tasksLink = screen.getByRole('link', { name: /mis tareas/i });
      expect(tasksLink).toBeInTheDocument();
      expect(tasksLink).toHaveAttribute('href', '/tasks');
    });
  });

  describe('Authentication Handling', () => {
    it('should show different items based on auth state', () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.user = null;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /registrarse/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /mis tareas/i })).not.toBeInTheDocument();
    });

    it('should show authenticated navigation when logged in', () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      expect(screen.getByRole('link', { name: /mis tareas/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /crear tarea/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /iniciar sesión/i })).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle logout errors gracefully', async () => {
      const user = userEvent.setup();
      const mockLogout = jest.fn().mockRejectedValue(new Error('Logout failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.logout = mockLogout;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      await user.click(screen.getByRole('button', { name: /testuser/i }));
      const logoutButton = await screen.findByText('Cerrar Sesión');
      await user.click(logoutButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error during logout:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Set mock values for this test
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.user = mockUser;
      mockUseAuth.isLoading = false;
      mockUseAuth.error = null;
      mockUseAuth.isTokenExpired = false;
      mockUseAuth.isTokenExpiringSoon = false;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      const userMenuButton = screen.getByRole('button', { name: /testuser/i });
      expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(userMenuButton).toHaveAttribute('aria-haspopup', 'true');

      const mobileMenuButton = screen.getByRole('button', { name: /abrir menú/i });
      expect(mobileMenuButton).toHaveAttribute('aria-label', 'Abrir menú');
    });
  });
});
