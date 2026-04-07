"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Collapse
} from "@mui/material";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import PaymentsIcon from "@mui/icons-material/Payments";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PrintIcon from "@mui/icons-material/Print";
import { ViewOrderDialog as BaseViewOrderDialog } from "./ViewOrderDialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCompanies } from "@/hooks/useCompanies";
import { pdf } from "@react-pdf/renderer";
import { OrderReceiptPDF } from "@/components/shared/OrderReceiptPDF";
import { toast } from "react-hot-toast";

// Brand Color Consistency
const BRAND_RED = "#e11d48";

const typeLabels = {
  dinein: "Dine In",
  delivery: "Delivery",
  packing: "Packing",
};

const statusColors = {
  new: BRAND_RED,
  prepared: "#f59e0b",
  out_for_delivery: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
  paid: "#10b981",
  not_paid: "#f59e0b",
};

// Helper for status parsing
const formatStatus = (status) => {
  if (!status) return "";
  return status
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function ViewOrderDialog({ open, onClose, order }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  const { user } = useAuthStore();
  const { getCompanyDetails } = useCompanies();
  // Safe fallback if order.company isn't populated yet
  const companyId = order?.company?._id || order?.company || user?.company;
  const { data: companyRes } = getCompanyDetails(companyId);
  const company = companyRes?.data || order?.company || {};

  const getImageBase64 = (url) => {
    if (!url) return Promise.resolve(null);
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";

        // Use proxy for absolute URLs to definitively bypass CORS restrictions
        const isAbsolute = url.startsWith("http");
        const objectUrl = isAbsolute
          ? `/api/image-proxy?url=${encodeURIComponent(url)}`
          : url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            const value = brightness < 150 ? 0 : 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            if (data[i + 3] > 0 && value === 0) data[i + 3] = 255;
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
        img.src = objectUrl;
      } catch (e) {
        resolve(null);
      }
    });
  };
  const handlePrintReceipt = async () => {
    if (!order) return;
    setIsPrinting(true);
    const loadingToast = toast.loading("Generating receipt...");

    try {
      // Use company details already fetched for reliable logo/QR access
      const companyLogoUrl = company?.logo || null;
      const paymentQrUrl = company?.paymentQr || null;

      const [companyLogo, paymentQr, brandingLogo] = await Promise.all([
        companyLogoUrl ? getImageBase64(companyLogoUrl) : Promise.resolve(null),
        paymentQrUrl ? getImageBase64(paymentQrUrl) : Promise.resolve(null),
        getImageBase64("/logo2L.png")
      ]);

      const blob = await pdf(
        <OrderReceiptPDF
          order={order}
          companyLogo={companyLogo}
          paymentQr={paymentQr}
          brandingLogo={brandingLogo}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      // Direct Print Implementation: Using a hidden iframe to trigger the print dialog
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.print();
          // Cleanup after a delay to ensure print dialog is triggered
          setTimeout(() => {
            document.body.removeChild(iframe);
            URL.revokeObjectURL(url);
          }, 1000);
        }, 500);
      };

      toast.success("Print dialog opened", { id: loadingToast });
    } catch (error) {
      console.error("Print Error:", error);
      toast.error("Failed to generate receipt", { id: loadingToast });
    } finally {
      setIsPrinting(false);
    }
  };

  if (!order) return null;

  const {
    items = [],
    customer,
    totalAmount,
    subTotal,
    additionalDiscount,
    payments,
    orderType,
    orderId,
    status,
    paymentStatus,
    createdAt,
    createdBy
  } = order;

  const customerName = typeof customer === 'object' ? customer?.name : null;
  const customerMobile = typeof customer === 'object' ? (customer?.mobileNo || customer?.mobile) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? 1.5 : 2.5,
          bgcolor: "var(--card)",
          backgroundImage: "none",
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "none",
          margin: isSmallScreen ? 1 : 2,
          maxHeight: isSmallScreen ? '96vh' : '90vh'
        }
      }}
    >
      {/* Header Section */}
      <Box sx={{
        p: isSmallScreen ? 1.5 : 2.5,
        px: isSmallScreen ? 2 : 3,
        bgcolor: `${BRAND_RED}08`,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        alignItems: isSmallScreen ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 2
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: isSmallScreen ? 1.5 : 3 }}>
          <Box
            sx={{
              width: isSmallScreen ? 40 : 48,
              height: isSmallScreen ? 40 : 48,
              bgcolor: BRAND_RED,
              color: "white",
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: isSmallScreen ? 22 : 28 }} />
          </Box>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Typography variant={isSmallScreen ? "subtitle1" : "h6"} fontWeight="900" sx={{ color: "var(--fg)", lineHeight: 1 }}>
                Order Details
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={formatStatus(status)}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    bgcolor: statusColors[status] || BRAND_RED,
                    color: 'white',
                    px: 0.5
                  }}
                />
                <Chip
                  label={paymentStatus === 'paid' ? "Paid" : "Unpaid"}
                  size="small"
                  variant="filled"
                  sx={{
                    height: 20,
                    fontSize: '10px',
                    fontWeight: 'bold',
                    bgcolor: statusColors[paymentStatus] || "#f59e0b",
                    color: 'white',
                    px: 0.5
                  }}
                />
              </Stack>
            </div>
            <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>
              ID: <span className="font-bold" style={{ color: BRAND_RED }}>#{orderId || order._id?.slice(-8).toUpperCase()}</span> • {format(new Date(createdAt), "dd MMM yyyy, hh:mm a")}
            </Typography>
          </div>
        </Box>
        <Box sx={{ display: "flex", alignSelf: isSmallScreen ? "flex-end" : "center", mt: isSmallScreen ? -6 : 0 }}>
          <IconButton onClick={onClose} size="small" sx={{ color: "var(--muted)", bgcolor: "var(--card)", border: '1px solid var(--border)', borderRadius: 1.5 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content - RESTORED: Fixed height and dual scrollbars */}
      <DialogContent sx={{ p: 0, overflow: isMobile ? 'auto' : 'hidden' }} className="no-scrollbar">
        <Box sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: isMobile ? 'auto' : 500,
          height: isMobile ? 'auto' : 'calc(90vh - 140px)'
        }}>

          {/* LEFT: Item Details - Scrollable on Desktop */}
          <Box sx={{
            flex: 1.4,
            p: isSmallScreen ? 2 : 3,
            borderRight: isMobile ? 'none' : "1px solid var(--border)",
            borderBottom: isMobile ? "1px solid var(--border)" : 'none',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: isItemsExpanded ? 2 : 0,
                cursor: 'pointer'
              }}
              onClick={() => setIsItemsExpanded(!isItemsExpanded)}
            >
              <Typography variant="subtitle2" fontWeight="bold" sx={{ display: "flex", alignItems: "center", gap: 1, color: "var(--muted)", textTransform: 'uppercase', letterSpacing: 1, fontSize: isSmallScreen ? '11px' : '13px' }}>
                <ShoppingBagIcon sx={{ fontSize: 16, color: BRAND_RED }} />
                Ordered Items ({items.length})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={typeLabels[orderType] || orderType}
                  size="small"
                  variant="outlined"
                  icon={orderType === 'dinein' ? <FastfoodIcon /> : orderType === 'delivery' ? <LocalShippingIcon /> : <ShoppingBasketIcon />}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 1.5,
                    px: 1,
                    borderColor: BRAND_RED,
                    color: BRAND_RED,
                    '& .MuiSvgIcon-root': { fontSize: 14, color: 'inherit !important' }
                  }}
                />
                <IconButton size="small" sx={{ ml: 0.5, p: 0.5 }}>
                  {isItemsExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={isItemsExpanded}>
              <Stack
                spacing={1.5}
                sx={{
                  py: 1,
                  maxHeight: isMobile ? 'none' : 'calc(90vh - 280px)',
                  overflowY: isMobile ? 'visible' : 'auto',
                  pr: isMobile ? 0 : 0.5,
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
                }}
              >
                {items.map((item, idx) => {
                  const productObj = typeof item.productId === 'object' ? item.productId : null;
                  const imgSource = productObj?.imageUrl || productObj?.imageURL;

                  return (
                    <Box key={idx} sx={{ p: isSmallScreen ? 1.5 : 2, borderRadius: 2.5, border: "1px solid var(--border)", bgcolor: `${BRAND_RED}02`, display: "flex", alignItems: "center", gap: isSmallScreen ? 1.5 : 2.5 }}>
                      <Box sx={{
                        width: isSmallScreen ? 48 : 56,
                        height: isSmallScreen ? 48 : 56,
                        bgcolor: "var(--card)",
                        borderRadius: 2,
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0
                      }}>
                        {imgSource ? (
                          <img src={imgSource} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <RestaurantMenuIcon sx={{ color: "var(--muted)", opacity: 0.3, fontSize: isSmallScreen ? 20 : 28 }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                          <div className="min-w-0">
                            <Typography variant="subtitle2" fontWeight="800" sx={{ color: "var(--fg)", lineHeight: 1.2 }}>
                              {item.name}
                            </Typography>
                            <div className="flex items-center gap-2 mt-1">
                              <Typography variant="caption" fontWeight="bold" sx={{ color: BRAND_RED, bgcolor: `${BRAND_RED}15`, px: 1, py: 0.2, borderRadius: 0.5 }}>
                                {item.variant?.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>
                                x{item.quantity} • ₹{item.variant?.price}
                              </Typography>
                            </div>
                          </div>
                          <Typography variant="subtitle2" fontWeight="900" sx={{ color: "var(--fg)", textAlign: 'right' }}>
                            ₹{(item.variant?.price + (item.addOns?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                          </Typography>
                        </Box>

                        {item.addOns?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.addOns.map((addon, aIdx) => (
                              <span
                                key={aIdx}
                                className="text-[10px] font-bold text-red-600/70 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md"
                              >
                                + {addon.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Collapse>
          </Box>

          {/* RIGHT: Summary & Logistics - RESTORED: Independent scrollbar */}
          <Box sx={{
            flex: 1,
            p: isSmallScreen ? 2 : 3,
            bgcolor: `${BRAND_RED}02`,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxHeight: isMobile ? 'none' : 'calc(90vh - 140px)',
            overflowY: 'auto', // Back to independent scroll
            borderLeft: isMobile ? 'none' : "1px solid var(--border)"
          }}>

            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: "var(--muted)", textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 1, fontSize: isSmallScreen ? '11px' : '13px' }}>
                <PaymentsIcon sx={{ fontSize: 16, color: BRAND_RED }} />
                Finance Summary
              </Typography>
              <Paper variant="outlined" sx={{ p: isSmallScreen ? 2 : 2.5, borderRadius: 3, bgcolor: "var(--card)", border: '1px solid var(--border)', boxShadow: 'none' }}>
                <Stack spacing={1.5}>
                  <div className="flex justify-between items-center text-sm">
                    <Typography variant="body2" sx={{ color: "var(--muted)", fontWeight: 600 }}>Subtotal</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>₹{subTotal}</Typography>
                  </div>
                  {additionalDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm text-red-500 font-bold">
                      <Typography variant="body2">Discount Applied</Typography>
                      <Typography variant="body2">-₹{additionalDiscount}</Typography>
                    </div>
                  )}
                  <Divider sx={{ borderStyle: "dotted", my: 0.5 }} />
                  <div className="flex justify-between items-center">
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--muted)" }}>Gross Total</Typography>
                    <Typography variant={isSmallScreen ? "h6" : "h5"} fontWeight="900" style={{ color: BRAND_RED }}>₹{totalAmount}</Typography>
                  </div>
                </Stack>
              </Paper>
            </Box>

            {/* Logistics & Notes (New Section as per Phase 1) */}
            {(order.table || order.address || order.notes) && (
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: "var(--muted)", textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 1, fontSize: isSmallScreen ? '11px' : '13px' }}>
                  Logistics & Notes
                </Typography>
                <Paper variant="outlined" sx={{ p: isSmallScreen ? 2 : 2.5, borderRadius: 3, bgcolor: "var(--card)", border: '1px solid var(--border)', boxShadow: 'none' }}>
                  <Stack spacing={1.5}>
                    {order.table && (
                      <div className="flex justify-between items-center text-sm">
                        <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>Table Number</Typography>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: BRAND_RED }}>{order.table}</Typography>
                      </div>
                    )}
                    {order.address && (
                      <div className="flex flex-col gap-1">
                        <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>Delivery Address</Typography>
                        <Typography variant="caption" fontWeight="bold">{order.address}</Typography>
                      </div>
                    )}
                    {order.notes && (
                      <div className="flex flex-col gap-1">
                        <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>Special Instructions</Typography>
                        <Paper variant="filled" sx={{ p: 1, px: 1.5, bgcolor: `${BRAND_RED}05`, border: `1px dashed ${BRAND_RED}20`, borderRadius: 1.5 }}>
                          <Typography variant="caption" sx={{ color: "var(--fg)", fontStyle: 'italic', fontWeight: 'bold' }}>"{order.notes}"</Typography>
                        </Paper>
                      </div>
                    )}
                  </Stack>
                </Paper>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5, color: "var(--muted)", textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1, letterSpacing: 1, fontSize: isSmallScreen ? '11px' : '13px' }}>
                <PersonIcon sx={{ fontSize: 16, color: BRAND_RED }} />
                Order Identity
              </Typography>
              <Paper variant="outlined" sx={{ p: isSmallScreen ? 2 : 2.5, borderRadius: 3, bgcolor: "var(--card)", border: '1px solid var(--border)', boxShadow: 'none' }}>
                <Stack spacing={1.5}>
                  <div className="flex justify-between items-center">
                    <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>Guest Name</Typography>
                    <Typography variant="caption" fontWeight="bold">{customerName || "Walk-in Guest"}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="caption" sx={{ color: "var(--muted)", fontWeight: 600 }}>Contact Info</Typography>
                    <Typography variant="caption" fontWeight="bold">{customerMobile || "Not Shared"}</Typography>
                  </div>

                  <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    bgcolor: BRAND_RED,
                    p: 1.5,
                    borderRadius: 2,
                    color: 'white'
                  }}>
                    <AccountCircleIcon sx={{ fontSize: 20 }} />
                    <div className="flex-1">
                      <Typography sx={{ fontSize: 9, opacity: 0.8, fontWeight: 'bold', textTransform: 'uppercase' }}>Processed By</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: '900' }}>{createdBy?.name || "Counter Staff"}</Typography>
                    </div>
                  </Box>
                </Stack>
              </Paper>
            </Box>

          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: isSmallScreen ? 1.5 : 2.5, px: isSmallScreen ? 2 : 3, borderTop: "1px solid var(--border)", gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrintReceipt}
          disabled={isPrinting}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: isSmallScreen ? 2 : 4,
            borderRadius: 1.5,
            bgcolor: BRAND_RED,
            fontSize: isSmallScreen ? '11px' : '13px',
            '&:hover': { bgcolor: `${BRAND_RED}dd` }
          }}
        >
          {isPrinting ? "Generating..." : "Print Receipt"}
        </Button>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: "var(--muted)",
            px: isSmallScreen ? 2 : 4,
            borderRadius: 1.5,
            border: '1px solid var(--border)',
            fontSize: isSmallScreen ? '11px' : '13px'
          }}
        >
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
}
