"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Skeleton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/constants";

export default function CategoriesTable({
  categories = [],
  loading = false,
  total = 0,
  page,
  limit,
  onPageChange,
  setLimit,
  onEdit,
}) {
  const { checkPermission } = usePermissions();
  if (loading) {
    return (
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid var(--border)", background: "transparent", borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "var(--cardsBG)" }}>
            <TableRow>
              <TableCell><Skeleton width={40} /></TableCell>
              <TableCell><Skeleton width={50} /></TableCell>
              <TableCell><Skeleton width={100} /></TableCell>
              <TableCell><Skeleton width={60} /></TableCell>
              <TableCell><Skeleton width={80} /></TableCell>
              <TableCell align="right"><Skeleton width={60} /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(limit || 5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton width={30} /></TableCell>
                <TableCell><Skeleton variant="rounded" width={40} height={40} /></TableCell>
                <TableCell><Skeleton width="60%" /></TableCell>
                <TableCell><Skeleton width={40} /></TableCell>
                <TableCell><Skeleton width={120} /></TableCell>
                <TableCell align="right"><Skeleton width={60} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-border rounded-xl bg-card">
        <RestaurantMenuIcon sx={{ fontSize: 60, color: "var(--muted)", opacity: 0.3, mb: 2 }} />
        <p className="text-lg font-semibold text-foreground">No Categories Found</p>
        <p className="text-sm text-(--muted)">Get started by creating a new category.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-sm overflow-hidden bg-card">
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "var(--cardsBG)" }}>
            <TableRow>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", width: 80, textAlign: "center" }}>Sr No</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold", width: 80 }}>Image</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "var(--muted)", fontWeight: "bold" }}>Add-ons</TableCell>
              <TableCell align="right" sx={{ color: "var(--muted)", fontWeight: "bold", width: 100, textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category._id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ textAlign: "center" }}>
                  <span className="text-sm font-medium text-foreground text-center">
                    {(page - 1) * limit + index + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg bg-cardsBG flex items-center justify-center overflow-hidden border border-border">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <RestaurantMenuIcon sx={{ color: "var(--muted)", fontSize: 20 }} />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-sm text-foreground">{category.name}</p>
                </TableCell>
                <TableCell>
                  {category.active ? (
                    <Chip label="Active" size="small" color="success" variant="outlined" sx={{ height: 24, fontSize: 11 }} />
                  ) : (
                    <Chip label="Inactive" size="small" color="error" variant="outlined" sx={{ height: 24, fontSize: 11 }} />
                  )}
                </TableCell>
                <TableCell>
                  {category.addOns && category.addOns.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {category.addOns.map((addon, idx) => (
                        <Chip
                          key={idx}
                          label={`${addon.name} (₹${addon.price})`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: 11, color: "var(--muted)", borderColor: "var(--border)" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-[var(--muted)]">—</span>
                  )}
                </TableCell>
                <TableCell align="center">
                  <div className="flex justify-center gap-1">
                    {checkPermission(PERMISSIONS.CATEGORIES_UPDATE) && (
                      <Tooltip title="Edit Category">
                        <IconButton size="small" onClick={() => onEdit(category)}>
                          <EditIcon fontSize="small" sx={{ color: "var(--fg)" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1} // MUI uses 0-based indexing
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{
          color: "var(--fg)",
          borderTop: "1px solid var(--border)",
          ".MuiTablePagination-selectIcon": { color: "var(--fg)" },
        }}
      />
    </div>
  );
}
