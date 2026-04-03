"use client";

import React from "react";
import {
  Drawer,
  TablePagination,
  Skeleton,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloseIcon from "@mui/icons-material/Close";
import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "./ProductCard";

export default function ImportProductsDrawer({
  open,
  onClose,
  search,
  setSearch,
  category,
  setCategory,
  page,
  setPage,
  limit,
  setLimit,
  selectedIds,
  setSelectedIds,
  onBulkImport,
}) {
  const { notImportedProductsQuery, masterCategoriesQuery } = useBrandProducts();

  const { data: catData } = masterCategoriesQuery();
  const categories = catData?.data?.data || [];
  const debouncedSearch = useDebounce(search, 500);

  const { data: productsData, isLoading: productsLoading } = notImportedProductsQuery({
    page,
    limit,
    search: debouncedSearch,
    category,
  });

  const apiData = productsData?.data?.data || { masterProducts: [], pagination: {} };
  const products = apiData.masterProducts || [];
  const total = apiData.pagination?.totalCount || 0;

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((item) => item !== id));
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

  const handleSelectCurrentPage = () => {
    setSelectedIds(products.map((p) => p._id));
  };

  const allOnPageSelected = products.length > 0 && products.every((p) => selectedIds.includes(p._id));
  const someOnPageSelected = products.some((p) => selectedIds.includes(p._id)) && !allOnPageSelected;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", md: "75%" },
          bgcolor: "var(--background)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid var(--border)",
          bgcolor: "var(--card)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--fg)" }}>
            Import Products
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--muted)" }}>
            Import products from the global master catalog to your brand.
          </Typography>
        </div>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
          px: 3,
          py: 2,
          bgcolor: "var(--card)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 73,
          zIndex: 9,
        }}
      >
        <TextField
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: { xs: 150, sm: 220 }, borderRadius: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "var(--muted)", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: { xs: 130, sm: 180 } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category || ""}
            label="Category"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="flex items-center gap-2 ml-auto">
          <Checkbox
            size="small"
            checked={allOnPageSelected}
            indeterminate={someOnPageSelected}
            onChange={handleSelectAllOnPage}
            sx={{ p: 0.5 }}
          />
          <Typography variant="caption" sx={{ whiteSpace: "nowrap", color: "var(--muted)" }}>
            Select page
          </Typography>
        </div>

        <Button
          variant="outlined"
          size="small"
          onClick={handleSelectCurrentPage}
          disabled={products.length === 0}
          sx={{ textTransform: "none", whiteSpace: "nowrap" }}
        >
          Select All
        </Button>

        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          disabled={selectedIds.length === 0}
          onClick={onBulkImport}
          sx={{ textTransform: "none", whiteSpace: "nowrap" }}
        >
          Import ({selectedIds.length})
        </Button>
      </Box>

      {/* Cards Grid */}
      <Box sx={{ px: 3, py: 2, flex: 1, overflowY: "auto" }}>
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-2 sm:p-3 flex gap-2 sm:gap-3"
              >
                <Skeleton
                  variant="rounded"
                  sx={{
                    width: { xs: 48, sm: 72 },
                    height: { xs: 48, sm: 72 },
                    flexShrink: 0,
                    borderRadius: 2,
                  }}
                />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" width="70%" height={18} />
                  <Skeleton variant="text" width="40%" height={14} />
                  <Skeleton variant="text" width="50%" height={12} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
            }}
          >
            <CloudDownloadIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3, color: "var(--muted)" }} />
            <Typography variant="body1" fontWeight={500} sx={{ color: "var(--muted)" }}>
              No products to import
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--muted)", opacity: 0.7 }}>
              All master products from this search/category are already imported!
            </Typography>
          </Box>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isSelected={selectedIds.includes(product._id)}
                onSelect={handleSelectOne}
                showActions={false}
              />
            ))}
          </div>
        )}
      </Box>

      {/* Pagination */}
      <Box
        sx={{
          borderTop: "1px solid var(--border)",
          bgcolor: "var(--card)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(e, p) => setPage(p + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(1);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Box>
    </Drawer>
  );
}
