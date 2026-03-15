"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Heart,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Check,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { productApi, userApi } from "@/lib/api";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { formatPrice, getDiscountPercent, cn } from "@/lib/utils";
import ProductCard from "@/components/shop/ProductCard";
import CartDrawer from "@/components/cart/CartDrawer";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productApi.getOne(slug).then((r) => r.data),
  });

  const product = data?.product;
  const related = data?.related || [];

  if (isLoading)
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl shimmer" />
            <div className="grid grid-cols-4 gap-2">
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl shimmer" />
                ))}
            </div>
          </div>
          <div className="space-y-4">
            {[80, 40, 60, 100, 60].map((w, i) => (
              <div
                key={i}
                className={`h-6 w-${w} rounded shimmer`}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl font-light mb-4">
            Product not found
          </p>
          <Link href="/shop" className="text-accent hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );

  // Get unique colors and sizes
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

  const handleAddToCart = async () => {
    // if (!isAuthenticated()) {
    //   toast.error("Please sign in first");
    //   router.push("/login");
    //   return;
    // }
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    if (!currentVariant) {
      toast.error("Variant not available");
      return;
    }

    await addItem({
      productId: product._id,
      variantId: currentVariant._id,
      size: selectedSize,
      color: selectedColor,
      colorHex: currentVariant.colorHex,
      quantity,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images?.[0],
    });
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated()) {
      toast.error("Please sign in first");
      router.push("/login");
      return;
    }
    await userApi.toggleWishlist(product._id);
    toast.success("Added to wishlist");
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link
            href="/shop"
            className="hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/shop?category=${product.category?.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category?.name}
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-secondary"
            >
              {product.images?.[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full bg-accent text-white">
                  -{discount}%
                </span>
              )}
            </motion.div>

            <div className="grid grid-cols-4 gap-3">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    selectedImage === i
                      ? "border-foreground"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Link
                href={`/shop?category=${product.category?.slug}`}
                className="text-sm text-accent hover:underline"
              >
                {product.category?.name}
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-light mt-2 mb-3">
                {product.name}
              </h1>

              {product.numReviews > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <Star
                          key={i}
                          size={14}
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
                  <span className="text-sm text-muted-foreground">
                    {product.rating?.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-medium">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Color */}
            <div>
              <p className="text-sm font-medium mb-3">
                Color:{" "}
                <span className="font-normal text-muted-foreground">
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
                      setSelectedVariant(null);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all",
                      selectedColor === v.color
                        ? "border-foreground ring-1 ring-foreground"
                        : "hover:border-foreground/50",
                    )}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ background: v.colorHex }}
                    />
                    {v.color}
                    {selectedColor === v.color && <Check size={12} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-sm font-medium mb-3">
                Size:{" "}
                <span className="font-normal text-muted-foreground">
                  {selectedSize || "Select"}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                  const available = availableSizes.includes(size);
                  const v = product.variants.find(
                    (v) => v.size === size && v.color === selectedColor,
                  );
                  const inStock = v ? v.stock > 0 : true;
                  return (
                    <button
                      key={size}
                      onClick={() => available && setSelectedSize(size)}
                      disabled={!available || !inStock}
                      className={cn(
                        "w-12 h-12 rounded-xl border text-sm font-medium transition-all",
                        selectedSize === size
                          ? "bg-foreground text-background border-foreground"
                          : "",
                        !available || !inStock
                          ? "opacity-30 cursor-not-allowed line-through"
                          : "hover:border-foreground/50",
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(currentVariant?.stock || 10, quantity + 1),
                    )
                  }
                  className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus size={14} />
                </button>
                {currentVariant && (
                  <span className="text-xs text-muted-foreground">
                    {currentVariant.stock} available
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                {product.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:bg-secondary transition-colors"
                onClick={handleAddToWishlist}
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t">
              {[
                { icon: Truck, text: "Free shipping over ৳999" },
                { icon: RotateCcw, text: "30-day easy returns" },
                { icon: Shield, text: "Quality guarantee" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center text-center gap-1.5"
                >
                  <Icon size={18} className="text-accent" />
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>

            {/* Product details */}
            {product.material && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Material:</span>{" "}
                  <span className="text-muted-foreground">
                    {product.material}
                  </span>
                </p>
                {product.careInstructions && (
                  <p className="text-sm">
                    <span className="font-medium">Care:</span>{" "}
                    <span className="text-muted-foreground">
                      {product.careInstructions}
                    </span>
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Brand:</span>{" "}
                  <span className="text-muted-foreground">{product.brand}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl font-light mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <CartDrawer />
    </div>
  );
}
