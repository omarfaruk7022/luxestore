// QuickViewModal.jsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Heart,
  Star,
  Check,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import { formatPrice, getDiscountPercent, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function QuickViewModal({ product, onClose }) {
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const uniqueColors = [
    ...new Map(product.variants.map((v) => [v.color, v])).values(),
  ];
  const availableSizes = selectedColor
    ? product.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size)
    : [...new Set(product.variants.map((v) => v.size))];

  const currentVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor,
  );

  const discount = getDiscountPercent(product.price, product.discountPrice);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    if (!currentVariant) {
      toast.error("Variant not available");
      return;
    }
    addItem({
      productId: product._id,
      variantId: currentVariant._id,
      name: product.name,
      image: product.images?.[0],
      price: product.discountPrice || product.price,
      size: selectedSize,
      color: selectedColor,
      colorHex: currentVariant.colorHex,
      quantity,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="w-full max-w-4xl bg-card rounded-3xl overflow-hidden shadow-2xl relative"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="grid md:grid-cols-2 p-5 ">
            {/* Images */}
            <div className="relative bg-secondary">
              <div className="relative aspect-square">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    {product.images?.[selectedImage] && (
                      <Image
                        src={
                          product.images[selectedImage] ||
                          "/images/placeholder.png"
                        }
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-2xl"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold rounded-full bg-accent text-white">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 p-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={cn(
                        "relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                        selectedImage === i
                          ? "border-foreground"
                          : "border-transparent opacity-60 hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img || "/images/placeholder.png"}
                        alt=""
                        fill
                        className="object-cover"
                      />{" "}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[520px]">
              <div>
                <p className="text-xs text-accent font-medium mb-1">
                  {product.category?.name}
                </p>
                <h2 className="font-display text-2xl font-light leading-snug">
                  {product.name}
                </h2>

                {product.numReviews > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={
                              i < Math.round(product.rating)
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              i < Math.round(product.rating)
                                ? "text-amber-400"
                                : "text-muted-foreground"
                            }
                          />
                        ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating?.toFixed(1)} ({product.numReviews})
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {product.shortDescription || product.description}
              </p>

              {/* Color */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2">
                  Color:{" "}
                  <span className="font-normal normal-case text-muted-foreground">
                    {selectedColor || "Select"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => {
                        setSelectedColor(v.color);
                        setSelectedSize("");
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer",
                        selectedColor === v.color
                          ? "border-foreground ring-1 ring-foreground"
                          : "hover:border-foreground/50",
                      )}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-border"
                        style={{ background: v.colorHex }}
                      />
                      {v.color}
                      {selectedColor === v.color && <Check size={10} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2">
                  Size:{" "}
                  <span className="font-normal normal-case text-muted-foreground">
                    {selectedSize || "Select"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                    const available = availableSizes.includes(size);
                    const v = product.variants.find(
                      (v) => v.size === size && v.color === selectedColor,
                    );
                    const inStock = v ? v.stock > 0 : true;
                    return (
                      <button
                        key={size}
                        onClick={() =>
                          available && inStock && setSelectedSize(size)
                        }
                        disabled={!available || !inStock}
                        className={cn(
                          "w-10 h-10 rounded-lg border text-xs font-medium transition-all cursor-pointer",
                          selectedSize === size
                            ? "bg-foreground text-background border-foreground"
                            : "",
                          !available || !inStock
                            ? "opacity-30 cursor-not-allowed line-through"
                            : "hover:border-foreground/50 cursor-pointer",
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(currentVariant?.stock || 10, quantity + 1),
                    )
                  }
                  className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                </button>
                {currentVariant && (
                  <span className="text-xs text-muted-foreground">
                    {currentVariant.stock} left
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.totalStock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <Link
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  Full Details <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
