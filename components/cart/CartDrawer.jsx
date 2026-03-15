"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setOpen,
    updateItem,
    removeItem,
    itemCount,
    subtotal,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // useEffect(() => {
  //   if (isOpen && isAuthenticated()) fetchCart();
  // }, [isOpen]);

  // const items = cart?.items || [];


  console.log(items)
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-display text-xl font-semibold">
                  Your Cart
                </h2>
                {itemCount() > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-white">
                    {itemCount()}
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* {!isAuthenticated() ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/40" />
                  <div>
                    <p className="font-medium mb-1">Sign in to view your cart</p>
                    <p className="text-sm text-muted-foreground">Your saved items will appear here</p>
                  </div>
                  <Link href="/login" onClick={() => setOpen(false)} className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium">
                    Sign In
                  </Link>
                </div>
              ) : */}
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/40" />
                  <div>
                    <p className="font-medium mb-1">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">
                      Add some items to get started
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 p-3 rounded-xl border bg-background"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.size} · {item.color}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateItem(item.variantId, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateItem(item.variantId, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="ml-auto p-1 rounded hover:text-destructive transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-semibold">
                    {formatPrice(subtotal())}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full py-3 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
