"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  Chip
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { format } from "date-fns";

export default function OrderSuccessView({ order, onNewOrder }) {
  if (!order) return null;

  const {
    items = [],
    customer,
    totalAmount,
    subTotal,
    additionalDiscount,
    payments,
    orderType,
    orderId,
    status,
    paymentStatus,
    createdAt
  } = order;

  // Defensive data access: Support both populated objects and ID strings
  const customerName = typeof customer === 'object' ? customer?.name : null;
  const customerMobile = typeof customer === 'object' ? (customer?.mobileNo || customer?.mobile) : null;

  const typeLabels = {
    dinein: "Dine In",
    delivery: "Delivery",
    packing: "Packing",
  };

  const statusColors = {
    new: "primary",
    delivered: "success",
    cancelled: "error",
    paid: "success",
    not_paid: "warning",
  };

  return (
    <Box className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-2 animate-in zoom-in duration-500 min-h-full">
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: "hidden",
          border: "1.5px solid var(--border)",
          bgcolor: "var(--card)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "none"
        }}
      >
        {/* Header Section - Enhanced with Statuses */}
        <Box sx={{ p: 2, px: 3, bgcolor: "rgba(var(--primary-rgb), 0.05)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "success.main",
                color: "white",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 28 }} />
            </Box>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Typography variant="h6" fontWeight="900" sx={{ color: "var(--fg)", lineHeight: 1 }}>
                  Order Placed!
                </Typography>
                <Chip
                  label={status?.toUpperCase() || "NEW"}
                  size="small"
                  color={statusColors[status] || "primary"}
                  sx={{ height: 18, fontSize: '10px', fontWeight: 'bold' }}
                />
                <Chip
                  label={paymentStatus === 'paid' ? "PAID" : "UNPAID"}
                  size="small"
                  variant="filled"
                  color={statusColors[paymentStatus] || "warning"}
                  sx={{ height: 18, fontSize: '10px', fontWeight: 'bold' }}
                />
              </div>
              <Typography variant="body2" sx={{ color: "var(--muted)" }}>
                ID: <span className="font-bold text-primary font-mono">#{orderId || order._id?.slice(-8).toUpperCase()}</span> • {format(new Date(createdAt), "hh:mm a")}
              </Typography>
            </div>
          </Box>

          <div className="flex gap-2">
            {/* <Button
              variant="outlined"
              startIcon={<ReceiptIcon />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Print Receipt
            </Button> */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onNewOrder}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
            >
              Next Order
            </Button>
          </div>
        </Box>

        {/* Content Section: Two Columns */}
        <Box className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">

          {/* LEFT: Item Details - Restored Font Sizes */}
          <Box className="flex-[1.4] p-4 sm:p-5">
            <div className="flex justify-between items-center mb-3">
              <Typography variant="subtitle1" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1, color: "var(--fg)" }}>
                <ShoppingBagIcon sx={{ fontSize: 18, color: "primary.main" }} />
                Items ({items.length})
              </Typography>
              <Chip
                label={typeLabels[orderType] || orderType}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 'bold', borderRadius: 1 }}
              />
            </div>

            <Stack 
              spacing={1} 
              sx={{ 
                maxHeight: 380, 
                overflowY: 'auto', 
                pr: 0.5,
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
              }}
            >
              {items.map((item, idx) => {
                // Robust image path resolution
                const productObj = typeof item.productId === 'object' ? item.productId : null;
                const imgSource = productObj?.imageUrl || productObj?.imageURL;

                return (
                  <Box key={idx} className="bg-cardsBG/30 p-3 rounded-xl border border-border flex items-center gap-4">
                    <div className="w-12 h-12 bg-card rounded-lg border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {imgSource ? (
                        <img src={imgSource} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <RestaurantMenuIcon sx={{ color: "var(--muted)", opacity: 0.3, fontSize: 24 }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ color: "var(--fg)", lineHeight: 1.2 }}>
                            {item.name}
                          </Typography>
                          <div className="flex items-center gap-2 mt-1">
                            <Typography variant="caption" fontWeight="bold" sx={{ color: "primary.main", bgcolor: "primary.main" + "10", px: 1, py: 0.2, borderRadius: 0.5 }}>
                              {item.variant?.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "var(--muted)" }}>
                              x{item.quantity} • ₹{item.variant?.price}
                            </Typography>
                          </div>
                        </div>
                        <Typography variant="subtitle2" fontWeight="900" sx={{ color: "var(--fg)", shrink: 0 }}>
                          ₹{(item.variant?.price + (item.addOns?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                        </Typography>
                      </div>

                      {item.addOns?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.addOns.map((addon, aIdx) => (
                            <span
                              key={aIdx}
                              className="text-[10px] font-medium text-[var(--muted)] bg-white/70 border border-border px-2 py-0.5 rounded-full"
                            >
                              + {addon.name} (₹{addon.price})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* RIGHT: Summary & Customer Details - Professional Styling */}
          <Box className="flex-1 p-4 sm:p-5 bg-cardsBG/10 flex flex-col gap-5">

            {/* 1. Pricing Summary */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: "var(--muted)", textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 0.5 }}>
                <PaymentsIcon sx={{ fontSize: 16, color: "primary.main" }} />
                Billing Summary
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: "var(--card)", border: '1px solid var(--border)' }}>
                <Stack spacing={1.5}>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>Subtotal</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)" }}>₹{subTotal}</Typography>
                  </div>
                  {additionalDiscount > 0 && (
                    <div className="flex justify-between items-center text-error">
                      <Typography variant="body2">Additional Discount</Typography>
                      <Typography variant="body2" fontWeight="bold">-₹{additionalDiscount}</Typography>
                    </div>
                  )}
                  <Divider sx={{ borderStyle: "dotted", my: 0.5 }} />
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "var(--fg)" }}>Grand Total</Typography>
                    <Typography variant="h5" fontWeight="900" color="primary">₹{totalAmount}</Typography>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-2">
                    {payments?.cashAmount > 0 && (
                      <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'green' }}>CASH: ₹{payments.cashAmount}</Typography>
                      </div>
                    )}
                    {payments?.onlineAmount > 0 && (
                      <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'blue' }}>ONLINE: ₹{payments.onlineAmount}</Typography>
                      </div>
                    )}
                  </div>
                </Stack>
              </Paper>
            </Box>

            {/* 2. Customer Details */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: "var(--muted)", textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 0.5 }}>
                <PersonIcon sx={{ fontSize: 16, color: "primary.main" }} />
                Customer Identity
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: "var(--card)", border: '1px solid var(--border)' }}>
                <Stack spacing={1.5}>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>Customer Name</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)" }}>{customerName || "Walk-in Guest"}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>Mobile Number</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)" }}>{customerMobile || "Not Provided"}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2" sx={{ color: "var(--muted)" }}>Service Mode</Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "primary.main" }}>{typeLabels[orderType] || orderType}</Typography>
                  </div>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
