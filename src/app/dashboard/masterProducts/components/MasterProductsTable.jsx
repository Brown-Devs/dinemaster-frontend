"use client";

import React from "react";
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatDateWithTime } from "@/lib/services/dateFormat";

export default function MasterProductsTable({
  apiData,
  products = [],
  loading = false,
  limit,
  setLimit,
  onPageChange,
}) {
  const currentPage = apiData?.pagination?.page || 1;
  const total = apiData?.pagination?.totalCount || 0;

  if (loading) {
    return (
      <div>
        <TableContainer className="bg-card border border-border border-b-0 rounded-xl">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Variants</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: limit || 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  return (
    <div>
      <TableContainer className="bg-card border border-border border-b-0 rounded-xl">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No master products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product._id} hover>
                  {/* Sr No */}
                  <TableCell>
                    {(currentPage - 1) * (limit || 10) + index + 1}
                  </TableCell>

                  {/* Image */}
                  <TableCell>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          background: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "#9ca3af",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        No img
                      </div>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="font-medium">{product.name || "-"}</span>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span className="font-small">{product.category || "-"}</span>
                  </TableCell>

                  {/* Active */}
                  <TableCell>
                    {product.active ? (
                      <Chip
                        icon={<CheckCircleIcon fontSize="small" />}
                        label="Active"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon fontSize="small" />}
                        label="Inactive"
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>

                  {/* Variants */}
                  <TableCell>
                    {product.variants && product.variants.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {product.variants.map((variant, vIdx) => (
                          <div
                            key={vIdx}
                            className="flex flex-col text-sm border border-border rounded-lg px-2 py-1"
                          >
                            <span className="font-medium text-xs">
                              {variant.name || `Variant ${vIdx + 1}`}
                            </span>
                            <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                              {variant.actualPrice != null && (
                                <span className="line-through text-gray-400">
                                  ₹{variant.actualPrice}
                                </span>
                              )}
                              {variant.discountedPrice != null && (
                                <span className="text-green-600 font-semibold">
                                  ₹{variant.discountedPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No variants</span>
                    )}
                  </TableCell>

                  {/* Created At */}
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDateWithTime(product.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={total || 0}
        page={(currentPage || 1) - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) =>
          setLimit(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </div>
  );
}
