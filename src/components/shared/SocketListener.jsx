"use client";
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

export default function SocketListener() {
    const queryClient = useQueryClient();
    const { fetchNotifications } = useNotifications();
    const { user } = useAuthStore();
    const joinedRef = useRef(false);
    const joinedCompanyRef = useRef(false);

    useEffect(() => {
        if (!user?._id) return;

        // connect only once
        if (!socket.connected) {
            socket.connect();
        }

        // join only once per user
        if (!joinedRef.current) {
            console.log("🟢 [SOCKET] joining user room", user._id);
            socket.emit("join", { userId: user._id });
            joinedRef.current = true;
        }

        if (!joinedCompanyRef.current) {
            socket.emit("join:company", { companyId: user.company });
            joinedCompanyRef.current = true;
        }

        const onWhatsAppIncoming = () => {
            console.log("📩 [SOCKET] whatsapp:incoming → refresh leads");
            queryClient.invalidateQueries(["leads"]);
        };

        const onNew = () => {
            // console.log("📩 [SOCKET] notification:new");
            fetchNotifications();
        };

        const onSync = () => {
            // console.log("📩 [SOCKET] notification:sync");
            fetchNotifications();
        };

        socket.on("notification:new", onNew);
        socket.on("notification:sync", onSync);
        socket.on("whatsapp:incoming", onWhatsAppIncoming);

        return () => {
            socket.off("notification:new", onNew);
            socket.off("notification:sync", onSync);
            socket.off("whatsapp:incoming", onWhatsAppIncoming);

            // optional: disconnect only if you want hard cleanup on logout
            // socket.disconnect();
            joinedRef.current = false;
            joinedCompanyRef.current = false;
        };
    }, [user?._id, user?.company]); // 🔑 only depend on user id

    return null;
}
