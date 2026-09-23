import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ 
  title = 'Something went wrong',
  message = 'We encountered an error while loading your data.',
  onRetry,
  showRetry = true 
}: ErrorStateProps) {
  return (
    <div className="bg-[#1A2332] border border-red-800/50 rounded-lg p-8 text-center">
      <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{message}</p>
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-700 text-red-400 hover:bg-red-900/20 hover:border-red-600"
        >
          <RefreshCw className="size-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

export function APIError({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return (
    <ErrorState
      title="API Error"
      message={error || "We're having trouble loading your data. Please try again."}
      onRetry={onRetry}
    />
  );
}