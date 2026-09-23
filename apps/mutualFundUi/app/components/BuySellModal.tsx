'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_ENDPOINT = '/api/v1/ai-mutual-fund-system';

interface BuySellModalProps {
  isOpen: boolean;
  onClose: () => void;
  fund: {
    id: string;
    schemeName: string;
    minSip?: number;
  };
}

export function BuySellModal({ isOpen, onClose, fund }: BuySellModalProps) {
  const [activeTab, setActiveTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [units, setUnits] = useState('');
  const [investmentType, setInvestmentType] = useState('LUMPSUM');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const buyMutation = useMutation({
    mutationFn: async (data: { fundId: string; amount: number; investmentType: string }) => {
      const response = await axios.post(`${API_BASE}${API_ENDPOINT}/investments/${session?.user?.id}/buy`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      handleClose();
    },
  });

  const sellMutation = useMutation({
    mutationFn: async (data: { fundId: string; units: number }) => {
      const response = await axios.post(`${API_BASE}${API_ENDPOINT}/investments/${session?.user?.id}/sell`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      handleClose();
    },
  });

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !session?.user?.id) return;

    const amountNum = parseFloat(amount);
    if (amountNum < (fund.minSip || 500)) {
      alert(`Minimum investment is ₹${fund.minSip || 500}`);
      return;
    }

    buyMutation.mutate({
      fundId: fund.id,
      amount: amountNum,
      investmentType,
    });
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!units || !session?.user?.id) return;

    const unitsNum = parseFloat(units);
    if (unitsNum <= 0) {
      alert('Please enter valid units to sell');
      return;
    }

    sellMutation.mutate({
      fundId: fund.id,
      units: unitsNum,
    });
  };

  const handleClose = () => {
    setAmount('');
    setUnits('');
    setActiveTab('buy');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1A2332] border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{fund.schemeName}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-[#0F1419]">
            <TabsTrigger value="buy" className="data-[state=active]:bg-[#FFAB00] data-[state=active]:text-black text-white">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-[#FFAB00] data-[state=active]:text-black text-white">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <form onSubmit={handleBuy} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investment-type">Investment Type</Label>
                <select
                  value={investmentType}
                  onChange={(e) => setInvestmentType(e.target.value)}
                  className="w-full p-2 bg-[#0F1419] border border-gray-700 rounded text-white"
                >
                  <option value="LUMPSUM">Lumpsum</option>
                  <option value="SIP">SIP</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-[#0F1419] border-gray-700 text-white"
                  min={fund.minSip || 500}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Minimum: ₹{(fund.minSip || 500).toLocaleString('en-IN')}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00C853] hover:bg-[#00A843] text-white"
                disabled={buyMutation.isPending || !amount}
              >
                {buyMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Processing...
                  </div>
                ) : (
                  `Buy ₹${amount || '0'}`
                )}
              </Button>

              {buyMutation.error && (
                <p className="text-red-400 text-sm">
                  {buyMutation.error.message || 'Failed to buy fund'}
                </p>
              )}
            </form>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <form onSubmit={handleSell} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="units">Units to Sell</Label>
                <Input
                  id="units"
                  type="number"
                  placeholder="Enter units"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="bg-[#0F1419] border-gray-700 text-white"
                  min="0.01"
                  step="0.01"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Current NAV: ₹105 (approx)
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={sellMutation.isPending || !units}
              >
                {sellMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Processing...
                  </div>
                ) : (
                  `Sell ${units || '0'} Units`
                )}
              </Button>

              {sellMutation.error && (
                <p className="text-red-400 text-sm">
                  {sellMutation.error.message || 'Failed to sell fund'}
                </p>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}