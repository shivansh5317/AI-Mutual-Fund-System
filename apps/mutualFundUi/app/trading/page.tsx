'use client';

import React, { useState } from 'react';
import { ProtectedPage } from '../components/ProtectedPage';
import Link from 'next/link';

import { useMarketIndices, useTrendingStocks, useMarketMovers, useUserInvestments, usePositions, useOrders, useWatchlist } from '../hooks/useTrading';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TrendingUp, TrendingDown, ChevronRight, Activity, Wallet } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { WatchlistPanel } from '../components/WatchlistPanel';
import { TradingActions } from '../components/TradingActions';
import { InvestmentSummaryCard } from '../components/InvestmentSummaryCard';
import { SellModal } from '../components/SellModal';

export default function Trading() {
  const [activeTab, setActiveTab] = useState('explore');
  const [marketTab, setMarketTab] = useState('gainers');

  return (
    <ProtectedPage>
      <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white mb-1">Trading</h1>
          <p className="text-gray-400">Stocks, F&O, and Market Analysis</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#1A2332] border-b border-gray-800 w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger
            value="explore"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#FFAB00] rounded-none px-6 py-3 text-gray-400 data-[state=active]:text-white"
          >
            Explore
          </TabsTrigger>


          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#FFAB00] rounded-none px-6 py-3 text-gray-400 data-[state=active]:text-white"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="watchlist"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#FFAB00] rounded-none px-6 py-3 text-gray-400 data-[state=active]:text-white"
          >
            Watchlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="mt-6">
          <ExploreContent marketTab={marketTab} setMarketTab={setMarketTab} setActiveTab={setActiveTab} />
        </TabsContent>


        <TabsContent value="orders" className="mt-6">
          <OrdersContent />
        </TabsContent>
        <TabsContent value="watchlist" className="mt-6">
          <WatchlistContent />
        </TabsContent>
      </Tabs>
    </div>
    </ProtectedPage>
  );
}

function ExploreContent({ marketTab, setMarketTab, setActiveTab }: { marketTab: string; setMarketTab: (tab: string) => void; setActiveTab: (tab: string) => void }) {
  const { indices, loading: indicesLoading } = useMarketIndices();
  const { stocks, loading: stocksLoading } = useTrendingStocks();
  const { movers, loading: moversLoading } = useMarketMovers(marketTab);
  const { investments, loading: investmentsLoading } = useUserInvestments();

  const handleStockClick = (stock: any) => {
    console.log('Stock clicked:', stock);
    alert(`${stock.name} - ₹${stock.price}`);
  };



  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Market Indices Ticker */}
        <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            {indicesLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-gray-400">Loading indices...</span>
              </div>
            ) : (
              indices.map((index: any, i: number) => (
                <div key={i} className="flex items-center gap-3 min-w-fit">
                  <div>
                    <div className="text-xs text-gray-400">{index.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-white">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      <span className={`text-sm flex items-center gap-1 ${index.change >= 0 ? 'text-[#00C853]' : 'text-red-500'}`}>
                        {index.change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {index.change > 0 ? '+' : ''}{index.change} ({index.changePercent}%)
                      </span>
                    </div>
                  </div>
                  {i < indices.length - 1 && <div className="h-8 w-px bg-gray-700" />}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Traded Stocks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-white">Most Traded Stocks on WealthAI</h2>
            <Link 
              href="/trading/all-funds"
              className="text-sm text-[#FFAB00] hover:underline flex items-center gap-1"
            >
              See more <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {stocksLoading ? (
              <div className="col-span-4 flex items-center justify-center p-8">
                <LoadingSpinner size="lg" />
                <span className="ml-2 text-gray-400">Loading stocks...</span>
              </div>
            ) : (
              stocks.map((stock: any) => (
                <div
                  key={stock.id}
                  className="bg-[#1A2332] border border-gray-800 rounded-lg p-4 hover:border-[#FFAB00] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFAB00] to-[#FF6D00] rounded-lg flex items-center justify-center text-2xl">
                      {stock.logo}
                    </div>
                    <div>
                      <div className="text-white text-sm">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-white text-lg mb-1">₹{stock.price.toFixed(2)}</div>
                  <div className={`text-sm mb-3 ${stock.change >= 0 ? 'text-[#00C853]' : 'text-red-500'}`}>
                    {stock.change > 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStockClick(stock)}
                    className="w-full bg-[#FFAB00] hover:bg-[#FF9800] text-black"
                  >
                    Info
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Market Movers */}
        <div>
          <h2 className="text-lg text-white mb-4">Top Market Movers</h2>
          <Tabs value={marketTab} onValueChange={setMarketTab}>
            <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start rounded-none h-auto p-0 mb-4">
              <TabsTrigger
                value="gainers"
                className="data-[state=active]:bg-[#1A2332] rounded-lg px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                Gainers
              </TabsTrigger>
              <TabsTrigger
                value="losers"
                className="data-[state=active]:bg-[#1A2332] rounded-lg px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                Losers
              </TabsTrigger>
              <TabsTrigger
                value="volume"
                className="data-[state=active]:bg-[#1A2332] rounded-lg px-4 py-2 text-gray-400 data-[state=active]:text-white"
              >
                Volume Shockers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gainers">
              {moversLoading ? (
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2 text-gray-400">Loading market movers...</span>
                </div>
              ) : (
                <MarketMoversTable stocks={movers} />
              )}
            </TabsContent>
            <TabsContent value="losers">
              {moversLoading ? (
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2 text-gray-400">Loading market movers...</span>
                </div>
              ) : (
                <MarketMoversTable stocks={movers} />
              )}
            </TabsContent>
            <TabsContent value="volume">
              {moversLoading ? (
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2 text-gray-400">Loading market movers...</span>
                </div>
              ) : (
                <MarketMoversTable stocks={movers} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-4 pr-21">
        {/* Your Investments */}
        <InvestmentSummaryCard />

        {/* Products & Tools */}
        <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-5">
          <h3 className="text-white mb-4">Products & Tools</h3>
          <div className="space-y-2">
            {[
              { name: 'IPO', status: '8 open', icon: '📊', color: 'text-green-400' },
              { name: 'Bonds', status: '1 open', icon: '💰', color: 'text-blue-400' },
              { name: 'ETF Screener', status: 'New', icon: '🔍', color: 'text-purple-400' },
              { name: 'Intraday Screener', status: 'Popular', icon: '📈', color: 'text-yellow-400' },
              { name: 'F&O Analysis', status: 'Pro', icon: '🎯', color: 'text-orange-400' },
              { name: 'Stock Screener', status: 'Free', icon: '🔎', color: 'text-cyan-400' },
            ].map((tool, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="text-white text-sm">{tool.name}</span>
                </div>
                <span className={`text-xs ${tool.color} px-2 py-1 bg-gray-800 rounded`}>
                  {tool.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketMoversTable({ stocks }: { stocks: any[] }) {
  const handleStockClick = (stock: any) => {
    console.log('Stock clicked:', stock);
    alert(`${stock.name} - ₹${stock.price}`);
  };

  return (
    <div className="bg-[#1A2332] border border-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#0F1419]">
          <tr>
            <th className="text-left p-4 text-sm text-gray-400">Company</th>
            <th className="text-right p-4 text-sm text-gray-400">Market Price (1D)</th>
            <th className="text-right p-4 text-sm text-gray-400">Volume</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr
              key={index}
              className="border-t border-gray-800 hover:bg-[#0F1419] transition-colors cursor-pointer"
              onClick={() => handleStockClick(stock)}
            >
              <td className="p-4">
                <div className="text-white">{stock.name}</div>
                <div className="text-xs text-gray-400">{stock.symbol}</div>
              </td>
              <td className="p-4 text-right">
                <div className="text-white">₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <div className={`text-sm ${stock.change >= 0 ? 'text-[#00C853]' : 'text-red-500'}`}>
                  {stock.change > 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                </div>
              </td>
              <td className="p-4 text-right text-gray-300">
                {stock.volume.toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}





function OrdersContent() {
  const { orders, loading } = useOrders();
  const [sellModal, setSellModal] = useState<{ isOpen: boolean; order: any }>({ isOpen: false, order: null });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-12 text-center">
        <div className="size-16 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 mx-auto mb-4 text-2xl">
          📋
        </div>
        <h3 className="text-xl text-white mb-2">No Orders Placed</h3>
        <p className="text-gray-400 mb-6">Your buy and sell orders will be shown here</p>
        <Button 
          className="bg-[#FFAB00] hover:bg-[#FF9800] text-black"
          onClick={() => window.location.href = '/trading/all-funds'}
        >
          Place Order
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1A2332] border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0F1419]">
            <tr>
              <th className="text-left p-4 text-sm text-gray-400">Stock</th>
              <th className="text-right p-4 text-sm text-gray-400">Side</th>
              <th className="text-right p-4 text-sm text-gray-400">Qty</th>
              <th className="text-right p-4 text-sm text-gray-400">Price</th>
              <th className="text-right p-4 text-sm text-gray-400">Type</th>
              <th className="text-right p-4 text-sm text-gray-400">Status</th>
              <th className="text-right p-4 text-sm text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-t border-gray-800 hover:bg-[#0F1419] transition-colors">
                <td className="p-4 text-white">{order.symbol}</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-1 rounded text-xs ${order.side === 'BUY' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {order.side}
                  </span>
                </td>
                <td className="p-4 text-right text-white">{order.quantity}</td>
                <td className="p-4 text-right text-white">₹{order.price.toFixed(2)}</td>
                <td className="p-4 text-right text-white">{order.type}</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'EXECUTED' ? 'bg-green-900 text-green-400' :
                    order.status === 'PENDING' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {order.side === 'BUY' && order.status === 'EXECUTED' && (
                    <Button
                      size="sm"
                      onClick={() => setSellModal({ isOpen: true, order })}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Sell
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <SellModal
        isOpen={sellModal.isOpen}
        onClose={() => setSellModal({ isOpen: false, order: null })}
        order={sellModal.order}
      />
    </>
  );
}

function WatchlistContent() {
  return (
    <div className="w-full">
      <WatchlistPanel />
    </div>
  );
}