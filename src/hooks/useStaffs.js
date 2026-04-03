import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useStaffs = () => {
    const queryClient = useQueryClient();

    const staffsQuery = (params = {}) => {
        const safeParams = params || {};
        const filteredParams = Object.fromEntries(
            Object.entries(safeParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['staffs', filteredParams],
            queryFn: () => api.get(`/users/list`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || err.message || 'Failed to fetch company users');
            },
        });
    };

    const adminsQuery = (params = {}) => {
        return staffsQuery({
            ...params,
            systemRole: "admin"
        });
    };

    const subAdminsQuery = (params = {}) => {
        return staffsQuery({
            ...params,
            systemRole: "subadmin"
        });
    };

    const createStaff = useMutation({
        mutationFn: (data) => api.post('/users/create', data),
        onSuccess: () => {
            toast.success('Staff created successfully');
            queryClient.invalidateQueries({ queryKey: ['staffs'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || 'Failed to create staff');
        },
    });

    const updateStaff = useMutation({
        mutationFn: ({ id, data }) => api.patch(`/users/${id}`, data),
        onSuccess: () => {
            toast.success('Staff updated successfully');
            queryClient.invalidateQueries({ queryKey: ['staffs'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || 'Failed to update staff');
        },
    });

    return {
        staffsQuery, adminsQuery, subAdminsQuery, createStaff, updateStaff
    };
}