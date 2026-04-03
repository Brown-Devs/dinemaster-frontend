import React from 'react';
import InnerDashboardLayout from '@/components/dashboard/InnerDashboardLayout';
import { Skeleton, Box, Typography } from '@mui/material';

export default function Loading() {
    return (
        <InnerDashboardLayout>
            {/* Header Skeleton */}
            <div className="mb-0 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Companies</h2>
                    <p className="text-gray-500 text-base">Manage companies and billing. add new entries and search quickly.</p>
                </div>
                <div className="flex gap-3">
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5 w-full mb-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" width="100%" height={120} sx={{ borderRadius: 4 }} />
                ))}
            </div>

            {/* Table Section Skeleton */}
            <div className="bg-card p-6 border border-border rounded-xl">
                <div className="mb-5">
                    <Skeleton variant="text" width={250} height={40} />
                    <Skeleton variant="text" width={400} height={20} />
                </div>

                {/* Search + Filters Skeleton */}
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: '7px', flex: 1 }} />
                    <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: '7px' }} />
                    <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
                </div>

                <div className="mt-4">
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 1 }} />
                </div>
            </div>
        </InnerDashboardLayout>
    );
}
