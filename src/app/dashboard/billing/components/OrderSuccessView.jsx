"use client";

import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";

export default function OrderSuccessView({ order, onNewOrder }) {
  if (!order) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full animate-in zoom-in duration-500">
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          borderRadius: 6, 
          textAlign: "center", 
          border: "1px solid var(--border)",
          bgcolor: "var(--card)",
          maxWidth: 450,
          width: "100%",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}
      >
        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
          <CheckCircleOutlineIcon sx={{ fontSize: 48 }} />
        </div>

        <Typography variant="h4" fontWeight="900" sx={{ color: "var(--fg)", mb: 1 }}>
          Order Success!
        </Typography>
        <Typography variant="body1" sx={{ color: "var(--muted)", mb: 4 }}>
          Order ID: <span className="font-bold text-primary font-mono">#{order._id?.slice(-8).toUpperCase()}</span>
        </Typography>

        <div className="bg-cardsBG p-4 rounded-2xl border border-border flex flex-col gap-3 mb-6">
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--muted)" }}>Customer</span>
            <span className="font-bold" style={{ color: "var(--fg)" }}>{order.customer?.name || "Guest"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--muted)" }}>Payment Method</span>
            <span className="font-bold uppercase" style={{ color: "var(--fg)" }}>{order.paymentMode}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
             <span className="font-bold" style={{ color: "var(--fg)" }}>Total Amount</span>
             <span className="font-black text-lg text-primary">₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
           <Button 
             variant="contained" 
             fullWidth 
             size="large" 
             startIcon={<AddIcon />}
             onClick={onNewOrder}
             sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
           >
             Create New Order
           </Button>
           <Button 
             variant="outlined" 
             fullWidth 
             size="large" 
             startIcon={<ReceiptIcon />}
             sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', textTransform: 'none' }}
           >
             Print Receipt
           </Button>
        </div>
      </Paper>
    </div>
  );
}
