"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Pagination,
  Box,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";
import { TablePagination } from "@mui/material";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";


const statusColors = {
  new: { bg: "#e3f2fd", text: "#1976d2", label: "New" },
  prepared: { bg: "#fff3e0", text: "#ef6c00", label: "Prepared" },
  out_for_delivery: { bg: "#f3e5f5", text: "#7b1fa2", label: "Out for Delivery" },
  delivered: { bg: "#e8f5e9", text: "#2e7d32", label: "Delivered" },
  cancelled: { bg: "#ffebee", text: "#d32f2f", label: "Cancelled" },
};

const typeIcons = {
  dinein: <FastfoodIcon fontSize="small" />,
  delivery: <LocalShippingIcon fontSize="small" />,
  packing: <ShoppingBagIcon fontSize="small" />,
};

const typeLabels = {
  dinein: "Dine In",
  delivery: "Delivery",
  packing: "Packing",
};

export default function OrdersTable({
  orders,
  loading,
  total,
  page,
  limit,
  onPageChange,
  setLimit,
  onUpdateStatus,
  onUpdatePayment,
  onViewDetails
}) {
  const { checkPermission } = usePermissions();
  const router = useRouter();

  const handleEditOrder = (order) => {
    router.push(`/dashboard/billing?editOrder=${order._id}`);
  };


  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
          bgcolor: "transparent", 
          border: "1px solid var(--border)", 
          borderRadius: "6px", 
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ bgcolor: "var(--cardsBG)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)', width: 80, textAlign: 'center', px: 4 }}>S.No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Items</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Payment</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', color: 'var(--muted)', width: 120, px: 4 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(limit)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" sx={{ color: "var(--muted)" }}>No orders found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow key={order._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: "var(--fg)", textAlign: 'center', px: 4 }}>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)", fontFamily: 'monospace' }}>
                      #{order.orderId || order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "var(--muted)" }}>
                      {format(new Date(order.createdAt), "dd MMM, hh:mm a")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)" }}>
                      {order.customer?.name || "Guest"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "var(--muted)" }}>
                      {order.customer?.mobileNo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span style={{ color: 'var(--muted)', display: 'flex' }}>
                         {typeIcons[order.orderType] || <FastfoodIcon fontSize="small" />}
                       </span>
                       <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: "bold" }}>
                         {typeLabels[order.orderType] || order.orderType}
                       </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>
                      {order.items?.length || 0} items
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)" }}>
                      ₹{order.totalAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Chip
                        label={statusColors[order.status]?.label || order.status}
                        size="small"
                        sx={{
                          bgcolor: statusColors[order.status]?.bg,
                          color: statusColors[order.status]?.text,
                          fontWeight: 'bold',
                          borderRadius: '6px'
                        }}
                      />
                      {checkPermission(PERMISSIONS.ORDERS_UPDATE) && (
                        <IconButton size="small" onClick={() => onUpdateStatus(order)} disabled={order.status === 'cancelled'}>
                          <EditIcon sx={{ fontSize: 14, color: "var(--muted)" }} />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Chip
                        label={order.paymentStatus === 'paid' ? "Paid" : "Unpaid"}
                        variant="outlined"
                        size="small"
                        color={order.paymentStatus === 'paid' ? "success" : "error"}
                        sx={{ fontWeight: 'bold' }}
                      />
                      {checkPermission(PERMISSIONS.ORDERS_UPDATE) && (
                        <IconButton size="small" onClick={() => onUpdatePayment(order)} disabled={order.status === 'cancelled'}>
                          <EditIcon sx={{ fontSize: 14, color: "var(--muted)" }} />
                        </IconButton>
                      )}
                    </div>
                    <Typography variant="caption" sx={{ color: "var(--muted)", display: 'block', mt: 0.5, fontSize: 10 }}>
                      {order.paymentMode?.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ px: 4 }}>
                    <div className="flex justify-center gap-1">
                      <Tooltip title="View Order Details">
                        <IconButton size="small" onClick={() => onViewDetails(order)}>
                          <VisibilityIcon fontSize="small" sx={{ color: "var(--muted)" }} />
                        </IconButton>
                      </Tooltip>
                      {checkPermission(PERMISSIONS.ORDERS_UPDATE) && order.status !== 'cancelled' && (
                        <Tooltip title="Edit Order in Billing">
                          <IconButton size="small" onClick={() => handleEditOrder(order)}>
                            <EditIcon fontSize="small" sx={{ color: "var(--muted)" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
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
      )}

    </Box>
  );
}
