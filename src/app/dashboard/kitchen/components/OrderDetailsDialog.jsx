"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { X, ClipboardList, Utensils } from "lucide-react";

export default function OrderDetailsDialog({ open, onClose, order }) {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.4)' }
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: "8px", // rounded-md
          bgcolor: "var(--card)",
          backgroundImage: "none",
          border: "1px solid var(--border)",
          boxShadow: 'none',
          margin: { xs: '8px', sm: '32px' }, // tighter on mobile
          width: { xs: 'calc(100% - 16px)', sm: 'auto' }
        },
      }}
    >
      {/* Header - Compact */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-foreground/2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-foreground/5 rounded-md border border-border">
            <ClipboardList size={16} className="text-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter text-foreground leading-none">
              Order #{order.orderId || order._id.slice(-6).toUpperCase()}
            </h2>
            <p className="text-[9px] font-black text-muted uppercase tracking-widest mt-1 opacity-70">
              {order.orderType} • {order.customer?.name || "Guest"}
            </p>
          </div>
        </div>
        <IconButton onClick={onClose} size="small" className="text-muted hover:bg-foreground/5 rounded-md">
          <X size={18} />
        </IconButton>
      </div>

      <DialogContent className="p-0 overflow-y-auto no-scrollbar">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Utensils size={14} className="text-muted" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              Preperation Items
            </span>
          </div>

          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <div key={idx} className="group border border-border/50 p-3 rounded-md bg-foreground/1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-foreground text-background text-xs font-black">
                        {item.quantity}
                      </div>
                      <span className="text-base font-black text-foreground tracking-tight uppercase">
                        {item.name}
                      </span>
                    </div>
                    
                    {/* Item Metadata */}
                    <div className="ml-10 mt-1.5 space-y-1">
                      {item.variant?.name && (
                        <p className="text-[10px] font-bold text-muted flex items-center gap-1.5 uppercase">
                           <span className="w-1 h-1 rounded-full bg-border" />
                           {item.variant.name}
                        </p>
                      )}
                      
                      {item.addOns?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.addOns.map((add, aIdx) => (
                            <span 
                              key={aIdx} 
                              className="text-[9px] font-black bg-foreground/5 text-foreground/70 px-2 py-0.5 rounded-sm border border-border uppercase tracking-tight"
                            >
                              + {add.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>

      <DialogActions className="p-4 bg-foreground/2 border-t border-border">
        <Button
          onClick={onClose}
          fullWidth
          className="py-2.5 text-xs font-black tracking-tighter uppercase text-muted hover:bg-foreground/5"
          sx={{ borderRadius: "4px", textTransform: "none" }}
        >
          Close View
        </Button>
      </DialogActions>
    </Dialog>
  );
}
