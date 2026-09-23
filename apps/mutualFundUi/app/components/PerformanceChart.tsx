import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    month: string;
    historicalNAV: number;
    predictedNAV?: number;
  }>;
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="bg-transparent">      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFAB00" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FFAB00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px', fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px', fill: '#9CA3AF' }}
            label={{ value: 'NAV Value (₹)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1A2332', 
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff'
            }}
            formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Area
            type="monotone"
            dataKey="historicalNAV"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#historicalGradient)"
            name="Historical NAV"
            dot={{ fill: '#3B82F6', r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="predictedNAV"
            stroke="#FFAB00"
            strokeWidth={3}
            strokeDasharray="8 8"
            fill="url(#predictedGradient)"
            name="AI-Predicted NAV"
            dot={{ fill: '#FFAB00', r: 4, strokeWidth: 2, stroke: '#FFAB00' }}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}