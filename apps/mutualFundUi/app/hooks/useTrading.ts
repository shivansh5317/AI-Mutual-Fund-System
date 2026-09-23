import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tradingAPI } from "../lib/api";

export const useMarketIndices = () => {
  const query = useQuery({
    queryKey: ["market-indices"],
    queryFn: tradingAPI.getMarketIndices,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    indices: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useTrendingStocks = () => {
  const query = useQuery({
    queryKey: ["trending-stocks"],
    queryFn: tradingAPI.getTrendingStocks,
    refetchInterval: 30000,
  });

  return {
    stocks: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useMarketMovers = (type: string = "gainers") => {
  const query = useQuery({
    queryKey: ["market-movers", type],
    queryFn: () => tradingAPI.getMarketMovers(type),
    refetchInterval: 30000,
  });

  return {
    movers: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useUserInvestments = () => {
  const query = useQuery({
    queryKey: ["user-investments"],
    queryFn: tradingAPI.getUserInvestments,
    refetchInterval: 60000, // Refetch every minute
  });

  return {
    investments: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useHoldings = () => {
  const query = useQuery({
    queryKey: ["holdings"],
    queryFn: tradingAPI.getHoldings,
    refetchInterval: 30000,
  });

  return {
    holdings: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const usePositions = () => {
  const query = useQuery({
    queryKey: ["positions"],
    queryFn: tradingAPI.getPositions,
    refetchInterval: 30000,
  });

  return {
    positions: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: tradingAPI.getOrders,
    refetchInterval: 10000,
  });

  return {
    orders: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useWatchlist = () => {
  const query = useQuery({
    queryKey: ["watchlist"],
    queryFn: tradingAPI.getWatchlist,
    refetchInterval: 30000,
  });

  return {
    watchlist: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tradingAPI.placeOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      return data;
    },
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tradingAPI.addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tradingAPI.removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
};
