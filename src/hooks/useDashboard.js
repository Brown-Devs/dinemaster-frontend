// hooks/useDashboard.js
import api from "@/lib/services/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDashboard = () => {
    const queryClient = useQueryClient();

    const fetcher = (url, params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
        return api.get(url, { params: filteredParams }).then(res => res.data);
    };

    const useEarningsSummary = (params) => useQuery({
        queryKey: ['dashboard', 'summary', 'earnings', params],
        queryFn: () => fetcher('/analytics/summary/earnings', params),
        staleTime: 1000 * 60 * 5,
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to fetch earnings summary'),
    });

    const useOrdersSummary = (params) => useQuery({
        queryKey: ['dashboard', 'summary', 'orders', params],
        queryFn: () => fetcher('/analytics/summary/orders', params),
        staleTime: 1000 * 60 * 5,
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to fetch orders summary'),
    });

    const useCustomersSummary = (params) => useQuery({
        queryKey: ['dashboard', 'summary', 'customers', params],
        queryFn: () => fetcher('/analytics/summary/customers', params),
        staleTime: 1000 * 60 * 5,
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to fetch customers summary'),
    });

    const useEarningsChart = (params) => useQuery({
        queryKey: ['dashboard', 'charts', 'earnings', params],
        queryFn: () => fetcher('/analytics/charts/earnings', params),
        staleTime: 1000 * 60 * 5,
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to fetch earnings chart'),
    });

    const useOrdersChart = (params) => useQuery({
        queryKey: ['dashboard', 'charts', 'orders', params],
        queryFn: () => fetcher('/analytics/charts/orders', params),
        staleTime: 1000 * 60 * 5,
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to fetch orders chart'),
    });

    const useCustomersChart = (params) => useQuery({
        queryKey: ['dashboard', 'charts', 'customers', params],
        queryFn: () => fetcher('/analytics/charts/customers', params),
        staleTime: 1000 * 60 * 5,
        onError: (err) => toast.error(err?.response?.data?.message || 'Failed to fetch customers chart'),
    });

    const refetchAll = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    return {
        useEarningsSummary,
        useOrdersSummary,
        useCustomersSummary,
        useEarningsChart,
        useOrdersChart,
        useCustomersChart,
        refetchAll,
    };
};
