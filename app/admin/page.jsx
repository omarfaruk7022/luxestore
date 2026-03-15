'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, Package, Users, DollarSign, TrendingUp,
  Clock, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatPrice, formatDate, ORDER_STATUS_COLORS, cn } from '@/lib/utils';

function StatCard({ title, value, icon: Icon, change, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 rounded-2xl border bg-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {change && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
            <ArrowUpRight size={13} /> {change}
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-light">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </motion.div>
  );
}

// Simple bar chart using plain divs
function MiniBarChart({ data }) {
  if (!data?.length) return <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">No data yet</div>;
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.slice(-14).map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-sm bg-accent/80 hover:bg-accent transition-colors relative"
            style={{ height: `${(d.revenue / max) * 100}%`, minHeight: 2 }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
              <div className="bg-foreground text-background text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                {formatPrice(d.revenue)}
              </div>
            </div>
          </div>
          <span className="text-[9px] text-muted-foreground rotate-45 origin-left">{d._id?.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats().then((r) => r.data),
    refetchInterval: 30000,
  });

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];
  const dailyRevenue = data?.dailyRevenue || [];

  const STAT_CARDS = [
    { title: 'Total Revenue', value: isLoading ? '...' : formatPrice(stats.totalRevenue || 0), icon: DollarSign, color: 'bg-emerald-500', change: '+12%', delay: 0 },
    { title: 'Total Orders', value: isLoading ? '...' : stats.totalOrders?.toLocaleString() || '0', icon: ShoppingCart, color: 'bg-blue-500', change: '+8%', delay: 0.05 },
    { title: 'Products', value: isLoading ? '...' : stats.totalProducts?.toLocaleString() || '0', icon: Package, color: 'bg-violet-500', delay: 0.1 },
    { title: 'Customers', value: isLoading ? '...' : stats.totalUsers?.toLocaleString() || '0', icon: Users, color: 'bg-orange-500', change: '+5%', delay: 0.15 },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="font-display text-3xl font-light">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your store performance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      {/* Pending alerts */}
      {(stats.pendingOrders > 0 || stats.processingOrders > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-3"
        >
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders?status=placed" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm">
              <Clock size={15} className="text-amber-600" />
              <span className="font-medium text-amber-800 dark:text-amber-300">{stats.pendingOrders} new orders</span>
              <span className="text-amber-600 dark:text-amber-400">awaiting confirmation</span>
            </Link>
          )}
          {stats.processingOrders > 0 && (
            <Link href="/admin/orders?status=processing" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm">
              <Package size={15} className="text-blue-600" />
              <span className="font-medium text-blue-800 dark:text-blue-300">{stats.processingOrders} orders</span>
              <span className="text-blue-600 dark:text-blue-400">being processed</span>
            </Link>
          )}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border bg-card"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <TrendingUp size={18} className="text-accent" />
          </div>
          <MiniBarChart data={dailyRevenue} />
        </motion.div>

        {/* Top products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl border bg-card"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Top Products</h3>
            <Link href="/admin/products" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {isLoading ? (
              Array(5).fill(null).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl shimmer shrink-0" />
                  <div className="flex-1">
                    <div className="h-3.5 w-3/4 rounded shimmer mb-1.5" />
                    <div className="h-3 w-1/2 rounded shimmer" />
                  </div>
                </div>
              ))
            ) : topProducts.map((product, i) => (
              <div key={product._id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                  {product.images?.[0] && (
                    <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sold} sold · ★{product.rating?.toFixed(1)}</p>
                </div>
                <p className="text-xs font-semibold shrink-0">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl border bg-card"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold">Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs text-accent hover:underline flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-medium text-muted-foreground first:pl-0 last:pr-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array(5).fill(null).map((_, i) => (
                  <tr key={i}>
                    {Array(7).fill(null).map((_, j) => (
                      <td key={j} className="py-3 px-2"><div className="h-4 rounded shimmer" /></td>
                    ))}
                  </tr>
                ))
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-secondary/50 transition-colors">
                  <td className="py-3 px-2 first:pl-0 font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-3 px-2">
                    <p className="font-medium">{order.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{order.items?.length} items</td>
                  <td className="py-3 px-2 font-semibold">{formatPrice(order.total)}</td>
                  <td className="py-3 px-2">
                    <span className={cn('px-2 py-0.5 text-xs rounded-full font-medium capitalize', ORDER_STATUS_COLORS[order.orderStatus])}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground text-xs">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-2 last:pr-0">
                    <Link href={`/admin/orders/${order._id}`} className="text-xs text-accent hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
