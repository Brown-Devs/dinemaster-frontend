import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCompany = () => {
    const queryClient = useQueryClient();

    // 1. Fetch My Company Settings
    const myCompanyQuery = () => {
        return useQuery({
            queryKey: ['myCompany'],
            queryFn: async () => {
                const res = await api.get(`/companies/me`);
                return res.data;
            },
            staleTime: 1000 * 60 * 10, // 10 mins
        });
    };

    // 2. Update My Company Branding/Settings
    const updateMyCompanyMutation = useMutation({
        mutationFn: (data) => api.patch(`/companies/me`, data),
        onSuccess: (res) => {
            toast.success(res?.data?.message || 'Settings updated successfully');
            queryClient.invalidateQueries({ queryKey: ['myCompany'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update settings');
        }
    });

    return {
        myCompanyQuery,
        updateMyCompanyMutation
    };
};
