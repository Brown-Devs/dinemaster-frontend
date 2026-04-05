"use client";

import React from "react";
import { Checkbox, Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/constants";

export default function ProductCard({
  product,
  isSelected = false,
  onSelect,
  onEdit,
  showActions = false,
}) {
  const { checkPermission } = usePermissions();
  return (
    <div
      className={`
        bg-card rounded-xl border transition-all duration-200
        flex flex-col sm:flex-row items-stretch sm:items-start gap-3 p-3 hover:shadow-md group relative
        ${isSelected
          ? "border-blue-400 ring-2 ring-blue-100 dark:ring-blue-900/40 shadow-sm"
          : "border-border hover:border-border2"
        }
      `}
    >
      {/* Top Section / Left Section: Image with Floating Checkbox */}
      <div className="flex flex-col items-start gap-2 shrink-0 relative">
        {/* Image - Responsive Size: Full width on mobile, fixed on desktop */}
        <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-cardsBG border border-border flex items-center justify-center relative">

          {/* Floating Checkbox */}
          {onSelect && (
            <div className="absolute top-0 left-0 z-10 bg-none flex items-center justify-center">
              <Checkbox
                size="small"
                checked={isSelected}
                onChange={() => onSelect(product._id)}
                sx={{
                  p: 0.5,
                  flexShrink: 0,
                  "& .MuiSvgIcon-root": { fontSize: 18 }
                }}
              />
            </div>
          )}

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                const placeholder = e.target.parentElement.querySelector('.no-image-placeholder');
                if (placeholder) placeholder.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="no-image-placeholder w-full h-full flex flex-col items-center justify-center"
            style={{ display: product.imageUrl ? "none" : "flex", color: "var(--muted)" }}
          >
            <RestaurantIcon sx={{ fontSize: 24, color: "var(--muted)", opacity: 0.5 }} />
            <span className="text-[8px] sm:text-[10px] mt-1 opacity-50">No Image</span>
          </div>
        </div>
      </div>

      {/* Info Content - Middle/Right */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1">
          <p className="text-sm sm:text-base font-bold leading-tight break-words mb-1" style={{ color: "var(--fg)" }}>
            {product.name}
          </p>

          {product.description && (
            <p className="text-[11px] sm:text-xs leading-snug mb-2 break-words" style={{ color: "var(--muted)" }}>
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
              {product.variants.map((variant, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                  style={{ backgroundColor: "var(--cardsBG)", color: "var(--muted)" }}
                >
                  {variant.name}
                  {variant.discountedPrice != null ? (
                    <>
                      <span className="ml-1 text-red-500 line-through font-semibold">₹{variant.actualPrice}</span>
                      <span className="ml-0.5 text-green-500 font-semibold">₹{variant.discountedPrice}</span>
                    </>
                  ) : variant.actualPrice != null ? (
                    <span className="ml-1 text-green-500 font-semibold">₹{variant.actualPrice}</span>
                  ) : null}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Status, Category & Actions */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-border/50 sm:border-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Active/Inactive badge */}
            {product.active !== undefined && (
              product.active ? (
                <span className="text-[9px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
              ) : (
                <span className="text-[9px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Inactive</span>
              )
            )}

            <Chip
              label={product.category?.name || product.category || "—"}
              size="small"
              variant="outlined"
              sx={{
                fontSize: 9,
                height: 18,
                flexShrink: 0,
                borderColor: "var(--border)",
                color: "var(--muted)",
                backgroundColor: "var(--cardsBG)",
                textTransform: "uppercase",
                fontWeight: 600,
                px: 0.5
              }}
            />
          </div>

          {/* Actions - Always Bottom Right Position */}
          {checkPermission(PERMISSIONS.PRODUCTS_UPDATE) && onEdit && (
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm group-hover:opacity-100 transition-all duration-300">
              <Tooltip title="Edit" placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                  sx={{
                    p: 0.6,
                    backgroundColor: 'var(--cardsBG)',
                    '&:hover': { backgroundColor: 'var(--border)' }
                  }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
