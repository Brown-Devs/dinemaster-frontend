// components/dashboard/MainLayoutProvider.jsx
"use client";
import React, { useMemo, useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import createAppTheme from "@/theme/muiTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useThemeStore, getInitialTheme } from '@/stores/useThemeStore';

export default function MainLayoutProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const { mode, setMode, isHydrated } = useThemeStore();

  useEffect(() => {
    if (!isHydrated) {
      const initialTheme = getInitialTheme();
      setMode(initialTheme);
    }
  }, [setMode, isHydrated]);

  const theme = useMemo(() => {
    return createAppTheme(isHydrated ? mode : 'light');
  }, [mode, isHydrated]);

  if (!isHydrated) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={createAppTheme('light')}>
          <CssBaseline />
          <div style={{ visibility: 'hidden' }}>{children}</div>
        </ThemeProvider>
        <Toaster position="top-right" />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}