'use client'

import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Tooltip,
    Badge,
    Button,
    Avatar,
    Typography,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import Link from 'next/link'

import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuIcon from '@mui/icons-material/Menu'
import ChecklistIcon from '@mui/icons-material/Checklist'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import PersonIcon from '@mui/icons-material/Person';

import { useThemeStore } from '@/stores/useThemeStore'
// import { useNotificationStore } from "@/stores/useNotificationStore"
import { useAuthStore } from '@/stores/useAuthStore'
import { USER_DESIGNATIONS } from '@/lib/constants'
import { useRouter } from 'next/navigation'
// import AttendanceButton from '../auth/AttendanceButton'
// import { getMeetingUrgency } from '@/lib/notifications/meetingUrgency'
import { useState } from 'react';
// import LogoutButton from '../auth/LogoutButton';
// import { useLeadStatusStore } from '@/stores/useLeadStatusStore';
// import { getUserRoleLabel } from "@/utils/roleConfigParser";

export default function Navbar({ onDrawerToggle, onOpenTasks }) {
    const router = useRouter();
    const { user } = useAuthStore()
    // const { roleLabels } = useLeadStatusStore();
    const mode = useThemeStore((s) => s.mode)
    const setMode = useThemeStore((s) => s.setMode)

    const { isHydrated } = useThemeStore();

    const logoSrc =
        isHydrated && mode === "dark" ? "/logo2DT.png" : "/logo2L.png";

    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const isProfileMenuOpen = Boolean(profileAnchorEl);

    const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
    const handleProfileClose = () => setProfileAnchorEl(null);

    // const notifications = useNotificationStore(s => s.notifications)
    // const taskCount = notifications.filter(n =>
    // n.sourceType === "task" || (n.sourceType === "meeting" && getMeetingUrgency(n?.dueAt) >= -1)).length
    // const taskCount = notifications.length || 0;

    return (
        <AppBar
            position="fixed"
            elevation={0}
            color="default"
            sx={{
                backgroundColor: 'background.paper',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                minHeight: {
                    xs: 48,
                    sm: 48,
                    md: 44,
                },
                zIndex: 100
            }}
        >
            <Toolbar
                className="flex justify-between"
                sx={{
                    minHeight: {
                        xs: 48,
                        sm: 48,
                        md: 44,
                    },
                    py: 0 // Remove vertical padding
                }}
            >
                {/* LEFT */}
                <div className="flex items-center gap-1 sm:gap-3 text-gray-500 min-[900px]:ml-[60px]">
                    <h2 className="hidden min-[900px]:block text-lg font-semibold tracking-tighter capitalize">
                        {/* {
                            user?.role !== 'admin' && user?.companyDetails &&
                            `${user?.companyDetails.name}'s `
                        }
                        {getUserRoleLabel(roleLabels, user?.systemRole, user)}  */}
                        Dashboard
                    </h2>

                    <Box className="flex items-center gap-2">
                        <IconButton
                            edge="start"
                            onClick={onDrawerToggle}
                            sx={{ display: { md: 'none' } }}
                        // size="small" // Use small size for mobile
                        >
                            <MenuIcon fontSize="small" />
                        </IconButton>

                        <Box sx={{ display: { md: 'none' } }}>
                            <img
                                src={logoSrc}
                                alt="Logo"
                                className="h-8 w-auto" // Reduced from h-11 to h-8
                            />
                        </Box>
                    </Box>
                </div>

                {/* RIGHT */}
                <Box className="flex items-center gap-0 sm:gap-1"> {/* Reduced gap */}
                    {/* TASKS BUTTON */}
                    {/* {user?.designation === USER_DESIGNATIONS.SALES_EXECUTIVE &&
                        <Button
                            onClick={onOpenTasks}
                            variant="outlined"
                            // size="small" // Changed from medium to small
                            startIcon={<ChecklistIcon />}
                            sx={{
                                textTransform: 'none',
                                display: { xs: 'none', md: 'flex' },
                                py: 0.5, // Reduced padding
                            }}
                        >
                            Reminders
                            {taskCount > 0 && (
                                <Badge
                                    badgeContent={taskCount}
                                    color="error"
                                    sx={{ ml: 2, mr: 0.5 }} // Reduced margins
                                />
                            )}
                        </Button>
                    } */}

                    {/* Mobile icon */}
                    {/* {user?.designation === USER_DESIGNATIONS.SALES_EXECUTIVE &&
                        <IconButton
                            onClick={onOpenTasks}
                            sx={{ display: { md: 'none' } }}
                            // size="small"
                        >
                            <Badge badgeContent={taskCount} color="error">
                                <ChecklistIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                    } */}

                    {/* Attendance Button */}
                    {/* {user?.designation === USER_DESIGNATIONS.SALES_EXECUTIVE &&
                        <AttendanceButton />
                    } */}

                    {/* My Profile Button */}
                    <Tooltip title="My Profile">
                        <IconButton onClick={handleProfileOpen} >
                            <PersonIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={profileAnchorEl}
                        open={isProfileMenuOpen}
                        onClose={handleProfileClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        PaperProps={{
                            sx: {
                                mt: 0.5, // Reduced margin top
                                borderRadius: 2,
                                minWidth: 240,
                                overflow: "hidden",
                            },
                        }}
                    >
                        {/* TOP USER INFO */}
                        <Box px={2} py={1}> {/* Reduced padding */}
                            <Box display="flex" alignItems="center" gap={1.2}>
                                <Avatar
                                    src={user?.avatar || "/profile.jpg"}
                                    alt={user?.name || "User"}
                                    sx={{ width: 36, height: 36 }} // Smaller avatar
                                />

                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                                        {user?.name || "User"}
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary">
                                        {user?.systemRole}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* <Divider /> */}

                        {/* VIEW PROFILE */}
                        {/* <MenuItem
                            onClick={() => {
                                handleProfileClose();
                                router.push("/dashboard/myProfile");
                            }}
                            dense // Add dense prop for smaller menu items
                        >
                            <ListItemIcon>
                                <VisibilityIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="View Profile" />
                        </MenuItem>

                        <Divider /> */}

                        {/* LOGOUT */}
                        {/* <MenuItem dense>
                            <LogoutButton />
                        </MenuItem> */}
                    </Menu>

                    {/* THEME TOGGLE (BETA) */}
                    <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        <IconButton
                            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                        // size="small"
                        >
                            {mode === 'dark' ? <WbSunnyIcon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    )
}