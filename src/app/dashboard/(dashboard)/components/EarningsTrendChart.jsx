"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import ChartWrapper from './ChartWrapper';

export default function EarningsTrendChart() {
  const { useEarningsChart } = useDashboard();
  const initialRange = { from: startOfMonth(new Date()), to: new Date() };
  const [dateRange, setDateRange] = useState(initialRange);

  const formatParam = (date) => date ? format(date, 'yyyy-MM-dd') : undefined;
  const { data, isLoading, isRefetching, refetch } = useEarningsChart({ 
    from: formatParam(dateRange.from), 
    to: formatParam(dateRange.to) 
  });

  return (
    <ChartWrapper 
      title="Revenue Trend" 
      icon={TrendingUp}
      dateRange={dateRange}
      onDateChange={(key, val) => setDateRange(prev => ({ ...prev, [key]: val }))}
      onReset={() => setDateRange(initialRange)}
      onRefetch={refetch}
      loading={isLoading}
      isRefetching={isRefetching}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data?.data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="_id" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'var(--muted)' }} 
            minTickGap={30}
            tickFormatter={(str) => {
              try {
                return format(new Date(str), 'MMM dd');
              } catch (e) {
                return str;
              }
            }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--fg)' }}
            itemStyle={{ fontSize: '12px' }}
            labelFormatter={(label) => {
              try {
                return format(new Date(label), 'PPP');
              } catch (e) {
                return label;
              }
            }}
          />
          <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
          <Area type="monotone" dataKey="online" stroke="#3b82f6" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
          <Area type="monotone" dataKey="cash" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
