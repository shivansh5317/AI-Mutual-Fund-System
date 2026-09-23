import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mutualFundAPI, type RecommendationRequest, type FundRecommendation } from "../lib/api";



export const useRecommendations = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutualFundAPI.getRecommendations,
    onSuccess: (data) => {
      queryClient.setQueryData(["recommendations"], data);
    },
  });

  const query = useQuery<FundRecommendation[]>({
    queryKey: ["recommendations"],
    queryFn: () => Promise.resolve([]),
    enabled: false,
  });

  return {
    recommendations: (query.data || []) as FundRecommendation[],
    loading: mutation.isPending,
    error: mutation.error?.message || null,
    fetchRecommendations: mutation.mutate,
  };
};

export const useAnalytics = (enabled = false) => {
  const query = useQuery({
    queryKey: ["analytics"],
    queryFn: mutualFundAPI.getAnalytics,
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - analytics don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    analytics: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useFilters = (enabled = false) => {
  const query = useQuery({
    queryKey: ["filters"],
    queryFn: mutualFundAPI.getFilters,
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes - filters rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    filters: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export const useFundDetails = (fundId: string) => {
  const query = useQuery({
    queryKey: ["fund", fundId],
    queryFn: () => mutualFundAPI.getFundDetails(fundId),
    enabled: !!fundId,
  });

  return {
    fund: query.data || null,
    loading: query.isLoading,
    error: query.error?.message || null,
  };
};
