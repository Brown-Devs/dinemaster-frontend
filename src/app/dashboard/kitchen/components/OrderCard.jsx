"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Timer } from "lucide-react";
import { useOrders } from "@/hooks/admin/useOrders";

// Shared card content used in both the card and the dialog
function OrderCardContent({ order, timeAgo, getItemLabel }) {
  const items = order.items || [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-black text-foreground tracking-tighter">
            #{order.orderId || order._id?.slice(-4)}
          </span>
          <span className="text-[10px] font-bold text-muted flex items-center gap-0.5">
            <Timer size={9} strokeWidth={3} />
            {timeAgo(order.createdAt)}
          </span>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${order.orderType === "dinein"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : order.orderType === "delivery"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
          }`}>
          {order.orderType === "homeDelivery" ? "Delivery" : order.orderType}
        </span>
      </div>

      {/* All Products in one box */}
      <div className="border border-border rounded-md bg-foreground/[0.015] mb-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={`px-3 py-2 ${i !== items.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-black text-foreground/60 min-w-[18px]">
                {item.quantity}×
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground tracking-tight leading-snug">
                  {getItemLabel(item)}
                </p>
                {item.addOns?.length > 0 && (
                  <p className="text-[10px] text-muted font-medium mt-0.5 leading-tight">
                    {item.addOns.map((a) => `+ ${a.name}`).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-bold text-foreground tracking-tight">
          {order.customer?.name || "Guest"}
        </p>
        <p className="text-[10px] text-muted font-medium">
          {order.customer?.mobileNo}
        </p>
      </div>
    </div>
  );
}

export default function OrderCard({ order, showPrepareAction = true, onStatusUpdated }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { updateOrderMutation } = useOrders();

  const timeAgo = (date) => {
    const mins = Math.floor((new Date() - new Date(date)) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h`;
  };

  const getItemLabel = (item) => {
    const name = item.name || item.productId?.name || "Item";
    const variant = item.variant?.name;
    return variant ? `${name} (${variant})` : name;
  };

  const handleConfirmPrepared = () => {
    updateOrderMutation.mutateAsync({
      id: order._id,
      data: { status: "prepared" },
    }).then(() => {
      setConfirmOpen(false);
      onStatusUpdated?.();
    });
  };

  return (
    <>
      <div className="bg-card border border-border rounded-md p-3">
        <OrderCardContent order={order} timeAgo={timeAgo} getItemLabel={getItemLabel} />

        {/* Action */}
        {showPrepareAction && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full mt-3 py-2 bg-foreground text-background font-bold rounded-md text-xs tracking-tight transition-opacity active:opacity-80"
          >
            Mark Prepared
          </button>
        )}
      </div>

      {/* Confirm Dialog - shows order card + confirm button */}
      <Dialog
        open={confirmOpen}
        onClose={() => !updateOrderMutation.isPending && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "8px",
            bgcolor: "var(--card)",
            border: "1px solid var(--border)",
            backgroundImage: "none",
            boxShadow: "none",
            margin: "12px",
          },
        }}
      >
        <DialogContent className="p-4">
          {/* Same order card content inside the dialog */}
          <OrderCardContent order={order} timeAgo={timeAgo} getItemLabel={getItemLabel} />
        </DialogContent>

        <DialogActions className="px-4 pb-4 pt-0 gap-1">
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={updateOrderMutation.isPending}
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 700,
              color: "var(--muted)",
              px: 2,
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={handleConfirmPrepared}
            loading={updateOrderMutation.isPending}
            variant="contained"
            size="small"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 700,
              bgcolor: "var(--fg)",
              color: "var(--card)",
              boxShadow: "none",
              px: 2,
              "&:hover": { bgcolor: "var(--fg)", boxShadow: "none" },
              "& .MuiLoadingButton-loadingIndicator": {
                color: "var(--card)",
              },
            }}
          >
            Yes, Prepared
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
