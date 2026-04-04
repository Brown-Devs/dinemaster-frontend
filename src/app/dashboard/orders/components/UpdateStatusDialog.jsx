"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert
} from "@mui/material";
import { useOrders } from "@/hooks/admin/useOrders";

export function UpdateStatusDialog({ open, onClose, order }) {
  const [status, setStatus] = useState("");
  const { updateOrderMutation } = useOrders();

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const handleUpdate = () => {
    if (!order) return;
    updateOrderMutation.mutateAsync({
      id: order._id,
      data: { status }
    }).then(() => onClose());
  };

  if (!order) return null;

  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: "var(--card)" } }}>
      <DialogTitle sx={{ fontWeight: 'bold', color: "var(--fg)" }}>Update Order Status</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "var(--muted)", mb: 3 }}>
          Change the operational status of order <span className="font-bold text-primary">#{order.orderId || order._id.slice(-6).toUpperCase()}</span>.
        </Typography>

        <FormControl fullWidth size="small" disabled={isCancelled}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="prepared">Prepared</MenuItem>
            <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled" disabled={isDelivered}>Cancelled</MenuItem>
          </Select>
        </FormControl>

        {status === 'cancelled' && !isCancelled && (
          <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
            Cancelling an order is permanent.
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: "var(--muted)" }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={status === order.status || updateOrderMutation.isLoading || isCancelled}
          sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
        >
          {updateOrderMutation.isLoading ? "Updating..." : "Update Status"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
