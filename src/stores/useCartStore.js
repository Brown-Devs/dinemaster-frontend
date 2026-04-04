import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      discountAmount: 0,
      customerDetails: null, // Legacy
      customerName: "",
      customerMobile: "",
      orderType: "dinein", // dinein, pack, delivery
      paymentStatus: "not_paid", // not_paid, paid
      paymentMode: "cash", // cash, online, mix
      payments: {
        cashAmount: 0,
        onlineAmount: 0,
      },

      // Helper to generate a unique ID based on product + variant + addons
      generateCartId: (productId, variantName, addOns = []) => {
        const addOnKeys = [...addOns].sort((a, b) => a.name.localeCompare(b.name)).map((a) => a.name).join("|");
        return `${productId}-${variantName}-${addOnKeys}`;
      },

      setCustomerName: (name) => set({ customerName: name }),
      setCustomerMobile: (mobile) => set({ customerMobile: mobile }),
      setOrderType: (type) => set({ orderType: type }),
      setPaymentStatus: (status) => set({ paymentStatus: status }),
      
      setPaymentMode: (mode) => set((state) => {
        const total = get().getCartTotal();
        if (mode === "cash") {
          return { paymentMode: mode, payments: { cashAmount: total, onlineAmount: 0 } };
        } else if (mode === "online") {
          return { paymentMode: mode, payments: { cashAmount: 0, onlineAmount: total } };
        }
        return { paymentMode: mode };
      }),

      setPayments: (payments) => set({ payments }),

      addToCart: (item) => {
        set((state) => {
          const { product, variant, addOns = [], quantity = 1 } = item;
          const cartId = get().generateCartId(product._id, variant.name, addOns);
          
          const existingItemIndex = state.cart.findIndex((i) => i.cartId === cartId);
          let newCart;

          if (existingItemIndex >= 0) {
            newCart = [...state.cart];
            newCart[existingItemIndex].quantity += quantity;
          } else {
            const basePrice = Number(variant.discountedPrice > 0 ? variant.discountedPrice : variant.actualPrice);
            const addOnsTotal = addOns.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
            
            const newItem = {
              cartId,
              product,
              variant,
              variantName: variant.name,
              addOns,
              quantity,
              pricePerItem: basePrice + addOnsTotal,
            };
            newCart = [...state.cart, newItem];
          }

          // Trigger payment recalculation if not in mix mode
          const subtotal = newCart.reduce((sum, i) => sum + (i.pricePerItem * i.quantity), 0);
          const total = Math.max(0, subtotal - state.discountAmount);
          
          let p = state.payments;
          if (state.paymentMode === "cash") p = { cashAmount: total, onlineAmount: 0 };
          else if (state.paymentMode === "online") p = { cashAmount: 0, onlineAmount: total };

          return { cart: newCart, payments: p };
        });
      },

      removeFromCart: (cartId) => {
        set((state) => {
          const newCart = state.cart.filter((item) => item.cartId !== cartId);
          const subtotal = newCart.reduce((sum, i) => sum + (i.pricePerItem * i.quantity), 0);
          const total = Math.max(0, subtotal - state.discountAmount);
          
          let p = state.payments;
          if (state.paymentMode === "cash") p = { cashAmount: total, onlineAmount: 0 };
          else if (state.paymentMode === "online") p = { cashAmount: 0, onlineAmount: total };
          
          return { cart: newCart, payments: p };
        });
      },

      updateQuantity: (cartId, delta) => {
        set((state) => {
          const newCart = state.cart.map((item) => {
            if (item.cartId === cartId) {
              const newQuantity = item.quantity + delta;
              return { ...item, quantity: Math.max(0, newQuantity) };
            }
            return item;
          }).filter(item => item.quantity > 0);

          const subtotal = newCart.reduce((sum, i) => sum + (i.pricePerItem * i.quantity), 0);
          const total = Math.max(0, subtotal - state.discountAmount);
          
          let p = state.payments;
          if (state.paymentMode === "cash") p = { cashAmount: total, onlineAmount: 0 };
          else if (state.paymentMode === "online") p = { cashAmount: 0, onlineAmount: total };

          return { cart: newCart, payments: p };
        });
      },

      setDiscount: (amount) => set((state) => {
        const subtotal = state.cart.reduce((sum, i) => sum + (i.pricePerItem * i.quantity), 0);
        const total = Math.max(0, subtotal - amount);
        
        let p = state.payments;
        if (state.paymentMode === "cash") p = { cashAmount: total, onlineAmount: 0 };
        else if (state.paymentMode === "online") p = { cashAmount: 0, onlineAmount: total };
        
        return { discountAmount: amount, payments: p };
      }),
      
      setCustomerDetails: (details) => set({ customerDetails: details }),

      clearCart: () => set({ 
        cart: [], 
        discountAmount: 0, 
        customerName: "", 
        customerMobile: "", 
        payments: { cashAmount: 0, onlineAmount: 0 },
        paymentMode: "cash"
      }),

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
      // Only persist cart and basics, maybe not full checkout state if browser reloads?
      // Actually receptionist might want it persisted if they refresh by mistake.
    }
  )
);
