"use client"
import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useCompanies } from '@/hooks/useCompanies';
import toast from 'react-hot-toast';
import { useAttendance } from '@/hooks/useAttendance';

export default function BreakDialog({ open, onClose }) {

    if (!open) return null;
    const { startBreak, refetchTodayAttendance } = useAttendance();
    const { getAttendanceConfig } = useCompanies();
    const brQ = getAttendanceConfig();
    const breakReasons = brQ?.data?.data?.breakReasons;

    const [selected, setSelected] = useState("");

    const handleStartBreak = async () => {
        if (!selected) {
            toast.error("Please select a reason.")
            return;
        }
        await startBreak.mutateAsync({ reasonKey: selected })
        refetchTodayAttendance();
        startBreak.isSuccess && onClose();
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle id="alert-dialog-logout">
                {"Start Break"}
            </DialogTitle>
            <DialogContent>
                <div className='py-2'>
                    <FormControl fullWidth size="small">
                        <InputLabel id="break-reason">Break Reason</InputLabel>
                        <Select
                            labelId='break-reason'
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                            sx={{ width: '100%' }}
                            label={"Break Reason"}
                        >
                            <MenuItem value="">Select a reason</MenuItem>
                            {breakReasons?.map(u => (
                                <MenuItem key={u?._id} value={u?.key}>{u?.label} ({u?.allowedMinutes} Mins)</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                    }}
                >
                    Cancel
                </Button>
                <Button
                    autoFocus
                    variant="contained"
                    sx={{ textTransform: 'none' }}
                    onClick={handleStartBreak}
                    loading={startBreak.isPending}
                    disabled={startBreak.isPending}
                    loadingPosition='start'
                >
                    Start
                </Button>
            </DialogActions>
        </Dialog>
    )
}