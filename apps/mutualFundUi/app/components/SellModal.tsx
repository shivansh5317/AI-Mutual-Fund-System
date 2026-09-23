'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePlaceOrder } from '../hooks/useTrading';
import { toast } from 'sonner';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function SellModal({ isOpen, onClose, order }: SellModalProps) {
  const [quantity, setQuantity] = useState(1);
  const placeOrderMutation = usePlaceOrder();

  if (!isOpen) return null;

  const handleSell = () => {
    placeOrderMutation.mutate({
      symbol: order.symbol,
      side: 'SELL',
      quantity,
      price: order.price,
      type: 'MARKET',
    }, {
      onSuccess: (data) => {
        console.log('Sell order success:', data);
        toast.success('Sell order placed successfully!', {
          description: `${quantity} units of ${order.symbol} sold`,
          duration: 3000,
        });
        onClose();
      },
      onError: (error) => {
        console.error('Sell order error:', error);
        toast.error('Failed to place sell order', {
          description: 'Please try again later',
          duration: 3000,
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-6 w-96 relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
        >
          ×
        </button>
        <h2 className="text-white text-xl mb-4 pr-8">Sell {order.symbol}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Available Quantity</label>
            <div className="text-white">{order.quantity}</div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Quantity to Sell</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              max={order.quantity}
              min={1}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Price</label>
            <div className="text-white">₹{order.price}</div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Total Value</label>
            <div className="text-white">₹{(quantity * order.price).toFixed(2)}</div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSell}
            disabled={placeOrderMutation.isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {placeOrderMutation.isPending ? 'Selling...' : 'Sell'}
          </Button>
        </div>
      </div>
    </div>
  );
}