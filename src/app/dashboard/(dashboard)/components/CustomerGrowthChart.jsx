"use client";
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth } from 'date-fns';
import { Users } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import ChartWrapper from './ChartWrapper';

export default function CustomerGrowthChart() {
  const { useCustomersChart } = useDashboard();
  const initialRange = { from: startOfMonth(new Date()), to: new Date() };
  const [dateRange, setDateRange] = useState(initialRange);

  const formatParam = (date) => date ? format(date, 'yyyy-MM-dd') : undefined;
  const { data, isLoading } = useCustomersChart({ 
    from: formatParam(dateRange.from), 
    to: formatParam(dateRange.to) 
  });

  return (
    <ChartWrapper 
      title="Customer Growth" 
      icon={Users}
      dateRange={dateRange}
      onDateChange={(key, val) => setDateRange(prev => ({ ...prev, [key]: val }))}
      onReset={() => setDateRange(initialRange)}
      loading={isLoading}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data?.data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="_id" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: 'var(--muted)' }} 
            minTickGap={30}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--fg)' }}
            itemStyle={{ fontSize: '11px' }}
          />
          <Area type="stepAfter" dataKey="newCustomers" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorCustomers)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
