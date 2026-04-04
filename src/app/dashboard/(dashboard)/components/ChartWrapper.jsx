"use client";
import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Skeleton, Box } from '@mui/material';
import { RefreshCw, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

export default function ChartWrapper({ title, icon: Icon, children, dateRange, onDateChange, loading, onReset }) {
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 flex flex-col h-[450px] transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-card2 rounded-xl border border-border text-muted transition-colors">
            <Icon size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tighter">{title}</h3>
            <p className="text-[12px] text-muted tracking-tight">Trends and Insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
                  onChange={(val) => { if (val) { onDateChange('from', val); setOpenFrom(false); } }}
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
                  onChange={(val) => { if (val) { onDateChange('to', val); setOpenTo(false); } }}
                  slotProps={{ textField: { sx: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, padding: 0, pointerEvents: 'none' } } }}
                />
              </LocalizationProvider>
            </div>
          </div>
          <button
            onClick={onReset}
            className="p-2.5 hover:bg-card2 rounded-xl text-muted hover:text-foreground border border-border transition-all"
            title="Reset dates"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 bg-transparent rounded-xl relative">
        {loading ? (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2, bgcolor: 'var(--card2)' }} />
          </Box>
        ) : children}
      </div>
    </div>
  );
}
