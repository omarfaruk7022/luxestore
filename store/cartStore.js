// import { create } from 'zustand';
// import { cartApi } from '@/lib/api';
// import toast from 'react-hot-toast';

// const useCartStore = create((set, get) => ({
//   cart: null,
//   isLoading: false,
//   isOpen: false,

//   setOpen: (val) => set({ isOpen: val }),

//   fetchCart: async () => {
//     set({ isLoading: true });
//     try {
//       const res = await cartApi.get();
//       set({ cart: res.data.cart });
//     } catch {
//       // silent
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   addItem: async (data) => {
//     try {
//       const res = await cartApi.add(data);
//       set({ cart: res.data.cart, isOpen: true });
//       toast.success('Added to cart!');
//       return { success: true };
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to add item');
//       return { success: false };
//     }
//   },

//   updateItem: async (itemId, quantity) => {
//     try {
//       const res = await cartApi.update(itemId, { quantity });
//       set({ cart: res.data.cart });
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Update failed');
//     }
//   },

//   removeItem: async (itemId) => {
//     try {
//       const res = await cartApi.remove(itemId);
//       set({ cart: res.data.cart });
//       toast.success('Item removed');
//     } catch {
//       toast.error('Failed to remove item');
//     }
//   },

//   clearCart: async () => {
//     try {
//       await cartApi.clear();
//       set({ cart: null });
//     } catch {
//       // silent
//     }
//   },

//   itemCount: () => {
//     const cart = get().cart;
//     return cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
//   },

//   subtotal: () => {
//     const cart = get().cart;
//     return cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;
//   },
// }));

// export default useCartStore;

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
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);

export default useCartStore;
