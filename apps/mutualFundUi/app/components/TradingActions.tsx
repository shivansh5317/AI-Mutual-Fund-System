'use client';

import React, { useState } from 'react';
import { usePlaceOrder, useAddToWatchlist, useRemoveFromWatchlist } from '../hooks/useTrading';

interface TradingActionsProps {
  symbol: string;
  name: string;
  price: number;
  change?: number;
  changePercent?: number;
}

export function TradingActions({ symbol, name, price, change, changePercent }: TradingActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState(price);

  const placeOrderMutation = usePlaceOrder();
  const addToWatchlistMutation = useAddToWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  const handleBuy = () => {
    placeOrderMutation.mutate({
      symbol,
      side: 'BUY',
      quantity,
      price: orderType === 'MARKET' ? price : limitPrice,
      type: orderType,
    }, {
      onSuccess: () => {
        alert(`Buy order placed for ${quantity} ${symbol}`);
      },
      onError: (error) => {
        console.error('Buy order failed:', error);
      }
    });
  };

  const handleSell = () => {
    placeOrderMutation.mutate({
      symbol,
      side: 'SELL',
      quantity,
      price: orderType === 'MARKET' ? price : limitPrice,
      type: orderType,
    }, {
      onSuccess: () => {
        alert(`Sell order placed for ${quantity} ${symbol}`);
      },
      onError: (error) => {
        console.error('Sell order failed:', error);
      }
    });
  };

  const handleAddToWatchlist = () => {
    addToWatchlistMutation.mutate({
      symbol,
      name,
      price,
      change,
      changePercent,
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">{symbol}</h3>
        <span className="text-gray-400">{name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-white">₹{price}</span>
        {change && (
          <span className={`text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change} ({changePercent?.toFixed(2)}%)
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            className="bg-gray-700 text-white px-2 py-1 rounded w-20"
            placeholder="Qty"
          />
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
          </select>
          {orderType === 'LIMIT' && (
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              step="0.01"
              className="bg-gray-700 text-white px-2 py-1 rounded w-24"
              placeholder="Price"
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBuy}
            disabled={placeOrderMutation.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex-1"
          >
            {placeOrderMutation.isPending ? 'Buying...' : 'Buy'}
          </button>
          <button
            onClick={handleSell}
            disabled={placeOrderMutation.isPending}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex-1"
          >
            {placeOrderMutation.isPending ? 'Selling...' : 'Sell'}
          </button>
        </div>

        <button
          onClick={handleAddToWatchlist}
          disabled={addToWatchlistMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded w-full"
        >
          {addToWatchlistMutation.isPending ? 'Adding...' : 'Add to Watchlist'}
        </button>
      </div>

      {placeOrderMutation.isSuccess && (
        <div className="text-green-400 text-sm">
          Order placed successfully!
        </div>
      )}
      
      {placeOrderMutation.error && (
        <div className="text-red-400 text-sm">
          Error: {placeOrderMutation.error.message}
        </div>
      )}
    </div>
  );
}