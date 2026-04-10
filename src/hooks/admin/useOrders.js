import api from "@/lib/services/axios";
import { useMutation, useQueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useOrders = () => {
    const queryClient = useQueryClient();

    // 1. Create a New Order
    const createOrderMutation = useMutation({
        mutationFn: async (orderData) => {
            const response = await api.post(`/orders`, orderData);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Order created successfully!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create order.");
        }
    });

    // 2. Fetch Orders (Paginated & Filtered)
    const ordersQuery = (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== "")
        );

        return useQuery({
            queryKey: ["orders", filteredParams],
            queryFn: async () => {
                const response = await api.get(`/orders`, { params: filteredParams });
                return response.data;
            },
            placeholderData: (previousData) => previousData,
            staleTime: 1000 * 60 * 2, // 2 mins
        });
    };

    // 2. Fetch a single Order
    const orderQuery = (id) => {
        return useQuery({
            queryKey: ["order", id],
            queryFn: async () => {
                const response = await api.get(`/orders/${id}`);
                return response.data;
            },
            enabled: !!id,
        });
    };

    // 3. Update Order (Administrative/Payment)
    const updateOrderMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await api.patch(`/orders/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Order updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update order.");
        }
    });

    // 4. Fetch Order Statistics
    const statsQuery = (options = {}) => {
        return useQuery({
            queryKey: ["orders", "stats"],
            queryFn: async () => {
                const response = await api.get(`/orders/stats`);
                return response.data;
            },
            staleTime: 1000 * 60 * 5, // 5 mins
            ...options
        });
    };

    // 4. Fetch Kitchen Orders (Infinite scroll with counts)
    const kitchenOrdersQuery = (params = {}) => {
        const { page, ...restParams } = params;
        const filteredParams = Object.fromEntries(
            Object.entries(restParams).filter(([_, v]) => v != null && v !== "")
        );

        return useInfiniteQuery({
            queryKey: ["kitchen-orders", filteredParams],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await api.get(`/orders/kitchen`, {
                    params: { ...filteredParams, page: pageParam },
                });
                return response.data;
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                const pagination = lastPage?.data?.pagination;
                return pagination?.hasNextPage ? pagination.page + 1 : undefined;
            },
            staleTime: 1000 * 30,
        });
    };

    return {
        createOrderMutation,
        ordersQuery,
        orderQuery,
        kitchenOrdersQuery,
        updateOrderMutation,
        statsQuery
    };
};
