"use client";

import React, { useState } from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import BillingMenu from "./components/BillingMenu";
import CartSidebar from "./components/CartSidebar";
import CheckoutDetailsForm from "./components/CheckoutDetailsForm";
import OrderSuccessView from "./components/OrderSuccessView";
import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import { useCategories } from "@/hooks/admin/useCategories";
import { useOrders } from "@/hooks/admin/useOrders";
import { Button, Typography, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useCartStore } from "@/stores/useCartStore";

import { MonitorSmartphone } from "lucide-react";

export default function BillingPage() {
  const [step, setStep] = useState(1); // 1 = Menu, 2 = Customer details / Checkout, 3 = Success
  const [orderResult, setOrderResult] = useState(null);

  // Fetch all necessities for the POS
  const { allBrandProductsQuery } = useBrandProducts();
  const { allCategoriesQuery } = useCategories();
  const { createOrderMutation } = useOrders();

  const productsData = allBrandProductsQuery();
  const categoriesData = allCategoriesQuery();

  const products = productsData.data?.data?.data?.products || productsData.data?.data?.data || [];
  const categories = categoriesData.data?.data?.data?.categories || categoriesData.data?.data?.data || [];

  const {
    cart,
    discountAmount,
    customerName,
    customerMobile,
    orderType,
    paymentStatus,
    payments,
    clearCart,
    getCartTotal
  } = useCartStore();

  const handleConfirmOrderClick = () => {
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    // Construct Payload
    const payload = {
      customer: {
        name: customerName || "Guest",
        mobileNo: customerMobile || "0000000000"
      },
      orderType,
      paymentStatus,
      additionalDiscount: discountAmount,
      payments,
      items: cart.map(item => ({
        productId: item.product._id,
        categoryId: item.product.category?._id || item.product.category,
        name: item.product.name,
        quantity: item.quantity,
        variant: {
          name: item.variant.name,
          price: Number(item.variant.discountedPrice > 0 ? item.variant.discountedPrice : item.variant.actualPrice)
        },
        addOns: item.addOns.map(a => ({
          name: a.name,
          price: Number(a.price)
        }))
      }))
    };

    try {
      const res = await createOrderMutation.mutateAsync(payload);
      if (res?.success) {
        setOrderResult(res.data.order);
        setStep(3); // Success Screen
      }
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  const handleNewOrder = () => {
    clearCart();
    setOrderResult(null);
    setStep(1);
  };

  return (
    <InnerDashboardLayout>
      {/* Mobile Restriction Message */}
      <div className="flex md:hidden flex-col items-center justify-center h-[calc(100vh-120px)] px-6 text-center">
        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm flex flex-col items-center max-w-[300px]">
          <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-xl mb-5">
            <MonitorSmartphone size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-black tracking-tighter text-foreground mb-2">Desktop Required</h2>
          <p className="text-xs text-muted font-medium">
            The Billing Point of Sale interface is optimized for larger screens. Please open it on a tablet or desktop device.
          </p>
        </div>
      </div>

      {/* Main POS Interface - Hidden on Mobile */}
      <div className="hidden md:flex h-[calc(100vh-70px)] gap-4 overflow-hidden pt-2">

        {step === 1 && (
          <>
            {/* Left 75%: Point of Sale Menu */}
            <div className="flex-1 min-w-0">
              <BillingMenu
                products={products}
                categories={categories}
                loadingProducts={productsData.isLoading}
                loadingCategories={categoriesData.isLoading}
              />
            </div>

            {/* Right 25%: Permanent Cart Sidebar */}
            <div className="w-[320px] xl:w-[380px] shrink-0 h-full border border-border rounded-2xl overflow-hidden shadow-sm bg-card">
              <CartSidebar onConfirm={handleConfirmOrderClick} />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex-1 flex gap-6 h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Left 35%: Review Cart */}
            <div className="w-[380px] shrink-0 h-full border border-border rounded-2xl overflow-hidden shadow-sm bg-card">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border bg-cardsBG flex items-center gap-3">
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => setStep(1)}
                    size="small"
                    sx={{ color: 'var(--muted)', textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Back to Menu
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CartSidebar hideConfirm readOnly />
                </div>
              </div>
            </div>

            {/* Right 65%: Form & Action */}
            <div className="flex-1 h-full flex flex-col gap-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                <CheckoutDetailsForm />
              </div>

              <div className="p-5 bg-card border border-border rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                  <Typography variant="caption" sx={{ color: "var(--muted)", display: 'block' }}>Total Payable Amount</Typography>
                  <Typography variant="h4" fontWeight="900" color="primary">₹{getCartTotal()}</Typography>
                </div>
                <Button
                  variant="contained"
                  size="large"
                  disabled={createOrderMutation.isPending}
                  startIcon={createOrderMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                  onClick={handlePlaceOrder}
                  sx={{ px: 8, py: 1.5, borderRadius: 3, fontWeight: '900', fontSize: 18, textTransform: 'none', boxShadow: 4 }}
                >
                  {createOrderMutation.isPending ? "Creating Order..." : "Complete Order"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 h-full flex items-center justify-center">
            <OrderSuccessView
              order={orderResult}
              onNewOrder={handleNewOrder}
            />
          </div>
        )}

      </div>
    </InnerDashboardLayout>
  );
}
