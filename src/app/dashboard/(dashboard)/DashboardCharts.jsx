"use client";
import React from 'react';
import EarningsTrendChart from './components/EarningsTrendChart';
import OrderVolumeChart from './components/OrderVolumeChart';
import CustomerGrowthChart from './components/CustomerGrowthChart';

export default function DashboardCharts() {
  return (
    <div className="space-y-4 mt-4">
      {/* Revenue & Growth Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <EarningsTrendChart />
        <CustomerGrowthChart />
      </div>

      {/* Orders Volume - Dedicated wide section */}
      <div className="grid grid-cols-1">
        <OrderVolumeChart />
      </div>
    </div>
  );
}
