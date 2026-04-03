"use client";

import React from "react";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import { useThemeStore } from "@/stores/useThemeStore";

export default function SidebarHeader({ user }) {
  const { mode, isHydrated } = useThemeStore();

  const logoSrc =
    isHydrated && mode === "dark" ? "/logo2DT.png" : "/logo2L.png";

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Box pr={3} py={2.5} display="flex" justifyContent="center" alignItems="center">
        <img
          src={logoSrc}
          alt="Logo"
          className="object-contain rounded-md w-auto h-10"
          priority
        />
      </Box>

      <div className="text-center items-center justify-center py-2 w-full font-semibold bg-card2 rounded-md sm:hidden">
        <h2 className="capitalize px-6 text-center">
          {user?.role !== "employee"
            ? user?.role
            : user?.designation || "Admin"}{" "}
          Panel
        </h2>
      </div>

      <Divider />
    </Box>
  );
}
