"use client";
import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDashboard } from '@/hooks/useDashboard';
import StatCard from './StatCard';
import { usePermissions } from '@/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/constants';
import {
  IndianRupee,
  ShoppingBasket,
  UserPlus,
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock,
  ChevronRight,
  CalendarDays
} from 'lucide-react';
import { format } from 'date-fns';
import { formatDate_DD_MMM_YYYY } from '@/lib/services/dateFormat';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function DashboardSummary() {
  const { checkPermission } = usePermissions();
  const { useEarningsSummary, useOrdersSummary, useCustomersSummary } = useDashboard();

  // Shared date range for summary (Default: Today)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  });
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const formatParam = (date) => date ? format(date, 'yyyy-MM-dd') : undefined;

  const summaryParams = {
    from: formatParam(dateRange.from),
    to: formatParam(dateRange.to)
  };

  const earningsQ = useEarningsSummary(summaryParams);
  const ordersQ = useOrdersSummary(summaryParams);
  const customersQ = useCustomersSummary(summaryParams);

  const earnings = earningsQ.data?.data || {};
  const orders = ordersQ.data?.data || {};
  const customers = customersQ.data?.data || {};

  // Formatted sub-stats for Earnings
  const earningsExtra = checkPermission(PERMISSIONS.BILLING_VIEW) ? (
    <>
      <div className="flex items-center gap-1.5">
        <Wallet size={12} className="text-white/60" />
        <span className="text-[13px] capitalize font-semibold">Cash: ₹{earnings.cashAmount || 0}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CreditCard size={12} className="text-white/60" />
        <span className="text-[13px] capitalize font-semibold">Online: ₹{earnings.onlineAmount || 0}</span>
      </div>
    </>
  ) : null;

  // Formatted sub-stats for Orders
  const ordersExtra = checkPermission(PERMISSIONS.ORDERS_VIEW) ? (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {orders.byOrderType?.map((type) => (
        <div key={type._id} className="flex items-center gap-1">
          <span className="text-[13px] capitalize font-semibold text-white/50">{type._id}:</span>
          <span className="text-[13px] font-semibold">{type.count}</span>
        </div>
      ))}
    </div>
  ) : null;

  const stats = [
    {
      title: "Total Revenue",
      value: checkPermission(PERMISSIONS.BILLING_VIEW) ? `₹${earnings.totalAmount || 0}` : "₹ ****",
      subtitle: `${formatDate_DD_MMM_YYYY(dateRange.from)} - ${formatDate_DD_MMM_YYYY(dateRange.to)}`,
      Icon: IndianRupee,
      bgGradient: "bg-linear-to-r from-[#0ea5e9] to-[#2563eb]",
      loading: earningsQ.isLoading,
      extraContent: earningsExtra
    },
    {
      title: "Total Orders",
      value: checkPermission(PERMISSIONS.ORDERS_VIEW) ? (orders.total || 0) : "****",
      subtitle: "Completed & Pending",
      Icon: ShoppingBasket,
      bgGradient: "bg-linear-to-r from-[#8b5cf6] to-[#7c3aed]",
      loading: ordersQ.isLoading,
      extraContent: ordersExtra
    },
    {
      title: "New Customers",
      value: checkPermission(PERMISSIONS.CUSTOMERS_VIEW) ? (customers.newCustomers || 0) : "****",
      subtitle: "Registered today",
      Icon: UserPlus,
      bgGradient: "bg-linear-to-r from-[#10b981] to-[#059669]",
      loading: customersQ.isLoading,
      extraContent: null
    }
  ];

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center gap-4 p-4 md:p-5 border-b border-border bg-card">
        {/* Title Row */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-lg md:text-xl font-extrabold tracking-tighter text-foreground">Quick Summary</h3>
          </div>
        </div>

        {/* Date Pickers Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-card2 p-1 rounded-lg border border-border">
            <div className="relative flex">
              <button
                onClick={() => setOpenFrom(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-card transition-colors active:scale-95"
              >
                <CalendarDays size={14} className="text-muted" />
                <div className="flex flex-col items-start leading-[1.1]">
                  <span className="text-[8px] text-muted font-bold uppercase tracking-widest">From</span>
                  <span className="text-[11px] font-extrabold text-foreground tracking-tight">{format(dateRange.from, 'dd/MM/yyyy')}</span>
                </div>
              </button>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  open={openFrom}
                  onClose={() => setOpenFrom(false)}
                  value={dateRange.from}
                  onChange={(val) => { if (val) { setDateRange(prev => ({ ...prev, from: val })); setOpenFrom(false); } }}
                  slotProps={{ textField: { sx: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, padding: 0, pointerEvents: 'none' } } }}
                />
              </LocalizationProvider>
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            <div className="relative flex">
              <button
                onClick={() => setOpenTo(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-card transition-colors active:scale-95"
              >
                <CalendarDays size={14} className="text-muted" />
                <div className="flex flex-col items-start leading-[1.1]">
                  <span className="text-[8px] text-muted font-bold uppercase tracking-widest">To</span>
                  <span className="text-[11px] font-extrabold text-foreground tracking-tight">{format(dateRange.to, 'dd/MM/yyyy')}</span>
                </div>
              </button>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  open={openTo}
                  onClose={() => setOpenTo(false)}
                  value={dateRange.to}
                  onChange={(val) => { if (val) { setDateRange(prev => ({ ...prev, to: val })); setOpenTo(false); } }}
                  slotProps={{ textField: { sx: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, padding: 0, pointerEvents: 'none' } } }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshIcon sx={{ fontSize: '16px !important' }} />}
            onClick={() => setDateRange({ from: new Date(), to: new Date() })}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '12px',
              px: 2,
              py: 0.8,
              bgcolor: 'var(--card)',
              color: 'var(--fg)',
              boxShadow: 'none',
              border: '1px solid var(--border)',
              '&:hover': { bgcolor: 'var(--card2)', boxShadow: 'none' }
            }}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Grid for Stat Cards */}
      <div className="p-5 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}
