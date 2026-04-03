import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useMasterProducts = () => {
    const queryClient = useQueryClient();

    const masterProductsQuery = (params = {}) => {
        const safeParams = params || {};
        const filteredParams = Object.fromEntries(
            Object.entries(safeParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['masterProducts', filteredParams],
            queryFn: () => api.get(`/master-catalogs`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || err.message || 'Failed to fetch master products');
            }
        });
    }

    return {
        masterProductsQuery,
    }
}
