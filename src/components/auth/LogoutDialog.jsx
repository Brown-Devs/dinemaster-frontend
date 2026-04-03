"use client"
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material'
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/lib/services/axios';

export default function LogoutDialog({ open, onClose, content }) {

    const { clearAuth, sessionId } = useAuthStore();
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true);
        try {
            // const deviceId = localStorage.getItem("crm_device_id");
            await api.post("/auth/logout", { sessionId });
        } catch (err) {
            // ignore network error, still clear local
            console.warn("logout API failed", err);
        } finally {
            clearAuth();
            localStorage.removeItem("crm_device_id"); // cleanup
            setLoading(false);
            onClose();
        }
    }


    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-logout"
            aria-describedby="alert-dialog-logout"
        >
            <DialogTitle id="alert-dialog-logout">
                {`${content?.title ?? 'Logout'}`}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-logout">
                    {`${content?.heading ?? 'Do you want to log out?'}`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{`${content?.btn1 ?? 'Cancel'}`}</Button>
                <Button
                    onClick={handleLogout}
                    autoFocus
                    variant="contained"
                    loading={loading}
                >
                    {`${content?.btn2 ?? 'Logout'}`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}