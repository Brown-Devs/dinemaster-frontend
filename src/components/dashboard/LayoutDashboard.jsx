// app/dashboard/LayoutDashboard.jsx  

import React, { useState } from "react"
import Sidebar from "../../components/dashboard/Sidebar"
import Navbar from "../../components/dashboard/Navbar"
// import NotificationDialog from "../shared/notifications/NotificationDialog"
import SidebarCollapsed from "./sidebar/SidebarCollapsed"

function LayoutDashboard({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false)

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev)
    }
    return (
        <div className="flex h-screen overflow-x-hidden">
            {/* Temporary (mobile) sidebar */}
            <Sidebar
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            />

            {/* Desktop collapsed rail */}
            <div className="max-[900px]:hidden">
                <SidebarCollapsed onOpenFull={() => setDesktopDrawerOpen(true)} />
            </div>

            {/* Full drawer overlay */}
            <Sidebar
                variant="temporary"
                open={desktopDrawerOpen}
                onClose={() => setDesktopDrawerOpen(false)}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Navbar */}
                <Navbar onDrawerToggle={handleDrawerToggle} onOpenTasks={() => setNotifOpen(true)} />

                {/* Page content, pushed below the AppBar (default 64px height) */}
                <main className="flex-1 pt-[42px] sm:pt-[29px] lg:pt-[32px] overflow-y-auto overflow-x-hidden bg-background min-w-0">
                    {children}
                </main>
            </div>
{/* 
            <NotificationDialog
                open={notifOpen}
                defaultTab="tasks"
                onClose={() => setNotifOpen(false)}
            /> */}
        </div>
    )
}

export default LayoutDashboard