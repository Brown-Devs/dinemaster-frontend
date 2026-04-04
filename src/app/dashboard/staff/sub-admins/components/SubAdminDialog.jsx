"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, FormControl,
    FormHelperText, Box, InputAdornment, Switch, FormControlLabel,
    Typography, Paper, FormGroup, Checkbox, Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subAdminSchema } from "@/lib/validations";
import { useStaffs } from "@/hooks/useStaffs";
import { PERMISSIONS } from "@/lib/constants";

const PERMISSION_GROUPS = {
    Dashboard: [
        { key: PERMISSIONS.DASHBOARD_VIEW, label: "View" },
    ],
    Orders: [
        { key: PERMISSIONS.ORDERS_VIEW, label: "View" },
        { key: PERMISSIONS.ORDERS_UPDATE, label: "Update" },
    ],
    Products: [
        { key: PERMISSIONS.PRODUCTS_VIEW, label: "View" },
        { key: PERMISSIONS.PRODUCTS_CREATE, label: "Create" },
        { key: PERMISSIONS.PRODUCTS_UPDATE, label: "Update" },
    ],
    Categories: [
        { key: PERMISSIONS.CATEGORIES_VIEW, label: "View" },
        { key: PERMISSIONS.CATEGORIES_CREATE, label: "Create" },
        { key: PERMISSIONS.CATEGORIES_UPDATE, label: "Update" },
    ],
    Customers: [
        { key: PERMISSIONS.CUSTOMERS_VIEW, label: "View" },
        { key: PERMISSIONS.CUSTOMERS_CREATE, label: "Create" },
        { key: PERMISSIONS.CUSTOMERS_UPDATE, label: "Update" },
    ],
    Billing: [
        { key: PERMISSIONS.BILLING_VIEW, label: "View" },
        { key: PERMISSIONS.BILLING_CREATE, label: "Create" },
    ],
    Staff: [
        { key: PERMISSIONS.STAFF_VIEW, label: "View" },
        { key: PERMISSIONS.STAFF_CREATE, label: "Create" },
        { key: PERMISSIONS.STAFF_UPDATE, label: "Update" },
    ],
    Kitchen: [
        { key: PERMISSIONS.KITCHEN_VIEW, label: "View" },
        { key: PERMISSIONS.KITCHEN_UPDATE, label: "Update" },
    ],
};

export default function SubAdminDialog({ open, onClose, initialData = null }) {
    const { createStaff, updateStaff } = useStaffs();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(subAdminSchema),
        defaultValues: {
            uniqueId: "",
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            active: true,
            permissions: [],
            systemRole: "subadmin"
        },
    });

    const currentPermissions = watch("permissions") || [];

    useEffect(() => {
        if (initialData) {
            reset({
                uniqueId: initialData.uniqueId || "",
                name: initialData.name || "",
                email: initialData.email || "",
                phoneNo: initialData.phoneNo || "",
                password: "",
                active: initialData.active ?? true,
                permissions: Array.isArray(initialData.permissions) ? initialData.permissions : [],
                systemRole: "subadmin"
            });
        } else {
            reset({
                uniqueId: "", name: "", email: "", phoneNo: "",
                password: "", active: true, permissions: [], systemRole: "subadmin"
            });
        }
    }, [initialData, open, reset]);

    const togglePermission = (permKey) => {
        const arr = [...currentPermissions];
        const idx = arr.indexOf(permKey);
        if (idx === -1) {
            arr.push(permKey);
        } else {
            arr.splice(idx, 1);
        }
        setValue("permissions", arr, { shouldValidate: true, shouldDirty: true });
    };

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                const dataToUpdate = { ...data };
                if (!dataToUpdate.password || dataToUpdate.password.trim() === "") {
                    delete dataToUpdate.password;
                }
                await updateStaff.mutateAsync({
                    id: initialData._id,
                    data: dataToUpdate,
                });
                onClose();
                return;
            }

            await createStaff.mutateAsync(data);
            onClose();
            reset();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md" aria-labelledby="sub-admin-dialog-title">
            <DialogTitle id="sub-admin-dialog-title" className="flex items-center justify-between">
                <span className="font-bold text-xl">{initialData ? "Edit Sub Admin" : "Create Sub Admin"}</span>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {/* Upper section: one part in grid-cols-2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                        <FormControl fullWidth error={Boolean(errors.uniqueId)}>
                            <TextField {...register("uniqueId")} label="Unique ID" placeholder="e.g. subadmin_01" size="small" variant="outlined" />
                            {errors.uniqueId && <FormHelperText>{errors.uniqueId.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(errors.name)}>
                            <TextField {...register("name")} label="Name" placeholder="Full Name" size="small" variant="outlined" />
                            {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(errors.email)}>
                            <TextField {...register("email")} label="Email" placeholder="email@example.com" size="small" variant="outlined" />
                            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(errors.phoneNo)}>
                            <TextField {...register("phoneNo")} label="Phone Number" placeholder="Phone Number" size="small" variant="outlined" />
                            {errors.phoneNo && <FormHelperText>{errors.phoneNo.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(errors.password)}>
                            <TextField
                                {...register("password")}
                                label={initialData ? "Password (optional)" : "Password"}
                                type={showPassword ? "text" : "password"}
                                size="small"
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                        </FormControl>

                        <FormControlLabel
                            control={<Switch checked={watch("active")} onChange={(e) => setValue("active", e.target.checked)} color="primary" />}
                            label={watch("active") ? "Account Active" : "Account Inactive"}
                            sx={{ mt: 0.5 }}
                        />
                    </div>

                    <div className="mt-8 mb-4 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200" />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.secondary", textTransform: 'uppercase', letterSpacing: 1 }}>
                            Permissions Management
                        </Typography>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                            if (group === "WhatsApp" || group === "Staff") return null;

                            return (
                                <Paper key={group} className="p-4 bg-gray-50/50" variant="outlined" sx={{ borderRadius: 3, borderStyle: 'dashed' }}>
                                    <h3 className="font-bold text-indigo-600 mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                        {group}
                                    </h3>
                                    <div className="flex flex-row flex-wrap gap-x-2 gap-y-0">
                                        {perms.map((p) => (
                                            <FormControlLabel
                                                key={p.key}
                                                control={
                                                    <Checkbox
                                                        checked={currentPermissions.includes(p.key)}
                                                        onChange={() => togglePermission(p.key)}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                }
                                                label={<span className="text-sm text-gray-700">{p.label}</span>}
                                                sx={{ mr: 1 }}
                                            />
                                        ))}
                                    </div>
                                </Paper>
                            );
                        })}
                    </div>
                </DialogContent>


                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={createStaff?.isPending || updateStaff?.isPending}
                        loading={createStaff?.isPending || updateStaff?.isPending}
                        loadingPosition="start"
                    >
                        {initialData ? "Save Changes" : "Create Sub Admin"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
