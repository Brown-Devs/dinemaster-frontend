"use client";

import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import {
  Button,
  TextField,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter, useSearchParams } from "next/navigation";
import { useMasterProducts } from "@/hooks/superAdmin/useMasterProducts";
import MasterProductsTable from "./components/MasterProductsTable";
import MasterProductFormModal from "./components/MasterProductFormModal";

export default function MasterProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const { 
    masterProductsQuery, 
    masterCategoriesQuery, 
    deleteMasterProductMutation 
  } = useMasterProducts();
  const { data: catData } = masterCategoriesQuery();
  const categories = catData?.data || [];

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value) => {
        updateParams({ search: value, page: 1 });
      }, 500),
    [searchParams]
  );

  useEffect(() => {
    debouncedUpdateSearch(searchInput.trim());
    return () => debouncedUpdateSearch.cancel();
  }, [searchInput]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
    }),
    [page, limit, search, category]
  );

  const masterProductsData = masterProductsQuery(queryParams);
  const apiData = masterProductsData?.data?.data?.data || {
    masterProducts: [],
    pagination: { page: 1, limit: 10 },
    totalCount: 0,
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this master product? This will also un-link any brand products derived from it.")) {
      deleteMasterProductMutation.mutate(id);
    }
  };

  return (
    <InnerDashboardLayout>
      {/* Header */}
      <div className="mb-4 mt-3 flex gap-2 max-[500px]:flex-col flex-row max-[500px]:items-start items-center justify-between">
        <div>
          <h2 className="font-bold max-[500px]:text-xl tracking-tight text-3xl">
            Master Products
          </h2>
          <p className="text-gray-500 max-[500px]:text-sm text-base">
            Manage all products in the master catalog.
          </p>
        </div>

        <div className="flex gap-3">
          <Tooltip title="Refresh" arrow>
            <span>
              <Button
                variant="outlined"
                onClick={() => masterProductsData.refetch()}
                startIcon={<RefreshIcon />}
                loading={masterProductsData.isRefetching}
                disabled={masterProductsData.isRefetching}
                loadingPosition="start"
              >
                Refresh
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Create New Product" arrow>
            <span>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
              >
                Add New
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card p-3 sm:p-6 border border-border rounded-xl w-full">
        {/* Bulk Actions (Optional UI alignment) */}
        {selectedIds.length > 0 && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">
              {selectedIds.length} item(s) selected
            </span>
            <Button
              size="small"
              color="error"
              variant="tonal"
              startIcon={<ClearIcon />}
              onClick={() => setSelectedIds([])}
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Filters Area */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <TextField
            size="small"
            className="flex-[2]"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF" }} />
                </InputAdornment>
              ),
              endAdornment: searchInput && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchInput("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" className="flex-1 min-w-[200px]">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <MasterProductsTable
          apiData={apiData}
          products={apiData.masterProducts}
          loading={masterProductsData.isLoading}
          limit={limit}
          setLimit={(val) => updateParams({ limit: val, page: 1 })}
          onPageChange={(p) => updateParams({ page: p })}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </div>

      <MasterProductFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
      />
    </InnerDashboardLayout>
  );
}
