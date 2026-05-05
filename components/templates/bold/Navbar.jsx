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
  { label: "New Drops", href: "/shop?newArrival=true" },
  { label: "Best Sellers", href: "/shop?bestSeller=true" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Purchase request", href: "/purchase" },
];

export default function BoldNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const { itemCount, setOpen } = useCartStore();
  const { settings } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-foreground shadow-lg" : "bg-foreground/95",
        )}
      >
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <span className="text-accent font-black text-xl uppercase tracking-tighter">
                {settings.storeName || "Store"}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors",
                    pathname === link.href
                      ? "text-accent"
                      : "text-white/70 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {isAuthenticated() && (
                <Link
                  href="/account/wishlist"
                  className="p-2 text-white/70 hover:text-white transition-colors"
                >
                  <Heart size={18} />
                </Link>
              )}
              {isAuthenticated() ? (
                <div className="relative group">
                  <button className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer">
                    <User size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-44 bg-foreground border border-white/10 shadow-2xl z-50 hidden group-hover:block">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/account"
                        className="block px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Orders
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-xs text-accent hover:bg-white/5 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block px-4 py-2 bg-accent text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setOpen(true)}
                className="relative p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <ShoppingBag size={18} />
                {itemCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount() > 9 ? "9+" : itemCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-white"
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
              className="md:hidden overflow-hidden border-t border-white/10 bg-foreground"
            >
              <nav className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="py-2.5 text-sm font-bold uppercase tracking-widest text-white/70 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                {!isAuthenticated() && (
                  <Link
                    href="/login"
                    className="mt-2 py-3 bg-accent text-white text-sm font-bold uppercase tracking-widest text-center"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSearch}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <div className="flex items-center gap-4 border-b-2 border-accent pb-4">
                <Search size={24} className="text-accent shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white text-2xl font-bold outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>
              <p className="text-white/30 text-xs mt-3 uppercase tracking-widest">
                Press Enter to search
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
