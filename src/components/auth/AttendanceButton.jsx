"use client"
import React, { useState } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    Button,
    Box,
    Typography,
    Tooltip
} from "@mui/material";
import FrontHandIcon from "@mui/icons-material/FrontHand";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useAttendance } from "@/hooks/useAttendance";
import BreakDialog from "./BreakDialog";
import { formatDateWithTime } from "@/lib/services/dateFormat";

export default function AttendanceButton() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const record = useAttendanceStore(s => s.record);
    const uiState = useAttendanceStore(s => s.getUiState());
    const loginAt = record?.loginAt;

    const { startAttendance, endAttendance, endBreak } = useAttendance();
    const [breakOpen, setBreakOpen] = useState(false);

    return (
        <>
            <Tooltip title={'Attendance'}>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <FrontHandIcon />
                </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>

                {/* STATUS */}
                <MenuItem disableRipple>
                    <Box>
                        <Typography fontWeight={600}>
                            {uiState === "not_started" && "Not Working"}
                            {uiState === "active" && "Working"}
                            {uiState === "break" && "On Break"}
                            {uiState === "completed" && "Work Completed"}
                        </Typography>

                        {loginAt && (
                            <Typography variant="caption" color="text.secondary">
                                Started at {formatDateWithTime(loginAt)}
                            </Typography>
                        )}
                    </Box>
                </MenuItem>

                {/* ACTIONS */}
                {uiState === "not_started" && (
                    <MenuItem>
                        <Button fullWidth variant="contained" onClick={() => startAttendance.mutate()}>
                            Start Work
                        </Button>
                    </MenuItem>
                )}

                {uiState === "active" && (
                    <>
                        <MenuItem>
                            <Button fullWidth variant="outlined" onClick={() => setBreakOpen(true)}>
                                Start Break
                            </Button>
                        </MenuItem>

                        <MenuItem>
                            <Button
                                fullWidth
                                color="error"
                                variant="outlined"
                                onClick={() => {
                                    if (!confirm("End today's work?")) return;
                                    endAttendance.mutate();
                                }}
                            >
                                End Work
                            </Button>
                        </MenuItem>
                    </>
                )}

                {uiState === "break" && (
                    <MenuItem>
                        <Button fullWidth variant="contained" onClick={() => endBreak.mutate()}>
                            End Break
                        </Button>
                    </MenuItem>
                )}

                {uiState === "completed" && (
                    <MenuItem disabled>
                        <Typography variant="caption" color="text.secondary">
                            Attendance already completed
                        </Typography>
                    </MenuItem>
                )}
            </Menu>

            <BreakDialog open={breakOpen} onClose={() => setBreakOpen(false)} />
        </>
    );
}


