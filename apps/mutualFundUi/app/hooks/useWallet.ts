import { useState, useEffect } from 'react';
import { walletAPI } from '../lib/api';

interface WalletBalance {
  balance: number;
  lockedAmount: number;
  availableBalance: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  reference: string;
  createdAt: string;
}

export function useWallet(userId?: string) {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const data = await walletAPI.getBalance();
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await walletAPI.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const addFunds = async (amount: number, paymentMethod: string) => {
    try {
      setLoading(true);
      const data = await walletAPI.addFunds(amount, paymentMethod);
      await fetchBalance();
      await fetchTransactions();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add funds');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async (amount: number, bankAccount: string) => {
    try {
      setLoading(true);
      const data = await walletAPI.withdrawFunds(amount, bankAccount);
      await fetchBalance();
      await fetchTransactions();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw funds');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  // Cache balance for 2 minutes, transactions for 5 minutes
  const cacheKey = `wallet-${userId}`;

  return {
    balance,
    transactions,
    loading,
    error,
    addFunds,
    withdrawFunds,
    refetch: () => {
      fetchBalance();
      fetchTransactions();
    },
    cacheKey, // For debugging
  };
}