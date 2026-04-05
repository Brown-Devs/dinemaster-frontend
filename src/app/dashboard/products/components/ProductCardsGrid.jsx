"use client";

import React from "react";
import { TablePagination, Skeleton, Box } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ProductCard from "./ProductCard";

export default function ProductCardsGrid({
  products = [],
  loading = false,
  limit = 10,
  currentPage = 1,
  total = 0,
  onPageChange,
  setLimit,
  selectedIds = [],
  onSelectChange,
  onEdit,
}) {
  const handleSelectOne = (id) => {
    const idx = selectedIds.indexOf(id);
    if (idx === -1) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter((item) => item !== id));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Updated Skeletons to match new ProductCard layout */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-3 flex flex-col sm:flex-row gap-3"
            >
              <div className="flex flex-col gap-2 shrink-0">
                <Skeleton
                  variant="rounded"
                  sx={{
                    width: { xs: '100%', sm: 80 },
                    height: { xs: 100, sm: 80 },
                    flexShrink: 0,
                    borderRadius: 2,
                  }}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="100%" height={16} />
                <Skeleton variant="text" width="60%" height={16} />
                <div className="mt-4 flex justify-between items-center">
                  <Skeleton variant="rounded" width={50} height={18} sx={{ borderRadius: 10 }} />
                  <div className="flex gap-1">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="space-y-4">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
          }}
        >
          <RestaurantIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3, color: "var(--muted)" }} />
          <p className="text-base font-medium" style={{ color: "var(--muted)" }}>No products found</p>
          <p className="text-sm" style={{ color: "var(--muted)", opacity: 0.7 }}>Add a product or import from the master catalog.</p>
        </Box>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isSelected={selectedIds.includes(product._id)}
            onSelect={handleSelectOne}
            onEdit={onEdit}
            showActions={true}
          />
        ))}
      </div>

      <TablePagination
        component="div"
        count={total}
        page={currentPage - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </div>
  );
}
