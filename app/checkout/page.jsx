"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Truck,
  Zap,
  Clock,
  ChevronRight,
  Lock,
} from "lucide-react";
import { cartApi, orderApi } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard Delivery",
    desc: "3–5 business days",
    price: 60,
    icon: Truck,
  },
  {
    id: "express",
    label: "Express Delivery",
    desc: "1–2 business days",
    price: 120,
    icon: Zap,
  },
  {
    id: "overnight",
    label: "Overnight Delivery",
    desc: "Next business day",
    price: 250,
    icon: Clock,
  },
];
const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", icon: DollarSign },
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { clearCart, items, subtotal: getSubtotal } = useCartStore();
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: review
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "Dhaka",
    state: "Dhaka",
    zip: "",
    country: "Bangladesh",
  });

  // remove the useQuery for cart entirely

  const subtotal = getSubtotal();
  const shippingCost =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price || 60;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login?redirect=/checkout");
    }
  }, [router]);

  const handlePlaceOrder = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await orderApi.create({
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: address,
        shippingMethod,
        paymentMethod,
      });

      await clearCart();
      toast.success("Order placed successfully!");
      router.push(`/account/orders/${res.data.order._id}?success=1`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-4xl font-light mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10">
          {["Shipping", "Payment", "Review"].map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <button
                onClick={() => i + 1 < step && setStep(i + 1)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${step === i + 1 ? "text-foreground" : step > i + 1 ? "text-accent" : "text-muted-foreground"}`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? "bg-foreground text-background" : step > i + 1 ? "bg-accent text-white" : "bg-secondary"}`}
                >
                  {i + 1}
                </span>
                {label}
              </button>
              {i < 2 && (
                <ChevronRight size={14} className="text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main */}
          <div className="space-y-6">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl border bg-card">
                  <h2 className="font-semibold mb-5">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name *", key: "fullName", col: 1 },
                      { label: "Phone *", key: "phone", col: 1 },
                      { label: "Street Address *", key: "street", col: 2 },
                      { label: "City *", key: "city", col: 1 },
                      { label: "State / Division", key: "state", col: 1 },
                      { label: "ZIP Code", key: "zip", col: 1 },
                      { label: "Country", key: "country", col: 1 },
                    ].map(({ label, key, col }) => (
                      <div key={key} className={col === 2 ? "col-span-2" : ""}>
                        <label className="text-sm font-medium mb-1.5 block">
                          {label}
                        </label>
                        <input
                          value={address[key]}
                          onChange={(e) =>
                            setAddress({ ...address, [key]: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border bg-card">
                  <h2 className="font-semibold mb-5">Shipping Method</h2>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map(
                      ({ id, label, desc, price, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setShippingMethod(id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${shippingMethod === id ? "border-foreground ring-1 ring-foreground bg-secondary/50" : "hover:bg-secondary/50"}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${shippingMethod === id ? "bg-foreground text-background" : "bg-secondary"}`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">{label}</p>
                            <p className="text-xs text-muted-foreground">
                              {desc}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(price)}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl border bg-card">
                  <h2 className="font-semibold mb-5">Payment Method</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === id ? "border-foreground ring-1 ring-foreground bg-secondary/50" : "hover:bg-secondary/50"}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === id ? "bg-foreground text-background" : "bg-secondary"}`}
                        >
                          <Icon size={18} />
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl border font-medium hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
                  >
                    Review Order
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="p-6 rounded-2xl border bg-card">
                  <h2 className="font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.size} · {item.color} · ×{item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border bg-card space-y-3">
                  <h2 className="font-semibold mb-2">Confirm Details</h2>
                  <div className="text-sm space-y-1.5">
                    <p>
                      <span className="text-muted-foreground">
                        Delivery to:
                      </span>{" "}
                      {address.fullName}, {address.street}, {address.city}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      {address.phone}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Shipping:</span>{" "}
                      {
                        SHIPPING_METHODS.find((m) => m.id === shippingMethod)
                          ?.label
                      }
                    </p>
                    <p>
                      <span className="text-muted-foreground">Payment:</span>{" "}
                      {
                        PAYMENT_METHODS.find((m) => m.id === paymentMethod)
                          ?.label
                      }
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl border font-medium hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Lock size={16} />
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="p-6 rounded-2xl border bg-card space-y-4">
              <h3 className="font-semibold">Cart Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} · {item.color}
                      </p>
                    </div>
                    <p className="text-xs font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
