// app/dashboard/layout.jsx
"use client";
import React, { useEffect } from "react";
import LayoutDashboard from "@/components/dashboard/LayoutDashboard";
import { USERTYPE } from "@/lib/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import useSessionPoll from "@/hooks/useSessionPoll";
import toast from "react-hot-toast";
// import SocketListener from "@/components/shared/SocketListener";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const { user, accessToken, initializeAuth, clearAuth, initialized } = useAuthStore();

    // useEffect(() => {
    //     window.fbAsyncInit = function () {
    //         window.FB.init({
    //             appId: process.env.NEXT_PUBLIC_WHATSAPP_APP_ID,
    //             cookie: true,
    //             xfbml: false,
    //             version: "v24.0"
    //         });
    //     };

    //     const script = document.createElement("script");
    //     script.src = "https://connect.facebook.net/en_US/sdk.js";
    //     script.async = true;
    //     document.body.appendChild(script);
    // }, []);


    // useEffect(() => {
    //     const apiData = todayAttendanceQuery.data?.data;
    //     if (!apiData) return;

    //     if (!apiData.record) {
    //         clear();
    //     } else {
    //         setFromApi(apiData);
    //     }
    // }, [todayAttendanceQuery.data]);

    // useEffect(() => {
    //     fetchNotifications();
    // }, []);

    // useEffect(() => {
    //     const data = fetchLeadStatuses?.data?.data;
    //     // console.log("Lead Status Data: ", data)
    // }, [fetchLeadStatuses?.data])

    // useEffect(() => {
    // const configQuery = getRoleLabelsConfig();
    // const config = configQuery?.data?.data;
    // }, [getRoleLabelsConfig?.data])

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    useSessionPoll(10000);

    useEffect(() => {
        if (!initialized) return;

        // small delay is ok but not required now
        if (!accessToken) {
            clearAuth();
            router.replace("/");
            return;
        }

        if (user) {
            const allowed = [USERTYPE.EMPLOYEE, USERTYPE.ADMIN, USERTYPE.COMPANY];
            if (!allowed.includes(user.role)) {
                toast.error("You are not authorized to access this page!");
                clearAuth();
                router.replace("/");
            }
        }
    }, [user, accessToken, router, clearAuth, initialized]);

    if (!accessToken || !user) return null;

    return <LayoutDashboard>
        {/* <SocketListener /> */}
        {children}
    </LayoutDashboard>

}
