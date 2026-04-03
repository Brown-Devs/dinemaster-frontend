import React from 'react';
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { Skeleton, Box, Typography } from "@mui/material";

export default function Loading() {
    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between flex-col sm:flex-row gap-3">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Sub Admins</h2>
                    <p className="text-gray-500 text-base">Manage Sub Admins - create and update their profile.</p>
                </div>
                <div className="flex gap-3 justify-start w-full sm:w-auto">
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mt-5 w-full mb-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" width="100%" height={120} sx={{ borderRadius: 4 }} />
                ))}
            </div>

            {/* List Section Skeleton */}
            <div className="bg-card p-3 sm:p-6 border border-border rounded-xl w-full">
                <div className="mb-5">
                    <Skeleton variant="text" width={250} height={32} />
                    <Skeleton variant="text" width={350} height={20} />
                </div>

                {/* Search + Filter Skeleton */}
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: '7px', flex: 1 }} />
                    <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                        <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: '7px' }} />
                        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                    </div>
                </div>

                <div className="mt-4">
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                </div>
            </div>
        </InnerDashboardLayout>
    );
}
