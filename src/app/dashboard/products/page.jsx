"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import {
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SearchIcon from "@mui/icons-material/Search";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import BrandProductsTable from "./components/BrandProductsTable";
import ImportFromMasterTab from "./components/ImportFromMasterTab";
import ProductFormModal from "./components/ProductFormModal";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const isImportMode = searchParams.get("import") === "true";
  const currentTab = searchParams.get("tab") || "all";
  const searchStr = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Local State
  const [selectedIds, setSelectedIds] = useState([]);
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
    type: currentTab === "all" ? "" : currentTab,
  });

  const apiData = brandProductsData?.data?.data?.data || { products: [], pagination: {} };

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

  const handleTabChange = (event, newValue) => {
    updateURL({ tab: newValue, page: 1 });
  };

  const toggleImportMode = (enable) => {
    updateURL({ import: enable ? "true" : "", page: 1, search: "" });
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
    toggleImportMode(false); // Return to main tab
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <InnerDashboardLayout>
      <div className="flex justify-between items-center mb-6 mt-2 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isImportMode && (
              <IconButton onClick={() => toggleImportMode(false)} size="small" sx={{ mb: 1 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <h1 className="font-bold text-3xl tracking-tight">
              {isImportMode ? "Import Products" : "Products"}
            </h1>
          </div>
          <p className="text-gray-500">
            {isImportMode
              ? "Import products from the global master catalog to your brand."
              : "Manage your company products, add new ones or import from master catalog."}
          </p>
        </div>

        <div className="flex gap-2">
          {!isImportMode ? (
            <>
              <Button
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                onClick={() => toggleImportMode(true)}
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
            </>
          ) : (
            <Button
                variant="outlined"
                onClick={() => toggleImportMode(false)}
            >
                Cancel
            </Button>
          )}
        </div>
      </div>

      {!isImportMode ? (
        <Box sx={{ width: "100%" }}>
          {/* Main Table View */}
          <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <Tabs value={currentTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                <Tab label="All" value="all" sx={{ textTransform: "none", fontWeight: 600 }} />
                <Tab label="Imported" value="imported" sx={{ textTransform: "none", fontWeight: 600 }} />
                <Tab label="Self Added" value="manual" sx={{ textTransform: "none", fontWeight: 600 }} />
              </Tabs>

              <div className="flex gap-2 items-center flex-wrap">
                <TextField
                  size="small"
                  placeholder="Search products..."
                  value={searchStr}
                  onChange={(e) => updateURL({ search: e.target.value, page: 1 })}
                  sx={{ width: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "gray", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
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

            <BrandProductsTable
              apiData={apiData}
              loading={brandProductsData.isLoading}
              limit={limit}
              setLimit={(l) => updateURL({ limit: l, page: 1 })}
              onPageChange={(p) => updateURL({ page: p })}
              selectedIds={selectedIds}
              onSelectChange={setSelectedIds}
              onEdit={handleOpenEditModal}
              onDelete={(id) => {
                  if(window.confirm("Are you sure you want to delete this product?")) bulkDeleteMutation.mutateAsync({ ids: [id] });
              }}
            />
          </div>
        </Box>
      ) : (
        <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm">
          {/* Import List View */}
          <ImportFromMasterTab
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
        </div>
      )}

      <ProductFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
      />
    </InnerDashboardLayout>
  );
}
