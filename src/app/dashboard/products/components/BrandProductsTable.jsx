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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { formatDateWithTime } from "@/lib/services/dateFormat";

export default function BrandProductsTable({
  apiData,
  loading = false,
  limit,
  setLimit,
  onPageChange,
  selectedIds = [],
  onSelectChange,
  onEdit,
  onDelete,
}) {
  const products = apiData?.products || [];
  const currentPage = apiData?.pagination?.page || 1;
  const total = apiData?.pagination?.totalCount || 0;

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = products.map((n) => n._id);
      onSelectChange(newSelected);
    } else {
      onSelectChange([]);
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
    onSelectChange(newSelected);
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
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: limit || 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell padding="checkbox"><Checkbox disabled /></TableCell>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}><Skeleton variant="text" /></TableCell>
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
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No products found.
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
                    <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      {product.imageURL ? (
                        <img
                          src={product.imageURL}
                          alt={product.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
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
                            <span className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">{product.description}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "-"}</TableCell>
                    <TableCell>
                      {product.masterCatalog ? (
                        <Chip
                          icon={<CloudDownloadIcon style={{ fontSize: 14 }} />}
                          label="Imported"
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{ height: 20, fontSize: "11px" }}
                        />
                      ) : (
                        <Chip
                          icon={<MyLocationIcon style={{ fontSize: 14 }} />}
                          label="Self Added"
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "11px", color: "gray", borderColor: "gray" }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {product.active ? (
                          <Chip label="Active" color="success" size="small" variant="tonal" sx={{ height: 20, fontSize: "10px" }} />
                        ) : (
                          <Chip label="Inactive" color="error" size="small" variant="tonal" sx={{ height: 20, fontSize: "10px" }} />
                        )}
                        {product.inStock ? (
                           <Chip label="In Stock" color="info" size="small" variant="tonal" sx={{ height: 20, fontSize: "10px" }} />
                        ) : (
                           <Chip label="Out of Stock" color="warning" size="small" variant="tonal" sx={{ height: 20, fontSize: "10px" }} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(product)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(product._id)}>
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
        count={total}
        page={currentPage - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </div>
  );
}
