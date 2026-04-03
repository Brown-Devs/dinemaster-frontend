"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import { useAuthStore } from "@/stores/useAuthStore";
// import { useLeadStatusStore } from "@/stores/useLeadStatusStore";
// import { usePermissions } from "@/hooks/usePermissions";

// import { getUserRoleLabel } from "@/utils/roleConfigParser";
import {
  MODULES,
  PERMISSIONS,
  ROLES,
  SYSTEM_ROLES,
  USERTYPE,
} from "@/lib/constants";

import LogoutButton from "@/components/auth/LogoutButton";
import { LocationPin, Person as PersonIcon } from "@mui/icons-material";

/* ICONS */
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  GroupAdd as GroupAddIcon,
  CalendarMonth as CalendarMonthIcon,
  Checklist as ChecklistIcon,
  Build as BuildIcon,
  People as PeopleIcon,
  Settings,
  Hub,
  Handyman,
  Email,
  MailLock,
  Inventory2,
  House,
  Route,
} from "@mui/icons-material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InsightsIcon from "@mui/icons-material/Insights";
import ChatIcon from "@mui/icons-material/Chat";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import TodayIcon from "@mui/icons-material/Today";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FrontHandIcon from "@mui/icons-material/FrontHand";
import FolderIcon from "@mui/icons-material/Folder";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Person2Icon from "@mui/icons-material/Person2";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import SchemaIcon from "@mui/icons-material/Schema";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { usePermissions } from "@/hooks/usePermissions";

const railWidth = 72;

export default function SidebarCollapsed({ onOpenFull }) {
  const router = useRouter();
  const pathname = usePathname() || "";

  const { user } = useAuthStore();
  // const { roleLabels } = useLeadStatusStore();
  const { isModuleEnabled, checkPermission } = usePermissions();

  const [submenuAnchor, setSubmenuAnchor] = useState(null);
  const [submenuItems, setSubmenuItems] = useState([]);

  const [profileAnchor, setProfileAnchor] = useState(null);

  if (!user) return null;

  /* ---------- PATH ---------- */

  const normalizePath = (url = "") => url.split("?")[0];

  const isActivePath = (path) => {
    if (!path) return false;

    const current = normalizePath(pathname);
    const target = normalizePath(path);

    if (target === "/dashboard") return current === "/dashboard";

    return current === target || current.startsWith(target + "/");
  };

  /* ---------- SECTIONS (EXACT COPY FROM BIG SIDEBAR) ---------- */

  const sections = useMemo(() => {
    if (!user) return [];

    if (user.role === ROLES.ADMIN) {
      return [
        {
          label: "Companies",
          icon: <BusinessIcon />,
          path: "/dashboard/companies",
          // module: MODULES.BASE,
        },
        {
          label: "Master Products",
          icon: <Inventory2 />,
          path: "/dashboard/masterProducts?page=1&limit=10",
          // module: MODULES.BASE,
        },
      ];
    }

    const base = [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
        module: MODULES.BASE,
      },
      {
        label: "Billing",
        icon: <ReceiptIcon />,
        path: "/dashboard/billing",
        module: MODULES.BILLING,
        permissions: PERMISSIONS.BILLING_VIEW,
      },
      {
        label: "Orders",
        icon: <ShoppingCartIcon />,
        path: "/dashboard/orders",
        module: MODULES.ORDERS,
        permissions: PERMISSIONS.ORDERS_VIEW,
      },
      {
        label: "Customers",
        icon: <Person2Icon fontSize="small" />,
        path: "/dashboard/customers",
        module: MODULES.CUSTOMERS,
        permissions: PERMISSIONS.CUSTOMERS_VIEW,
      },
      {
        label: "Products",
        icon: <Inventory2 />,
        path: "/dashboard/products",
        module: MODULES.PRODUCTS,
        permissions: PERMISSIONS.PRODUCTS_VIEW,
      },
      {
        label: "Categories",
        icon: <CategoryIcon />,
        path: "/dashboard/categories",
        module: MODULES.CATEGORIES,
        permissions: PERMISSIONS.CATEGORIES_VIEW,
      },
      // {
      //   label: "WhatsApp",
      //   icon: <WhatsAppIcon />,
      //   path: "/dashboard/whatsapp",
      //   module: MODULES.WHATSAPP,
      //   permissions: PERMISSIONS.WHATSAPP_VIEW,
      // },

      {
        label: "Reports",
        icon: <AssessmentIcon />,
        expandable: true,
        children: [
          {
            label: "Today's Report",
            path: "/dashboard/reports/today",
            icon: <TodayIcon fontSize="small" />,
            module: MODULES.REPORTS,
          },
          {
            label: "Performance",
            path: "/dashboard/reports/performance",
            icon: <TrendingUpIcon fontSize="small" />,
            module: MODULES.REPORTS,
          },
          {
            label: "Overall Report",
            path: "/dashboard/reports/overall",
            icon: <AnalyticsIcon fontSize="small" />,
            module: MODULES.REPORTS,
          },
        ],
        module: MODULES.REPORTS,
        permissions: PERMISSIONS.REPORTS_VIEW,
      },
      {
        label: "Staff",
        icon: <PeopleIcon />,
        expandable: true,
        children: [
          {
            label: "Admins",
            path: "/dashboard/staff/admins",
            icon: <AdminPanelSettingsIcon fontSize="small" />,
            module: MODULES.STAFF_BASE,
          },
          {
            label: "Sub Admins",
            path: "/dashboard/staff/sub-admins",
            icon: <SupervisedUserCircleIcon fontSize="small" />,
            module: MODULES.STAFF_BASE,
          },
        ],
        module: MODULES.STAFF_BASE,
        permissions: PERMISSIONS.STAFF_VIEW,
      },
      {
        label: "Settings",
        icon: <Settings />,
        path: "/dashboard/settings",
        module: MODULES.SETTINGS,
        permissions: PERMISSIONS.SETTINGS_VIEW,
      },
    ];

    return base;
  }, [user]);

  /* ---------- FILTER ---------- */

  const filteredSections = sections.filter((item) => {
    if (item.module && !isModuleEnabled(item.module)) return false;
    if (item.permissions && !checkPermission(item.permissions)) return false;
    return true;
  });

  /* ---------- CLICK ---------- */

  const handleClick = (e, item) => {
    if (item.children) {
      setSubmenuAnchor(e.currentTarget);
      setSubmenuItems(item.children);
    } else {
      router.push(item.path);
    }
  };

  /* ---------- UI ---------- */

  return (
    <Box
      sx={{
        width: railWidth,
        height: "100vh",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        py: 1,
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: "background.paper",
      }}
    >
      {/* LOGO */}
      <Box display="flex" justifyContent="center">
        <Tooltip title="Open Menu" placement="right">
          <IconButton onClick={onOpenFull}>
            <img src="/logo-512.png" alt="logo" className="w-10 h-10" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* ICONS SCROLL */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 0.5, // keeps scrollbar at far right
        }}
      >
        {filteredSections.map((item) => {
          const active =
            isActivePath(item.path) ||
            item.children?.some((c) => isActivePath(c.path));

          return (
            <Box key={item.label} display="flex" justifyContent="center">
              <Tooltip title={item.label} placement="right">
                <IconButton
                  onClick={(e) => handleClick(e, item)}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    my: 0.3,
                    backgroundColor: active ? "action.selected" : "transparent",
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* FOOTER */}
      <Box display="flex" justifyContent="center" pb={1}>
        <Tooltip title="Profile" placement="right">
          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
            <Avatar src={user?.avatar || "/profile.jpg"} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
      >
        {user?.role !== USERTYPE.ADMIN && (
          <MenuItem
            onClick={() => {
              router.push("/dashboard/myProfile");
              setProfileAnchor(null);
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
        )}

        <MenuItem>
          <LogoutButton />
        </MenuItem>
      </Menu>

      {/* SUBMENU */}
      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={() => setSubmenuAnchor(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
      >
        {submenuItems.map((child) => {
          if (child.module && !isModuleEnabled(child.module)) return null;
          if (child.permissions && !checkPermission(child.permissions)) return null;

          const active = isActivePath(child.path);

          return (
            <MenuItem
              key={child.label}
              selected={active}
              onClick={() => {
                router.push(child.path);
                setSubmenuAnchor(null);
              }}
              sx={{
                backgroundColor: active ? "action.selected" : "transparent",
                "&:hover": {
                  backgroundColor: active
                    ? "action.selected"
                    : "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "primary.main" : "inherit",
                }}
              >
                {child.icon}
              </ListItemIcon>

              <span
                style={{
                  fontWeight: active ? 600 : 400,
                }}
              >
                {child.label}
              </span>
            </MenuItem>
          );
        })}
      </Menu>

    </Box>
  );
}
