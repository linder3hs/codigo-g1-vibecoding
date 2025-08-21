/**
 * Loading Component
 * Simple loading spinner for use throughout the application
 */

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const FullScreenLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loading size="lg" />
  </div>
);

export default Loading;