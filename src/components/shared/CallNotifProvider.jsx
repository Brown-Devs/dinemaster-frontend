// src/components/shared/CallNotifProvider.jsx
"use client";
import { useEffect } from "react";
import PushRegister from "./PushRegister";
// import SwMessageHandler from "./SwMessageHandler";

export default function CallNotifProvider({ children }) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch(console.error);
        }
    }, []);

    return (
        <>
            <PushRegister />
            {/* <SwMessageHandler /> */}
            {children}
        </>
    );
}
