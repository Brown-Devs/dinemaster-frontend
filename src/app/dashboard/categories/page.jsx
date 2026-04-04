"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import {
  Button,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useCategories } from "@/hooks/admin/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import CategoriesTable from "./components/CategoriesTable";
import CategoryFormModal from "./components/CategoryFormModal";

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const searchStr = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Local State
  const [searchInput, setSearchInput] = useState(searchStr);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { categoriesQuery, deleteCategoryMutation } = useCategories();

  const categoriesData = categoriesQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const apiData = categoriesData?.data?.data?.data || { categories: [], pagination: {} };
  const categories = apiData?.categories || [];
  const currentPage = apiData?.pagination?.page || 1;
  const total = apiData?.pagination?.totalCount || apiData?.totalCount || 0; // Check both in case of API structure variations

  // Sync Input when URL changes
  useEffect(() => {
    setSearchInput(searchStr);
  }, [searchStr]);

  // Update URL on Debounce Output
  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateURL({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`?${params.toString()}`);
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutateAsync(id);
    }
  };

  return (
    <InnerDashboardLayout>
      <div className="flex justify-between items-center mb-6 mt-2 flex-wrap gap-4">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Categories</h1>
          <p style={{ color: "var(--muted)" }}>
            Manage category structures and specific add-ons for your products.
          </p>
        </div>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={handleOpenAddModal}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Add Category
        </Button>
      </div>

      <Box sx={{ width: "100%" }}>
        <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TextField
              size="small"
              placeholder="Search categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ width: { xs: "100%", sm: 280 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "var(--muted)", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* Table Component */}
          <CategoriesTable
            categories={categories}
            loading={categoriesData.isLoading}
            total={total}
            page={currentPage}
            limit={limit}
            onPageChange={(p) => updateURL({ page: p })}
            setLimit={(l) => updateURL({ limit: l, page: 1 })}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        </div>
      </Box>

      {/* Product Form Modal */}
      <CategoryFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />
    </InnerDashboardLayout>
  );
}
