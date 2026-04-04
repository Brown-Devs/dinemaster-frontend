"use client";

import React, { useState, useEffect } from "react";
import { Dialog, IconButton, Typography, Radio, Divider, Button, Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export default function VariantDialog({ open, onClose, product, onAdd }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  useEffect(() => {
    if (open && product) {
      if (product.variants?.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
      setSelectedAddOns([]);
    }
  }, [open, product]);

  const handleToggleAddOn = (addon) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(a => a.name === addon.name);
      if (exists) return prev.filter(a => a.name !== addon.name);
      return [...prev, addon];
    });
  };

  const hasVariantsToChoose = product?.variants?.length > 1;

  const handleConfirm = () => {
    const finalVariant = hasVariantsToChoose ? selectedVariant : (product.variants?.[0] || null);
    onAdd(product, finalVariant, selectedAddOns);
    onClose();
  };

  if (!product) return null;

  const categoryAddOns = product.category?.addOns || [];
  const showTwoColumns = hasVariantsToChoose && categoryAddOns.length > 0;

  // Resolve prices properly to avoid 0 mistake
  const getPrice = (v) => Number(v.discountedPrice > 0 ? v.discountedPrice : v.actualPrice);
  const selectedVariantPrice = selectedVariant ? getPrice(selectedVariant) : (product.variants?.[0] ? getPrice(product.variants[0]) : 0);
  const finalAddonPrice = selectedAddOns.reduce((sum, a) => sum + Number(a.price), 0);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={showTwoColumns ? "md" : "xs"} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: "var(--card)",
          backgroundImage: "none",
          width: showTwoColumns ? '700px' : 'auto'
        }
      }}
    >
      <div className="flex justify-between items-start p-4 pb-2">
        <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)" }}>
          Customize Product
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ mt: -0.5, mr: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <div className="px-4 pb-4 flex gap-4 items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-cardsBG border border-border shrink-0">
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
        </div>
        <div>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "var(--fg)", lineHeight: 1.1 }}>
            {product.name}
          </Typography>
          {product.description && (
            <Typography variant="caption" sx={{ color: "var(--muted)", mt: 0.5, display: 'block' }}>
              {product.description.slice(0, 50)}{product.description.length > 50 ? '...' : ''}
            </Typography>
          )}
        </div>
      </div>

      <Divider sx={{ borderColor: 'var(--border)' }} />

      <div className={`p-4 ${showTwoColumns ? 'grid grid-cols-2 gap-6' : 'flex flex-col space-y-4'} max-h-[50vh] overflow-y-auto`}>
        
        {/* Variants Section */}
        {hasVariantsToChoose && (
          <div>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)", mb: 2 }}>
              Choose Size/Variant <span className="text-red-500">*</span>
            </Typography>
            
            <div className="space-y-2">
              {product.variants?.map((v, i) => {
                const price = getPrice(v);
                const hasDiscount = v.discountedPrice > 0 && v.discountedPrice < v.actualPrice;
                const isSelected = selectedVariant?.name === v.name;

                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                      ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-cardsBG hover:border-border2'}`
                    }
                  >
                    <div className="flex flex-col">
                      <Typography variant="body2" fontWeight="bold" sx={{ color: isSelected ? 'primary.main' : 'var(--fg)' }}>
                        {v.name}
                      </Typography>
                      {hasDiscount && (
                        <Typography variant="caption" sx={{ color: "success.main" }}>
                          {(100 - (v.discountedPrice / v.actualPrice * 100)).toFixed(0)}% Off (Save ₹{v.actualPrice - v.discountedPrice})
                        </Typography>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)" }}>
                          ₹{price}
                        </Typography>
                        {hasDiscount && (
                          <Typography variant="caption" sx={{ color: "var(--muted)", textDecoration: "line-through" }}>
                            ₹{v.actualPrice}
                          </Typography>
                        )}
                      </div>
                      <Radio 
                        checked={isSelected}
                        icon={<RadioButtonUncheckedIcon sx={{ color: 'var(--border2)' }} />}
                        checkedIcon={<CheckCircleIcon color="primary" />}
                        sx={{ p: 0 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-ons Section */}
        {categoryAddOns.length > 0 && (
          <div>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "var(--fg)", mb: 2 }}>
              Add-ons (Optional)
            </Typography>
            <div className="space-y-2">
              {categoryAddOns.map((addon, i) => {
                const isSelected = selectedAddOns.some(a => a.name === addon.name);

                return (
                  <div 
                    key={i} 
                    onClick={() => handleToggleAddOn(addon)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                      ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-cardsBG hover:border-border2'}`
                    }
                  >
                    <Typography variant="body2" fontWeight="medium" sx={{ color: "var(--fg)" }}>
                      {addon.name}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Typography variant="subtitle2" sx={{ color: "var(--muted)" }}>
                        +₹{addon.price}
                      </Typography>
                      <Checkbox 
                        checked={isSelected}
                        sx={{ p: 0 }}
                        color="primary"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border flex justify-end items-center">
        {categoryAddOns.length > 0 && !hasVariantsToChoose && selectedAddOns.length === 0 && (
          <Button 
            onClick={handleConfirm}
            sx={{ color: "var(--muted)", mr: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            Not Required
          </Button>
        )}
        <Button 
          variant="contained" 
          fullWidth={!showTwoColumns}
          color="primary"
          size="large"
          type="button"
          onClick={handleConfirm}
          disabled={hasVariantsToChoose && !selectedVariant}
          sx={{ py: 1.5, px: showTwoColumns ? 6 : undefined, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
        >
          Add Item - ₹{selectedVariantPrice + finalAddonPrice}
        </Button>
      </div>

    </Dialog>
  );
}
