import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_ENDPOINT = '/api/v1/ai-mutual-fund-system';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Full baseURL:', `${API_BASE_URL}${API_ENDPOINT}`);

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_ENDPOINT}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface RecommendationRequest {
  amcName?: string;
  category?: string;
  amountInvested: number;
  tenure: number;
  investmentType?: string;
}

export interface FundRecommendation {
  id: string;
  schemeName: string;
  amcName: string;
  category: string;
  rating: number;
  riskLevel: number;
  returns1yr: number | null;
  returns3yr: number | null;
  returns5yr: number | null;
  expectedReturn: number;
  projectedValue: number;
  score: number;
}

export interface AnalyticsData {
  totalFunds: number;
  byCategory: Array<{ category: string; _count: number }>;
  topAMCs: Array<{ amcName: string; _count: number }>;
  avgReturns: {
    returns1yr: number | null;
    returns3yr: number | null;
    returns5yr: number | null;
  };
}

export interface FiltersData {
  amcs: string[];
  categories: Record<string, string[]>;
}

// Helper to get user ID from session
const getUserId = async () => {
  const { getSession } = await import('next-auth/react');
  const session = await getSession();
  return session?.user?.id || 'user_default';
};

export const tradingAPI = {
  getMarketIndices: async () => {
    const response = await apiClient.get('/trading/indices');
    return response.data.data;
  },
  getTrendingStocks: async () => {
    const response = await apiClient.get('/trading/trending');
    return response.data.data;
  },
  getMarketMovers: async (type?: string) => {
    const response = await apiClient.get(`/trading/movers${type ? `?type=${type}` : ''}`);
    return response.data.data;
  },
  getUserInvestments: async () => {
    const response = await apiClient.get('/trading/investments');
    return response.data.data;
  },
  getHoldings: async () => {
    const response = await apiClient.get('/trading/holdings');
    return response.data.data;
  },
  getPositions: async () => {
    const response = await apiClient.get('/trading/positions');
    return response.data.data;
  },
  getOrders: async () => {
    const response = await apiClient.get('/trading/orders');
    return response.data.data;
  },
  getWatchlist: async () => {
    const response = await apiClient.get('/trading/watchlist');
    return response.data.data;
  },
  placeOrder: async (orderData: any) => {
    const response = await apiClient.post('/trading/buyStock', orderData);
    return response.data.data;
  },
  addToWatchlist: async (stockData: { symbol: string; name: string; price?: number; change?: number; changePercent?: number }) => {
    const response = await apiClient.post('/trading/watchlist', stockData);
    return response.data.data;
  },
  removeFromWatchlist: async (watchlistId: string) => {
    const response = await apiClient.delete(`/trading/watchlist/${watchlistId}`);
    return response.data;
  },
  getTransactions: async () => {
    const response = await apiClient.get('/trading/transactions');
    return response.data.data;
  },
};



export const walletAPI = {
  getBalance: async () => {
    const response = await apiClient.get('/wallet/balance');
    return response.data.data;
  },
  addFunds: async (amount: number, paymentMethod: string) => {
    const response = await apiClient.post('/wallet/add-funds', { amount, paymentMethod });
    return response.data.data;
  },
  withdrawFunds: async (amount: number, bankAccount: string) => {
    const response = await apiClient.post('/wallet/withdraw', { amount, bankAccount });
    return response.data.data;
  },
  getTransactions: async () => {
    const response = await apiClient.get('/wallet/transactions');
    return response.data.data;
  },
};

export const mutualFundAPI = {
  getRecommendations: async (request: RecommendationRequest): Promise<FundRecommendation[]> => {
    const response = await apiClient.post('/mutual-funds/recommendations', request);
    return response.data.data;
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get('/mutual-funds/analytics');
    return response.data.data;
  },

  getFilters: async (): Promise<FiltersData> => {
    const response = await apiClient.get('/mutual-funds/filters');
    return response.data.data;
  },

  getFundDetails: async (fundId: string) => {
    const response = await apiClient.get(`/mutual-funds/${fundId}`);
    return response.data.data;
  },

  getAllFunds: async (params?: {
    category?: string;
    amcName?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.amcName) queryParams.append('amcName', params.amcName);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('offset', ((params.page - 1) * (params.limit || 10)).toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await apiClient.get(`/mutual-funds/all?${queryParams.toString()}`);
    return response.data;
  },
};