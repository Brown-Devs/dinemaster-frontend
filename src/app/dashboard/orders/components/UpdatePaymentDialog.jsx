"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  IconButton
} from "@mui/material";
import { useOrders } from "@/hooks/admin/useOrders";
import CloseIcon from "@mui/icons-material/Close";
import PaymentsIcon from "@mui/icons-material/Payments";

export function UpdatePaymentDialog({ open, onClose, order }) {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [payments, setPayments] = useState({ cashAmount: 0, onlineAmount: 0 });
  const { updateOrderMutation } = useOrders();

  useEffect(() => {
    if (order) {
      setPaymentStatus(order.paymentStatus);

      const p = order.payments || { cashAmount: 0, onlineAmount: 0 };
      setPayments(p);

      // Derive initial mode
      if (p.cashAmount > 0 && p.onlineAmount > 0) {
        setPaymentMode("mix");
      } else if (p.onlineAmount > 0) {
        setPaymentMode("online");
      } else {
        setPaymentMode("cash");
      }
    }
  }, [order]);

  const totalAmount = order?.totalAmount || 0;

  const handleModeChange = (newMode) => {
    if (!newMode) return;
    setPaymentMode(newMode);

    if (newMode === 'cash') {
      setPayments({ cashAmount: totalAmount, onlineAmount: 0 });
    } else if (newMode === 'online') {
      setPayments({ cashAmount: 0, onlineAmount: totalAmount });
    }
    // For 'mix', we keep current values or let user adjust
  };

  const handleSplitChange = (type, val) => {
    const amount = Number(val);
    if (type === 'cash') {
      setPayments({ cashAmount: amount, onlineAmount: Math.max(0, totalAmount - amount) });
    } else {
      setPayments({ onlineAmount: amount, cashAmount: Math.max(0, totalAmount - amount) });
    }
  };

  const handleUpdate = () => {
    if (!order) return;
    updateOrderMutation.mutateAsync({
      id: order._id,
      data: {
        paymentStatus,
        paymentMode,
        payments: {
          cashAmount: Number(payments.cashAmount),
          onlineAmount: Number(payments.onlineAmount)
        }
      }
    }).then(() => onClose());
  };

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "4px", // rounded-sm
          bgcolor: "var(--card)",
          backgroundImage: "none"
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-primary">
          <PaymentsIcon fontSize="small" />
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--fg)]">Payment Update</h2>
        </div>
        <IconButton size="small" onClick={onClose} className="rounded-sm text-[var(--muted)] hover:bg-[var(--border)]">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <DialogContent className="p-5 space-y-6">
        {/* Payable Summary */}
        <div className="bg-[var(--cardsBG)] p-4 border border-dashed border-[var(--border)] text-center rounded-sm">
          <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">Total Payable Amount</p>
          <p className="text-3xl font-black text-primary mt-1">₹{totalAmount}</p>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider block ml-1">Payment Status</label>
          <ToggleButtonGroup
            value={paymentStatus}
            exclusive
            onChange={(e, val) => val && setPaymentStatus(val)}
            fullWidth
            size="small"
            color="primary"
            sx={{ gap: 1 }}
          >
            <ToggleButton
              value="not_paid"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: "4px !important",
                border: "1px solid var(--border) !important",
                color: "var(--muted)",
                '&.Mui-selected': { bgcolor: "error.main", color: "white" }
              }}
            >
              Not Paid
            </ToggleButton>
            <ToggleButton
              value="paid"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: "4px !important",
                border: "1px solid var(--border) !important",
                color: "var(--muted)",
                '&.Mui-selected': { bgcolor: "success.main", color: "white" }
              }}
            >
              Paid
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* Payment Mode */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider block ml-1">Payment Mode</label>
          <ToggleButtonGroup
            value={paymentMode}
            exclusive
            onChange={(e, val) => handleModeChange(val)}
            fullWidth
            size="small"
            color="primary"
            sx={{ gap: 1 }}
          >
            {['cash', 'online', 'mix'].map((m) => (
              <ToggleButton
                key={m}
                value={m}
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  borderRadius: "4px !important",
                  border: "1px solid var(--border) !important",
                  color: "var(--muted)",
                  '&.Mui-selected': { bgcolor: "primary.main", color: "white" }
                }}
              >
                {m}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        {/* Conditional Split Adjustment */}
        {paymentMode === 'mix' && (
          <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Divider sx={{ borderColor: "var(--border)", borderStyle: "dashed" }}>
              <span className="text-[9px] text-[var(--muted)] bg-[var(--card)] px-2 font-bold uppercase tracking-widest">Adjust Splits</span>
            </Divider>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Cash Amount"
                fullWidth
                size="small"
                type="number"
                value={payments.cashAmount}
                onChange={(e) => handleSplitChange('cash', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  sx: { borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }
                }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
              <TextField
                label="Online Amount"
                fullWidth
                size="small"
                type="number"
                value={payments.onlineAmount}
                onChange={(e) => handleSplitChange('online', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  sx: { borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }
                }}
                InputLabelProps={{ sx: { fontSize: "0.85rem" } }}
              />
            </div>
          </div>
        )}
      </DialogContent>

      <DialogActions className="px-5 py-4 border-t border-[var(--border)] gap-2">
        <Button
          onClick={onClose}
          className="text-xs text-[var(--muted)] hover:bg-[var(--border)] h-9 min-w-[80px]"
          sx={{ textTransform: "none", borderRadius: "2px" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={updateOrderMutation.isPending}
          loading={updateOrderMutation.isPending}
          loadingPosition="start"
          className="text-xs font-bold h-9 bg-primary shadow-none hover:shadow-md min-w-[120px]"
          sx={{ textTransform: "none", borderRadius: "2px" }}
        >
          {updateOrderMutation.isPending ? "Updating..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
