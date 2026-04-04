"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Stack,
  Slider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";

export default function OrdersFilterDrawer({ open, onClose, filters, onApply, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: { xs: '100%', sm: 380 }, bgcolor: "var(--card)" } }}
      >
        <Box sx={{ p: 2, h: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box className="flex justify-between items-center mb-3">
            <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)" }}>
              Filter Orders
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: "var(--muted)" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3, borderColor: 'var(--border)' }} />

          {/* Form Content */}
          <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }} className="no-scrollbar">
            <Stack spacing={2.5}>

              {/* Status */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'var(--muted)' }}>Order Status</InputLabel>
                <Select
                  value={localFilters.status || ""}
                  label="Order Status"
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              {/* Order Type */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'var(--muted)' }}>Order Type</InputLabel>
                <Select
                  value={localFilters.orderType || ""}
                  label="Order Type"
                  onChange={(e) => handleChange("orderType", e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="dinein">Dine-in</MenuItem>
                  <MenuItem value="homeDelivery">Home Delivery</MenuItem>
                  <MenuItem value="packing">Packing</MenuItem>
                </Select>
              </FormControl>

              {/* Payment Mode */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'var(--muted)' }}>Payment Mode</InputLabel>
                <Select
                  value={localFilters.paymentMode || ""}
                  label="Payment Mode"
                  onChange={(e) => handleChange("paymentMode", e.target.value)}
                >
                  <MenuItem value="">All Modes</MenuItem>
                  <MenuItem value="cash">Full Cash</MenuItem>
                  <MenuItem value="online">Full Online</MenuItem>
                  <MenuItem value="mix">Mixed (Cash + Online)</MenuItem>
                </Select>
              </FormControl>

              {/* Payment Status */}
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'var(--muted)' }}>Payment Status</InputLabel>
                <Select
                  value={localFilters.paymentStatus || ""}
                  label="Payment Status"
                  onChange={(e) => handleChange("paymentStatus", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="not_paid">Not Paid</MenuItem>
                </Select>
              </FormControl>

              {/* Date Filters */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)", mb: 1.5 }}>
                  Date Range
                </Typography>
                <Stack spacing={2}>
                  <DatePicker
                    label="From Date"
                    value={localFilters.fromDate ? new Date(localFilters.fromDate) : null}
                    onChange={(val) => handleChange("fromDate", val ? format(val, "yyyy-MM-dd") : "")}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="To Date"
                    value={localFilters.toDate ? new Date(localFilters.toDate) : null}
                    onChange={(val) => handleChange("toDate", val ? format(val, "yyyy-MM-dd") : "")}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Stack>
              </Box>

              {/* Amount Range */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)", mb: 1.5 }}>
                  Amount Range (₹)
                </Typography>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Min"
                    size="small"
                    type="number"
                    value={localFilters.minAmount || ""}
                    onChange={(e) => handleChange("minAmount", e.target.value)}
                  />
                  <TextField
                    label="Max"
                    size="small"
                    type="number"
                    value={localFilters.maxAmount || ""}
                    onChange={(e) => handleChange("maxAmount", e.target.value)}
                  />
                </Stack>
              </Box>

            </Stack>
          </Box>

          {/* Footer Actions */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid var(--border)' }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleApply}
                sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
}
