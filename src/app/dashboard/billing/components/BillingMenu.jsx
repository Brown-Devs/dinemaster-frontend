"use client";

import React, { useState, useMemo } from "react";
import { TextField, InputAdornment, Skeleton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import BillingProductCard from "./BillingProductCard";
import VariantDialog from "./VariantDialog";
import { useCartStore } from "@/stores/useCartStore";

export default function BillingMenu({ categories, products, loadingCategories, loadingProducts }) {
  const { addToCart } = useCartStore();
  console.log(categories)
  console.log(products)
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProductForDialog, setSelectedProductForDialog] = useState(null);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;
    return categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
  }, [categories, categorySearch]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by Category
    if (selectedCategoryId !== "all") {
      result = result.filter(p => {
        const pCatId = typeof p.category === 'object' ? p.category?._id : p.category;
        return pCatId === selectedCategoryId;
      });
    }

    // Filter by Search
    if (productSearch) {
      result = result.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    }

    return result;
  }, [products, selectedCategoryId, productSearch]);


  const handleAddClick = (product) => {
    const variants = product.variants || [];

    // If only one variant and no add-ons required dynamically, add straight to cart
    // Since we attached Category to Product, we can check if category has add-ons
    const hasAddOns = product.category?.addOns?.length > 0;

    if (variants.length === 1 && !hasAddOns) {
      addToCart({
        product: product,
        variant: variants[0],
        addOns: [],
        quantity: 1
      });
    } else {
      // Open dialog to let user choose variant and/or add-ons
      setSelectedProductForDialog(product);
      setDialogOpen(true);
    }
  };

  const handleDialogAdd = (product, variant, addOns) => {
    addToCart({
      product,
      variant,
      addOns,
      quantity: 1
    });
  };

  return (
    <div className="flex h-full rounded-2xl overflow-hidden border border-border bg-card">

      {/* ── Left Sidebar: Categories ── */}
      <div className="w-24 sm:w-32 lg:w-40 border-r border-border bg-cardsBG flex flex-col shrink-0">
        <div className="p-2 border-b border-border">
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "var(--muted)", fontSize: 16, mr: 0.5 }} />,
              sx: { fontSize: 12, borderRadius: 2, bgcolor: 'var(--card)' }
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
          {/* ALL Option */}
          <div
            onClick={() => setSelectedCategoryId("all")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl cursor-pointer transition-colors border
              ${selectedCategoryId === "all" ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-card'}`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary flex items-center justify-center bg-card mb-1">
              <Typography variant="caption" fontWeight="bold" color="primary">ALL</Typography>
            </div>
            <Typography variant="caption" fontWeight="bold" sx={{ color: selectedCategoryId === "all" ? "primary.main" : "var(--fg)", textAlign: 'center' }}>
              All
            </Typography>
          </div>

          {/* Dynamic Categories */}
          {loadingCategories ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <Skeleton variant="circular" width={48} height={48} sx={{ mb: 1 }} />
                <Skeleton width={40} height={10} />
              </div>
            ))
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => setSelectedCategoryId(cat._id)}
                className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors border
                  ${selectedCategoryId === cat._id ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-card'}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-border2 flex items-center justify-center bg-card overflow-hidden mb-1 shrink-0">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <RestaurantMenuIcon sx={{ fontSize: 24, color: "var(--muted)" }} />
                  )}
                </div>
                <Typography variant="caption" sx={{ color: "var(--fg)", textAlign: 'center', lineHeight: 1.1, fontSize: 11 }}>
                  {cat.name}
                </Typography>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Main Panel: Products ── */}
      <div className="flex-1 flex flex-col bg-card relative overflow-hidden">

        {/* Top Header/Search */}
        <div className="p-4 border-b border-border bg-card flex justify-between items-center shrink-0">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--fg)" }}>
            Enjoy tasty meals...
          </Typography>
          <TextField
            size="small"
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "var(--muted)", fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: "var(--cardsBG)" }
            }}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 content-start">
          {loadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: 3 }} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <RestaurantMenuIcon sx={{ fontSize: 60, color: "var(--muted)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "var(--fg)" }}>No Products Found</Typography>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
              {filteredProducts.map(product => (
                <BillingProductCard
                  key={product._id}
                  product={product}
                  onAddClick={handleAddClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Multi-Variant / Addons */}
      <VariantDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={selectedProductForDialog}
        onAdd={handleDialogAdd}
      />

    </div>
  );
}
