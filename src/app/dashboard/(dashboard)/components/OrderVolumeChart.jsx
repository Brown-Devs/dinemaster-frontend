"use client";
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, startOfMonth } from 'date-fns';
import { ShoppingBag } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import ChartWrapper from './ChartWrapper';

export default function OrderVolumeChart() {
  const { useOrdersChart } = useDashboard();
  const initialRange = { from: startOfMonth(new Date()), to: new Date() };
  const [dateRange, setDateRange] = useState(initialRange);

  const formatParam = (date) => date ? format(date, 'yyyy-MM-dd') : undefined;
  const { data, isLoading, isRefetching, refetch } = useOrdersChart({ 
    from: formatParam(dateRange.from), 
    to: formatParam(dateRange.to) 
  });

  const processedData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(item => {
      const entry = { _id: item._id };
      item.types.forEach(t => { entry[t.type] = t.count; });
      return entry;
    });
  }, [data]);

  return (
    <ChartWrapper 
      title="Order Volume" 
      icon={ShoppingBag}
      dateRange={dateRange}
      onDateChange={(key, val) => setDateRange(prev => ({ ...prev, [key]: val }))}
      onReset={() => setDateRange(initialRange)}
      onRefetch={refetch}
      loading={isLoading}
      isRefetching={isRefetching}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            cursor={{ fill: 'var(--card2)' }}
            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--fg)' }}
            itemStyle={{ fontSize: '11px' }}
            labelFormatter={(label) => {
              try {
                return format(new Date(label), 'PPP');
              } catch (e) {
                return label;
              }
            }}
          />
          <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px' }} />
          <Bar dataKey="dinein" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="delivery" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="packing" fill="#facc15" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
