import React, { useState } from "react";
import {
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import { MoreVert, Person as PersonIcon } from "@mui/icons-material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { USERTYPE } from "@/lib/constants";
// import LogoutButton from "@/components/auth/LogoutButton";
// import { useLeadStatusStore } from "@/stores/useLeadStatusStore";
// import { getUserRoleLabel } from "@/utils/roleConfigParser";

export default function SidebarFooter({ user, mode, setMode, router, variant, onClose }) {
    // const { roleLabels } = useLeadStatusStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Box
            p={2}
            sx={{
                flexShrink: 0,
                borderTop: "1px solid rgba(0,0,0,0.08)",
                background: "inherit",
            }}
        >
            {/* <Box mt={1} display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
        <Button
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          variant="outlined"
          size="small"
          startIcon={mode === "dark" ? <WbSunnyIcon /> : <Brightness4Icon />}
          sx={{ textTransform: "none" }}
        >
          {mode === "dark" ? "Light Theme" : "Dark Theme"}
          <Chip label={"Beta"} size="small" sx={{ ml: 1, background: "black", color: "white" }} />
        </Button>
      </Box> */}

            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Avatar
                        src={user?.avatar || "/profile.jpg"}
                        alt={user?.name || "User"}
                        sx={{ width: 42, height: 42, mr: 1 }}
                    />

                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "capitalize" }} className="truncate">
                            {user?.name || "User"}
                        </Typography>

                        {/* <Typography variant="caption" color="text.secondary">
                            {getUserRoleLabel(roleLabels, user?.systemRole)}
                        </Typography> */}
                    </Box>
                </Box>

                <IconButton onClick={handleMenuOpen} aria-label="Profile options" size="small">
                    <MoreVert />
                </IconButton>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {user?.role !== USERTYPE.ADMIN && (
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            router.push(`/dashboard/myProfile`);
                            if (variant === "temporary") onClose?.();
                        }}
                    >
                        <PersonIcon sx={{ mr: 1 }} fontSize="small" /> My Profile
                    </MenuItem>
                )}

                <MenuItem>
                    {/* <LogoutButton /> */}
                </MenuItem>
            </Menu>
        </Box>
    );
}
