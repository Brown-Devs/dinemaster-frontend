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
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MasterProductsTable({
  apiData,
  products = [],
  loading = false,
  limit,
  setLimit,
  onPageChange,
  onEdit,
  onDelete,
  selectedIds = [],
  onSelectChange,
}) {
  const currentPage = apiData?.pagination?.page || 1;
  const total = apiData?.pagination?.totalCount || 0;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = products.map((n) => n._id);
      onSelectChange?.(newSelected);
    } else {
      onSelectChange?.([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    onSelectChange?.(newSelected);
  };

  if (loading) {
    return (
      <TableContainer className="bg-card border border-border border-b-0 rounded-xl">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
              <TableCell>Sr No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: limit || 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
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
    );
  }

  return (
    <div>
      <TableContainer className="bg-card border border-border border-b-0 rounded-xl">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < products.length}
                  checked={products.length > 0 && selectedIds.length === products.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Sr No</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No master products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => {
                const isSelected = selectedIds.indexOf(product._id) !== -1;
                return (
                  <TableRow key={product._id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOne(product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      {(currentPage - 1) * (limit || 10) + index + 1}
                    </TableCell>

                    <TableCell>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400">
                          No img
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{product.name}</span>
                        {product.description && (
                          <span className="text-xs text-gray-400 line-clamp-1 max-w-[200px] mb-1">
                            {product.description}
                          </span>
                        )}
                        {product.variants && product.variants.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.variants.map((v, idx) => (
                              <div key={idx} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 flex gap-1 items-center">
                                <span className="font-medium">{v.name}:</span>
                                {v.discountedPrice > 0 && v.discountedPrice < v.actualPrice ? (
                                  <>
                                    <span className="line-through text-gray-400 italic">₹{v.actualPrice}</span>
                                    <span className="font-bold">₹{v.discountedPrice}</span>
                                  </>
                                ) : (
                                  <span className="font-bold">₹{v.actualPrice}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-medium text-gray-600">{product.category || "-"}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.active ? (
                          <Chip
                            label="Active"
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "10px" }}
                          />
                        ) : (
                          <Chip
                            label="Inactive"
                            color="error"
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: "10px" }}
                          />
                        )}
                        <Chip
                          label="Master"
                          color="info"
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "10px" }}
                        />
                      </div>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit?.(product)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete?.(product._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
