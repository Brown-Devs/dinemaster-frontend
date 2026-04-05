"use client";
import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const PermissionDenied = ({ 
  title = "Access Restricted", 
  message = "You don't have the required permissions to view this module. Please contact your administrator if you believe this is an error." 
}) => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "rgba(244, 67, 54, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(244, 67, 54, 0.4)" },
              "70%": { transform: "scale(1.05)", boxShadow: "0 0 0 15px rgba(244, 67, 54, 0)" },
              "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(244, 67, 54, 0)" },
            },
          }}
        >
          <ShieldOutlinedIcon sx={{ fontSize: 50, color: "error.main" }} />
        </Box>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 800, color: "text.primary", mb: 2 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 4, maxWidth: "500px", lineHeight: 1.6 }}
        >
          {message}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/dashboard" passHref>
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: "capitalize",
                px: 4,
                py: 1.5,
                borderRadius: "10px",
                boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
              }}
            >
              Return to Dashboard
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default PermissionDenied;
