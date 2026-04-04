import api from "@/lib/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCategories = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Paginated Categories
    const categoriesQuery = (params = {}) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['categories', filteredParams],
            queryFn: () => api.get(`/categories`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
        });
    }

    // 2. Fetch All Active Categories (Dropdown)
    const allCategoriesQuery = () => {
        return useQuery({
            queryKey: ['allCategories'],
            queryFn: () => api.get(`/categories/all`),
            staleTime: 1000 * 60 * 30, // 30 mins
        });
    }

    // 3. Create Category
    const createCategoryMutation = useMutation({
        mutationFn: (data) => api.post(`/categories`, data),
        onSuccess: () => {
            toast.success('Category created successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['allCategories'] });
            queryClient.invalidateQueries({ queryKey: ['companyCategories'] }); // Product Form usage
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create category');
        }
    });

    // 4. Update Category
    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
        onSuccess: () => {
            toast.success('Category updated successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['allCategories'] });
            queryClient.invalidateQueries({ queryKey: ['companyCategories'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update category');
        }
    });

    // 5. Delete Category
    const deleteCategoryMutation = useMutation({
        mutationFn: (id) => api.delete(`/categories/${id}`),
        onSuccess: () => {
            toast.success('Category deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['allCategories'] });
            queryClient.invalidateQueries({ queryKey: ['companyCategories'] });
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to delete category');
        }
    });

    return {
        categoriesQuery,
        allCategoriesQuery,
        createCategoryMutation,
        updateCategoryMutation,
        deleteCategoryMutation
    }
}
