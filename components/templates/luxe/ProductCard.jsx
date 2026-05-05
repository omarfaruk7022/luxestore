"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye, ArrowRight } from "lucide-react";
import { formatPrice, getDiscountPercent, cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { userApi } from "@/lib/api";
import toast from "react-hot-toast";
import QuickViewModal from "@/components/modals/QuickViewModal";

export default function ProductCard({ product, index = 0, filtersOpen }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error("Sign in to save items");
      return;
    }
    try {
      const res = await userApi.toggleWishlist(product._id);
      setIsWishlisted(res.data.added);
      toast.success(res.data.message);
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-secondary mb-4">
          {product.images?.[imgIdx] && (
            <Image
              src={product.images[imgIdx]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Hover second image */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent text-white">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-foreground text-background">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary border">
                Best Seller
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              "bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-background cursor-pointer",
              isWishlisted && "opacity-100! text-red-500",
            )}
          >
            <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick view */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex items-center justify-center gap-2">
            <div
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-background/90 backdrop-blur-sm text-xs font-medium "
              onClick={(e) => {
                e.preventDefault();
                setShowQuickView(true);
              }}
            >
              <Eye size={14} />
              {!filtersOpen ? "Quick View" : ""}
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-background/90 backdrop-blur-sm text-sm font-medium">
              <ArrowRight size={14} />
              {!filtersOpen ? "View Details" : ""}
            </div>
          </div>

          {/* Out of stock */}
          {product.totalStock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-background border text-xs font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {product.category?.name}
          </p>
          <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {(() => {
                const lowestVariant = product.variants?.reduce(
                  (min, v) =>
                    (v.discountPrice || v.price) <
                    (min.discountPrice || min.price)
                      ? v
                      : min,
                  product.variants[0],
                );
                const finalPrice =
                  lowestVariant?.discountPrice || lowestVariant?.price;
                const originalPrice = lowestVariant?.discountPrice
                  ? lowestVariant?.price
                  : null;

                return (
                  <>
                    <span className="font-semibold">
                      {finalPrice ? formatPrice(finalPrice) : "TBA"}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>

            {product.numReviews > 0 && (
              <div className="flex items-center gap-1">
                <Star
                  size={11}
                  fill="currentColor"
                  className="text-amber-400"
                />
                <span className="text-xs text-muted-foreground">
                  {product.rating?.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </motion.div>
  );
}
