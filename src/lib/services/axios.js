// src/lib/services/api.js
import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000/api/v1";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // backend sets cookie; safe to include
});

// attach Authorization header from Zustand (if present)
api.interceptors.request.use((config) => {
    try {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        }
    } catch (e) { /* noop */ }
    return config;
}, (err) => Promise.reject(err));

// Response interceptor: if 401 -> clear auth from store and redirect (client handles redirect)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
            try {
                useAuthStore.getState().clearAuth?.();
            } catch (e) { }
        }
        return Promise.reject(err);
    }
);

export default api;
