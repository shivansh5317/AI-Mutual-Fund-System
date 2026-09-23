'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

export function WealthLoader() {
  return (
    <div className="fixed inset-0 bg-[#0F1419] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FFAB00] to-[#FF6D00] rounded-2xl flex items-center justify-center animate-pulse">
            <TrendingUp className="size-10 text-white" />
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin">
            <div className="w-2 h-2 bg-[#FFAB00] rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2"></div>
            <div className="w-2 h-2 bg-[#00C853] rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-1/2 -left-1 transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl text-white mb-2">WealthAI</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Analyzing market data</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#FFAB00] rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-[#FFAB00] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-[#FFAB00] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FFAB00] to-[#00C853] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}