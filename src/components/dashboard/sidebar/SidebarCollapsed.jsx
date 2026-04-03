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

const railWidth = 72;

export default function SidebarCollapsed({ onOpenFull }) {
  const router = useRouter();
  const pathname = usePathname() || "";

  const { user } = useAuthStore();
  // const { roleLabels } = useLeadStatusStore();
  // const { isModuleEnabled, checkPermission } = usePermissions();

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
      ];
    }

    // const base = [
    //   {
    //     label: "Dashboard",
    //     icon: <DashboardIcon />,
    //     path: "/dashboard",
    //     module: MODULES.BASE,
    //   },
    //   {
    //     label: "Leads",
    //     icon: <GroupAddIcon />,
    //     path: "/dashboard/leads?page=1&limit=10&sort=updated_desc",
    //     module: MODULES.LEADS,
    //     permissions: PERMISSIONS.LEADS_VIEW,
    //   },
    //   {
    //     label: "Lead Documents",
    //     icon: <DescriptionIcon />,
    //     path: "/dashboard/leadDocuments?page=1&limit=10&sort=created_desc",
    //     module: MODULES.LEAD_DOCS,
    //     permissions: PERMISSIONS.LEAD_DOCS_VIEW,
    //   },
    //   {
    //     label: "Meetings",
    //     icon: <MeetingRoomIcon />,
    //     path: "/dashboard/meetings",
    //     module: MODULES.MEETING,
    //     permissions: PERMISSIONS.MEETINGS_VIEW,
    //   },
    //   {
    //     label: "Tasks",
    //     icon: <ChecklistIcon />,
    //     path: "/dashboard/tasks",
    //     module: MODULES.TASK,
    //     permissions: PERMISSIONS.TASKS_VIEW,
    //   },
    //   {
    //     label: "Visits",
    //     icon: <EventIcon />,
    //     path: "/dashboard/visits",
    //     module: MODULES.VISITS,
    //     permissions: PERMISSIONS.VISITS_VIEW,
    //   },
    //   {
    //     label: "Calendar",
    //     icon: <CalendarMonthIcon />,
    //     path: "/dashboard/calendar",
    //     // module: MODULES.CALENDAR,
    //     // permissions: PERMISSIONS.CALENDAR_VIEW,
    //     module: MODULES.LEADS,
    //     permissions: PERMISSIONS.LEADS_VIEW,
    //   },
    //   {
    //     label: "Activity Tracker",
    //     icon: <FrontHandIcon />,
    //     path: "/dashboard/attendance",
    //     module: MODULES.TASK,
    //     permissions: PERMISSIONS.TASKS_VIEW,
    //   },
    //   {
    //     label: "Properties",
    //     icon: <House />,
    //     path: "/dashboard/projects",
    //     module: MODULES.PROPERTY,
    //     permissions: PERMISSIONS.PROPERTY_VIEW,
    //   },
    // ];

    // if (user.systemRole === SYSTEM_ROLES.COMPANY_ADMIN) {
    //   return [
    //     ...base,
    //     {
    //       label: "Track Location",
    //       path: "/dashboard/location/live",
    //       icon: <LocationPin fontSize="small" />,
    //       module: MODULES.BASE
    //     },
    //     {
    //       label: "Services",
    //       icon: <BuildIcon />,
    //       path: "/dashboard/services",
    //       module: MODULES.SERVICES,
    //       permissions: PERMISSIONS.SERVICES_VIEW,
    //     },
    //     {
    //       label: "Products",
    //       icon: <Inventory2 />,
    //       path: "/dashboard/products",
    //       module: MODULES.PRODUCTS,
    //       permissions: PERMISSIONS.PRODUCTS_VIEW,
    //     },
    //     {
    //       label: "Assets Library",
    //       icon: <FolderIcon />,
    //       path: "/dashboard/assets",
    //       module: MODULES.ASSETS,
    //       permissions: PERMISSIONS.ASSETS_VIEW,
    //     },
    //     {
    //       label: "Invoices",
    //       icon: <ReceiptLongIcon />,
    //       path: "/dashboard/invoices",
    //       module: MODULES.INVOICE,
    //       permissions: PERMISSIONS.INVOICE_VIEW,
    //     },
    //     {
    //       label: "Itineraries",
    //       icon: <Route />,
    //       path: "/dashboard/itineraries-v2",
    //       module: MODULES.ITINERARY,
    //       permissions: PERMISSIONS.ITINERARY_VIEW,
    //     },
    //     {
    //       label: "Reports",
    //       icon: <AssessmentIcon />,
    //       module: MODULES.REPORTS_BASE,
    //       children: [
    //         {
    //           label: "Today's Report",
    //           path: "/dashboard/reports/today/v2",
    //           icon: <TodayIcon />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Performance",
    //           path: "/dashboard/reports/performance",
    //           icon: <TrendingUpIcon />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Overall Report",
    //           path: "/dashboard/reports/overall",
    //           icon: <AnalyticsIcon />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Services",
    //           path: "/dashboard/reports/services",
    //           icon: <MiscellaneousServicesIcon />,
    //           module: MODULES.REPORTS_SERVICES,
    //         },
    //         {
    //           label: "Download Logs",
    //           path: "/dashboard/reports/downloadLogs",
    //           icon: <FileDownloadIcon />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Email Logs",
    //           path: "/dashboard/reports/emailLogs",
    //           icon: <MailLock />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Staff",
    //       icon: <PeopleIcon />,
    //       module: MODULES.BASE,
    //       children: [
    //         {
    //           label: "Groups",
    //           icon: <Diversity1Icon />,
    //           path: "/dashboard/groups",
    //           module: MODULES.STAFF_GROUP,
    //         },
    //         {
    //           label: "Teams",
    //           icon: <Diversity3Icon />,
    //           path: "/dashboard/teams",
    //           module: MODULES.STAFF_TEAM,
    //         },
    //         {
    //           label: `${getUserRoleLabel(roleLabels, SYSTEM_ROLES.SALES_MANAGER)}`,
    //           path: "/dashboard/staff/salesManagers",
    //           icon: <AdminPanelSettingsIcon />,
    //           module: MODULES.STAFF_GROUP,
    //         },
    //         {
    //           label: `${getUserRoleLabel(roleLabels, SYSTEM_ROLES.TEAM_LEADER)}`,
    //           path: "/dashboard/staff/teamLeaders",
    //           icon: <SupervisedUserCircleIcon />,
    //           module: MODULES.STAFF_TEAM,
    //         },
    //         {
    //           label: `${getUserRoleLabel(roleLabels, SYSTEM_ROLES.SALES_EXECUTIVE)}`,
    //           path: "/dashboard/staff/salesExecutives",
    //           icon: <Person2Icon />,
    //           module: MODULES.STAFF_BASE,
    //         },
    //         {
    //           label: "Flow Chart",
    //           path: "/dashboard/hierarchy",
    //           icon: <SchemaIcon />,
    //         },
    //       ],
    //     },
    //     {
    //       label: "WhatsApp",
    //       icon: <WhatsAppIcon />,
    //       module: MODULES.WHATSAPP,
    //       children: [
    //         {
    //           label: "Chats",
    //           icon: <ChatIcon />,
    //           path: "/dashboard/whatsapp/chats",
    //           module: MODULES.WHATSAPP,
    //         },
    //         {
    //           label: "Templates",
    //           icon: <DescriptionIcon />,
    //           path: "/dashboard/whatsapp/templates",
    //           module: MODULES.WHATSAPP,
    //         },
    //         {
    //           label: "Automation",
    //           icon: <InsightsIcon />,
    //           path: "/dashboard/whatsapp/automation",
    //           module: MODULES.WHATSAPP,
    //         },
    //       ],
    //     },
    //     {
    //       label: "Marketing",
    //       icon: <Email />,
    //       path: "/dashboard/marketing",
    //       module: MODULES.MARKETING,
    //     },
    //     {
    //       label: "Integrations",
    //       icon: <Hub />,
    //       path: "/dashboard/integrations",
    //       module: MODULES.INTEGRATION,
    //     },
    //     {
    //       label: "Tools",
    //       icon: <Handyman />,
    //       path: "/dashboard/tools",
    //       module: MODULES.TOOLS,
    //     },
    //     {
    //       label: "About Company",
    //       icon: <GroupAddIcon />,
    //       path: "/dashboard/aboutCompany",
    //       module: MODULES.BASE,
    //     },
    //     {
    //       label: "Settings",
    //       icon: <Settings />,
    //       path: "/dashboard/settings/attendanceConfig",
    //       module: MODULES.BASE,
    //     },
    //   ];
    // }

    // if (
    //   user.systemRole === SYSTEM_ROLES.SALES_MANAGER
    // ) {
    //   return [
    //     ...base,
    //     {
    //       label: "Services",
    //       icon: <BuildIcon />,
    //       path: "/dashboard/services",
    //       module: MODULES.SERVICES,
    //       permissions: PERMISSIONS.SERVICES_VIEW,
    //     },
    //     {
    //       label: "Assets Library",
    //       path: "/dashboard/assets",
    //       icon: <FolderIcon fontSize="small" />,
    //       module: MODULES.ASSETS,
    //       permissions: PERMISSIONS.ASSETS_VIEW,
    //     },
    //     {
    //       label: "Invoices",
    //       path: "/dashboard/invoices",
    //       icon: <ReceiptLongIcon fontSize="small" />,
    //       module: MODULES.INVOICE,
    //       permissions: PERMISSIONS.INVOICE_VIEW,
    //     },
    //     {
    //       label: "Itineraries",
    //       path: "/dashboard/itineraries-v2",
    //       icon: <Route fontSize="small" />,
    //       module: MODULES.ITINERARY,
    //       permissions: PERMISSIONS.ITINERARY_VIEW,
    //     },
    //     {
    //       label: "Staff",
    //       icon: <PeopleIcon />,
    //       expandable: true,
    //       children: [
    //         {
    //           label: "Teams",
    //           icon: <Diversity3Icon />,
    //           path: "/dashboard/teams",
    //           module: MODULES.STAFF_TEAM,
    //         },
    //         {
    //           label: `${getUserRoleLabel(roleLabels, SYSTEM_ROLES.TEAM_LEADER)}`,
    //           path: "/dashboard/staff/teamLeaders",
    //           icon: <SupervisedUserCircleIcon fontSize="small" />,
    //           module: MODULES.STAFF_TEAM,
    //         },
    //         {
    //           label: `${getUserRoleLabel(roleLabels, SYSTEM_ROLES.SALES_EXECUTIVE)}`,
    //           path: "/dashboard/staff/salesExecutives",
    //           icon: <Person2Icon fontSize="small" />,
    //           module: MODULES.STAFF_BASE,
    //         },
    //       ],
    //       module: MODULES.BASE,
    //     },
    //     {
    //       label: "WhatsApp",
    //       icon: <WhatsAppIcon />,
    //       expandable: true,
    //       children: [
    //         {
    //           label: "Chats",
    //           icon: <ChatIcon />,
    //           path: "/dashboard/whatsapp/chats",
    //           module: MODULES.WHATSAPP,
    //         },
    //       ],
    //       module: MODULES.WHATSAPP,
    //     },
    //     {
    //       label: "Marketing",
    //       icon: <Email />,
    //       path: "/dashboard/marketing",
    //       module: MODULES.MARKETING,
    //     },
    //     // {
    //     //   label: "Reports",
    //     //   icon: <AssessmentIcon />,
    //     //   expandable: true,
    //     //   children: [
    //     //     {
    //     //       label: "Today's Report",
    //     //       path: "/dashboard/reports/today/v2",
    //     //       icon: <AssessmentIcon fontSize="small" />,
    //     //       module: MODULES.REPORTS_TODAY,
    //     //     },
    //     //     {
    //     //       label: "Overall Report",
    //     //       path: "/dashboard/reports/overall",
    //     //       icon: <AssessmentIcon fontSize="small" />,
    //     //       module: MODULES.REPORTS_OVERALL,
    //     //     },
    //     //   ],
    //     //   module: MODULES.REPORTS_BASE,
    //     // },
    //   ];
    // }

    // if (
    //   user.systemRole === SYSTEM_ROLES.TEAM_LEADER
    // ) {
    //   return [
    //     ...base,
    //     {
    //       label: "Services",
    //       icon: <BuildIcon />,
    //       path: "/dashboard/services",
    //       module: MODULES.SERVICES,
    //       permissions: PERMISSIONS.SERVICES_VIEW,
    //     },
    //     {
    //       label: "Assets Library",
    //       path: "/dashboard/assets",
    //       icon: <FolderIcon fontSize="small" />,
    //       module: MODULES.ASSETS,
    //       permissions: PERMISSIONS.ASSETS_VIEW,
    //     },
    //     {
    //       label: "Invoices",
    //       path: "/dashboard/invoices",
    //       icon: <ReceiptLongIcon fontSize="small" />,
    //       module: MODULES.INVOICE,
    //       permissions: PERMISSIONS.INVOICE_VIEW,
    //     },
    //     {
    //       label: "Itineraries",
    //       path: "/dashboard/itineraries-v2",
    //       icon: <Route fontSize="small" />,
    //       module: MODULES.ITINERARY,
    //       permissions: PERMISSIONS.ITINERARY_VIEW,
    //     },
    //     {
    //       label: "Staff",
    //       icon: <PeopleIcon />,
    //       expandable: true,
    //       children: [
    //         {
    //           label: `${getUserRoleLabel(roleLabels, SYSTEM_ROLES.SALES_EXECUTIVE)}`,
    //           path: "/dashboard/staff/salesExecutives",
    //           icon: <Person2Icon fontSize="small" />,
    //           module: MODULES.STAFF_BASE,
    //         },
    //       ],
    //       module: MODULES.BASE,
    //     },
    //     {
    //       label: "WhatsApp",
    //       icon: <WhatsAppIcon />,
    //       expandable: true,
    //       children: [
    //         {
    //           label: "Chats",
    //           icon: <ChatIcon />,
    //           path: "/dashboard/whatsapp/chats",
    //           module: MODULES.WHATSAPP,
    //         },
    //       ],
    //       module: MODULES.WHATSAPP,
    //     },
    //     {
    //       label: "Marketing",
    //       icon: <Email />,
    //       path: "/dashboard/marketing",
    //       module: MODULES.MARKETING,
    //     },
    //     // {
    //     //   label: "Reports",
    //     //   icon: <AssessmentIcon />,
    //     //   expandable: true,
    //     //   children: [
    //     //     {
    //     //       label: "Today's Report",
    //     //       path: "/dashboard/reports/today/v2",
    //     //       icon: <AssessmentIcon fontSize="small" />,
    //     //       module: MODULES.REPORTS_TODAY,
    //     //     },
    //     //     {
    //     //       label: "Overall Report",
    //     //       path: "/dashboard/reports/overall",
    //     //       icon: <AssessmentIcon fontSize="small" />,
    //     //       module: MODULES.REPORTS_OVERALL,
    //     //     },
    //     //   ],
    //     //   module: MODULES.REPORTS_BASE,
    //     // },
    //   ];
    // }

    // if (user.systemRole === SYSTEM_ROLES.SALES_EXECUTIVE) {
    //   return [
    //     {
    //       label: "Dashboard",
    //       icon: <DashboardIcon />,
    //       path: "/dashboard",
    //       module: MODULES.BASE,
    //     },
    //     {
    //       label: "Leads",
    //       icon: <GroupAddIcon />,
    //       path: "/dashboard/leads?page=1&limit=10&sort=updated_desc",
    //       module: MODULES.LEADS,
    //       permissions: PERMISSIONS.LEADS_VIEW,
    //     },
    //     {
    //       label: "Lead Documents",
    //       icon: <DescriptionIcon />,
    //       path: "/dashboard/leadDocuments?page=1&limit=10&sort=created_desc",
    //       module: MODULES.LEAD_DOCS,
    //       permissions: PERMISSIONS.LEAD_DOCS_VIEW,
    //     },
    //     {
    //       label: "Meetings",
    //       icon: <CalendarMonthIcon />,
    //       path: "/dashboard/meetings",
    //       module: MODULES.MEETING,
    //       permissions: PERMISSIONS.MEETINGS_VIEW,
    //     },
    //     {
    //       label: "Visits",
    //       icon: <EventIcon />,
    //       path: "/dashboard/visits",
    //       module: MODULES.VISITS,
    //       permissions: PERMISSIONS.VISITS_VIEW,
    //     },
    //     {
    //       label: "Tasks",
    //       icon: <ChecklistIcon />,
    //       path: "/dashboard/tasks",
    //       module: MODULES.TASK,
    //       permissions: PERMISSIONS.TASKS_VIEW,
    //     },
    //     {
    //       label: "Calendar",
    //       icon: <CalendarMonthIcon />,
    //       path: "/dashboard/calendar",
    //       // module: MODULES.CALENDAR,
    //       // permissions: PERMISSIONS.CALENDAR_VIEW,
    //       module: MODULES.LEADS,
    //       permissions: PERMISSIONS.LEADS_VIEW,
    //     },
    //     {
    //       label: "Services",
    //       icon: <BuildIcon />,
    //       path: "/dashboard/services",
    //       module: MODULES.SERVICES,
    //       permissions: PERMISSIONS.SERVICES_VIEW,
    //     },
    //     {
    //       label: "Properties",
    //       icon: <House />,
    //       path: "/dashboard/projects",
    //       module: MODULES.PROPERTY,
    //       permissions: PERMISSIONS.PROPERTY_VIEW,
    //     },
    //     {
    //       label: "Invoices",
    //       path: "/dashboard/invoices",
    //       icon: <ReceiptLongIcon fontSize="small" />,
    //       module: MODULES.INVOICE,
    //       permissions: PERMISSIONS.INVOICE_VIEW,
    //     },
    //     {
    //       label: "Itineraries",
    //       path: "/dashboard/itineraries-v2",
    //       icon: <Route fontSize="small" />,
    //       module: MODULES.ITINERARY,
    //       permissions: PERMISSIONS.ITINERARY_VIEW,
    //     },
    //     {
    //       label: "Marketing",
    //       icon: <Email />,
    //       path: "/dashboard/marketing",
    //       module: MODULES.MARKETING,
    //     },
    //     {
    //       label: "Activity Tracker",
    //       icon: <FrontHandIcon />,
    //       path: "/dashboard/attendance",
    //     },
    //     {
    //       label: "Assets Library",
    //       path: "/dashboard/assets",
    //       icon: <FolderIcon fontSize="small" />,
    //       module: MODULES.ASSETS,
    //       permissions: PERMISSIONS.ASSETS_VIEW,
    //     },
    //   ];
    // }

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
            <Image src="/logo-512.png" alt="logo" width={36} height={36} />
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
