import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      discountAmount: 0,
      customerDetails: null, // For Step 2

      // Helper to generate a unique ID based on product + variant + addons
      generateCartId: (productId, variantName, addOns = []) => {
        const addOnKeys = [...addOns].sort((a, b) => a.name.localeCompare(b.name)).map((a) => a.name).join("|");
        return `${productId}-${variantName}-${addOnKeys}`;
      },

      addToCart: (item) => {
        set((state) => {
          const { product, variant, addOns = [], quantity = 1 } = item;
          const cartId = get().generateCartId(product._id, variant.name, addOns);
          
          const existingItemIndex = state.cart.findIndex((i) => i.cartId === cartId);
          
          if (existingItemIndex >= 0) {
            // Update quantity if exact configuration exists
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += quantity;
            return { cart: newCart };
          } else {
            // Add new cart item
            const basePrice = Number(variant.discountedPrice || variant.actualPrice || 0);
            const addOnsTotal = addOns.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
            
            const newItem = {
              cartId,
              product,
              variant,
              addOns,
              quantity,
              pricePerItem: basePrice + addOnsTotal,
            };
            return { cart: [...state.cart, newItem] };
          }
        });
      },

      removeFromCart: (cartId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, delta) => {
        set((state) => {
          const newCart = state.cart.map((item) => {
            if (item.cartId === cartId) {
              const newQuantity = item.quantity + delta;
              return { ...item, quantity: Math.max(0, newQuantity) };
            }
            return item;
          }).filter(item => item.quantity > 0); // Automatically remove if hits 0

          return { cart: newCart };
        });
      },

      setDiscount: (amount) => set({ discountAmount: amount }),
      
      setCustomerDetails: (details) => set({ customerDetails: details }),

      clearCart: () => set({ cart: [], discountAmount: 0, customerDetails: null }),

      // Selectors (derived data computation)
      getCartTotal: () => {
        const state = get();
        const subtotal = state.cart.reduce((total, item) => total + (item.pricePerItem * item.quantity), 0);
        return Math.max(0, subtotal - state.discountAmount);
      },
      
      getSubtotal: () => {
         return get().cart.reduce((total, item) => total + (item.pricePerItem * item.quantity), 0);
      },

      getTotalItems: () => {
         return get().cart.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: "dinemaster-pos-cart",
    }
  )
);
