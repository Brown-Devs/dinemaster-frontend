"use client";

import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import {
  Button,
  TextField,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter, useSearchParams } from "next/navigation";
import { useMasterProducts } from "@/hooks/superAdmin/useMasterProducts";
import MasterProductsTable from "./components/MasterProductsTable";

export default function MasterProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value) => {
        updateParams({ search: value, page: 1 });
      }, 500),
    [searchParams]
  );

  useEffect(() => {
    debouncedUpdateSearch(searchInput.trim());
    return () => debouncedUpdateSearch.cancel();
  }, [searchInput]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(search ? { search } : {}),
    }),
    [page, limit, search]
  );

  const { masterProductsQuery } = useMasterProducts();
  const masterProductsData = masterProductsQuery(queryParams);
  const apiData = masterProductsData?.data?.data?.data || {
    masterProducts: [],
    pagination: { page: 1, limit: 10 },
    totalCount: 0,
  };

  return (
    <InnerDashboardLayout>
      {/* Header */}
      <div className="mb-4 mt-3 flex gap-2 max-[500px]:flex-col flex-row max-[500px]:items-start items-center justify-between">
        <div>
          <h2 className="font-bold max-[500px]:text-xl tracking-tight text-3xl">
            Master Products
          </h2>
          <p className="text-gray-500 max-[500px]:text-sm text-base">
            Manage all products in the master catalog.
          </p>
        </div>

        <div className="flex gap-3">
          <Tooltip title="Refresh" arrow>
            <span>
              <Button
                variant="outlined"
                onClick={() => masterProductsData.refetch()}
                startIcon={<RefreshIcon />}
                loading={masterProductsData.isRefetching}
                disabled={masterProductsData.isRefetching}
                loadingPosition="start"
              >
                Refresh
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Create New Product" arrow>
            <span>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
              // onClick={() => setDialogOpen(true)}
              >
                Add New
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card p-3 sm:p-6 border border-border rounded-xl w-full">

        {/* Search Bar */}
        <div className="mb-4">
          <TextField
            size="small"
            fullWidth
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <MasterProductsTable
          apiData={apiData}
          products={apiData.masterProducts}
          loading={masterProductsData.isLoading}
          limit={limit}
          setLimit={(val) => updateParams({ limit: val, page: 1 })}
          onPageChange={(p) => updateParams({ page: p })}
        />
      </div>
    </InnerDashboardLayout>
  );
}
