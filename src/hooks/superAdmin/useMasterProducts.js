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
        });
    }

    const masterCategoriesQuery = () => {
        return useQuery({
            queryKey: ['masterCategories'],
            queryFn: async () => {
                const res = await api.get(`/master-catalogs/categories`);
                return res.data;
            },
            staleTime: 1000 * 60 * 10, // 10 mins
        });
    }

    const createMasterProductMutation = useMutation({
        mutationFn: (data) => api.post(`/master-catalogs`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['masterProducts']);
            queryClient.invalidateQueries(['masterCategories']);
            toast.success('Master product created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create master product');
        }
    });

    const updateMasterProductMutation = useMutation({
        mutationFn: ({ id, data }) => api.patch(`/master-catalogs/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['masterProducts']);
            queryClient.invalidateQueries(['masterCategories']);
            toast.success('Master product updated successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update master product');
        }
    });

    return {
        masterProductsQuery,
        masterCategoriesQuery,
        createMasterProductMutation,
        updateMasterProductMutation
    }
}
