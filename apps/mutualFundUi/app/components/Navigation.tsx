'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, TrendingUp, Wallet, Settings, User, BarChart3, Plus, LogOut, ChevronDown, ChevronRight, Receipt } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { AddFundsModal } from './AddFundsModal';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { balance, loading, refetch } = useWallet(session?.user?.id);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [tradingExpanded, setTradingExpanded] = useState(pathname.startsWith('/trading'));

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/funds', icon: TrendingUp, label: 'Explore Funds' },
    { path: '/portfolio', icon: Wallet, label: 'My Portfolio' },
  ];

  const tradingItems = [
    { path: '/trading', label: 'Trading Dashboard' },
    { path: '/trading/all-funds', label: 'All Funds' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-[#1A2332] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="/favicon.svg" alt="WealthAI Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl">WealthAI</h1>
              <p className="text-xs text-gray-400">AI-Powered Wealth Building</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Wallet Balance */}
            {session?.user?.id && (
              <div className="flex items-center gap-3 bg-[#0F1419] px-4 py-2 rounded-lg border border-gray-700">
                <Wallet className="size-4 text-[#FFAB00]" />
                <div className="text-right">
                  <div className="text-xs text-gray-400">Available Balance</div>
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Loading...
                      </>
                    ) : (
                      `₹${balance?.availableBalance?.toLocaleString('en-IN') || '0'}`
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddFundsModal(true)}
                  className="bg-[#FFAB00] hover:bg-[#FF9800] text-black h-8 px-3"
                >
                  <Plus className="size-3 mr-1" />
                  Add
                </Button>
              </div>
            )}

            {session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                        <AvatarFallback className="bg-[#FFAB00] text-black">
                          {session?.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{session?.user?.name || 'User'}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A2332] border-gray-700 text-white">
                    <DropdownMenuItem asChild className="hover:bg-gray-800 cursor-pointer">
                      <Link href="/transactions" className="flex items-center">
                        <Receipt className="size-4 mr-2" />
                        Transactions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className="hover:bg-gray-800 cursor-pointer">
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth" className="bg-[#FFAB00] hover:bg-[#FF9800] text-black px-4 py-2 rounded-lg font-medium transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1A2332] border-r border-gray-800 fixed left-0 top-[73px] bottom-0 z-40">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-[#FFAB00] text-black font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Trading Section with Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setTradingExpanded(!tradingExpanded)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname.startsWith('/trading')
                  ? 'bg-[#FFAB00] text-black font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <BarChart3 className="size-5" />
              <span className="flex-1 text-left">Trading</span>
              {tradingExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
            
            {tradingExpanded && (
              <div className="ml-4 space-y-1">
                {tradingItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                      isActive(item.path)
                        ? 'bg-[#FFAB00]/20 text-[#FFAB00] font-medium'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Add Funds Modal */}
      {session?.user?.id && (
        <AddFundsModal
          isOpen={showAddFundsModal}
          onClose={() => setShowAddFundsModal(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </>
  );
}