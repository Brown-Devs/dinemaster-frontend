// app/company/dashboard/page.jsx
"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";

export default function CompanyDashboardPage() {

    //   const { isModuleEnabled } = usePermissions();
    //   if (!isModuleEnabled(MODULES.BASE)) {
    //     return (
    //       <InnerDashboardLayout>
    //         <AccessDenied
    //           title="Access disabled"
    //           description="Your organization is not allowed to access this."
    //         />
    //       </InnerDashboardLayout>
    //     );
    //   }
    return (
        <InnerDashboardLayout>
            {/* Header with refresh */}
            <div className="flex justify-between items-center mb-5 mt-2 gap-6">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Companies</h2>
                    <p className="text-gray-500 text-base">Manage companies and billing. add new entries and search quickly.</p>
                </div>
            </div>


        </InnerDashboardLayout>
    );
}
