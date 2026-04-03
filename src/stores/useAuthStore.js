// src/stores/useAuthStore.js
import { create } from "zustand";

const LOCALSTORAGE_KEY = "authState";

function loadFromLocalStorage() {
    if (typeof window === "undefined") return null;
    try {
        const str = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!str) return null;
        return JSON.parse(str);
    } catch {
        return null;
    }
}

// src/stores/useAuthStore.js - add logging
function saveToLocalStorage({ user, accessToken, sessionId }) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ user, accessToken, sessionId }));
    } catch (e) {
        console.error("[auth] saveToLocalStorage error", e);
    }
}

export const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    sessionId: null,
    initialized: false, // new

    setAuth: (user, accessToken, sessionId) => {
        set({ user, accessToken, sessionId, initialized: true });
        saveToLocalStorage({ user, accessToken, sessionId });
    },

    clearAuth: () => {
        console.trace("[auth] clearAuth called - clearing state and localStorage");
        set({ user: null, accessToken: null, sessionId: null, initialized: true });
        if (typeof window !== "undefined") localStorage.removeItem(LOCALSTORAGE_KEY);
    },

    initializeAuth: () => {
        const saved = loadFromLocalStorage();
        if (saved && saved.user && saved.accessToken) {
            set({
                user: saved.user,
                accessToken: saved.accessToken,
                sessionId: saved.sessionId || null,
                initialized: true,
            });
        } else {
            // mark initialized even if nothing present so app knows we tried
            set({ initialized: true });
        }
    },
}));
