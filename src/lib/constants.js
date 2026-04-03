// lib/constants.js
export const USERTYPE = {
    ADMIN: 'super_admin',
    COMPANY: 'admin',
    EMPLOYEE: 'subadmin',
}

export const USER_DESIGNATIONS = {
    SALES_MANAGER: 'Sales Manager',
    SALES_EXECUTIVE: 'Sales Executive',
    COMPANY: 'Company',
    TEAM_LEADER: 'Team Leader',
}

export const DEVICE_TYPES = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
    TABLET: 'tablet',
}

export const ATTENDANCE_STATUSES = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BREAK: 'break'
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
    // Leads
    LEADS_VIEW: "leads.view",
    LEADS_DELETE: "leads.delete",
    LEADS_DOWNLOAD: "leads.download",
    LEADS_CREATE_MANUAL: "leads.createManual",
    LEADS_BULK_UPLOAD: "leads.bulkUpload",
    LEADS_ASSIGN: "leads.assign",
    LEADS_CALL: "leads.call",
    LEADS_WHATSAPP: "leads.whatsapp",
    LEADS_MAIL: "leads.mail",
    LEADS_BULK_ASSIGN: "leads.bulkAssign",
    LEADS_UPDATE_DETAILS: "leads.updateDetails",
    LEADS_UPDATE_STATUS: "leads.updateStatus",
    LEADS_UPDATE_PIPELINE: "leads.updatePipeline",

    // Lead Documents
    LEAD_DOCS_VIEW: "leads.docs.view",
    LEAD_DOCS_UPLOAD: "leads.docs.upload",
    LEAD_DOCS_DELETE: "leads.docs.delete",
    LEAD_DOCS_DOWNLOAD: "leads.docs.download",
    LEAD_DOCS_REQUEST: "leads.docs.request",
    LEAD_DOCS_FORM_CREATE: "leads.docs.form.create",
    LEAD_DOCS_FORM_EDIT: "leads.docs.form.edit",
    LEAD_DOCS_FORM_DELETE: "leads.docs.form.delete",

    //Marketing
    MARKETING_MAIL: "marketing.mail",
    MARKETING_TEMPLATES_VIEW: "marketing.templates.view",
    MARKETING_TEMPLATES_CREATE: "marketing.templates.create",

    // Tasks
    TASKS_VIEW: "tasks.view",
    TASKS_CREATE: "tasks.create",
    TASKS_UPDATE: "tasks.update",
    TASKS_DELETE: "tasks.delete",

    INVOICE_VIEW: "invoice.view",
    INVOICE_DOWNLOAD: "invoice.download",
    INVOICE_SEND: "invoice.send",
    INVOICE_CREATE: "invoice.create",
    INVOICE_UPDATE: "invoice.update",
    INVOICE_DELETE: "invoice.delete",

    ITINERARY_VIEW: "itinerary.view",
    ITINERARY_DOWNLOAD: "itinerary.download",
    ITINERARY_SEND: "itinerary.send",
    ITINERARY_CREATE: "itinerary.create",
    ITINERARY_UPDATE: "itinerary.update",
    ITINERARY_DELETE: "itinerary.delete",

    // Meetings
    MEETINGS_VIEW: "meetings.view",
    MEETINGS_CREATE: "meetings.create",
    MEETINGS_UPDATE: "meetings.update",
    MEETINGS_DELETE: "meetings.delete",
    TASKS_DELETE: "tasks.delete",

    // Visits
    VISITS_VIEW: "visits.view",
    VISITS_CREATE: "visits.create",
    VISITS_UPDATE: "visits.update",
    VISITS_UPDATE_STATUS: "visits.updateStatus",
    VISITS_DELETE: "visits.delete",

    // PROJECT
    PROJECT_VIEW: "project.view",
    PROJECT_CREATE: "project.create",
    PROJECT_UPDATE: "project.update",
    PROJECT_UPDATE_STATUS: "project.updateStatus",
    PROJECT_DELETE: "project.delete",

    // PROPERTY
    PROPERTY_VIEW: "property.view",
    PROPERTY_CREATE: "property.create",
    PROPERTY_UPDATE: "property.update",
    PROPERTY_UPDATE_STATUS: "property.updateStatus",
    PROPERTY_DELETE: "property.delete",

    // Services
    SERVICES_VIEW: "services.view",
    SERVICES_CREATE: "services.create",
    SERVICES_UPDATE: "services.update",
    SERVICES_DELETE: "services.delete",

    // Services
    PRODUCTS_VIEW: "products.view",
    PRODUCTS_CREATE: "products.create",
    PRODUCTS_UPDATE: "products.update",
    PRODUCTS_DELETE: "products.delete",

    // Sales Executives (management by managers)
    SALES_EXEC_VIEW: "salesExecutives.view",
    SALES_EXEC_CREATE: "salesExecutives.create",
    SALES_EXEC_UPDATE: "salesExecutives.update",
    SALES_EXEC_DELETE: "salesExecutives.delete",

    // Tasks
    ASSETS_VIEW: "assets.view",
    ASSETS_CREATE: "assets.create",
    ASSETS_DELETE: "assets.delete",
    ASSETS_DOWNLOAD: "assets.download",

    CALENDAR_VIEW: "calendar.view"
};

export const MODULES = {
    BASE: "modules.base",

    LEADS: "modules.lead",
    SERVICES: "modules.service",
    PRODUCTS: "modules.product",
    PROPERTY: "modules.property",
    VISITS: "modules.visit",
    MEETING: "modules.meeting",
    TASK: "modules.task",
    ASSETS: "modules.asset",
    ATTENDANCE: "modules.attendance",
    INVOICE: "modules.invoice",
    ITINERARY: "modules.itinerary",
    WHATSAPP: "modules.whatsapp",
    MARKETING: "modules.marketing",
    TOOLS: "modules.tool",
    CALENDAR: "modules.calendar",

    // documents
    LEAD_DOCS: "modules.leadDocs",

    // Core Integration
    INTEGRATION: "modules.integration",

    // Integration Modules
    INTEGRATION_META: "modules.integration.meta",
    INTEGRATION_WHATSAPP: "modules.integration.whatsapp",
    INTEGRATION_WEBSITE: "modules.integration.website",
    INTEGRATION_JUSTDIAL: "modules.integration.justdial",
    INTEGRATION_INDIAMART: "modules.integration.indiamart",
    INTEGRATION_SULEKHA: "modules.integration.sulekha",
    INTEGRATION_99ACRES: "modules.integration.99acres",
    INTEGRATION_HOUSING: "modules.integration.housing",
    INTEGRATION_MAGICBRICKS: "modules.integration.magicbricks",

    STAFF_BASE: "modules.staff.base",
    STAFF_GROUP: "modules.staff.group",
    STAFF_TEAM: "modules.staff.team",

    REPORTS_BASE: "modules.report.base",
    REPORTS_TODAY: "modules.report.today",
    REPORTS_OVERALL: "modules.report.overall",
    REPORTS_PERFORMANCE: "modules.report.performance",
    REPORTS_SERVICES: "modules.report.service",
    REPORTS_PRODUCTS: "modules.report.product",
    REPORTS_PROPERTY: "modules.report.property",
};


// used in leads tab
export const LEAD_FILTERS_META = {
    status: {
        label: "Status",
        options: ["New", "Contacted", "Converted", "Lost", "Junk Lead"]
    },
    source: {
        label: "Source",
        options: ["Website", "Bulk Upload", "Meta Ads", "Whatsapp", "Manual Upload"]
    },
    pipeline: {
        label: "Pipeline",
        options: ["Hot", "Warm", "Meeting Scheduled", "Cold"]
    }
};

// Status chips
export const STATUS_CHIP_COLORS = {
    "New": {
        bg: "bg-gray-100",
        text: "text-gray-700",
    },
    "Attempted to Contact": {
        bg: "bg-amber-100",
        text: "text-amber-700",
    },
    "Contacted": {
        bg: "bg-green-100",
        text: "text-green-700",
    },
    "In Negotiation": {
        bg: "bg-sky-100",
        text: "text-sky-700",
    },
    "Converted": {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
    },
    "Junk Lead": {
        bg: "bg-gray-200",
        text: "text-gray-600",
    },
    "Lost": {
        bg: "bg-red-100",
        text: "text-red-700",
    },
    "Contact in Future": {
        bg: "bg-violet-100",
        text: "text-violet-700",
    },
};

// Pipeline chips
export const PIPELINE_CHIP_COLORS = {
    "Hot": {
        bg: "bg-red-100",
        text: "text-red-700",
    },
    "Warm": {
        bg: "bg-orange-100",
        text: "text-orange-700",
    },
    "Cold": {
        bg: "bg-blue-100",
        text: "text-blue-600",
    },
    "Closed": {
        bg: "bg-green-100",
        text: "text-green-600",
    },
    "Lost": {
        bg: "bg-slate-100",
        text: "text-slate-600",
    },
};

// Task status chips
export const TASK_STATUS_CHIP_COLORS = {
    "Not Started": {
        bg: "bg-gray-200",
        text: "text-gray-800",
        border: "border border-gray-300",
    },
    "In Progress": {
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border border-amber-300",
    },
    "Completed": {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border border-green-300",
    },
    "Default": {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border border-gray-300",
    },
};


export const LEADS_COLUMNS = [
    // { key: "select", label: "", fixed: true },
    // { key: "sr", label: "Sr No", fixed: true },
    { key: "name", label: "Name", fixed: true },
    { key: "contact", label: "Contact" },
    { key: "project", label: "Project" },
    { key: "property", label: "Property" },
    { key: "service", label: "Service" },
    { key: "amount", label: "Amount" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
    { key: "pipeline", label: "Lead Stage" },
    { key: "assignedToEmp", label: "Assigned To" },
    { key: "team", label: "Team" },
    { key: "group", label: "Group" },
    { key: "timeline", label: "Timeline" },
    // { key: "actions", label: "Actions", fixed: true },
];

export const LEAD_COLUMNS_KEYS = {
    SELECT: "select",
    SR: "sr",
    NAME: "name",
    CONTACT: "contact",
    SERVICE: "service",
    PROJECT: "project",
    PROPERTY: "property",
    AMOUNT: "amount",
    SOURCE: "source",
    STATUS: "status",
    PIPELINE: "pipeline",
    ASSIGNED_TO: "assignedToEmp",
    TEAM: "team",
    GROUP: "group",
    TIMELINE: "timeline",
    ACTIONS: "actions",
};

export const LEAD_PIPELINE = [
    'Hot', 'Warm', 'Cold', 'Closed', 'Lost'
]

export const LEAD_SOURCE_OPTIONS = [
    "Website",
    "App",
    "Manual Upload",
    "Bulk Upload",
    "Meta Ads",
    "Whatsapp",
    "Justdial",
    "GMB",
    "Google Ads",
    "IndiaMart",
    "Tradeindia",
    "Sulekha",
    "Housing.com",
    "MagicBricks",
    "99Acre",
    "Referral",
    "Other",
];

export const LEAD_SOURCE_OPTIONS_AUTOMATION = [
    "Website",
    "App",
    "Manual Upload",
    // "Bulk Upload",
    "Meta Ads",
    "Whatsapp",
    "Justdial",
    "GMB",
    "Google Ads",
    "IndiaMart",
    "Tradeindia",
    "Sulekha",
    "Housing.com",
    "MagicBricks",
    "99Acre",
    "Referral",
    "Other",
];

export const AUTOMATION_VARIABLE_SOURCES = [
    { value: "lead.name", label: "Lead Name" },
    { value: "lead.phoneNo", label: "Phone Number" },
    { value: "lead.email", label: "Email" },
    { value: "lead.source", label: "Lead Source" },
    { value: "lead.service", label: "Service" },
    { value: "custom", label: "Custom Value" }
];

export const AUTOMATION_VARIABLE_SOURCES_VISITS = [
    ...AUTOMATION_VARIABLE_SOURCES.filter(opt => opt.value !== "custom"),
    { value: "visit.dateTime", label: "Visit Date" },
    { value: "custom", label: "Custom Value" }
];
