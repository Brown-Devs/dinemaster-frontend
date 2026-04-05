"use client";
import React, { useState, useEffect, useMemo } from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useStaffs } from "@/hooks/useStaffs";
import AdminsTable from "./components/AdminsTable";
import AdminDialog from "./components/AdminDialog";
import { Button, Box, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, InputAdornment, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StatCard2 from "@/components/shared/StatCard2";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS, MODULES } from "@/lib/constants";
import PermissionDenied from "@/components/shared/PermissionDenied";

function AdminsPage() {
    const { adminsQuery } = useStaffs();
    const { user } = useAuthStore();
    const { checkPermission, isModuleEnabled } = usePermissions();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            setSearchQuery(searchInput.trim());
        }, 3000);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    const tab = user?.systemRole === "admin" ? "admin" : undefined;

    const queryParams = useMemo(() => ({
        tab,
        page,
        limit,
        ...(searchQuery ? { searchQuery } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
    }), [tab, page, limit, searchQuery, statusFilter]);

    const staffData = adminsQuery(queryParams);

    if (staffData.isError) {
        return <div>Error: {staffData.error?.message || "Failed to load Sub Admins"}</div>;
    }

    const apiData = staffData?.data?.data?.data || {
        users: [],
        pagination: { page: 1, limit },
        totalCount: 0,
    };

    const usersList = Array.isArray(apiData?.users) ? apiData.users : [];

    const stats = useMemo(() => {
        const total = apiData?.totalCount ?? usersList.length;
        const active = usersList.filter(u => !!u.active).length;
        const inactive = total - active;
        return { total, active, inactive };
    }, [apiData, usersList]);

    const statsLoading = staffData.isLoading || staffData.isRefetching;

    const handleResetFilters = () => {
        setSearchInput("");
        setSearchQuery("");
        setStatusFilter("");
        setPage(1);
        staffData.refetch && staffData.refetch();
    };
    const hasAccess = isModuleEnabled(MODULES.STAFF_BASE) && checkPermission(PERMISSIONS.STAFF_VIEW);
    if (!hasAccess) return <PermissionDenied />;

    return (
        <InnerDashboardLayout>
            <div className="mb-5 flex items-center justify-between flex-col sm:flex-row gap-3">
                <div>
                    <h2 className="font-bold text-3xl mt-1">Admins</h2>
                    <p className="text-gray-500 text-base">Manage Admins - create and update their profile.</p>
                </div>

                <div className="flex gap-3 justify-start w-full sm:w-auto">
                    <Tooltip title="Refresh" arrow>
                        <span>
                            <Button
                                variant="outlined"
                                onClick={() => staffData.refetch && staffData.refetch()}
                                aria-label="Refresh"
                                disabled={!!staffData.isRefetching}
                                loading={staffData.isRefetching}
                                loadingIndicator={<CircularProgress size={20} />}
                            >
                                <RefreshIcon />
                            </Button>
                        </span>
                    </Tooltip>

                    {checkPermission(PERMISSIONS.STAFF_CREATE) && (
                        <Tooltip title={`Add Admin`} arrow>
                            <span>
                                <Button
                                    variant="outlined"
                                    sx={{ textTransform: "capitalize" }}
                                    onClick={() => setDialogOpen(true)}
                                    aria-label={`Add Admin`}
                                >
                                    <AddIcon />
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mt-5 w-full mb-4">
                <StatCard2 title={`Total Admins`} value={stats.total} subtitle="All time" loading={statsLoading} Icon={AccountCircleIcon} bg="from-[#1e293b] to-[#0f172a]" />
                <StatCard2 title="Active" value={stats.active} subtitle="Currently active" loading={statsLoading} Icon={CheckCircleIcon} bg="from-[#0d9488] to-[#042f2e]" />
                <StatCard2 title="Inactive" value={stats.inactive} subtitle="Currently inactive" loading={statsLoading} Icon={CancelIcon} bg="from-[#7e22ce] to-[#3b0764]" />
            </div>

            <div className="bg-card p-3 sm:p-6 border border-border rounded-xl w-full">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl">Admins List</h2>
                        <p className="text-gray-500 text-sm">View and manage Admins.</p>
                    </div>
                </div>

                {/* Search and filter */}
                <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">

                    {/* Search – takes remaining space */}
                    <div className="w-full sm:flex-1">
                        <TextField
                            variant="outlined"
                            placeholder="Search sub admins, IDs, names..."
                            size="small"
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setSearchQuery(searchInput.trim());
                                    setPage(1);
                                }
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: "#9CA3AF" }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "7px",
                                    minHeight: 40,
                                },
                            }}
                        />
                    </div>

                    {/* Status + Reset */}
                    <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                        <Box sx={{ minWidth: 180 }}>
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}
                            >
                                <InputLabel id="status-filter-label">Status</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    label="Status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Tooltip title="Reset filters" arrow>
                            <span>
                                <Button variant="outlined" onClick={handleResetFilters}>
                                    <RestartAltIcon />
                                </Button>
                            </span>
                        </Tooltip>
                    </div>
                </div>


                <AdminsTable
                    apiData={apiData}
                    onPageChange={(newPage) => setPage(newPage)}
                    limit={limit}
                    setLimit={setLimit}
                    dataLoading={staffData.isLoading}
                    onEdit={(e) => { setEditingItem(e); setDialogOpen(true); }}
                />
            </div>

            <AdminDialog
                open={dialogOpen}
                initialData={editingItem}
                onClose={() => { setDialogOpen(false); setEditingItem(null); }}
            />
        </InnerDashboardLayout>
    );
}

export default AdminsPage;
