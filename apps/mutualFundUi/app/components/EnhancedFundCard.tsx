import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Riskometer } from './Riskometer';
import { TechnicalDetailsModal } from './TechnicalDetailsModal';
import { BuySellModal } from './BuySellModal';
import { Star, Sparkles, TrendingUp, Info } from 'lucide-react';
import { FundData } from './FundCard';

interface EnhancedFundCardProps {
  fund: FundData & {
    rating?: number;
    minSIP?: number;
    aum?: string;
  };
}

export function EnhancedFundCard({ fund }: EnhancedFundCardProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showBuySellModal, setShowBuySellModal] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < rating
            ? 'fill-[#FFAB00] text-[#FFAB00]'
            : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <>
      <Card className="bg-[#1A2332] border-gray-800 hover:border-[#FFAB00] transition-all duration-300 hover:shadow-xl hover:shadow-[#FFAB00]/10">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-white leading-tight mb-2">
              {fund.schemeName}
            </h3>
            <p className="text-sm text-gray-400">{fund.amc}</p>
            {fund.rating && (
              <div className="flex items-center gap-1 mt-2">
                {renderStars(fund.rating)}
              </div>
            )}
          </div>

          {/* Riskometer */}
          <div className="flex justify-center py-2 bg-[#0F1419] rounded-lg">
            <Riskometer level={fund.riskLevel} />
          </div>

          {/* 3-Year Returns */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-700/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="size-4 text-[#00C853]" />
              <span className="text-sm text-gray-300">3-YEAR RETURNS</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-[#00C853]">
                +{(fund.threeYearCAGR || 0).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400">₹10K → ₹{(10000 * Math.pow(1 + (fund.threeYearCAGR || 0)/100, 3)).toFixed(0)}</span>
            </div>
          </div>

          {/* AI Forecast */}
          <div
            className="rounded-lg p-4 border-2 border-[#FFAB00] relative overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 171, 0, 0.1)' }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFAB00]/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="size-5 text-[#FFAB00]" />
                <span className="text-sm text-gray-300">AI FORECAST (1Y)</span>
              </div>
              <div className="text-2xl text-[#FFAB00] mb-2">
                +{(fund.aiForecastedROI || 0).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">
                Powered by machine learning
              </div>
            </div>
          </div>

          {/* Fund Details Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-800">
            <div>
              <div className="text-xs text-gray-500">Min. SIP</div>
              <div className="text-sm text-white mt-1">₹{fund.minSIP || 500}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">AUM</div>
              <div className="text-sm text-white mt-1">{fund.aum || '₹2.5K Cr'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Expense</div>
              <div className="text-sm text-white mt-1">{(fund.technicalData?.expenseRatio || 0).toFixed(2)}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1 bg-[#FFAB00] hover:bg-[#FF9800] text-black"
              onClick={() => setShowTechnicalDetails(true)}
            >
              <Info className="size-4 mr-2" />
              View Details
            </Button>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setShowTechnicalDetails(true)}
          >
            View Technical Analysis & Fees
          </Button>
        </CardContent>
      </Card>

      <TechnicalDetailsModal
        isOpen={showTechnicalDetails}
        onClose={() => setShowTechnicalDetails(false)}
        fundName={fund.schemeName}
        technicalData={fund.technicalData}
      />
      
      <BuySellModal
        isOpen={showBuySellModal}
        onClose={() => setShowBuySellModal(false)}
        fund={{
          id: fund.id,
          schemeName: fund.schemeName,
          minSip: fund.minSIP,
        }}
      />
    </>
  );
}
