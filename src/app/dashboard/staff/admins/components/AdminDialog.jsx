"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, FormControl,
    FormHelperText, Box, InputAdornment, Switch, FormControlLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema } from "@/lib/validations";
import { useStaffs } from "@/hooks/useStaffs";

export default function AdminDialog({ open, onClose, initialData = null }) {
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
        resolver: zodResolver(adminSchema),
        defaultValues: {
            uniqueId: "",
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            active: true,
            systemRole: "admin"
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                uniqueId: initialData.uniqueId || "",
                name: initialData.name || "",
                email: initialData.email || "",
                phoneNo: initialData.phoneNo || "",
                password: "",
                active: initialData.active ?? true,
                systemRole: "admin"
            });
        } else {
            reset({
                uniqueId: "", name: "", email: "", phoneNo: "",
                password: "", active: true, systemRole: "admin"
            });
        }
    }, [initialData, open, reset]);

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
        <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="flex items-center justify-between">
                {initialData ? "Edit Admin" : "Create Admin"}
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <div className="flex flex-col gap-2">
                        <FormControl fullWidth margin="dense" error={Boolean(errors.uniqueId)}>
                            <TextField
                                {...register("uniqueId")}
                                label="Unique ID"
                                placeholder="e.g. admin_01"
                                variant="outlined"
                                autoComplete="off"
                            />
                            {errors.uniqueId && <FormHelperText>{errors.uniqueId.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="dense" error={Boolean(errors.name)}>
                            <TextField
                                {...register("name")}
                                label="Name"
                                placeholder="Full Name"
                                variant="outlined"
                            />
                            {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="dense" error={Boolean(errors.email)}>
                            <TextField
                                {...register("email")}
                                label="Email"
                                placeholder="email@example.com"
                                variant="outlined"
                            />
                            {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="dense" error={Boolean(errors.phoneNo)}>
                            <TextField
                                {...register("phoneNo")}
                                label="Phone Number"
                                placeholder="Phone Number"
                                variant="outlined"
                            />
                            {errors.phoneNo && <FormHelperText>{errors.phoneNo.message}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth margin="dense" error={Boolean(errors.password)}>
                            <TextField
                                {...register("password")}
                                label={initialData ? "Password (optional)" : "Password"}
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
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
                            sx={{ mt: 1 }}
                        />
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
                        {initialData ? "Save Changes" : "Create Admin"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
