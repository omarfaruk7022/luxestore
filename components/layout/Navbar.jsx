"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?newArrival=true" },
  { label: "Best Sellers", href: "/shop?bestSeller=true" },
  { label: "Sale", href: "/shop?sale=true" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const { itemCount, setOpen } = useCartStore();

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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass shadow-sm" : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-display font-bold">
                  L
                </span>
              </div>
              <span className="font-display text-xl font-semibold tracking-wide">
                LuxeWear
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent",
                    pathname === link.href
                      ? "text-accent"
                      : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Wishlist */}
              {isAuthenticated() && (
                <Link
                  href="/account/wishlist"
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <Heart size={18} />
                </Link>
              )}

              {/* User */}
              {isAuthenticated() ? (
                <div className="relative group">
                  <button className="p-2 rounded-full hover:bg-secondary transition-colors flex items-center gap-1 cursor-pointer">
                    <User size={18} />
                    <ChevronDown size={12} className="hidden md:block" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-card shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors "
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
                      >
                        My Orders
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-accent"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-destructive cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Sign In
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setOpen(true)}
                className="relative p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {itemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {itemCount() > 9 ? "9+" : itemCount()}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-card"
            >
              <nav className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated() && (
                  <Link
                    href="/login"
                    className="mt-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-foreground text-background text-center"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onSubmit={handleSearch}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl"
            >
              <div className="flex items-center gap-3 bg-card border rounded-2xl px-5 py-4 shadow-2xl">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X
                    size={18}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  />
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
