import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBrandProducts = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Brand Products
    const brandProductsQuery = (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['brandProducts', filteredParams],
            queryFn: () => api.get(`/brand-products`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
        });
    }

    // 1b. Fetch All Brand Products for POS (Limit 500)
    const allBrandProductsQuery = (params = {}) => {
        return useQuery({
            queryKey: ['allBrandProducts', params],
            queryFn: () => api.get(`/brand-products`, { params: { limit: 500, active: true, ...params } }),
            staleTime: 1000 * 60 * 30, // 30 mins
        });
    }

    // 2. Fetch Master Products NOT yet imported
    const notImportedProductsQuery = (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['notImportedMasterProducts', filteredParams],
            queryFn: () => api.get(`/master-catalogs/not-imported`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
        });
    }

    // 3. Fetch Unique Master Categories (for Import Filter)
    const masterCategoriesQuery = () => {
        return useQuery({
            queryKey: ['masterCategories'],
            queryFn: () => api.get(`/master-catalogs/categories`),
            staleTime: 1000 * 60 * 30, // 30 mins
        });
    }

    // 3b. Fetch Company Categories (for Product Form)
    const companyCategoriesQuery = () => {
        return useQuery({
            queryKey: ['companyCategories'],
            queryFn: () => api.get(`/categories`), // Assuming there's a GET /categories that returns company categories
            staleTime: 1000 * 60 * 5,
        });
    }

    // 4. Bulk Import Mutation
    const bulkImportMutation = useMutation({
        mutationFn: (data) => api.post(`/brand-products/bulk-import`, data),
        onSuccess: (res) => {
            toast.success(res?.data?.message || 'Products imported successfully');
            queryClient.invalidateQueries(['brandProducts']);
            queryClient.invalidateQueries(['notImportedMasterProducts']);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to import products');
        }
    });

    // 5. Bulk Delete Mutation
    const bulkDeleteMutation = useMutation({
        mutationFn: (data) => api.post(`/brand-products/bulk-delete`, data),
        onSuccess: (res) => {
            toast.success(res?.data?.message || 'Products deleted successfully');
            queryClient.invalidateQueries(['brandProducts']);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to delete products');
        }
    });

    // 6. Delete Single Product
    const deleteProductMutation = useMutation({
        mutationFn: (id) => api.delete(`/brand-products/${id}`),
        onSuccess: () => {
            toast.success('Product deleted successfully');
            queryClient.invalidateQueries(['brandProducts']);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to delete product');
        }
    });

    // 7. Update Product
    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }) => api.patch(`/brand-products/${id}`, data),
        onSuccess: () => {
            toast.success('Product updated successfully');
            queryClient.invalidateQueries(['brandProducts']);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update product');
        }
    });

    // 8. Create Product (Manual)
    const createProductMutation = useMutation({
        mutationFn: (data) => api.post(`/brand-products`, data),
        onSuccess: () => {
            toast.success('Product created successfully');
            queryClient.invalidateQueries(['brandProducts']);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create product');
        }
    });

    return {
        brandProductsQuery,
        allBrandProductsQuery,
        notImportedProductsQuery,
        masterCategoriesQuery,
        companyCategoriesQuery,
        bulkImportMutation,
        bulkDeleteMutation,
        deleteProductMutation,
        updateProductMutation,
        createProductMutation
    }
}
