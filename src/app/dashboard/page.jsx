// app/company/dashboard/page.jsx
"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { MODULES } from "@/lib/constants";
import { usePermissions } from "@/hooks/usePermissions";
import AccessDenied from "@/components/shared/AccessDenied";

export default function CompanyDashboardPage() {
  const { user } = useAuthStore();

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
      {/* Header with refresh */}
      <div className="flex justify-between items-center mb-5 mt-2 gap-6">
        <div>
          <h2 className="text-3xl font-bold max-[450px]:text-2xl">Dashboard</h2>
          <p className="text-gray-600 text-base mt-1 max-[450px]:text-xs">
            Welcome to Dine Master panel. Real-time insights into your sales
            pipeline
          </p>
        </div>
      </div>


    </InnerDashboardLayout>
  );
}
