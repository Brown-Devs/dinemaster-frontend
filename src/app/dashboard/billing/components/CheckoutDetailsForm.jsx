"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  ToggleButtonGroup, 
  ToggleButton, 
  Paper, 
  Grid,
  CircularProgress,
  InputAdornment
} from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCartStore } from "@/stores/useCartStore";
import { useCustomers } from "@/hooks/admin/useCustomers";

export default function CheckoutDetailsForm() {
  const { 
    customerName, setCustomerName,
    customerMobile, setCustomerMobile,
    orderType, setOrderType,
    paymentStatus, setPaymentStatus,
    paymentMode, setPaymentMode,
    payments, setPayments,
    getCartTotal
  } = useCartStore();

  const { customerLookupQuery } = useCustomers();
  const total = getCartTotal();

  // Query for customer lookup
  const { data: customerData, isFetching: isLookingUp } = customerLookupQuery(customerMobile);

  // Auto-fill name if customer found
  useEffect(() => {
    if (customerData?.success && customerData?.data?.customer) {
      setCustomerName(customerData.data.customer.name);
    }
  }, [customerData, setCustomerName]);

  // Mixed payment auto-calculation logic
  const handleCashChange = (val) => {
    const cash = Number(val);
    const online = Math.max(0, total - cash);
    setPayments({ cashAmount: cash, onlineAmount: online });
  };

  const handleOnlineChange = (val) => {
    const online = Number(val);
    const cash = Math.max(0, total - online);
    setPayments({ cashAmount: cash, onlineAmount: online });
  };

  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)", mb: 3 }}>
          Customer Information
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Mobile Number"
            fullWidth
            required
            value={customerMobile}
            onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10 digit number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneIcon sx={{ color: "var(--muted)" }} />
                </InputAdornment>
              ),
              endAdornment: isLookingUp && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Customer Name"
            fullWidth
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon sx={{ color: "var(--muted)" }} />
                </InputAdornment>
              )
            }}
          />
        </div>
      </section>

      {/* Order Settings */}
      <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)", mb: 3 }}>
          Order Details
        </Typography>
        
        <div className="space-y-6">
          {/* Order Type */}
          <div>
            <Typography variant="subtitle2" sx={{ color: "var(--muted)", mb: 1.5 }}>
              Order Type
            </Typography>
            <ToggleButtonGroup
              value={orderType}
              exclusive
              onChange={(e, val) => val && setOrderType(val)}
              fullWidth
              color="primary"
              size="small"
            >
              <ToggleButton value="dinein" sx={{ borderRadius: "12px 0 0 12px", textTransform: 'none', fontWeight: 'bold' }}>
                Dine In
              </ToggleButton>
              <ToggleButton value="packing" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                Packing
              </ToggleButton>
              <ToggleButton value="delivery" sx={{ borderRadius: "0 12px 12px 0", textTransform: 'none', fontWeight: 'bold' }}>
                Delivery
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {/* Payment Status */}
          <div>
            <Typography variant="subtitle2" sx={{ color: "var(--muted)", mb: 1.5 }}>
              Payment Status
            </Typography>
            <ToggleButtonGroup
              value={paymentStatus}
              exclusive
              onChange={(e, val) => val && setPaymentStatus(val)}
              fullWidth
              color="primary"
              size="small"
            >
              <ToggleButton value="not_paid" sx={{ borderRadius: "12px 0 0 12px", textTransform: 'none', fontWeight: 'bold' }}>
                Not Paid
              </ToggleButton>
              <ToggleButton value="paid" sx={{ borderRadius: "0 12px 12px 0", textTransform: 'none', fontWeight: 'bold' }}>
                Paid
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)" }}>
            Payment Mode
          </Typography>
          <div className="bg-primary/10 px-3 py-1 rounded-full">
             <Typography variant="body2" fontWeight="bold" color="primary">
               Total: ₹{total}
             </Typography>
          </div>
        </div>

        <ToggleButtonGroup
          value={paymentMode}
          exclusive
          onChange={(e, val) => val && setPaymentMode(val)}
          fullWidth
          color="primary"
          size="small"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="cash" sx={{ borderRadius: "12px 0 0 12px", textTransform: 'none', fontWeight: 'bold' }}>
            Cash
          </ToggleButton>
          <ToggleButton value="online" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
            Online
          </ToggleButton>
          <ToggleButton value="mix" sx={{ borderRadius: "0 12px 12px 0", textTransform: 'none', fontWeight: 'bold' }}>
            Mix
          </ToggleButton>
        </ToggleButtonGroup>

        {paymentMode === "mix" && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <TextField
              label="Cash Amount"
              type="number"
              fullWidth
              value={payments.cashAmount || ""}
              onChange={(e) => handleCashChange(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <TextField
              label="Online Amount"
              type="number"
              fullWidth
              value={payments.onlineAmount || ""}
              onChange={(e) => handleOnlineChange(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </div>
        )}

        {paymentMode !== "mix" && (
           <div className="p-3 bg-cardsBG rounded-xl border border-dashed border-border flex justify-center">
              <Typography variant="body2" sx={{ color: "var(--muted)" }}>
                 Processing full payment via <span className="text-primary font-bold">{paymentMode.toUpperCase()}</span>
              </Typography>
           </div>
        )}
      </section>
    </div>
  );
}
