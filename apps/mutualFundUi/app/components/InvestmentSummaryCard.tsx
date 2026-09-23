'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_ENDPOINT = '/api/v1/ai-mutual-fund-system';

export function InvestmentSummaryCard() {
  const { data: session } = useSession();

  const { data: investments, isLoading } = useQuery({
    queryKey: ['user-investments', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      try {
        const response = await axios.get(`${API_BASE}${API_ENDPOINT}/trading/${session.user.id}/investments`);
        return response.data.data;
      } catch (error) {
        console.log('Investment data not available, showing empty state');
        return {
          currentValue: 0,
          totalInvested: 0,
          totalReturns: 0,
          totalReturnsPercent: 0,
          totalInvestments: 0
        };
      }
    },
    enabled: !!session?.user?.id,
    refetchInterval: 60000,
  });

  return (
    <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-5">
      <h3 className="text-white mb-4">Your Investments</h3>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoadingSpinner size="md" />
          <span className="ml-2 text-gray-400">Loading investments...</span>
        </div>
      ) : investments ? (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Current</div>
            <div className="text-2xl text-white">₹{investments.current?.toLocaleString('en-IN') || '0'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">1D returns</div>
            <div className="text-[#00C853]">
              +₹{investments.oneDayReturn?.toFixed(2) || '0.00'} ({investments.oneDayReturnPercent || '0.00'}%)
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Total returns</div>
            <div className="text-[#00C853]">
              +₹{investments.totalReturn?.toFixed(2) || '0.00'} ({investments.totalReturnPercent || '0.00'}%)
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Invested</div>
            <div className="text-white">₹{investments.invested?.toLocaleString('en-IN') || '0'}</div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center p-4">
          <div className="text-4xl mb-2">📊</div>
          <div>No investments yet</div>
          <div className="text-sm mt-1">Start investing to see your portfolio here</div>
        </div>
      )}
    </div>
  );
}