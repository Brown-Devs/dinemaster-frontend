"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { MODULES } from "@/lib/constants";
import { usePermissions } from "@/hooks/usePermissions";
import AccessDenied from "@/components/shared/AccessDenied";
import DashboardSummary from "./(dashboard)/DashboardSummary";
import DashboardCharts from "./(dashboard)/DashboardCharts";
import { useDashboard } from "@/hooks/useDashboard";
import { RefreshCw } from "lucide-react";
import { Tooltip, IconButton } from "@mui/material";

export default function CompanyDashboardPage() {
  const { user } = useAuthStore();
  const { refetchAll } = useDashboard();

  const { isModuleEnabled } = usePermissions();
  if (!isModuleEnabled(MODULES.BASE)) {
    return (
      <InnerDashboardLayout>
        <AccessDenied
          title="Access disabled"
          description="Your organization is not allowed to access this."
        />
      </InnerDashboardLayout>
    );
  }

  return (
    <InnerDashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 gap-6">
        <div className="space-y-1 mt-3">
          <h2 className="text-4xl font-bold tracking-tight">
            Dashboard
          </h2>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            Welcome back. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip title="Refresh everything">
            <button
              onClick={() => refetchAll()}
              className="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95 group"
            >
              <RefreshCw size={22} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="space-y-5">
        {/* Top Summary Metrics */}
        <section>
          <DashboardSummary />
        </section>

        {/* Visual Trends & Growth */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Growth & Trends</h3>
            <div className="h-[2px] flex-1 bg-linear-to-r from-gray-200 to-transparent" />
          </div>
          <DashboardCharts />
        </section>
      </div>
    </InnerDashboardLayout>
  );
}
