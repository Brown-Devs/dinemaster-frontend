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
      <div className="flex justify-between items-center mb-4 gap-4 mt-3 px-1">
        <div className="space-y-0.5">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
            Coffee Zone Dashboard
          </h2>
          <p className="text-xs md:text-sm text-muted font-medium">
            Welcome back, {user?.name}
          </p>
        </div>

        <Tooltip title="Refresh everything">
          <button
            onClick={() => refetchAll()}
            className="p-2.5 bg-card border border-border rounded-md transition-all active:opacity-80"
          >
            <RefreshCw size={18} className="text-foreground" />
          </button>
        </Tooltip>
      </div>

      <div className="space-y-5">
        {/* Top Summary Metrics */}
        <section>
          <DashboardSummary />
        </section>

        {/* Visual Trends & Growth */}
        <section>
          <div className="flex items-center gap-3 mb-4 px-1">
            <h3 className="text-lg md:text-xl font-black tracking-tighter text-foreground">Growth & Trends</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <DashboardCharts />
        </section>
      </div>
    </InnerDashboardLayout>
  );
}
