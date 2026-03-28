import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { cartApi } from "@/lib/api";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setOpen: (val) => set({ isOpen: val }),
      // fetchCart: async () => {
      //   set({ isLoading: true });
      //   try {
      //     const res = await cartApi.get();
      //     set({ cart: res.data.cart });
      //   } catch {
      //     // silent
      //   } finally {
      //     set({ isLoading: false });
      //   }
      // },

      addItem: (newItem) => {
        const items = get().items;
        const existingIdx = items.findIndex(
          (i) =>
            i.productId === newItem.productId &&
            i.variantId === newItem.variantId,
        );
        if (existingIdx > -1) {
          const updated = [...items];
          updated[existingIdx].quantity += newItem.quantity || 1;
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...items, { ...newItem, quantity: newItem.quantity || 1 }],
            isOpen: true,
          });
        }
        toast.success("Added to cart!");
      },

      updateItem: (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
        toast.success("Item removed");
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.discountPrice || i.price) * i.quantity,
          0,
        ),
    }),
    { name: "cart-storage" },
  ),
);

export default useCartStore;
