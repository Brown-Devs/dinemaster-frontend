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

const statusColors = {
  new: { bg: "rgba(33, 150, 243, 0.1)", text: "#2196f3", label: "New" },
  delivered: { bg: "rgba(76, 175, 80, 0.1)", text: "#4caf50", label: "Delivered" },
  cancelled: { bg: "rgba(244, 67, 54, 0.1)", text: "#f44336", label: "Cancelled" },
};

const typeIcons = {
  dinein: <FastfoodIcon fontSize="small" />,
  homeDelivery: <LocalShippingIcon fontSize="small" />,
  packing: <ShoppingBagIcon fontSize="small" />,
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent", border: "1px solid var(--border)", borderRadius: "16px", overflow: 'hidden' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: "var(--cardsBG)" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)', width: 80, textAlign: 'center', px: 4 }}>Sr No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--muted)' }}>Details</TableCell>
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
                       <Tooltip title={order.orderType}>
                          <span style={{ color: 'var(--muted)' }}>{typeIcons[order.orderType] || order.orderType}</span>
                       </Tooltip>
                       <Typography variant="caption" sx={{ color: "var(--muted)" }}>
                         {order.items?.length || 0} items
                       </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)" }}>
                      ₹{order.totalAmount}
                    </Typography>
                    {order.additionalDiscount > 0 && (
                      <Typography variant="caption" sx={{ color: "success.main", display: 'block' }}>
                        -₹{order.additionalDiscount} disc
                      </Typography>
                    )}
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
                      <IconButton size="small" onClick={() => onUpdateStatus(order)} disabled={order.status === 'cancelled'}>
                        <EditIcon sx={{ fontSize: 14, color: "var(--muted)" }} />
                      </IconButton>
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
                      <IconButton size="small" onClick={() => onUpdatePayment(order)} disabled={order.status === 'cancelled'}>
                        <EditIcon sx={{ fontSize: 14, color: "var(--muted)" }} />
                      </IconButton>
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
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, order)}>
                        <MoreVertIcon fontSize="small" sx={{ color: "var(--muted)" }} />
                      </IconButton>
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        <MenuItem onClick={() => { onUpdateStatus(selectedOrder); handleMenuClose(); }} disabled={selectedOrder?.status === 'cancelled'}>
          <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Update Status" />
        </MenuItem>
        <MenuItem onClick={() => { onUpdatePayment(selectedOrder); handleMenuClose(); }} disabled={selectedOrder?.status === 'cancelled'}>
          <ListItemIcon><PaymentIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Payment Details" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
      </Menu>
    </Box>
  );
}
