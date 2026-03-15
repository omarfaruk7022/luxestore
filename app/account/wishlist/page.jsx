"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { userApi } from "@/lib/api";
import ProductCard from "@/components/shop/ProductCard";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => userApi.getWishlist().then((r) => r.data.wishlist),
  });

  const handleRemove = async (productId) => {
    try {
      await userApi.toggleWishlist(productId);
      queryClient.invalidateQueries(["wishlist"]);
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const items = data || [];

  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] rounded-2xl shimmer mb-4" />
              <div className="h-4 w-3/4 rounded shimmer mb-2" />
              <div className="h-4 w-1/2 rounded shimmer" />
            </div>
          ))}
      </div>
    );

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-card">
        <Heart size={48} className="text-muted-foreground/30 mb-4" />
        <h3 className="font-display text-2xl font-light mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          Save items you love and come back to them anytime.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Explore Products
        </Link>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg">Wishlist ({items.length})</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((product, i) => (
          <div key={product._id} className="relative group">
            <ProductCard product={product} index={i} />
            <button
              onClick={() => handleRemove(product._id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive z-10"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
