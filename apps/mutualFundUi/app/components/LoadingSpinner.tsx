import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-600 border-t-[#FFAB00] ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingCard() {
  return (
    <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-5 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        <div className="h-20 bg-gray-700 rounded"></div>
        <div className="h-16 bg-gray-700 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-700 rounded flex-1"></div>
          <div className="h-8 bg-gray-700 rounded w-8"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-900/20 border border-gray-800 rounded-lg p-5 animate-pulse">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-16 h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="w-20 h-3 bg-gray-700 rounded"></div>
            <div className="w-24 h-6 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}