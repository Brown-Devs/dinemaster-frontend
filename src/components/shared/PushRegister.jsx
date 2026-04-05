// src/components/shared/PushRegister.jsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/services/axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/useAuthStore";
import { getDeviceInfo } from "@/utils/device";

function urlBase64ToUint8Array(base64String) {
    if (!base64String) return null;
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function PushRegister() {
    const user = useAuthStore((s) => s.user);
    const sessionId = useAuthStore((s) => s.sessionId);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        (async () => {
            if (!user || !sessionId) return;
            const deviceInfo = getDeviceInfo();
            // if (!deviceInfo.isMobile) return; // removed to allow all devices (kitchen staff use tablets/desktops)

            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

            try {
                await navigator.serviceWorker.register("/sw.js");
                const reg = await navigator.serviceWorker.ready;
                let subscription = await reg.pushManager.getSubscription();
                if (!subscription) {
                    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                    if (!vapidKey) {
                        console.warn("PushRegister: NEXT_PUBLIC_VAPID_PUBLIC_KEY missing");
                        return;
                    }

                    const perm = await Notification.requestPermission();
                    if (perm !== "granted") {
                        console.warn("Notification permission denied");
                        return;
                    }

                    const applicationServerKey = urlBase64ToUint8Array(vapidKey);
                    if (!applicationServerKey) return;

                    subscription = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey
                    });
                }

                // deviceId maintained in localStorage
                const deviceIdKey = "crm_device_id";
                let deviceId = localStorage.getItem(deviceIdKey);
                if (!deviceId) {
                    deviceId = uuidv4();
                    localStorage.setItem(deviceIdKey, deviceId);
                }

                // send to backend
                await api.post("/subscriptions", {
                    subscription,
                    deviceId,
                    deviceInfo,
                    sessionId
                });

                setRegistered(true);
                console.log("Push subscription saved");
            } catch (err) {
                console.error("PushRegister error:", err);
            }
        })();
    }, [user, sessionId]);

    return null;
}
