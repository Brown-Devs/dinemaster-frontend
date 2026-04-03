// src/components/shared/ReactQueryProvider.jsx
"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🔥 Create a function to initialize QueryClient
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 1000 * 10,
                // 🔥 Important for SSR
                enabled: typeof window !== 'undefined',
            },
        },
    });
}

let browserQueryClient = undefined;

function getQueryClient() {
    // Server: always make a new query client
    if (typeof window === 'undefined') {
        return makeQueryClient();
    }
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}

export default function ReactQueryProvider({ children }) {
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}