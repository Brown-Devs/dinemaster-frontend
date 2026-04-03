"use client";

import React, { useMemo } from "react";
import { Drawer, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { MODULES, PERMISSIONS, ROLES, SYSTEM_ROLES } from "@/lib/constants";

import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarMenu from "./sidebar/SidebarMenu";
import SidebarFooter from "./sidebar/SidebarFooter";

// icons
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
  LocalActivityOutlined,
  LocationPin,
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
// import { useLeadStatusStore } from "@/stores/useLeadStatusStore";
// import { getUserRoleLabel } from "@/utils/roleConfigParser";
import EventIcon from "@mui/icons-material/Event";
import DescriptionIcon from "@mui/icons-material/Description";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptIcon from "@mui/icons-material/Receipt";

const drawerWidth = 260;

export default function Sidebar({
  variant = "permanent",
  open = true,
  onClose,
}) {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const router = useRouter();
  const pathname = usePathname() || "/";
  const { user } = useAuthStore();
  // const { roleLabels } = useLeadStatusStore();

  const sections = useMemo(() => {
    if (!user) return [];
    if (user.systemRole === ROLES.ADMIN) {
      return [
        {
          label: "Companies",
          icon: <BusinessIcon />,
          path: "/dashboard/companies",
          module: MODULES.BASE,
        },
        {
          label: "Master Products",
          icon: <Inventory2 />,
          path: "/dashboard/masterProducts?page=1&limit=10",
          module: MODULES.BASE,
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
            permissions: PERMISSIONS.REPORTS_VIEW,
          },
          {
            label: "Performance",
            path: "/dashboard/reports/performance",
            icon: <TrendingUpIcon fontSize="small" />,
        module: MODULES.REPORTS,
            permissions: PERMISSIONS.REPORTS_VIEW,
          },
          {
            label: "Overall Report",
            path: "/dashboard/reports/overall",
            icon: <AnalyticsIcon fontSize="small" />,
        module: MODULES.REPORTS,
            permissions: PERMISSIONS.REPORTS_VIEW,
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
        permissions: PERMISSIONS.STAFF_VIEW,
        module: MODULES.STAFF_BASE,
          },
          {
            label: "Sub Admins",
            path: "/dashboard/staff/sub-admins",
            icon: <SupervisedUserCircleIcon fontSize="small" />,
        permissions: PERMISSIONS.STAFF_VIEW,
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

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      className=""
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(0,0,0,0.08)",
          px: 1.5,

          // important: overflow hidden on paper
          overflow: "hidden",
          zIndex: 1200,
        },
      }}
      slotProps={{
        paper: {
          className: "",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SidebarHeader user={user} />

        <SidebarMenu
          sections={sections}
          pathname={pathname}
          variant={variant}
          onClose={onClose}
        />

        <SidebarFooter
          user={user}
          mode={mode}
          setMode={setMode}
          router={router}
          variant={variant}
          onClose={onClose}
        />
      </Box>
    </Drawer>
  );
}



    // const base = [
    //   {
    //     label: "Dashboard",
    //     icon: <DashboardIcon />,
    //     path: "/dashboard",
    //     module: MODULES.BASE,
    //     // permission: 
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
    //       label: "Reports",
    //       icon: <AssessmentIcon />,
    //       expandable: true,
    //       children: [
    //         {
    //           label: "Today's Report",
    //           path: "/dashboard/reports/today/v2",
    //           icon: <TodayIcon fontSize="small" />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Performance",
    //           path: "/dashboard/reports/performance",
    //           icon: <TrendingUpIcon fontSize="small" />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Overall Report",
    //           path: "/dashboard/reports/overall",
    //           icon: <AnalyticsIcon fontSize="small" />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Services",
    //           path: "/dashboard/reports/services",
    //           icon: <MiscellaneousServicesIcon fontSize="small" />,
    //           module: MODULES.REPORTS_SERVICES,
    //         },
    //         {
    //           label: "Download Logs",
    //           path: "/dashboard/reports/downloadLogs",
    //           icon: <FileDownloadIcon fontSize="small" />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //         {
    //           label: "Email Logs",
    //           path: "/dashboard/reports/emailLogs",
    //           icon: <MailLock fontSize="small" />,
    //           module: MODULES.REPORTS_BASE,
    //         },
    //       ],
    //       module: MODULES.REPORTS_BASE,
    //       // permissions: PERMISSIONS.RE
    //     },
    //     {
    //       label: "Staff",
    //       icon: <PeopleIcon />,
    //       expandable: true,
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
    //           icon: <AdminPanelSettingsIcon fontSize="small" />,
    //           module: MODULES.STAFF_GROUP,
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
    //         {
    //           label: "Flow Chart",
    //           path: "/dashboard/hierarchy",
    //           icon: <SchemaIcon fontSize="small" />,
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
    //       module: MODULES.WHATSAPP,
    //     },
    //     // { label: "WhatsApp", icon: <WhatsAppIcon />, path: "/dashboard/whatsapp" },
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
    //         }
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