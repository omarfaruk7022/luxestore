"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "My Profile", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  // { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: "Change Password", href: "/account/password", icon: Lock },
];

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.push("/login");
  }, []);

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-4xl font-light mb-8">My Account</h1>
        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            {/* User info */}
            <div className="p-5 rounded-2xl border bg-card mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <span className="text-accent font-display text-lg font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-foreground text-background"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon size={16} />
                    {label}
                    {active && <ChevronRight size={14} className="ml-auto" />}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
