import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BASE_ENDPOINT = '/api/v1/ai-mutual-fund-system';

const api = axios.create({
  baseURL: `${API_BASE_URL}${BASE_ENDPOINT}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Trading API
export const tradingAPI = {
  getMarketIndices: () => api.get('/trading/indices'),
  getTrendingStocks: () => api.get('/trading/trending'),
  getMarketMovers: (type: string) => api.get(`/trading/movers?type=${type}`),
  getUserInvestments: () => api.get('/trading/investments'),
  getHoldings: () => api.get('/trading/holdings'),
  getPositions: () => api.get('/trading/positions'),
  getOrders: () => api.get('/trading/orders'),
  getWatchlist: () => api.get('/trading/watchlist'),
  placeOrder: (orderData: any) => api.post('/trading/orders', orderData),
  addToWatchlist: (data: any) => api.post('/trading/watchlist', data),
  removeFromWatchlist: (watchlistId: string) => api.delete(`/trading/watchlist/${watchlistId}`),
};

// Mutual Funds API
export const mutualFundsAPI = {
  getRecommendations: (data: any) => api.post('/mutual-funds/recommendations', data),
  getAnalytics: () => api.get('/mutual-funds/analytics'),
  getFilters: () => api.get('/mutual-funds/filters'),
  getAllFunds: (params: any) => api.get('/mutual-funds/all', { params }),
  getFundById: (id: string) => api.get(`/mutual-funds/${id}`),
};

// Wallet API
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  addFunds: (data: any) => api.post('/wallet/add-funds', data),
  withdraw: (data: any) => api.post('/wallet/withdraw', data),
  getTransactions: () => api.get('/wallet/transactions'),
};

// User API
export const userAPI = {
  auth: (data: any) => api.post('/user/auth', data),
};