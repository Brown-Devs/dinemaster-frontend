"use client";

import React from "react";
import { IconButton, Button, Divider, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCartStore } from "@/stores/useCartStore";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/constants";

export default function CartSidebar({ onConfirm, confirmText = "Confirm Order", hideConfirm = false, readOnly = false }) {
  const { cart, updateQuantity, removeFromCart, discountAmount, setDiscount } = useCartStore();
  const { checkPermission } = usePermissions();

  const subtotal = cart.reduce((sum, item) => sum + (item.pricePerItem * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full text-center">
        <div className="w-20 h-20 rounded-full bg-cardsBG flex items-center justify-center mb-4 border border-border">
          <ShoppingCartIcon sx={{ fontSize: 32, color: "var(--muted)" }} />
        </div>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)" }}>
          Your cart is empty
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--muted)", mt: 1 }}>
          Click on items from the menu to start building an order.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between bg-cardsBG">
        <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)", display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon color="primary" /> Cart Details
        </Typography>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {cart.map((item) => (
          <div key={item.cartId} className="flex gap-2 bg-cardsBG p-2 rounded-xl border border-border">
            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-white border border-border2">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100"><ShoppingCartIcon sx={{color: '#ccc', fontSize: 16}}/></div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)", lineHeight: 1.1, fontSize: 13 }}>
                    {item.product.name}
                  </Typography>
                  {(item.variant?.name || item.variantName) && (
                    <Typography variant="caption" sx={{ color: "var(--muted)", fontSize: 10 }}>
                      {item.variant?.name || item.variantName}
                    </Typography>
                  )}
                  {item.addOns && item.addOns.length > 0 && (
                    <Typography variant="caption" sx={{ color: "var(--muted)", display: 'block', fontSize: 10 }}>
                      + {item.addOns.map(a => a.name).join(', ')}
                    </Typography>
                  )}
                </div>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)" }}>
                  ₹{item.pricePerItem * item.quantity}
                </Typography>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className={`flex items-center bg-card border border-border rounded-full shadow-sm overflow-hidden h-6 ${readOnly ? 'opacity-80' : ''}`}>
                  {!readOnly && (
                    <button 
                      onClick={() => updateQuantity(item.cartId, -1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-cardsBG transition-colors"
                    >
                      <RemoveIcon sx={{ fontSize: 12, color: "var(--fg)" }} />
                    </button>
                  )}
                  <span className={`${readOnly ? 'px-3' : 'w-5'} text-center text-xs font-bold`} style={{ color: "var(--fg)" }}>
                    {readOnly ? `Qty: ${item.quantity}` : item.quantity}
                  </span>
                  {!readOnly && (
                    <button 
                      onClick={() => updateQuantity(item.cartId, 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-cardsBG transition-colors bg-green-500/10 text-green-600"
                    >
                      <AddIcon sx={{ fontSize: 12 }} />
                    </button>
                  )}
                </div>
                {!readOnly && (
                  <IconButton size="small" onClick={() => removeFromCart(item.cartId)} sx={{ color: 'var(--muted)', '&:hover': { color: 'error.main'}, p: 0.5 }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-cardsBG border-t border-border space-y-3">
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--muted)" }}>Subtotal</span>
          <span className="font-semibold" style={{ color: "var(--fg)" }}>₹{subtotal}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span style={{ color: "var(--muted)" }}>Additional Discount</span>
          <div className="flex items-center gap-1">
            <span style={{ color: "var(--muted)" }}>₹</span>
            {readOnly ? (
              <Typography variant="body2" fontWeight="bold" sx={{ color: "var(--fg)", minWidth: '40px', textAlign: 'right' }}>
                {discountAmount || 0}
              </Typography>
            ) : (
              <input 
                type="number"
                min="0"
                value={discountAmount || ''}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-16 bg-card border border-border rounded px-1 py-0.5 text-right font-medium text-[color:var(--fg)] outline-none focus:border-primary"
                placeholder="0"
              />
            )}
          </div>
        </div>
        
        <Divider sx={{ borderColor: 'var(--border)' }} />

        <div className="flex justify-between items-end pb-2">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)" }}>Total</Typography>
          <Typography variant="h5" fontWeight="900" sx={{ color: "var(--fg)" }}>₹{total}</Typography>
        </div>

        {!hideConfirm && checkPermission(PERMISSIONS.BILLING_CREATE) && (
          <Button 
            variant="contained" 
            fullWidth 
            color="error"
            size="large"
            onClick={onConfirm}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: 16, textTransform: 'none' }}
          >
            {confirmText}
          </Button>
        )}
      </div>
    </div>
  );
}
