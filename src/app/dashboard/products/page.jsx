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

import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS, MODULES } from "@/lib/constants";
import PermissionDenied from "@/components/shared/PermissionDenied";

import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import ProductCardsGrid from "./components/ProductCardsGrid";
import ImportProductsDrawer from "./components/ImportProductsDrawer";
import ProductFormModal from "./components/ProductFormModal";

export default function ProductsPage() {
  const { isModuleEnabled, checkPermission } = usePermissions();

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const searchStr = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Local State
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

  const { brandProductsQuery, bulkImportMutation } = useBrandProducts();

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

  const hasAccess = isModuleEnabled(MODULES.PRODUCTS) && checkPermission(PERMISSIONS.PRODUCTS_VIEW);
  if (!hasAccess) return <PermissionDenied />;

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
          {checkPermission(PERMISSIONS.PRODUCTS_CREATE) && (
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon />}
              onClick={handleOpenImportDrawer}
            >
              Import Products
            </Button>
          )}
          {checkPermission(PERMISSIONS.PRODUCTS_CREATE) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              onClick={handleOpenAddModal}
            >
              Add Product
            </Button>
          )}
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 items-center">
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
            onEdit={handleOpenEditModal}
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
