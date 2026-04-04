"use client";

import React, { useState, useEffect } from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useOrders } from "@/hooks/admin/useOrders";
import { Grid, Box, IconButton, Tooltip, Badge } from "@mui/material";
import { RefreshCw, UtensilsCrossed, AlertTriangle } from "lucide-react";
import OrderCard from "./components/OrderCard";
import OrderDetailsDialog from "./components/OrderDetailsDialog";

export default function KitchenPage() {
  const { ordersQuery, updateOrderMutation } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Filters State
  const [typeFilter, setTypeFilter] = useState("all"); // all, dinein, homeDelivery, packing
  const [statusFilter, setStatusFilter] = useState("new"); // new, prepared

  // Fetch orders based on filters
  const { data, isLoading, refetch, isFetching } = ordersQuery({
    status: statusFilter,
    orderType: typeFilter === "all" ? undefined : typeFilter,
    limit: 100,
    page: 1,
  });

  const orders = data?.data?.orders || [];
  const activeCount = orders.length;

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => refetch(), 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleUpdateStatus = (id, status) => {
    updateOrderMutation.mutate({
      id,
      data: { status },
    }, {
      onSuccess: () => refetch()
    });
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const FilterButton = ({ label, value, current, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-1.5 text-xs font-bold uppercase tracking-tight rounded-md border transition-all ${current === value
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-muted border-border hover:border-foreground/50"
        }`}
    >
      {label}
    </button>
  );

  return (
    <InnerDashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 mt-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
              Kitchen Display
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-black bg-red-500 text-white rounded-md">
                {activeCount}
              </span>
            </h1>
          </div>
          <p className="text-xs text-muted font-bold uppercase tracking-wider">
            Real-time Order Preparation Console
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Order Type Filter Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Order Type</span>
            <div className="flex gap-1">
              <FilterButton label="All" value="all" current={typeFilter} onClick={setTypeFilter} />
              <FilterButton label="Dine-in" value="dinein" current={typeFilter} onClick={setTypeFilter} />
              <FilterButton label="Delivery" value="homeDelivery" current={typeFilter} onClick={setTypeFilter} />
              <FilterButton label="Packing" value="packing" current={typeFilter} onClick={setTypeFilter} />
            </div>
          </div>

          {/* Status Filter Section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Order Status</span>
            <div className="flex gap-1">
              <FilterButton label="New" value="new" current={statusFilter} onClick={setStatusFilter} />
              <FilterButton label="Prepared" value="prepared" current={statusFilter} onClick={setStatusFilter} />
            </div>
          </div>

          <div className="flex items-end">
            <Tooltip title="Refresh Manually">
              <IconButton
                onClick={() => refetch()}
                disabled={isFetching}
                className="rounded-md border border-border bg-card"
                sx={{ p: 1 }}
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin text-primary" : "text-foreground"} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Orders Grid (Tailwind instead of MUI Grid) */}
      {orders.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-card rounded-md border border-border border-dashed p-10 text-center">
          <UtensilsCrossed size={48} className="text-muted opacity-20 mb-4" />
          <h2 className="text-xl font-black tracking-tighter text-foreground uppercase">Clear Horizon</h2>
          <p className="text-xs text-muted font-bold uppercase tracking-widest mt-2">No pending items for the selected filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order) => (
            <div key={order._id}>
              <OrderCard
                order={order}
                isUpdating={updateOrderMutation.isPending && updateOrderMutation.variables?.id === order._id}
                onUpdateStatus={handleUpdateStatus}
                onClick={() => handleOpenDetails(order)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Details Dialog (Safe from pricing) */}
      <OrderDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
      />

      {/* Network Error indicator if needed */}
      {!isLoading && !data && (
        <Box className="fixed bottom-10 right-10 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
          <AlertTriangle size={18} />
          <span className="text-xs font-bold uppercase tracking-tight">API Connection Issue</span>
        </Box>
      )}
    </InnerDashboardLayout>
  );
}
