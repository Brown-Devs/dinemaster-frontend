"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function BillingLoading() {
  return (
    <InnerDashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8 gap-6">
          <div className="space-y-2 mt-3">
            <h2 className="text-4xl font-black tracking-tighter text-foreground">
              Billing
            </h2>
            <p className="text-muted font-medium flex items-center gap-2 tracking-tight">
              Preparing your point of sale...
            </p>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex flex-col items-center justify-center bg-card rounded-2xl border border-border">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              size={60} 
              thickness={4} 
              sx={{ color: 'var(--fg)', opacity: 0.8 }} 
            />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 3, 
              fontWeight: 'bold', 
              tracking: 'tighter', 
              color: 'var(--muted)' 
            }}
          >
            Loading point of sale...
          </Typography>
        </div>
      </div>
    </InnerDashboardLayout>
  );
}
