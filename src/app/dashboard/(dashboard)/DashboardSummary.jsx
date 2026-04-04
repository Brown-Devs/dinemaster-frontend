"use client";
import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDashboard } from '@/hooks/useDashboard';
import StatCard from './StatCard';
import {
  IndianRupee,
  ShoppingBasket,
  UserPlus,
  CreditCard,
  Wallet,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { formatDate_DD_MMM_YYYY } from '@/lib/services/dateFormat';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function DashboardSummary() {
  const { useEarningsSummary, useOrdersSummary, useCustomersSummary } = useDashboard();

  // Shared date range for summary (Default: Today)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  });

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
  const earningsExtra = (
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
  );

  // Formatted sub-stats for Orders
  const ordersExtra = (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {orders.byOrderType?.map((type) => (
        <div key={type._id} className="flex items-center gap-1">
          <span className="text-[13px] capitalize font-semibold text-white/50">{type._id}:</span>
          <span className="text-[13px] font-semibold">{type.count}</span>
        </div>
      ))}
    </div>
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${earnings.totalAmount || 0}`,
      subtitle: `${formatDate_DD_MMM_YYYY(dateRange.from)} - ${formatDate_DD_MMM_YYYY(dateRange.to)}`,
      Icon: IndianRupee,
      bgGradient: "bg-linear-to-r from-[#0ea5e9] to-[#2563eb]",
      loading: earningsQ.isLoading,
      extraContent: earningsExtra
    },
    {
      title: "Total Orders",
      value: orders.total || 0,
      subtitle: "Completed & Pending",
      Icon: ShoppingBasket,
      bgGradient: "bg-linear-to-r from-[#8b5cf6] to-[#7c3aed]",
      loading: ordersQ.isLoading,
      extraContent: ordersExtra
    },
    {
      title: "New Customers",
      value: customers.newCustomers || 0,
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
      <div className="flex items-center justify-between p-5 border-b border-border bg-card">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-xl font-extrabold tracking-tighter text-foreground">Quick Summary</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-card2 rounded-full border border-border">
            <span className="text-[10px] font-black text-muted tracking-tight">Period:</span>
            <span className="text-[11px] font-bold text-foreground">
              {formatDate_DD_MMM_YYYY(dateRange.from)} <span className="text-muted ml-2 mr-2">→</span> {formatDate_DD_MMM_YYYY(dateRange.to)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="flex items-center gap-2 bg-card2 p-1.5 rounded-xl border border-border">
              <DatePicker
                label="From"
                format="dd/MM/yyyy"
                value={dateRange.from}
                onChange={(val) => setDateRange(prev => ({ ...prev, from: val }))}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: {
                      width: 150,
                      '& .MuiInput-root': { color: 'var(--fg)', '&:before': { borderBottom: 'none' }, '&:after': { borderBottom: 'none' } },
                      '& .MuiInputLabel-root': { color: 'var(--muted)', fontSize: '0.75rem' }
                    }
                  }
                }}
              />
              <div className="w-px h-6 bg-border mx-1" />
              <DatePicker
                label="To"
                format="dd/MM/yyyy"
                value={dateRange.to}
                onChange={(val) => setDateRange(prev => ({ ...prev, to: val }))}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: {
                      width: 150,
                      '& .MuiInput-root': { color: 'var(--fg)', '&:before': { borderBottom: 'none' }, '&:after': { borderBottom: 'none' } },
                      '& .MuiInputLabel-root': { color: 'var(--muted)', fontSize: '0.75rem' }
                    }
                  }
                }}
              />
            </div>
          </LocalizationProvider>
          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => setDateRange({ from: new Date(), to: new Date() })}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1,
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
