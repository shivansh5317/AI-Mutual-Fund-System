'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CreditCard, Building2, Smartphone, X } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { LoadingSpinner } from './LoadingSpinner';
import { useSession } from 'next-auth/react';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddFundsModal({ isOpen, onClose, onSuccess }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { data: session } = useSession();
  const { addFunds } = useWallet(session?.user?.id);

  const paymentMethods = [
    { value: 'upi', label: 'UPI', icon: Smartphone },
    { value: 'netbanking', label: 'Net Banking', icon: Building2 },
    { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
  ];

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentMethod) {
      setError('Please fill all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum < 100) {
      setError('Minimum amount is ₹100');
      return;
    }

    if (amountNum > 500000) {
      setError('Maximum amount is ₹5,00,000 per transaction');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await addFunds(amountNum, paymentMethod);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPaymentMethod('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#1A2332] border-gray-800 text-white max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Funds Added Successfully!</h3>
            <p className="text-gray-400">₹{amount} has been added to your wallet</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1A2332] border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-lg font-semibold text-[#FFAB00]">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-[#FFAB00]">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#0F1419] border-2 border-gray-700 focus:border-[#FFAB00] text-white text-2xl font-bold pl-12 pr-4 py-6 rounded-xl transition-all duration-200"
                min="100"
                max="500000"
                required
              />
            </div>
            <p className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2">💡 Minimum: ₹100 | Maximum: ₹5,00,000 per transaction</p>
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">💰 Quick Select</Label>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className={`border-2 transition-all duration-200 font-semibold py-3 rounded-lg ${
                    amount === quickAmount.toString()
                      ? 'border-[#FFAB00] bg-[#FFAB00] text-black'
                      : 'border-gray-700 bg-yellow-100 text-black hover:border-[#FFAB00] hover:bg-[#FFAB00]'
                  }`}
                >
                  ₹{quickAmount.toLocaleString('en-IN')}
                </Button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger className="bg-[#0F1419] border-gray-700 text-white">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2332] border-gray-700">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem
                      key={method.value}
                      value={method.value}
                      className="text-white hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {method.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <p className="text-blue-400 text-xs">
              🔒 Your payment is secured with 256-bit SSL encryption. Funds will be added instantly.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#FFAB00] hover:bg-[#FF9800] text-black font-medium"
            disabled={loading || !amount || !paymentMethod}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Processing...
              </div>
            ) : (
              `Add ₹${amount || '0'}`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}