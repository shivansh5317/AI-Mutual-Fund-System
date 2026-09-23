'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePlaceOrder } from '../hooks/useTrading';
import { toast } from 'sonner';

interface BuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: any;
}

export function BuyModal({ isOpen, onClose, fund }: BuyModalProps) {
  const [amount, setAmount] = useState(1000);
  const [investmentType, setInvestmentType] = useState<'SIP' | 'LUMPSUM'>('SIP');
  const placeOrderMutation = usePlaceOrder();

  if (!isOpen) return null;

  const handleBuy = () => {
    const quantity = Math.floor(amount / 100); // Assuming NAV of 100
    const orderData = {
      symbol: fund.schemeName?.split(' ')[0] || fund.name,
      side: 'BUY',
      quantity,
      price: 100,
      type: 'MARKET',
    };
    
    console.log('Placing order:', orderData);
    
    placeOrderMutation.mutate(orderData, {
      onSuccess: (data) => {
        console.log('Order success:', data);
        // If we reach onSuccess, the request was successful
        toast.success(`Order placed successfully for ${fund.schemeName}!`, {
          description: `₹${amount} ${investmentType} order placed`,
          duration: 3000,
        });
        onClose();
      },
      onError: (error) => {
        console.error('Order error:', error);
        toast.error('Failed to place order', {
          description: 'Please try again later',
          duration: 3000,
        });
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#1A2332] border border-gray-800 rounded-lg p-6 w-96 max-w-[90vw] relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
        >
          ×
        </button>
        <h2 className="text-white text-xl mb-4 pr-8">Buy {fund.schemeName}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Investment Type</label>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setInvestmentType('SIP')}
                className={`flex-1 py-2 px-4 rounded ${
                  investmentType === 'SIP' 
                    ? 'bg-[#FFAB00] text-black' 
                    : 'bg-gray-700 text-white'
                }`}
              >
                SIP
              </button>
              <button
                onClick={() => setInvestmentType('LUMPSUM')}
                className={`flex-1 py-2 px-4 rounded ${
                  investmentType === 'LUMPSUM' 
                    ? 'bg-[#FFAB00] text-black' 
                    : 'bg-gray-700 text-white'
                }`}
              >
                Lumpsum
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={investmentType === 'SIP' ? 500 : 1000}
              className="bg-gray-800 border-gray-700 text-white mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Min: ₹{investmentType === 'SIP' ? '500' : '1,000'}
            </p>
          </div>
          
          <div className="bg-gray-800 p-3 rounded">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fund:</span>
              <span className="text-white">{fund.schemeName}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{investmentType}</span>
            </div>
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
            onClick={handleBuy}
            disabled={placeOrderMutation.isPending || amount < (investmentType === 'SIP' ? 500 : 1000)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {placeOrderMutation.isPending ? 'Placing...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}