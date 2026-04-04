"use client";

import React from "react";
import { Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useCartStore } from "@/stores/useCartStore";

export default function BillingProductCard({ product, onAddClick }) {
  const { cart, updateQuantity } = useCartStore();

  // Price calculations
  const variants = product.variants || [];
  const sortedVariants = [...variants].sort((a, b) =>
    Number(a.discountedPrice || a.actualPrice) - Number(b.discountedPrice || b.actualPrice)
  );

  const lowestVariant = sortedVariants[0];
  const lowestPrice = lowestVariant ? (lowestVariant.discountedPrice > 0 ? Number(lowestVariant.discountedPrice) : Number(lowestVariant.actualPrice)) : 0;
  const originalPrice = lowestVariant ? Number(lowestVariant.actualPrice) : 0;
  const hasMultiple = variants.length > 1;
  const hasDiscount = lowestVariant?.discountedPrice > 0 && lowestVariant.discountedPrice < lowestVariant.actualPrice;

  // Find if this simple product is in cart (only works well for single variant, no add-ons)
  // For multi-variant, we let the button say "Add +" to open the dialog, 
  // though if we wanted complex state we could sum quantities. But simple 'Add' is fine for multi.
  const isSingleVariant = variants.length === 1;
  const singleVariantCartId = isSingleVariant ? useCartStore.getState().generateCartId(product._id, lowestVariant.name, []) : null;
  const existingCartItem = isSingleVariant ? cart.find((i) => i.cartId === singleVariantCartId) : null;
  const quantity = existingCartItem ? existingCartItem.quantity : 0;

  return (
    <div className="bg-card border border-border rounded-xl p-3 flex gap-3 hover:shadow-md transition-shadow relative overflow-hidden">

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)", lineHeight: 1.2 }}>
            {product.name}
          </Typography>

          <div className="flex items-center gap-2 mt-1">
            <Typography variant="subtitle1" fontWeight="900" sx={{ color: "var(--fg)" }}>
              ₹{lowestPrice}
            </Typography>
            {hasDiscount && (
              <Typography variant="caption" sx={{ color: "var(--muted)", textDecoration: "line-through" }}>
                ₹{originalPrice}
              </Typography>
            )}
          </div>

          {hasDiscount && (
            <Typography variant="caption" sx={{ color: "success.main", display: "block", fontSize: 10, mt: 0.5 }}>
              {((originalPrice - lowestPrice) / originalPrice * 100).toFixed(0)}% Off (Save ₹{originalPrice - lowestPrice})
            </Typography>
          )}

          <Typography variant="caption" sx={{ color: "var(--muted)", display: "block", mt: 1, fontSize: 11, lineHeight: 1.2 }}>
            {(product.description ? product.description : "")}
          </Typography>
        </div>

      </div>

      {/* Product Image & Actions */}
      <div className="w-20 shrink-0 flex flex-col items-center gap-2 relative">
        <div className="w-20 h-20 rounded-lg bg-cardsBG border border-border overflow-hidden flex items-center justify-center relative">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <RestaurantMenuIcon sx={{ color: "var(--muted)", opacity: 0.5, fontSize: 32 }} />
          )}
        </div>

        {/* Action Button */}
        <div className="absolute -bottom-3 w-full flex justify-center">
          {(!hasMultiple && quantity > 0) ? (
            <div className="flex items-center bg-white border border-green-500 rounded-full shadow-sm overflow-hidden h-7">
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(singleVariantCartId, -1); }}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <RemoveIcon sx={{ fontSize: 16, color: "var(--fg)" }} />
              </button>
              <span className="w-6 text-center text-xs font-bold" style={{ color: "var(--fg)" }}>
                {quantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); updateQuantity(singleVariantCartId, 1); }}
                className="w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 transition-colors text-white"
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddClick(product)}
              className="bg-white border border-green-500 text-green-600 hover:bg-green-50 text-xs font-bold py-1 px-4 rounded-full shadow-sm transition-colors flex items-center gap-0.5"
            >
              Add {hasMultiple ? '+' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
