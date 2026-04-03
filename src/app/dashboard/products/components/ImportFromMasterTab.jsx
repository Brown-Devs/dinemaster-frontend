"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Skeleton,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useBrandProducts } from "@/hooks/admin/useBrandProducts";

export default function ImportFromMasterTab({
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
  onBulkImport
}) {
  const { notImportedProductsQuery, masterCategoriesQuery } = useBrandProducts();
  
  const { data: catData, isLoading: catLoading } = masterCategoriesQuery();
  const categories = catData?.data?.data || [];

  const { data: productsData, isLoading: productsLoading } = notImportedProductsQuery({
    page,
    limit,
    search,
    category
  });

  const apiData = productsData?.data?.data || { masterProducts: [], pagination: {} };
  const products = apiData.masterProducts || [];
  const total = apiData.pagination?.totalCount || 0;

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
        newSelected = [...selectedIds, id];
    } else {
        newSelected = selectedIds.filter(item => item !== id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAllOnPage = (event) => {
    if (event.target.checked) {
      const pageIds = products.map((n) => n._id);
      setSelectedIds(prev => [...new Set([...prev, ...pageIds])]);
    } else {
      const pageIds = products.map((n) => n._id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectAllInCategory = () => {
    // This is a powerful feature: "Select All" can only select what's currently fetched.
    // If the user wants to select *everything* filtered, we'd normally need a special backend flag.
    // However, for simplicity and expected behavior with pagination, selecting current page IDs is a good start.
    // If we want to support "Select all XXX products in this category", we'd need another implementation.
    // For now, let's select all indices on the current page to keep it safe.
    setSelectedIds(products.map(p => p._id));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap bg-gray-50 p-4 rounded-lg border border-border">
        <TextField
          size="small"
          placeholder="Search master products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250, backgroundColor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "gray", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200, backgroundColor: "white" }}>
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
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="ml-auto flex gap-2">
            <Button 
                variant="outlined" 
                size="small" 
                color="secondary"
                onClick={handleSelectAllInCategory}
                disabled={products.length === 0}
            >
                Select Current Page
            </Button>
            <Button
                variant="contained"
                startIcon={<CloudDownloadIcon />}
                disabled={selectedIds.length === 0}
                onClick={onBulkImport}
            >
                Import Selected ({selectedIds.length})
            </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer className="bg-card border border-border border-b-0 rounded-xl">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAllOnPage}
                  checked={products.length > 0 && products.every(p => selectedIds.includes(p._id))}
                  indeterminate={products.some(p => selectedIds.includes(p._id)) && !products.every(p => selectedIds.includes(p._id))}
                />
              </TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Variants</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productsLoading ? (
              Array.from({ length: limit }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8, color: "text.secondary" }}>
                  All master products from this search/category are already imported!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const isSelected = selectedIds.includes(product._id);
                return (
                  <TableRow key={product._id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOne(product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded border border-gray-100"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">{product.name}</span>
                    </TableCell>
                    <TableCell>
                       <Chip label={product.category} size="small" variant="outlined" sx={{ fontSize: 10, height: 18 }} />
                    </TableCell>
                    <TableCell>
                       <span className="text-xs text-gray-500">{product.variants?.length || 0} Variants</span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(e, p) => setPage(p + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </div>
  );
}
