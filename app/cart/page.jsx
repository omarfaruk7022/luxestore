"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { formatPrice } from "@/lib/utils";
import CartDrawer from "@/components/cart/CartDrawer";

export default function CartPage() {
  const { items, fetchCart, updateItem, removeItem, itemCount, subtotal } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // useEffect(() => {
  //   if (isAuthenticated()) fetchCart();
  // }, []);

  // const items = cart?.items || [];
  const SHIPPING_THRESHOLD = 999;
  const shippingFree = subtotal() >= SHIPPING_THRESHOLD;
  const shippingProgress = Math.min(
    (subtotal() / SHIPPING_THRESHOLD) * 100,
    100,
  );

  // if (!isAuthenticated())
  //   return (
  //     <div className="min-h-screen pt-24 flex items-center justify-center">
  //       <div className="text-center">
  //         <ShoppingBag
  //           size={48}
  //           className="text-muted-foreground/30 mx-auto mb-4"
  //         />
  //         <h2 className="font-display text-3xl font-light mb-2">
  //           Sign in to view your cart
  //         </h2>
  //         <Link
  //           href="/login"
  //           className="mt-4 inline-block px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium"
  //         >
  //           Sign In
  //         </Link>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-4xl font-light">Shopping Cart</h1>
          {itemCount() > 0 && (
            <span className="px-3 py-1 rounded-full bg-secondary text-sm font-medium">
              {itemCount()} items
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={64} className="text-muted-foreground/20 mb-6" />
            <h2 className="font-display text-3xl font-light mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything yet
            </p>
            <Link
              href="/shop"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            {/* Items */}
            <div className="space-y-4">
              {/* Free shipping progress */}
              <div className="p-4 rounded-2xl border bg-card">
                {shippingFree ? (
                  <p className="text-sm text-green-600 font-medium">
                    {" "}
                    You qualify for free shipping!
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add{" "}
                      <span className="font-medium text-foreground">
                        {formatPrice(SHIPPING_THRESHOLD - subtotal())}
                      </span>{" "}
                      more for free shipping
                    </p>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress}%` }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </>
                )}
              </div>

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
                    className="flex gap-5 p-5 rounded-2xl border bg-card"
                  >
                    <Link
                      href={`/shop/${item.product?.slug || "#"}`}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-secondary shrink-0 block"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/shop/${item.product?.slug || "#"}`}
                            className="font-medium hover:text-accent transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                              {item.size}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span
                                className="w-3 h-3 rounded-full border border-border inline-block"
                                style={{ background: item.colorHex }}
                              />
                              {item.color}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateItem(item.variantId, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItem(item.variantId, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={15} /> Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-4">
              <div className="p-6 rounded-2xl border bg-card space-y-4">
                <h3 className="font-semibold text-lg">Order Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount()} items)
                    </span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span
                      className={
                        shippingFree ? "text-green-600 font-medium" : ""
                      }
                    >
                      {shippingFree ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-between font-semibold text-base">
                  <span>Estimated Total</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </div>

              {/* Accepted payments */}
              <div className="p-4 rounded-2xl border bg-card">
                <p className="text-xs text-muted-foreground mb-3">We accept</p>
                <div className="flex flex-wrap gap-2">
                  {["Visa", "Mastercard", "bKash", "Nagad", "COD"].map(
                    (method) => (
                      <span
                        key={method}
                        className="px-2.5 py-1 text-xs border rounded-lg font-medium"
                      >
                        {method}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <CartDrawer />
    </div>
  );
}
