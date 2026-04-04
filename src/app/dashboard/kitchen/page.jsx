"use client";

import React, { useState, useEffect, useRef } from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useOrders } from "@/hooks/admin/useOrders";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { RefreshCw, UtensilsCrossed, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import OrderCard from "./components/OrderCard";

export default function KitchenPage() {
  const { kitchenOrdersQuery } = useOrders();

  const [statusTab, setStatusTab] = useState("new");
  const [typeFilter, setTypeFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    data,
    isLoading,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = kitchenOrdersQuery({
    status: statusTab,
    orderType: typeFilter,
    date: format(selectedDate, "yyyy-MM-dd"),
    limit: 10,
  });

  // Flatten all pages into a single orders array
  const orders = data?.pages?.flatMap((page) => page?.data?.orders || []) || [];
  const counts = data?.pages?.[0]?.data?.counts || { dinein: 0, delivery: 0, packing: 0 };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => refetch(), 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Infinite scroll sentinel
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);



  // Display date label
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const selectedStr = format(selectedDate, "yyyy-MM-dd");
  const isToday = selectedStr === todayStr;
  const dateLabel = isToday ? "Today" : format(selectedDate, "dd MMM yyyy");

  const chipStyles = {
    dinein: {
      active: "bg-amber-500 text-white border-amber-500",
      badge: "bg-amber-600/30 text-white",
      inactive: "border-amber-200 text-amber-700 bg-amber-50",
      badgeInactive: "bg-amber-100 text-amber-700",
    },
    delivery: {
      active: "bg-blue-500 text-white border-blue-500",
      badge: "bg-blue-600/30 text-white",
      inactive: "border-blue-200 text-blue-700 bg-blue-50",
      badgeInactive: "bg-blue-100 text-blue-700",
    },
    packing: {
      active: "bg-emerald-500 text-white border-emerald-500",
      badge: "bg-emerald-600/30 text-white",
      inactive: "border-emerald-200 text-emerald-700 bg-emerald-50",
      badgeInactive: "bg-emerald-100 text-emerald-700",
    },
  };

  const typeChips = [
    { label: "Dine-in", value: "dinein", count: counts.dinein || 0 },
    { label: "Delivery", value: "delivery", count: counts.delivery || 0 },
    { label: "Packing", value: "packing", count: counts.packing || 0 },
  ];

  return (
    <InnerDashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 mt-3 px-1">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-foreground">
            Kitchen Display
          </h1>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">
            {dateLabel}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(val) => { if (val) { setSelectedDate(val); setCalendarOpen(false); } }}
              open={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              slotProps={{
                textField: { sx: { display: "none" } },
              }}
            />
          </LocalizationProvider>
          <Tooltip title="Select Date">
            <IconButton
              onClick={() => setCalendarOpen(true)}
              className="rounded-md border border-border bg-card"
              sx={{ p: 1 }}
            >
              <CalendarDays size={16} className="text-foreground" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-md border border-border bg-card"
              sx={{ p: 1 }}
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin text-primary" : "text-foreground"} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-border mb-4">
        {["new", "prepared"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setStatusTab(tab); setTypeFilter(null); }}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider text-center transition-colors ${statusTab === tab
              ? "text-foreground border-b-2 border-foreground"
              : "text-muted"
              }`}
          >
            {tab === "new" ? "New Orders" : "Prepared"}
          </button>
        ))}
      </div>

      {/* Type Chips with Counts (colored) */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar px-1">
        {typeChips.map((chip) => {
          const style = chipStyles[chip.value];
          const isActive = typeFilter === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => setTypeFilter(isActive ? null : chip.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${isActive ? style.active : style.inactive
                }`}
            >
              {chip.label}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isActive ? style.badge : style.badgeInactive
                }`}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {orders.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center h-[40vh] bg-card rounded-md border border-dashed border-border text-center p-6">
          <UtensilsCrossed size={36} className="text-muted opacity-20 mb-3" />
          <p className="text-sm font-black tracking-tighter text-foreground">No orders here</p>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">
            {statusTab === "new" ? "All caught up!" : "No prepared orders yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              showPrepareAction={statusTab === "new"}
              onStatusUpdated={refetch}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && (
          <CircularProgress size={24} sx={{ color: "var(--muted)" }} />
        )}
        {!hasNextPage && orders.length > 0 && (
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
            All orders loaded
          </p>
        )}
      </div>
    </InnerDashboardLayout>
  );
}
