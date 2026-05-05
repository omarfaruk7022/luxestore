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
  Leaf,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { useStore } from "@/components/layout/StoreProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?newArrival=true" },
  { label: "Best Sellers", href: "/shop?bestSeller=true" },
  { label: "Sale", href: "/shop?sale=true" },
  { label: "Purchase request", href: "/purchase" },
];

export default function NatureNavbar() {
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
            : "bg-transparent",
        )}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo with leaf */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf size={15} className="text-white" />
              </div>
              <span className="font-semibold text-base tracking-wide">
                {settings.storeName || "Store"}
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300",
                    pathname === link.href
                      ? "text-accent after:w-full"
                      : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-accent/10 transition-colors cursor-pointer"
              >
                <Search size={17} />
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-accent/10 transition-colors cursor-pointer"
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              {isAuthenticated() && (
                <Link
                  href="/account/wishlist"
                  className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                >
                  <Heart size={17} />
                </Link>
              )}
              {isAuthenticated() ? (
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-accent/10 transition-colors cursor-pointer">
                    <User size={17} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border bg-card shadow-lg z-50 hidden group-hover:block overflow-hidden">
                    <div className="p-3 border-b bg-accent/5">
                      <p className="text-sm font-semibold truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/10 transition-colors"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/10 transition-colors"
                      >
                        My Orders
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="flex items-center px-3 py-2 text-sm rounded-xl hover:bg-accent/10 transition-colors text-accent"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center px-5 py-2 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setOpen(true)}
                className="relative p-2 rounded-full hover:bg-accent/10 transition-colors cursor-pointer"
              >
                <ShoppingBag size={17} />
                {itemCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount() > 9 ? "9+" : itemCount()}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-full hover:bg-accent/10 transition-colors"
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background/95 backdrop-blur-md"
            >
              <nav className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/10 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                {!isAuthenticated() && (
                  <Link
                    href="/login"
                    className="mt-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-accent text-white text-center"
                  >
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
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-28 px-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              onSubmit={handleSearch}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <div className="flex items-center gap-3 bg-card border-2 border-accent/30 rounded-2xl px-5 py-4 shadow-2xl focus-within:border-accent transition-colors">
                <Search size={18} className="text-accent shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
