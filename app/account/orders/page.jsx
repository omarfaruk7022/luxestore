'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Eye } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { formatPrice, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS, cn } from '@/lib/utils';

export default function OrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: () => orderApi.getAll({ page, limit: 10 }).then((r) => r.data),
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  if (isLoading) return (
    <div className="space-y-4">
      {Array(4).fill(null).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border bg-card">
          <div className="flex justify-between mb-3">
            <div className="h-5 w-40 rounded shimmer" />
            <div className="h-5 w-24 rounded shimmer" />
          </div>
          <div className="h-4 w-64 rounded shimmer" />
        </div>
      ))}
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-card">
      <Package size={48} className="text-muted-foreground/30 mb-4" />
      <h3 className="font-display text-2xl font-light mb-2">No orders yet</h3>
      <p className="text-muted-foreground text-sm mb-6">Your orders will appear here once you make a purchase.</p>
      <Link href="/shop" className="px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Order History</h2>
        {pagination && <p className="text-sm text-muted-foreground">{pagination.total} orders</p>}
      </div>

      {orders.map((order, i) => (
        <motion.div
          key={order._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-5 rounded-2xl border bg-card hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-mono font-medium text-muted-foreground">{order.orderNumber}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full capitalize', ORDER_STATUS_COLORS[order.orderStatus])}>
                {order.orderStatus}
              </span>
              <span className={cn('px-2.5 py-1 text-xs font-medium rounded-full capitalize', PAYMENT_STATUS_COLORS[order.paymentStatus])}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {order.items?.slice(0, 3).map((item, j) => (
              <div key={j} className="text-xs text-muted-foreground bg-secondary rounded-lg px-2.5 py-1">
                {item.name} ×{item.quantity}
              </div>
            ))}
            {order.items?.length > 3 && (
              <span className="text-xs text-muted-foreground">+{order.items.length - 3} more</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold">{formatPrice(order.total)}</span>
              <span className="text-muted-foreground ml-3">via {order.paymentMethod?.toUpperCase()}</span>
            </div>
            <Link
              href={`/account/orders/${order._id}`}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <Eye size={13} /> View Details
            </Link>
          </div>
        </motion.div>
      ))}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40 hover:bg-secondary transition-colors">
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40 hover:bg-secondary transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
