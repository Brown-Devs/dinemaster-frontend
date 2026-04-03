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
      <Box pr={3} py={1.5} display="flex" justifyContent="center" alignItems="center">
        <Image
          src={logoSrc}
          alt="Logo"
          width={250}
          height={88}
          style={{ objectFit: "contain", borderRadius: "8px" }}
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
