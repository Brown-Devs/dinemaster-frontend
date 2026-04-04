"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Button,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Checkbox,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SearchIcon from "@mui/icons-material/Search";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import ProductCardsGrid from "./components/ProductCardsGrid";
import ImportProductsDrawer from "./components/ImportProductsDrawer";
import ProductFormModal from "./components/ProductFormModal";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const searchStr = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Local State
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchInput, setSearchInput] = useState(searchStr);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync searchInput with URL if URL changes (e.g. back button)
  useEffect(() => {
    setSearchInput(searchStr);
  }, [searchStr]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateURL({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Import Drawer State
  const [importDrawerOpen, setImportDrawerOpen] = useState(false);
  const [importSelectedIds, setImportSelectedIds] = useState([]);
  const [importSearch, setImportSearch] = useState("");
  const [importCategory, setImportCategory] = useState("");
  const [importPage, setImportPage] = useState(1);
  const [importLimit, setImportLimit] = useState(25);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { brandProductsQuery, bulkImportMutation, bulkDeleteMutation } = useBrandProducts();

  const brandProductsData = brandProductsQuery({
    page,
    limit,
    search: searchStr,
    type: "",
  });

  const apiData = brandProductsData?.data?.data?.data || { products: [], pagination: {} };
  const products = apiData?.products || [];
  const currentPage = apiData?.pagination?.page || 1;
  const total = apiData?.pagination?.totalCount || 0;

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

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      await bulkDeleteMutation.mutateAsync({ ids: selectedIds });
      setSelectedIds([]);
    }
  };

  const handleBulkImport = async () => {
    if (importSelectedIds.length === 0) return;
    await bulkImportMutation.mutateAsync({ masterCatalogIds: importSelectedIds });
    setImportSelectedIds([]);
    setImportDrawerOpen(false);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenImportDrawer = () => {
    setImportSelectedIds([]);
    setImportSearch("");
    setImportCategory("");
    setImportPage(1);
    setImportLimit(25);
    setImportDrawerOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      bulkDeleteMutation.mutateAsync({ ids: [id] });
    }
  };

  const handleSelectAllOnPage = (event) => {
    if (event.target.checked) {
      const pageIds = products.map((n) => n._id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = products.map((n) => n._id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const allOnPageSelected = products.length > 0 && products.every((p) => selectedIds.includes(p._id));
  const someOnPageSelected = products.some((p) => selectedIds.includes(p._id)) && !allOnPageSelected;

  return (
    <InnerDashboardLayout>
      <div className="flex justify-between items-center mb-6 mt-2 flex-wrap gap-4 px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">
            Products
          </h1>
          <p className="text-[13px] text-muted mt-0.5">
            Manage your company products, add new ones or import from master catalog.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<CloudDownloadIcon />}
            onClick={handleOpenImportDrawer}
          >
            Import Products
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            onClick={handleOpenAddModal}
          >
            Add Product
          </Button>
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 items-center">
              <Checkbox
                size="small"
                checked={allOnPageSelected}
                indeterminate={someOnPageSelected}
                onChange={handleSelectAllOnPage}
                sx={{ p: 0.5 }}
              />
              <TextField
                size="small"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{ width: { xs: 150, sm: 220 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              {selectedIds.length > 0 && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleBulkDelete}
                >
                  Delete ({selectedIds.length})
                </Button>
              )}

              <Tooltip title="Refresh">
                <IconButton onClick={() => brandProductsData.refetch()} disabled={brandProductsData.isFetching}>
                  <RefreshIcon fontSize="small" className={brandProductsData.isFetching ? "animate-spin" : ""} />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Product Cards */}
          <ProductCardsGrid
            products={products}
            loading={brandProductsData.isLoading}
            limit={limit}
            currentPage={currentPage}
            total={total}
            onPageChange={(p) => updateURL({ page: p })}
            setLimit={(l) => updateURL({ limit: l, page: 1 })}
            selectedIds={selectedIds}
            onSelectChange={setSelectedIds}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
          />
        </div>
      </Box>

      {/* Import Products Drawer */}
      <ImportProductsDrawer
        open={importDrawerOpen}
        onClose={() => setImportDrawerOpen(false)}
        search={importSearch}
        setSearch={setImportSearch}
        category={importCategory}
        setCategory={setImportCategory}
        page={importPage}
        setPage={setImportPage}
        limit={importLimit}
        setLimit={setImportLimit}
        selectedIds={importSelectedIds}
        setSelectedIds={setImportSelectedIds}
        onBulkImport={handleBulkImport}
      />

      <ProductFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />
    </InnerDashboardLayout>
  );
}
