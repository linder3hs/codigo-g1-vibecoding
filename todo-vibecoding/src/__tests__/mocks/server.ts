/**
 * MSW Server Configuration
 * Sets up Mock Service Worker for testing environment
 */

import { setupServer } from 'msw/node';
import { taskHandlers, mockTodos } from './handlers/taskHandlers';
import { authHandlers, mockUsers, mockTokens, mockRefreshTokens } from './handlers/authHandlers';

// Combine all handlers
const handlers = [
  ...taskHandlers,
  ...authHandlers,
];

// Create MSW server instance
export const server = setupServer(...handlers);

// Export handlers for potential use in individual tests
export { taskHandlers, authHandlers };

// Export mock data for testing utilities
export { mockTodos, mockUsers, mockTokens, mockRefreshTokens };

// Server control utilities
export const resetServer = () => {
  server.resetHandlers();
};

export const restoreServer = () => {
  server.restoreHandlers();
};

// Add custom handlers for specific tests
export const addHandlers = (...newHandlers: Parameters<typeof server.use>) => {
  server.use(...newHandlers);
};

// Reset all mock data to initial state
export const resetMockData = () => {
  // Reset task data
  mockTodos.length = 0;
  mockTodos.push(
    {
      id: 1,
      title: 'Tarea de ejemplo',
      description: 'Esta es una tarea de ejemplo para testing',
      status: 'pendiente',
      status_display: 'Pendiente',
      user_username: 'testuser',
      is_completed: false,
      created_at: '2024-01-01T00:00:00Z',
      completed_at: null,
      priority: 'medium'
    }
  );
  
  // Reset auth data
  mockTokens.clear();
  mockRefreshTokens.clear();
};