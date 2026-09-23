'use client'

import React from 'react';
import { ProtectedPage } from '../components/ProtectedPage';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { tradingAPI } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Transactions() {
  const { data: session } = useSession();
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: tradingAPI.getTransactions,
    enabled: !!session?.user?.id,
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <ArrowUpRight className="size-5 text-green-500" />;
      case 'SELL':
        return <ArrowDownLeft className="size-5 text-red-500" />;
      case 'ADD_FUNDS':
        return <ArrowUpRight className="size-5 text-blue-500" />;
      case 'WITHDRAW':
        return <ArrowDownLeft className="size-5 text-orange-500" />;
      default:
        return <Clock className="size-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="size-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="size-4 text-red-500" />;
      case 'PENDING':
        return <Clock className="size-4 text-yellow-500" />;
      default:
        return <Clock className="size-4 text-gray-500" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'BUY':
      case 'WITHDRAW':
        return 'text-red-500';
      case 'SELL':
      case 'ADD_FUNDS':
        return 'text-green-500';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <ProtectedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-white mb-2">Transaction History</h1>
          <p className="text-gray-400">View all your trading and wallet transactions</p>
        </div>

        <div className="bg-[#1A2332] border border-gray-800 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl text-white">All Transactions</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : !transactions?.length ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">No transactions yet</p>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0F1419]">
                  <tr>
                    <th className="text-left p-4 text-sm text-gray-400">Type</th>
                    <th className="text-left p-4 text-sm text-gray-400">Description</th>
                    <th className="text-right p-4 text-sm text-gray-400">Amount</th>
                    <th className="text-center p-4 text-sm text-gray-400">Status</th>
                    <th className="text-right p-4 text-sm text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction: any) => (
                    <tr key={transaction.id} className="border-t border-gray-800 hover:bg-gray-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <span className="text-white font-medium">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className={`p-4 text-right font-medium ${getAmountColor(transaction.type)}`}>
                        {transaction.type === 'BUY' || transaction.type === 'WITHDRAW' ? '-' : '+'}
                        ₹{transaction.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`text-sm ${
                            transaction.status === 'COMPLETED' ? 'text-green-500' :
                            transaction.status === 'FAILED' ? 'text-red-500' :
                            'text-yellow-500'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}