"use client";
import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Menu, MenuItem,
    TablePagination, Chip, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Switch } from "@mui/material";
import TableSkeleton2 from "@/components/shared/TableSkeleton2";
import { formatDateWithTime, formatRelativeTime } from "@/lib/services/dateFormat";
import { useStaffs } from "@/hooks/useStaffs";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/constants";

export default function SubAdminsTable({ apiData, onPageChange, limit, setLimit, dataLoading, onEdit }) {
    const { updateStaff } = useStaffs();
    const { checkPermission } = usePermissions();

    const handleToggleStatus = async (user) => {
        try {
            await updateStaff.mutateAsync({
                id: user._id,
                data: { active: !user.active }
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Unique ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Timeline</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    {dataLoading ? (
                        <TableSkeleton2 rows={6} columns={10} />
                    ) : (
                        <TableBody>
                            {apiData?.users?.map((u, index) => (
                                <TableRow hover key={u._id}>
                                    <TableCell>{(apiData?.pagination.page - 1) * apiData?.pagination.limit + index + 1}</TableCell>
                                    <TableCell>{u?.uniqueId || "-"}</TableCell>
                                    <TableCell>{u?.name || "-"}</TableCell>
                                    <TableCell>{u?.email || "-"}</TableCell>
                                    <TableCell>{u?.phoneNo || "-"}</TableCell>

                                    <TableCell>
                                        <div className="flex flex-col">
                                            <Tooltip title={formatDateWithTime(u?.createdAt) || ""} arrow>
                                                <span className="text-sm font-medium capitalize">{formatRelativeTime(u?.createdAt) || "-"}</span>
                                            </Tooltip>
                                            <span className="text-xs text-gray-400">Created</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {checkPermission(PERMISSIONS.STAFF_UPDATE) ? (
                                            <Tooltip title={u?.active ? "Deactivate" : "Activate"} arrow>
                                                <Switch
                                                    checked={!!u?.active}
                                                    onChange={() => handleToggleStatus(u)}
                                                    disabled={updateStaff.isPending}
                                                    size="small"
                                                    color="success"
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Chip label={u?.active ? "Active" : "Inactive"} size="small" variant="outlined" />
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        {checkPermission(PERMISSIONS.STAFF_UPDATE) && (
                                            <Tooltip title="Edit" arrow>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => onEdit && onEdit(u)}
                                                    sx={{ color: "#4f46e5", "&:hover": { backgroundColor: "#eef2ff" } }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={apiData?.totalCount || 0}
                page={apiData?.pagination?.page - 1 || 0}
                onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={limit || 0}
                onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    onPageChange(1);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </div>
    );
}
