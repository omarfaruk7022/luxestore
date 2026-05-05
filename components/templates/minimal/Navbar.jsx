"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { useStore } from "@/components/layout/StoreProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New", href: "/shop?newArrival=true" },
  { label: "Best Sellers", href: "/shop?bestSeller=true" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Purchase request", href: "/purchase" },
];

export default function MinimalNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const { itemCount, setOpen } = useCartStore();
  const { settings } = useStore();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-foreground text-background text-center py-2 text-xs tracking-widest uppercase font-medium">
        Free shipping on orders over {settings.currencySymbol}
        {settings.freeShippingThreshold} — Across Bangladesh
      </div>

      <header className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-bold tracking-tight uppercase"
            >
              {settings.storeName || "Store"}
            </Link>

            {/* Desktop Nav — centered */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-wide transition-colors border-b-2 pb-0.5",
                    pathname === link.href
                      ? "border-foreground"
                      : "border-transparent hover:border-foreground/40 text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 hover:opacity-60 transition-opacity cursor-pointer"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-1.5 hover:opacity-60 transition-opacity cursor-pointer"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {isAuthenticated() && (
                <Link
                  href="/account/wishlist"
                  className="p-1.5 hover:opacity-60 transition-opacity"
                >
                  <Heart size={18} />
                </Link>
              )}
              {isAuthenticated() ? (
                <div className="relative group">
                  <button className="p-1.5 hover:opacity-60 transition-opacity cursor-pointer">
                    <User size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-44 border bg-card shadow-xl z-50 hidden group-hover:block">
                    <div className="p-3 border-b">
                      <p className="text-xs font-semibold truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-xs hover:bg-secondary transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-3 py-2 text-xs hover:bg-secondary transition-colors"
                      >
                        Orders
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-xs hover:bg-secondary transition-colors text-accent"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors text-destructive cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block text-sm font-medium hover:opacity-60 transition-opacity"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setOpen(true)}
                className="relative p-1.5 hover:opacity-60 transition-opacity cursor-pointer"
              >
                <ShoppingBag size={18} />
                {itemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                    {itemCount() > 9 ? "9+" : itemCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="md:hidden overflow-hidden border-t bg-background"
            >
              <nav className="px-6 py-4 flex flex-col gap-3">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm font-medium py-1"
                  >
                    {l.label}
                  </Link>
                ))}
                {!isAuthenticated() && (
                  <Link href="/login" className="text-sm font-medium py-1">
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-start justify-center pt-32 px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              onSubmit={handleSearch}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <div className="flex items-center gap-4 border-b-2 border-foreground pb-3">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xl outline-none placeholder:text-muted-foreground"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={20} />
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
