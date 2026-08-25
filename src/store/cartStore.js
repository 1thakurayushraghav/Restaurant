import { create } from "zustand";
import { persist } from "zustand/middleware";

// Client-side cart is an ESTIMATE only — server recalculates all pricing at checkout (see pricingService).
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // { productId, slug, name, image, isVeg, variantId, variantLabel, price, quantity }

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += item.quantity || 1;
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, quantity: item.quantity || 1 }] });
        }
      },

      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        });
      },

      increaseQty: (productId, variantId) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
      },

      decreaseQty: (productId, variantId) => {
        const items = get().items;
        const target = items.find((i) => i.productId === productId && i.variantId === variantId);
        if (!target) return;
        if (target.quantity <= 1) {
          set({ items: items.filter((i) => !(i.productId === productId && i.variantId === variantId)) });
        } else {
          set({
            items: items.map((i) =>
              i.productId === productId && i.variantId === variantId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
        }
      },

      changeVariant: (productId, oldVariantId, newVariant) => {
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === oldVariantId
              ? { ...i, variantId: newVariant.id, variantLabel: newVariant.label, price: newVariant.price }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "sm_cart" }
  )
);
