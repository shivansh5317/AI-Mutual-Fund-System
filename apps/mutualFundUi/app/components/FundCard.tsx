import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Riskometer } from './Riskometer';
import { TechnicalDetailsModal } from './TechnicalDetailsModal';
import { TrendingUp, Sparkles } from 'lucide-react';

export interface FundData {
  id: string;
  schemeName: string;
  amc: string;
  category: string;
  riskLevel: 'Low' | 'Low to Moderate' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
  threeYearCAGR: number;
  aiForecastedROI: number;
  technicalData: {
    alpha: number;
    beta: number;
    sharpeRatio: number;
    sortinoRatio: number;
    expenseRatio: number;
    standardDeviation: number;
    treynorRatio: number;
  };
}

interface FundCardProps {
  fund: FundData;
}

export function FundCard({ fund }: FundCardProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base leading-tight">
            {fund.schemeName}
          </CardTitle>
          <p className="text-sm text-gray-600">{fund.amc}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Riskometer */}
          <div className="flex justify-center py-2">
            <Riskometer level={fund.riskLevel} />
          </div>

          {/* 3-Year CAGR */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-4 text-[#00C853]" />
              <span className="text-sm text-gray-700">3-Year CAGR Returns</span>
            </div>
            <div className="text-2xl text-[#00C853]">
              {fund.threeYearCAGR.toFixed(2)}%
            </div>
          </div>

          {/* AI Forecasted Performance - Gold accent */}
          <div 
            className="rounded-lg p-4 border-2 border-[#FFAB00] relative overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 171, 0, 0.08)' }}
          >
            <div className="absolute top-2 right-2">
              <Sparkles className="size-5 text-[#FFAB00]" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-800">AI Forecasted Performance</span>
            </div>
            <div className="text-xl text-[#FFAB00]">
              {fund.aiForecastedROI.toFixed(2)}% ROI
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Based on predictive analytics
            </div>
          </div>

          {/* View Technical Details Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-sm"
            onClick={() => setShowTechnicalDetails(true)}
          >
            View Technical Details
          </Button>
        </CardContent>
      </Card>

      <TechnicalDetailsModal
        isOpen={showTechnicalDetails}
        onClose={() => setShowTechnicalDetails(false)}
        fundName={fund.schemeName}
        technicalData={fund.technicalData}
      />
    </>
  );
}
