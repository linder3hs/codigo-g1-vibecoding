import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FilterButtons } from './FilterButtons';
import type { FilterType } from '../../../types/filter';

// Mock props
const mockOnFilterChange = jest.fn();

const defaultProps = {
  currentFilter: 'all' as FilterType,
  onFilterChange: mockOnFilterChange,
};

describe('FilterButtons', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all filter buttons correctly', () => {
      render(<FilterButtons {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /mostrar todas las tareas/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mostrar tareas pendientes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mostrar tareas completadas/i })).toBeInTheDocument();
      
      expect(screen.getByText('Todas')).toBeInTheDocument();
      expect(screen.getByText('Pendientes')).toBeInTheDocument();
      expect(screen.getByText('Completadas')).toBeInTheDocument();
    });

    it('should apply correct layout classes for horizontal layout', () => {
      const { container } = render(<FilterButtons {...defaultProps} layout="horizontal" />);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('flex', 'flex-wrap', 'justify-center', 'gap-3');
    });

    it('should apply correct layout classes for vertical layout', () => {
      const { container } = render(<FilterButtons {...defaultProps} layout="vertical" />);
      
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass('flex', 'flex-col', 'gap-3');
    });
  });

  describe('User Interactions', () => {
    it('should call onFilterChange when clicking filter buttons', async () => {
      const user = userEvent.setup();
      render(<FilterButtons {...defaultProps} />);
      
      const pendingButton = screen.getByRole('button', { name: /mostrar tareas pendientes/i });
      await user.click(pendingButton);
      
      expect(mockOnFilterChange).toHaveBeenCalledWith('pending');
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple filter changes correctly', async () => {
      const user = userEvent.setup();
      render(<FilterButtons {...defaultProps} />);
      
      const completedButton = screen.getByRole('button', { name: /mostrar tareas completadas/i });
      const allButton = screen.getByRole('button', { name: /mostrar todas las tareas/i });
      
      await user.click(completedButton);
      await user.click(allButton);
      
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, 'completed');
      expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'all');
      expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('Active State', () => {
    it('should highlight the current active filter', () => {
      render(<FilterButtons {...defaultProps} currentFilter="pending" />);
      
      const pendingButton = screen.getByRole('button', { name: /mostrar tareas pendientes/i });
      const allButton = screen.getByRole('button', { name: /mostrar todas las tareas/i });
      
      expect(pendingButton).toHaveAttribute('aria-pressed', 'true');
      expect(allButton).toHaveAttribute('aria-pressed', 'false');
      
      expect(pendingButton).toHaveClass('bg-gray-800', 'text-white');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes and labels', () => {
      render(<FilterButtons {...defaultProps} />);
      
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
        expect(button).toHaveAttribute('aria-pressed');
      });
      
      expect(screen.getByRole('button', { name: /mostrar todas las tareas/i })).toHaveAttribute('aria-label', 'Mostrar todas las tareas');
      expect(screen.getByRole('button', { name: /mostrar tareas pendientes/i })).toHaveAttribute('aria-label', 'Mostrar tareas pendientes');
      expect(screen.getByRole('button', { name: /mostrar tareas completadas/i })).toHaveAttribute('aria-label', 'Mostrar tareas completadas');
    });
  });
});