import api from "@/lib/services/axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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

    return {
        createOrderMutation,
        ordersQuery,
        updateOrderMutation
    };
};
