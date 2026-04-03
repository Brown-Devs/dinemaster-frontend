// src/components/shared/SwMessageHandler.jsx
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import api from "@/lib/services/axios";

export default function SwMessageHandler() {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const router = useRouter();

    useEffect(() => {
        function handleMessage(ev) {
            const msg = ev.data;
            if (!msg) return;
            if (msg.type === "FORCE_LOGOUT") {
                // best-effort to inform backend
                const deviceId = localStorage.getItem("crm_device_id");
                api.post("/auth/logout", { deviceId }).catch(() => { });
                clearAuth();
                router.replace("/");
                alert("You were logged out because this account signed in elsewhere.");
            }
        }

        navigator.serviceWorker?.addEventListener?.("message", handleMessage);
        return () => navigator.serviceWorker?.removeEventListener?.("message", handleMessage);
    }, [clearAuth, router]);

    return null;
}
