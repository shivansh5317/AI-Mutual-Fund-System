'use client';

import React from 'react';
import { useWatchlist, useRemoveFromWatchlist } from '../hooks/useTrading';
import { LoadingSpinner } from './LoadingSpinner';

export function WatchlistPanel() {
  const { watchlist, loading, error } = useWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  const handleRemove = (watchlistId: string) => {
    removeFromWatchlistMutation.mutate(watchlistId);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2 text-white">Loading watchlist...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="text-red-400">Error loading watchlist: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-white text-lg font-semibold mb-4">My Watchlist</h2>
      
      {watchlist.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          Your watchlist is empty. Add funds from the All Funds page.
        </div>
      ) : (
        <div className="space-y-2">
          {watchlist.map((item: any) => (
            <div key={item.id} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white font-medium">{item.name}</div>
                <div className="text-gray-400 text-sm">{item.symbol}</div>
              </div>
              
              <button
                onClick={() => handleRemove(item.id)}
                disabled={removeFromWatchlistMutation.isPending}
                className="text-red-400 hover:text-red-300 disabled:text-gray-500 p-1"
                title="Remove from watchlist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}