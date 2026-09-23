'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedPage } from '../../components/ProtectedPage';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { usePlaceOrder, useAddToWatchlist } from '../../hooks/useTrading';
import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { BuyModal } from '../../components/BuyModal';
import { toast } from 'sonner';
import { mutualFundAPI } from '../../lib/api';

export default function AllFundsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [buyModal, setBuyModal] = useState<{ isOpen: boolean; fund: any }>({ isOpen: false, fund: null });
  
  const placeOrderMutation = usePlaceOrder();
  const addToWatchlistMutation = useAddToWatchlist();

  const { data: fundsData, isLoading } = useQuery({
    queryKey: ['all-funds', currentPage, searchTerm],
    queryFn: async () => {
      const data = await mutualFundAPI.getAllFunds({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });
      return data.success ? data : { data: [], pagination: { totalPages: 1 } };
    },
    refetchInterval: 60000,
  });

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const response = await fetch('/api/trading/portfolio');
      return response.ok ? response.json() : { holdings: [] };
    },
  });

  const isOwned = (fundSymbol: string) => {
    return portfolio?.holdings?.some((holding: any) => holding.symbol === fundSymbol) || false;
  };

  const handleBuy = (fund: any) => {
    setBuyModal({ isOpen: true, fund });
  };

  const handleSell = (fund: any) => {
    const price = 100;
    placeOrderMutation.mutate({
      symbol: fund.schemeName?.split(' ')[0] || fund.name,
      side: 'SELL',
      quantity: 1,
      price,
      type: 'MARKET',
    });
  };

  const handleAddToWatchlist = (fund: any) => {
    addToWatchlistMutation.mutate({
      symbol: fund.schemeName?.split(' ')[0] || fund.name,
      name: fund.schemeName || fund.name,
      price: 100,
      change: Math.random() * 10 - 5,
      changePercent: Math.random() * 2 - 1,
    }, {
      onSuccess: () => {
        toast.success('Added to watchlist!', {
          description: `${fund.schemeName} added to your watchlist`,
          duration: 3000,
        });
      },
      onError: () => {
        toast.error('Failed to add to watchlist', {
          description: 'Please try again later',
          duration: 3000,
        });
      }
    });
  };

  return (
    <ProtectedPage>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/trading" className="p-2 hover:bg-gray-800 rounded-lg">
            <ArrowLeft className="size-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl text-white mb-1">All Mutual Funds</h1>
            <p className="text-gray-400">Browse and trade all available mutual funds</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-[#1A2332] border-gray-700 text-white"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" />
            <span className="ml-2 text-gray-400">Loading funds...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundsData?.data?.map((fund: any) => (
                <div key={fund.id} className="bg-[#1A2332] border border-gray-800 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-white font-semibold mb-2">{fund.schemeName}</h3>
                    <p className="text-gray-400 text-sm">{fund.amcName}</p>
                    <p className="text-gray-400 text-sm">{fund.category}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <span className="text-white ml-1">{fund.rating}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk:</span>
                      <span className="text-white ml-1">{fund.riskLevel}/10</span>
                    </div>
                    <div>
                      <span className="text-gray-400">1Y Return:</span>
                      <span className="text-white ml-1">{fund.returns1yr?.toFixed(2) || 'N/A'}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Min SIP:</span>
                      <span className="text-white ml-1">₹{fund.minSip}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBuy(fund)}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      Buy
                    </Button>
                    {isOwned(fund.schemeName?.split(' ')[0] || fund.name) && (
                      <Button
                        size="sm"
                        onClick={() => handleSell(fund)}
                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
                      >
                        Sell
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleAddToWatchlist(fund)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Watch
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-3 mt-8 p-4">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded ${
                      currentPage === pageNum 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(5)}
                className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Last
              </button>
            </div>
          </>
        )}
        
        <BuyModal
          isOpen={buyModal.isOpen}
          onClose={() => setBuyModal({ isOpen: false, fund: null })}
          fund={buyModal.fund}
        />
      </div>
    </ProtectedPage>
  );
}