"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton
} from "@mui/material";
import { format } from "date-fns";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const typeIcons = {
  dinein: <FastfoodIcon sx={{ fontSize: 16 }} />,
  homeDelivery: <LocalShippingIcon sx={{ fontSize: 16 }} />,
  packing: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
};

const statusColors = {
  new: { bg: "rgba(33, 150, 243, 0.08)", text: "#2196f3", label: "New" },
  delivered: { bg: "rgba(76, 175, 80, 0.08)", text: "#4caf50", label: "Delivered" },
  cancelled: { bg: "rgba(244, 67, 54, 0.08)", text: "#f44336", label: "Cancelled" },
};

export function ViewOrderDialog({ open, onClose, order }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "4px", // rounded-sm equivalent
          bgcolor: "var(--card)",
          backgroundImage: "none",
          margin: isMobile ? "8px" : "32px",
          maxHeight: isMobile ? "92vh" : "90vh",
          width: isMobile ? "calc(100% - 16px)" : "70vw",
        }
      }}
    >
      {/* Header - Sharp & Minimalist */}
      <div className="sticky top-0 z-10 bg-[var(--card)] px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center text-primary">
            <ReceiptLongIcon sx={{ fontSize: 18 }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--fg)] leading-none">Order #{order.orderId || order._id.slice(-6).toUpperCase()}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[var(--muted)] flex items-center">{typeIcons[order.orderType] || <FastfoodIcon sx={{ fontSize: 14 }} />}</span>
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">{order.orderType === 'homeDelivery' ? 'Delivery' : order.orderType}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            label={statusColors[order.status]?.label || order.status}
            size="small"
            sx={{
              bgcolor: statusColors[order.status]?.bg,
              color: statusColors[order.status]?.text,
              fontWeight: "bold",
              borderRadius: "2px", // rounded-sm
              height: 20,
              fontSize: "9px"
            }}
          />
          <IconButton size="small" onClick={onClose} className="text-[var(--muted)] hover:bg-[var(--border)] rounded-sm">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </div>
      </div>

      <DialogContent className="p-0 no-scrollbar">
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} min-h-[400px]`}>
          
          {/* Main Content: Items Table */}
          <div className="flex-1 p-4 overflow-x-auto">
            <h3 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               Ordered Items
            </h3>
            
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-[var(--border)]">
                     <th className="py-2 text-[10px] font-bold text-[var(--muted)] uppercase">Item Details</th>
                     <th className="py-2 px-2 text-[10px] font-bold text-[var(--muted)] uppercase text-center">Qty</th>
                     <th className="py-2 px-2 text-[10px] font-bold text-[var(--muted)] uppercase text-right">Price</th>
                     <th className="py-2 text-[10px] font-bold text-[var(--muted)] uppercase text-right">Total</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-[var(--border)]">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-[var(--cardsBG)] transition-colors">
                       <td className="py-3 pr-4">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-[var(--fg)]">{item.name}</span>
                             {item.variant?.name && (
                                <span className="text-[10px] text-[var(--muted)] mt-0.5">
                                   Variant: {item.variant.name}
                                </span>
                             )}
                             {item.addOns?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                   {item.addOns.map((add, aIdx) => (
                                      <span key={aIdx} className="text-[9px] text-primary/70 border border-primary/20 px-1 py-0 rounded-sm">
                                         + {add.name}
                                      </span>
                                   ))}
                                </div>
                             )}
                          </div>
                       </td>
                       <td className="py-3 px-2 text-center text-sm font-medium text-[var(--fg)]">
                          {item.quantity}
                       </td>
                       <td className="py-3 px-2 text-right text-sm text-[var(--muted)]">
                          ₹{item.variant?.price || 0}
                       </td>
                       <td className="py-3 text-right text-sm font-bold text-[var(--fg)]">
                          ₹{(item.variant?.price + (item.addOns?.reduce((acc, curr) => acc + curr.price, 0) || 0)) * item.quantity}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>

          {/* Sidebar: Details & Accounting */}
          <div className={`${isMobile ? "w-full border-t" : "w-[300px] border-l"} border-[var(--border)] bg-[var(--cardsBG)]/50`}>
             <div className="p-5 space-y-6">
                
                {/* Customer Section */}
                <div>
                   <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider block mb-3">Customer Details</label>
                   <div className="border border-[var(--border)] bg-[var(--card)] p-3 rounded-sm">
                      <p className="text-sm font-bold text-[var(--fg)]">{order.customer?.name || "Guest Visitor"}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">{order.customer?.mobileNo}</p>
                   </div>
                </div>

                {/* Logistics Section */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--muted)]">Date & Time</span>
                      <span className="font-medium text-[var(--fg)] text-right">{format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-[var(--muted)]">Processed By</span>
                      <span className="font-medium text-[var(--fg)]">{order.createdBy?.name || "Staff"}</span>
                   </div>
                </div>

                <Divider sx={{ borderColor: "var(--border)", borderStyle: "dashed" }} />

                {/* Accounting Section - "Peaceful & Premium" */}
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-xs text-[var(--muted)]">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{order.subTotal}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs text-green-600">
                      <span>Adjustment / Discount</span>
                      <span className="font-medium">-₹{order.additionalDiscount || 0}</span>
                   </div>
                   <div className="pt-3 border-t border-[var(--border)]">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-tighter">Amount Payable</span>
                         <span className="text-xl font-black text-primary leading-none">₹{order.totalAmount}</span>
                      </div>
                   </div>
                </div>

                {/* Payment Evidence */}
                <div className="pt-2">
                   <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider">Payment Details</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm border ${order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-500 bg-red-50 border-red-200'}`}>
                         {order.paymentStatus?.toUpperCase()}
                      </span>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2">
                      <div className="border border-[var(--border)] bg-[var(--card)] p-2 rounded-sm flex flex-col items-center">
                         <span className="text-[9px] text-[var(--muted)] font-medium uppercase">Cash</span>
                         <span className="text-sm font-bold text-[var(--fg)] mt-0.5">₹{order.payments?.cashAmount || 0}</span>
                      </div>
                      <div className="border border-[var(--border)] bg-[var(--card)] p-2 rounded-sm flex flex-col items-center">
                         <span className="text-[9px] text-[var(--muted)] font-medium uppercase">Online</span>
                         <span className="text-sm font-bold text-[var(--fg)] mt-0.5">₹{order.payments?.onlineAmount || 0}</span>
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </DialogContent>

      <DialogActions className="p-3 bg-[var(--card)] border-t border-[var(--border)] gap-2">
        <Button
          onClick={onClose}
          className="text-xs text-[var(--muted)] hover:bg-[var(--border)] h-9 px-4"
          sx={{ textTransform: "none", borderRadius: "2px" }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          className="text-xs h-9 px-6 bg-primary font-bold shadow-none hover:shadow-md"
          sx={{ textTransform: "none", borderRadius: "2px" }}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
