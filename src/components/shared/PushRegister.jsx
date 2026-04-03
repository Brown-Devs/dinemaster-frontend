// src/components/shared/PushRegister.jsx
"use client";
import { useEffect, useState } from "react";
import api from "@/lib/services/axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/useAuthStore";
import { getDeviceInfo } from "@/utils/device";

function urlBase64ToUint8Array(base64String) {
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
            if (!deviceInfo.isMobile) return; // only mobile  register

            if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

            try {
                await navigator.serviceWorker.register("/sw.js");
                const reg = await navigator.serviceWorker.ready;
                let subscription = await reg.pushManager.getSubscription();
                if (!subscription) {
                    const perm = await Notification.requestPermission();
                    if (perm !== "granted") {
                        console.warn("Notification permission denied");
                        return;
                    }
                    subscription = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
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
                await api.post("/push/save-subscription", {
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
