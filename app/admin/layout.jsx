'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart2, ChevronRight, ArrowLeft, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) router.push('/');
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isAuthenticated() || !isAdmin()) return null;

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
            <BarChart2 size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <p className="text-xs text-muted-foreground">LuxeWear Management</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors">
          <ArrowLeft size={15} />
          Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-card fixed top-16 bottom-0 left-0 flex-col z-40 hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-card border-b px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Menu size={18} />
        </button>
        <span className="text-sm font-medium">
          {NAV_ITEMS.find(i => i.href === pathname || (i.href !== '/admin' && pathname.startsWith(i.href)))?.label || 'Admin'}
        </span>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-card border-r z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-semibold text-sm">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary">
                  <X size={16} />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        active ? 'bg-foreground text-background' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon size={16} />
                      {label}
                      {active && <ChevronRight size={13} className="ml-auto" />}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t">
                <Link href="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-secondary transition-colors">
                  <ArrowLeft size={15} />
                  Back to Store
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 lg:p-8 mt-10 lg:mt-0"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}