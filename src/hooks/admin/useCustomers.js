import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";

export const useCustomers = () => {
    
    // 1. Lookup Customer by Mobile Number
    const customerLookupQuery = (mobileNo) => {
        return useQuery({
            queryKey: ['customerLookup', mobileNo],
            queryFn: async () => {
                const response = await api.get(`/customers/lookup`, { params: { mobileNo } });
                return response.data;
            },
            enabled: !!mobileNo && mobileNo.length === 10,
            retry: false,
            staleTime: 1000 * 60 * 5, // 5 mins
        });
    }

    // 2. Fetch Paginated Customer List
    const customersQuery = ({ page = 1, limit = 10, search = "" } = {}) => {
        return useQuery({
            queryKey: ['adminCustomers', { page, limit, search }],
            queryFn: async () => {
                const response = await api.get(`/customers/`, { 
                    params: { 
                        page, 
                        limit, 
                        searchQuery: search 
                    } 
                });
                return response.data;
            },
            keepPreviousData: true,
            staleTime: 1000 * 60, // 1 min
        });
    }

    return {
        customerLookupQuery,
        customersQuery
    };
};
