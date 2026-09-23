'use client'

import { Search, SlidersHorizontal } from 'lucide-react';
import { ProtectedPage } from '../components/ProtectedPage';
import { useMemo, useState } from 'react';
import { EnhancedFundCard } from '../components/EnhancedFundCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { useRecommendations } from '../hooks/useMutualFunds';
import { LoadingCard } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorBoundary';
import type { FundRecommendation } from '../lib/api';
import { useState as useStateReact, useEffect } from 'react';
import axios from 'axios';
import { FundChatbot } from '../components/FundChatbot';

// Helper function to convert API data to component format
const convertToFundData = (fund: any) => ({
  id: fund.id,
  schemeName: fund.schemeName,
  amc: fund.amcName,
  category: fund.category,
  riskLevel: getRiskLevelText(fund.riskLevel),
  threeYearCAGR: fund.returns3yr || fund.expectedReturn,
  aiForecastedROI: fund.expectedReturn,
  rating: fund.rating,
  minSIP: fund.minSip || 500,
  aum: fund.fundSizeCr ? `₹${fund.fundSizeCr.toFixed(1)}K Cr` : '₹2.5K Cr',
  technicalData: {
    alpha: fund.alpha || 0,
    beta: fund.beta || 1,
    sharpeRatio: fund.sharpe || 0,
    sortinoRatio: fund.sortino || 0,
    expenseRatio: fund.expenseRatio || 1.2,
    standardDeviation: fund.sd || 0,
    treynorRatio: fund.sharpe ? (fund.sharpe * 0.8) : 0, // Approximate treynor from sharpe
  },
});

const getRiskLevelText = (riskLevel: number): 'Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High' | 'Low to Moderate' => {
  if (riskLevel <= 2) return 'Low';
  if (riskLevel <= 4) return 'Moderate';
  if (riskLevel <= 6) return 'Moderately High';
  return 'High';
};

export default function Funds() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('returns');
  const [filterRisk, setFilterRisk] = useState('all');
  const [allFunds, setAllFunds] = useStateReact<FundRecommendation[]>([]);
  const [loading, setLoading] = useStateReact(false);
  const [error, setError] = useStateReact<string | null>(null);
  
  // Fetch all funds on component mount
  useEffect(() => {
    const fetchAllFunds = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/v1/ai-mutual-fund-system/mutual-funds/all');
        setAllFunds(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load funds');
        console.error('Error fetching funds:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllFunds();
  }, []);

  const filteredAndSortedFunds = useMemo(() => {
    let funds = allFunds.map(convertToFundData);

    // Search filter
    if (searchTerm) {
      funds = funds.filter(
        (fund) =>
          fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fund.amc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk filter
    if (filterRisk !== 'all') {
      funds = funds.filter((fund) => fund.riskLevel === filterRisk);
    }

    // Sort
    funds.sort((a, b) => {
      switch (sortBy) {
        case 'returns':
          return b.threeYearCAGR - a.threeYearCAGR;
        case 'ai-forecast':
          return b.aiForecastedROI - a.aiForecastedROI;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return funds;
  }, [allFunds, searchTerm, sortBy, filterRisk]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-white mb-2">AI-Recommended Funds for Your Profile</h1>
          <p className="text-gray-400">Loading personalized recommendations...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-white mb-2">AI-Recommended Funds for Your Profile</h1>
          <p className="text-gray-400">Error loading recommendations</p>
        </div>
        <ErrorState
          title="Funds Loading Error"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const handleChatbotRecommendations = (recommendations: any[]) => {
    const convertedFunds = recommendations.map(convertToFundData);
    setAllFunds(convertedFunds);
    setSearchTerm(''); // Clear search to show all AI results
    setFilterRisk('all'); // Clear filters to show all AI results
  };

  return (
    <ProtectedPage>
      <div className="space-y-6">
      <FundChatbot onFundsRecommended={handleChatbotRecommendations} />
      {/* Header */}
      <div>
        <h1 className="text-2xl text-white mb-2">AI-Recommended Funds for Your Profile</h1>
        <p className="text-gray-400">
          Showing {filteredAndSortedFunds.length} funds based on your investment preferences
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search funds or AMC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0F1419] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-gray-400" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-[#0F1419] border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2332] border-gray-700">
                <SelectItem value="returns" className="text-white">
                  Returns
                </SelectItem>
                <SelectItem value="ai-forecast" className="text-white">
                  AI Forecast
                </SelectItem>
                <SelectItem value="rating" className="text-white">
                  Rating
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-48 bg-[#0F1419] border-gray-700 text-white">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2332] border-gray-700">
                <SelectItem value="all" className="text-white">
                  All Risk Levels
                </SelectItem>
                <SelectItem value="Low" className="text-white">
                  Low
                </SelectItem>
                <SelectItem value="Moderate" className="text-white">
                  Moderate
                </SelectItem>
                <SelectItem value="Moderately High" className="text-white">
                  Moderately High
                </SelectItem>
                <SelectItem value="High" className="text-white">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Fund Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : filteredAndSortedFunds.length === 0 ? (
        <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg">
            {allFunds.length === 0 
              ? 'No funds available.' 
              : 'No funds match your search criteria'
            }
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setFilterRisk('all');
            }}
            variant="outline"
            className="mt-4 border-gray-700 text-white hover:bg-gray-800"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedFunds.map((fund) => (
            <EnhancedFundCard key={fund.id} fund={fund} />
          ))}
        </div>
      )}
    </div>
    </ProtectedPage>
  );
}