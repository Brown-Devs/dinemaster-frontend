"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Divider,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Box
} from "@mui/material";
import { useOrders } from "@/hooks/admin/useOrders";

export function UpdatePaymentDialog({ open, onClose, order }) {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [discount, setDiscount] = useState(0);
  const [payments, setPayments] = useState({ cashAmount: 0, onlineAmount: 0 });
  const { updateOrderMutation } = useOrders();

  useEffect(() => {
    if (order) {
      setPaymentStatus(order.paymentStatus);
      setDiscount(order.additionalDiscount || 0);
      setPayments(order.payments || { cashAmount: 0, onlineAmount: 0 });
    }
  }, [order]);

  const handleUpdate = () => {
    if (!order) return;
    updateOrderMutation.mutateAsync({
      id: order._id,
      data: {
        paymentStatus,
        additionalDiscount: Number(discount),
        payments: {
          cashAmount: Number(payments.cashAmount),
          onlineAmount: Number(payments.onlineAmount)
        }
      }
    }).then(() => onClose());
  };

  if (!order) return null;

  // Calculate Subtotal (since we don't store it, we derive it for preview)
  const currentSubtotal = (order?.totalAmount || 0) + (order?.additionalDiscount || 0);
  const previewTotal = Math.max(0, currentSubtotal - discount);

  const handleSplitChange = (type, val) => {
    const amount = Number(val);
    if (type === 'cash') {
      setPayments({ cashAmount: amount, onlineAmount: Math.max(0, previewTotal - amount) });
    } else {
      setPayments({ onlineAmount: amount, cashAmount: Math.max(0, previewTotal - amount) });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, bgcolor: "var(--card)" } }}>
      <DialogTitle sx={{ fontWeight: 'bold', color: "var(--fg)" }}>Payment & Accounting</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 4, p: 2, bgcolor: "var(--cardsBG)", borderRadius: 3, border: "1px solid var(--border)" }}>
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="caption" sx={{ color: "var(--muted)" }}>Current Payable</Typography>
              <Typography variant="h5" fontWeight="black" color="primary">₹{previewTotal}</Typography>
            </div>
            <div className="text-right">
              <Typography variant="caption" sx={{ color: "var(--muted)" }}>Subtotal: ₹{currentSubtotal}</Typography>
            </div>
          </div>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "var(--fg)" }}>Payment Status</Typography>
            <ToggleButtonGroup
              value={paymentStatus}
              exclusive
              onChange={(e, val) => val && setPaymentStatus(val)}
              fullWidth
              size="small"
              color="primary"
            >
              <ToggleButton value="not_paid" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Not Paid</ToggleButton>
              <ToggleButton value="paid" sx={{ textTransform: 'none', fontWeight: 'bold' }}>Paid</ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: "var(--fg)" }}>Adjust Discount (Amount)</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12}><Divider sx={{ my: 1, borderColor: "var(--border)" }} /></Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: "var(--fg)" }}>Payment Split Adjustment</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Cash"
                  fullWidth
                  size="small"
                  type="number"
                  value={payments.cashAmount}
                  onChange={(e) => handleSplitChange('cash', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Online"
                  fullWidth
                  size="small"
                  type="number"
                  value={payments.onlineAmount}
                  onChange={(e) => handleSplitChange('online', e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: "var(--muted)" }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={updateOrderMutation.isLoading}
          sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
        >
          {updateOrderMutation.isLoading ? "Saving Changes..." : "Save Details"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
