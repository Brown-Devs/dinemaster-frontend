"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Chip,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import TodayIcon from "@mui/icons-material/Today";
import HistoryIcon from "@mui/icons-material/History";
import PaymentsIcon from "@mui/icons-material/Payments";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useOrders } from "@/hooks/admin/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import OrdersTable from "./components/OrdersTable";
import OrdersFilterDrawer from "./components/OrdersFilterDrawer";
import { UpdateStatusDialog } from "./components/UpdateStatusDialog";
import { UpdatePaymentDialog } from "./components/UpdatePaymentDialog";
import { format, subDays } from "date-fns";

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ordersQuery } = useOrders();

  // URL State Parsing
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const searchQuery = searchParams.get("searchQuery") || "";
  const status = searchParams.get("status") || "";
  const orderType = searchParams.get("orderType") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";
  const paymentMode = searchParams.get("paymentMode") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const minAmount = searchParams.get("minAmount") || "";
  const maxAmount = searchParams.get("maxAmount") || "";

  // Local Search State
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Drawer / Modal State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState({ open: false, type: null, order: null });
  const [viewModal, setViewModal] = useState({ open: false, order: null });

  // Sync Search Input with URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      updateURL({ searchQuery: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const updateURL = (newVals) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newVals).forEach(([key, val]) => {
      if (val === undefined || val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.replace(`?${params.toString()}`);
  };

  // Quick Filters
  const handleTodayOrders = () => {
    const now = format(new Date(), "yyyy-MM-dd");
    updateURL({ fromDate: now, toDate: now, page: 1 });
  };

  const handleYesterdayOrders = () => {
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    updateURL({ fromDate: yesterday, toDate: yesterday, page: 1 });
  };

  const handleUnpaidOrders = () => {
    updateURL({ paymentStatus: "not_paid", page: 1 });
  };

  const currentFilters = useMemo(() => ({
    page,
    limit,
    searchQuery,
    status,
    orderType,
    paymentStatus,
    paymentMode,
    fromDate,
    toDate,
    minAmount,
    maxAmount
  }), [searchParams]);

  const ordersData = ordersQuery(currentFilters);
  const apiData = ordersData.data?.data || { orders: [], totalCount: 0 };
  console.log(apiData.orders)
  const handleOpenStatus = (order) => setUpdateModal({ open: true, type: 'status', order });
  const handleOpenPayment = (order) => setUpdateModal({ open: true, type: 'payment', order });
  const handleViewDetails = (order) => setViewModal({ open: true, order });

  return (
    <InnerDashboardLayout>
      <Box sx={{ mb: 4, mt: 2 }}>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Order Management</h1>
            <p style={{ color: "var(--muted)" }}>
              Search, filter, and manage all your restaurant bookings and sales.
            </p>
          </div>
          <IconButton onClick={() => ordersData.refetch()} sx={{ bgcolor: "var(--cardsBG)", border: "1px solid var(--border)" }}>
            <RefreshIcon sx={{ color: "var(--muted)" }} />
          </IconButton>
        </div>

        {/* Quick Filters */}
        <Stack direction="row" spacing={2} sx={{ mt: 4, flexWrap: "wrap", gap: 1 }}>
          <Button
            variant={fromDate === format(new Date(), "yyyy-MM-dd") ? "contained" : "outlined"}
            startIcon={<TodayIcon />}
            onClick={handleTodayOrders}
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Today's Orders
          </Button>
          <Button
            variant={fromDate === format(subDays(new Date(), 1), "yyyy-MM-dd") ? "contained" : "outlined"}
            startIcon={<HistoryIcon />}
            onClick={handleYesterdayOrders}
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Yesterday
          </Button>
          <Button
            variant={paymentStatus === "not_paid" ? "contained" : "outlined"}
            startIcon={<PaymentsIcon />}
            onClick={handleUnpaidOrders}
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Unpaid Orders
          </Button>

          {(status || orderType || paymentStatus || paymentMode || fromDate || toDate) && (
            <Button
              variant="text"
              onClick={() => router.replace('?')}
              color="error"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Clear All Filters
            </Button>
          )}
        </Stack>
      </Box>

      {/* Main Content Card */}
      <Box className="bg-card p-4 sm:p-6 border border-border rounded-2xl shadow-sm space-y-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TextField
            size="small"
            placeholder="Search by name, mobile or amount..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ width: { xs: "100%", sm: 350 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--muted)", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setIsFilterOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', color: "var(--muted)", borderColor: "var(--border)" }}
          >
            Advanced Filters
          </Button>
        </div>

        {/* Table */}
        <OrdersTable
          orders={apiData.orders || []}
          total={apiData.totalCount || 0}
          loading={ordersData.isLoading}
          page={page}
          limit={limit}
          onPageChange={(p) => updateURL({ page: p })}
          setLimit={(l) => updateURL({ limit: l, page: 1 })}
          onUpdateStatus={handleOpenStatus}
          onUpdatePayment={handleOpenPayment}
          onViewDetails={handleViewDetails}
        />

      </Box>

      {/* Filter Drawer */}
      <OrdersFilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={currentFilters}
        onApply={(newFilters) => updateURL({ ...newFilters, page: 1 })}
        onReset={() => router.replace('?')}
      />

      {/* Update Dialogs */}
      {updateModal.open && updateModal.type === 'status' && updateModal.order && (
        <UpdateStatusDialog
          open={true}
          onClose={() => setUpdateModal({ ...updateModal, open: false })}
          order={updateModal.order}
        />
      )}

      {updateModal.open && updateModal.type === 'payment' && updateModal.order && (
        <UpdatePaymentDialog
          open={true}
          onClose={() => setUpdateModal({ ...updateModal, open: false })}
          order={updateModal.order}
        />
      )}

    </InnerDashboardLayout>
  );
}
