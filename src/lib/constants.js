// lib/constants.js
export const USERTYPE = {
    ADMIN: 'super_admin',
    COMPANY: 'admin',
    EMPLOYEE: 'subadmin',
}

export const DEVICE_TYPES = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
    TABLET: 'tablet',
}

export const ROLES = {
    ADMIN: 'super_admin',
    COMPANY: 'admin',
    EMPLOYEE: 'subadmin'
}

export const SYSTEM_ROLES = {
    SALES_MANAGER: 'sales_manager',
    SALES_EXECUTIVE: 'sales_executive',
    TEAM_LEADER: 'team_leader',
    COMPANY_ADMIN: 'company_admin'
}

export const PERMISSIONS = {

    // Dashboard
    DASHBOARD_VIEW: "dashboard.view",

    // Orders
    ORDERS_VIEW: "orders.view",
    ORDERS_UPDATE: "orders.update",

    // WhatsApp
    // WHATSAPP_VIEW: "whatsapp.view",
    // WHATSAPP_SEND: "whatsapp.send",
    // WHATSAPP_MANAGE_TEMPLATES: "whatsapp.manageTemplates",

    // Products
    PRODUCTS_VIEW: "products.view",
    PRODUCTS_CREATE: "products.create",
    PRODUCTS_UPDATE: "products.update",

    // Categories
    CATEGORIES_VIEW: "categories.view",
    CATEGORIES_CREATE: "categories.create",
    CATEGORIES_UPDATE: "categories.update",

    // Billing
    BILLING_VIEW: "billing.view",
    BILLING_CREATE: "billing.create",

    // Customers
    CUSTOMERS_VIEW: "customers.view",

    // Staff
    STAFF_VIEW: "staff.view",
    STAFF_CREATE: "staff.create",
    STAFF_UPDATE: "staff.update",

    // Kitchen
    KITCHEN_VIEW: "kitchen.view",
    KITCHEN_UPDATE: "kitchen.update",
};

export const MODULES = {
    BASE: "modules.base",
    STAFF_BASE: "modules.staff.base",
    ORDERS: "modules.orders",
    REPORTS: "modules.reports",
    WHATSAPP: "modules.whatsapp",
    PRODUCTS: "modules.products",
    CATEGORIES: "modules.categories",
    SETTINGS: "modules.settings",
    BILLING: "modules.billing",
    CUSTOMERS: "modules.customers",
    KITCHEN: "modules.kitchen",
};


// Dinemaster Status Chips (Example placeholders - can be expanded)
export const DINEMASTER_STATUS_COLORS = {
    "Pending": { bg: "bg-amber-100", text: "text-amber-700" },
    "Completed": { bg: "bg-green-100", text: "text-green-700" },
    "Cancelled": { bg: "bg-red-100", text: "text-red-700" },
};

