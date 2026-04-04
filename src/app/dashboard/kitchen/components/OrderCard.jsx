"use client";

import React, { useState } from "react";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { 
  Timer,
  ShoppingBag,
  User as UserIcon,
  Phone as PhoneIcon
} from "lucide-react";
import { format } from "date-fns";

export default function OrderCard({ order, onUpdateStatus, isUpdating, onClick }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handlePrepareClick = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmPrepared = () => {
    onUpdateStatus(order._id, 'prepared');
    setConfirmOpen(false);
  };

  const timeAgo = (date) => {
    const mins = Math.floor((new Date() - new Date(date)) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins/60)}h ago`;
  };

  const items = order.items || [];
  const displayItems = items.slice(0, 5);
  const remainingCount = items.length - 5;

  return (
    <>
      <div 
        onClick={onClick}
        className="bg-card border border-border rounded-md p-4 transition-all cursor-pointer shadow-none active:bg-foreground/5"
      >
        {/* Header: ID and Type */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tighter leading-none">
              #{order.orderId || order._id.slice(-6).toUpperCase()}
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-wider mt-1">
               <Timer size={10} strokeWidth={3} />
               {timeAgo(order.createdAt)}
            </div>
          </div>
          <div className="bg-foreground/5 border border-border px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-foreground">
            {order.orderType === 'homeDelivery' ? 'Delivery' : order.orderType}
          </div>
        </div>

        {/* Products Section (FIRST) */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 mb-2 pl-1">
            <ShoppingBag size={12} className="text-muted" />
            <span className="text-[10px] font-black uppercase text-muted tracking-widest">Items ({items.length})</span>
          </div>
          
          {displayItems.map((item, i) => (
            <div key={i} className="border border-border p-2 rounded-md bg-foreground/2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-black text-foreground tracking-tight leading-snug">
                  {item.quantity} × {item.name}
                </span>
              </div>
              {item.variant?.name && (
                <p className="text-[10px] font-bold text-muted mt-0.5 uppercase tracking-tighter">
                  {item.variant.name}
                </p>
              )}
              {item.addOns?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-border/50">
                  {item.addOns.map((add, aIdx) => (
                    <span 
                      key={aIdx} 
                      className="text-[9px] font-bold text-muted leading-none bg-foreground/5 px-1.5 py-0.5 rounded"
                    >
                      + {add.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {remainingCount > 0 && (
            <div className="text-center py-1 bg-foreground/5 rounded-md border border-dashed border-border mt-2">
              <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                + {remainingCount} more items...
              </span>
            </div>
          )}
        </div>

        {/* User Details (SECOND) */}
        <div className="pt-3 border-t border-border mt-3 space-y-0.5 pl-1">
          <p className="text-xs font-black text-foreground tracking-tight uppercase leading-none">
            {order.customer?.name || "Guest Visitor"}
          </p>
          <p className="text-[11px] font-bold text-muted tracking-tighter">
            {order.customer?.mobileNo}
          </p>
        </div>

        {/* Action: Mark Prepared */}
        <button
          onClick={handlePrepareClick}
          disabled={isUpdating}
          className="w-full mt-5 py-2.5 bg-foreground text-background font-black rounded-md uppercase tracking-tighter text-xs transition-opacity active:opacity-80 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Mark Prepared"}
        </button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: '8px', 
            bgcolor: 'var(--card)', 
            border: '1px solid var(--border)', 
            backgroundImage: 'none',
            margin: '16px'
          }
        }}
      >
        <DialogTitle className="px-6 pt-5 pb-2 text-lg font-black tracking-tighter uppercase">
          Confirm Preparation
        </DialogTitle>
        <DialogContent className="px-6 pb-6 pt-2">
          <p className="text-sm font-bold text-muted tracking-tight leading-relaxed">
            Are you sure this order is prepared and ready for table/delivery?
          </p>
        </DialogContent>
        <DialogActions className="px-5 pb-5 pt-0 gap-2">
          <Button 
            onClick={() => setConfirmOpen(false)} 
            className="text-xs font-black tracking-tighter uppercase text-muted hover:bg-foreground/5 px-4"
            sx={{ borderRadius: '4px' }}
          >
            Cancel
          </Button>
          <LoadingButton 
            onClick={handleConfirmPrepared} 
            loading={isUpdating}
            variant="contained"
            className="bg-foreground text-background font-black text-xs tracking-tighter uppercase px-6 h-9 shadow-none hover:shadow-none hover:bg-foreground active:bg-foreground"
            sx={{ 
                borderRadius: '4px',
                '& .MuiLoadingButton-loadingIndicator': { color: 'var(--card)' }
            }}
          >
            Yes, Prepared
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
