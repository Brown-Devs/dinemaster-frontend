"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function KitchenLoading() {
  return (
    <InnerDashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8 gap-4 mt-2">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Kitchen Display
            </h1>
            <p className="text-muted font-medium tracking-tight">
              Loading active orders for the kitchen...
            </p>
          </div>
        </div>

        {/* Loading Content Container */}
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
            Syncing orders...
          </Typography>
        </div>
      </div>
    </InnerDashboardLayout>
  );
}
