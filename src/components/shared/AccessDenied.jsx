"use client";

import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/navigation";

export default function AccessDenied({
  title = "Access Restricted",
  description = "You do not have permission to view this section.",
  showBack = true,
  actionLabel = "Go Back",
  onAction,
}) {
  const router = useRouter();

  const handleAction = () => {
    if (onAction) return onAction();
    router.back();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: { xs: 3, sm: 6 },
        textAlign: "center",
        maxWidth: 520,
        mx: "auto",
        mt: 6,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <LockOutlinedIcon fontSize="medium" />
      </Box>

      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, mb: 3 }}
      >
        {description}
      </Typography>

      {showBack && (
        <Button
          variant="outlined"
          size="small"
          onClick={handleAction}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
}