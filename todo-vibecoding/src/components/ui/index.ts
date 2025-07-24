/**
 * Barrel file for UI components
 * Centralizes exports for cleaner imports
 */

// Export all UI components
export { Header } from './Header';
export { StatsCard } from './StatsCard';
export { StatsSection } from './StatsSection';
export { FilterButtons } from './FilterButtons';
export { TodoItem } from './TodoItem';
export { TodoList } from './TodoList';
export { Footer } from './Footer';

// Export default components as well for flexibility
export { default as HeaderDefault } from './Header';
export { default as StatsCardDefault } from './StatsCard';
export { default as StatsSectionDefault } from './StatsSection';
export { default as FilterButtonsDefault } from './FilterButtons';
export { default as TodoItemDefault } from './TodoItem';
export { default as TodoListDefault } from './TodoList';
export { default as FooterDefault } from './Footer';

// Re-export types if needed
export type { FilterType } from '../../hooks/useTodo';