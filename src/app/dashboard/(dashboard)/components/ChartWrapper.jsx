"use client";
import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Skeleton, Box } from '@mui/material';
import { RefreshCw } from 'lucide-react';

export default function ChartWrapper({ title, icon: Icon, children, dateRange, onDateChange, loading, onReset }) {
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="flex items-center gap-2 bg-card2 p-1 rounded-lg border border-border">
              <DatePicker
                label="From"
                format="dd/MM/yyyy"
                value={dateRange.from}
                onChange={(val) => onDateChange('from', val)}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: {
                      width: 150,
                      '& .MuiInput-root': { color: 'var(--fg)', fontSize: '0.8rem', '&:before': { borderBottom: 'none' }, '&:after': { borderBottom: 'none' } },
                      '& .MuiInputLabel-root': { color: 'var(--muted)', fontSize: '0.65rem' }
                    }
                  }
                }}
              />
              <div className="w-px h-4 bg-border" />
              <DatePicker
                label="To"
                format="dd/MM/yyyy"
                value={dateRange.to}
                onChange={(val) => onDateChange('to', val)}
                slotProps={{
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: {
                      width: 150,
                      '& .MuiInput-root': { color: 'var(--fg)', fontSize: '0.8rem', '&:before': { borderBottom: 'none' }, '&:after': { borderBottom: 'none' } },
                      '& .MuiInputLabel-root': { color: 'var(--muted)', fontSize: '0.65rem' }
                    }
                  }
                }}
              />
            </div>
          </LocalizationProvider>
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
