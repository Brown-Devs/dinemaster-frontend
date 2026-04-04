"use client";
import React from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function CategoriesLoading() {
  return (
    <InnerDashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8 gap-4 mt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Orders
            </h1>
            <p className="text-muted font-medium tracking-tight">
              Manage orders.
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
            Loading...
          </Typography>
        </div>
      </div>
    </InnerDashboardLayout>
  );
}
