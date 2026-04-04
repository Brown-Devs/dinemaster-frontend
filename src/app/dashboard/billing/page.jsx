"use client";

import React, { useState } from "react";
import InnerDashboardLayout from "@/components/dashboard/InnerDashboardLayout";
import BillingMenu from "./components/BillingMenu";
import CartSidebar from "./components/CartSidebar";
import { useBrandProducts } from "@/hooks/admin/useBrandProducts";
import { useCategories } from "@/hooks/admin/useCategories";

export default function BillingPage() {
  const [step, setStep] = useState(1); // 1 = Menu, 2 = Customer details / Checkout

  // Fetch all necessities for the POS
  const { allBrandProductsQuery } = useBrandProducts();
  const { allCategoriesQuery } = useCategories();

  const productsData = allBrandProductsQuery();
  const categoriesData = allCategoriesQuery();

  const products = productsData.data?.data?.data?.products || productsData.data?.data?.data || [];
  const categories = categoriesData.data?.data?.data?.categories || categoriesData.data?.data?.data || [];

  const handleConfirmOrderClick = () => {
    // Proceed to step 2 (Customer details overlay / checkout view)
    setStep(2);
  };

  return (
    <InnerDashboardLayout>
      <div className="h-[calc(100vh-100px)] flex gap-4 overflow-hidden pt-2">
        
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-card rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-4">Step 2: Customer Details & Checkout</h2>
            <p className="text-gray-500 mb-6">This section will be implemented next.</p>
            <button 
              onClick={() => setStep(1)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Go Back to Menu
            </button>
          </div>
        )}

      </div>
    </InnerDashboardLayout>
  );
}
