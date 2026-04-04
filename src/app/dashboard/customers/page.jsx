"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from "@mui/material";
import { Search, RefreshCw, Users as UsersIcon } from "lucide-react";
import { useCustomers } from "@/hooks/admin/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import CustomersTable from "./components/CustomersTable";

export default function CustomersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const searchStr = searchParams.get("searchQuery") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Local State
  const [searchInput, setSearchInput] = useState(searchStr);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { customersQuery } = useCustomers();
  const { data, isLoading, refetch, isFetching } = customersQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const apiData = data?.data || { customers: [], pagination: {} };
  const customers = apiData?.customers || [];
  const total = apiData?.totalCount || 0;

  // Sync Input when URL changes (e.g. back button)
  useEffect(() => {
    setSearchInput(searchStr);
  }, [searchStr]);

  // Update URL on Debounce Output
  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateURL({ searchQuery: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const updateURL = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`?${params.toString()}`);
  };

  return (
    <InnerDashboardLayout>
      {/* Module Header */}
      <div className="flex justify-between items-center mb-6 mt-2 flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-foreground">
              Customers
            </h1>
          </div>
          <p className="text-sm text-muted font-medium flex items-center gap-2">
            View and manage your registered customer base and their order history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip title="Refresh Records">
            <IconButton
              onClick={() => refetch()}
              disabled={isFetching}
              sx={{
                bgcolor: 'var(--card)',
                border: '1px solid var(--border)',
                '&:hover': { bgcolor: 'var(--card2)' }
              }}
            >
              <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <div className="bg-card p-4 sm:p-6 border border-border rounded-2xl space-y-5 transition-all">
          {/* Toolbar with Search and Stats */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-5">
            <TextField
              size="small"
              placeholder="Search by name or mobile..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 320 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: 'var(--card2)',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--fg)' },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-muted" />
                  </InputAdornment>
                ),
              }}
            />

            <div className="flex items-center gap-4 text-xs font-bold text-muted uppercase tracking-tight">
              <div className="flex flex-col items-end">
                <span>Total Registered</span>
                <span className="text-lg text-foreground font-black tracking-tighter">{total}</span>
              </div>
            </div>
          </div>

          {/* Table Component */}
          <CustomersTable
            customers={customers}
            loading={isLoading}
            total={total}
            page={page}
            limit={limit}
            onPageChange={(p) => updateURL({ page: p })}
            setLimit={(l) => updateURL({ limit: l, page: 1 })}
          />
        </div>
      </Box>
    </InnerDashboardLayout>
  );
}
