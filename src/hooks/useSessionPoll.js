"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/services/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function useSessionPoll(intervalMs = 10000) {
    const [isMounted, setIsMounted] = useState(false);
    const sessionId = useAuthStore((s) => s.sessionId);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const router = useRouter();
    const handledLogoutRef = useRef(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const query = useQuery({
        queryKey: ["session", sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error("no-session");
            const res = await api.get(`/auth/session/${sessionId}`);
            return res.data;
        },
        enabled: isMounted && !!sessionId,
        refetchInterval: intervalMs,
        retry: false,
        refetchOnWindowFocus: false,
    });

    // Handle errors using useEffect
    useEffect(() => {
        if (query.error && !handledLogoutRef.current) {
            const err = query.error;
            const status = err?.response?.status ?? err?.status ?? null;
            const message = err?.response?.data?.message || err?.message || "Session error";

            console.log("Session error detected:", { status, message });

            // 401 or 404 = invalid session, logout user
            if (status === 401 || status === 404) {
                handledLogoutRef.current = true;

                toast.error("Session expired. Logging out...");

                // Clear auth first
                clearAuth();

                // Then redirect
                setTimeout(() => {
                    router.replace("/");
                }, 1000);
            } else if (err?.message !== "no-session") {
                // Other errors (not no-session)
                console.warn("Session poll error:", message);
            }
        }
    }, [query.error, clearAuth, router]);

    // Reset handledLogout when sessionId changes (new login)
    useEffect(() => {
        if (sessionId) {
            handledLogoutRef.current = false;
        }
    }, [sessionId]);

    return query;
}