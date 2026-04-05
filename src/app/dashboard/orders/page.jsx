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
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders } from "@/hooks/admin/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import OrdersTable from "./components/OrdersTable";
import OrdersFilterDrawer from "./components/OrdersFilterDrawer";
import { UpdateStatusDialog } from "./components/UpdateStatusDialog";
import { UpdatePaymentDialog } from "./components/UpdatePaymentDialog";
import { ViewOrderDialog } from "./components/ViewOrderDialog";
import { format, subDays } from "date-fns";
import OrdersSummary from "./components/OrdersSummary";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS, MODULES } from "@/lib/constants";
import PermissionDenied from "@/components/shared/PermissionDenied";

export default function OrdersPage() {
  const { isModuleEnabled, checkPermission } = usePermissions();

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

  // Persistent Collapse State for Statistics
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dinemaster_orders_stats_expanded');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('dinemaster_orders_stats_expanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

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

  const hasAccess = isModuleEnabled(MODULES.ORDERS) && checkPermission(PERMISSIONS.ORDERS_VIEW);
  if (!hasAccess) return <PermissionDenied />;

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

  // Use QueryClient to selectively refetch stats
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    ordersData.refetch();
    if (isExpanded) {
      queryClient.invalidateQueries({ queryKey: ["orders", "stats"] });
    }
  };

  const handleOpenStatus = (order) => setUpdateModal({ open: true, type: 'status', order });
  const handleOpenPayment = (order) => setUpdateModal({ open: true, type: 'payment', order });
  const handleViewDetails = (order) => setViewModal({ open: true, order });

  return (
    <InnerDashboardLayout>
      <Box sx={{ mb: 2, mt: 1 }}>
        <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Order Management</h1>
            <p style={{ color: "var(--muted)" }}>
              Search, filter, and manage all your restaurant bookings and sales.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip title="Refresh Everything">
              <IconButton 
                onClick={handleRefresh} 
                sx={{ 
                  bgcolor: "var(--cardsBG)", 
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  transition: "all 0.2s",
                  "&:hover": { transform: "rotate(45deg)", color: "var(--primary)" }
                }}
              >
                <RefreshIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={isExpanded ? "Collapse Summary" : "Expand Summary"}>
              <IconButton 
                onClick={() => setIsExpanded(!isExpanded)} 
                sx={{ 
                  bgcolor: "var(--cardsBG)", 
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem"
                }}
              >
                {isExpanded ? <ChevronUpIcon sx={{ fontSize: 20 }} /> : <ChevronDownIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Statistics Summary Section */}
        <OrdersSummary isExpanded={isExpanded} />

        {/* Clear Filters if any applied */}
        {(status || orderType || paymentStatus || paymentMode || fromDate || toDate) && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              onClick={() => router.replace('?')}
              color="error"
              size="small"
              sx={{ textTransform: 'none' }}
              startIcon={<FilterListIcon />}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
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

      {viewModal.open && viewModal.order && (
        <ViewOrderDialog
          open={true}
          onClose={() => setViewModal({ ...viewModal, open: false })}
          order={viewModal.order}
        />
      )}

    </InnerDashboardLayout>
  );
}
