'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, MapPin, CreditCard, Truck, Clock, XCircle, ChevronRight } from 'lucide-react';
import { orderApi } from '@/lib/api';
import { formatPrice, formatDate, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useState } from 'react';

const STATUS_STEPS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered'];

const STATUS_ICON = {
  placed: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === '1';
  const [cancelling, setCancelling] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getOne(id).then((r) => r.data.order),
  });

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderApi.cancel(id, { reason: 'Cancelled by customer' });
      queryClient.invalidateQueries(['order', id]);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) return (
    <div className="space-y-4">
      {Array(3).fill(null).map((_, i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
    </div>
  );

  if (!data) return (
    <div className="text-center py-20">
      <p className="font-display text-2xl font-light">Order not found</p>
      <Link href="/account/orders" className="text-accent text-sm hover:underline mt-2 inline-block">Back to Orders</Link>
    </div>
  );

  const order = data;
  const currentStatusIdx = STATUS_STEPS.indexOf(order.orderStatus);
  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

  return (
    <div className="space-y-6">
      {/* Success banner */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Order placed successfully!</p>
            <p className="text-xs text-green-600 dark:text-green-400">Thank you for shopping with LuxeWear. We'll confirm your order shortly.</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/account/orders" className="hover:text-foreground transition-colors">Orders</Link>
            <ChevronRight size={14} />
            <span className="font-mono">{order.orderNumber}</span>
          </div>
          <h2 className="font-semibold text-lg">Order {order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('px-3 py-1.5 text-sm font-medium rounded-full capitalize', ORDER_STATUS_COLORS[order.orderStatus])}>
            {order.orderStatus}
          </span>
          <span className={cn('px-3 py-1.5 text-sm font-medium rounded-full capitalize', PAYMENT_STATUS_COLORS[order.paymentStatus])}>
            {order.paymentStatus}
          </span>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-3 py-1.5 text-sm font-medium rounded-full border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Status tracker */}
      {order.orderStatus !== 'cancelled' && order.orderStatus !== 'returned' && (
        <div className="p-6 rounded-2xl border bg-card">
          <h3 className="font-medium mb-6">Order Progress</h3>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-accent transition-all duration-700"
              style={{ width: currentStatusIdx >= 0 ? `${(currentStatusIdx / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
            />
            <div className="relative flex justify-between">
              {STATUS_STEPS.map((status, i) => {
                const Icon = STATUS_ICON[status] || Clock;
                const done = i <= currentStatusIdx;
                const active = i === currentStatusIdx;
                return (
                  <div key={status} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all',
                      done ? 'bg-accent border-accent text-white' : 'bg-card border-border text-muted-foreground',
                      active && 'ring-4 ring-accent/20'
                    )}>
                      <Icon size={16} />
                    </div>
                    <span className={cn('text-xs capitalize text-center', done ? 'font-medium' : 'text-muted-foreground')}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="p-6 rounded-2xl border bg-card">
        <h3 className="font-medium mb-5">Items Ordered</h3>
        <div className="space-y-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
                {item.image && <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color} · Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping ({order.shippingMethod})</span><span>{formatPrice(order.shippingCost)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span><span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-2 border-t">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping + Payment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-accent" />
            <h3 className="font-medium text-sm">Shipping Address</h3>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.street}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
            <p>{order.shippingAddress?.country}</p>
            <p className="text-foreground">{order.shippingAddress?.phone}</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-accent" />
            <h3 className="font-medium text-sm">Payment Info</h3>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={cn('font-medium capitalize', PAYMENT_STATUS_COLORS[order.paymentStatus].split(' ')[1])}>{order.paymentStatus}</span>
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking</span>
                <span className="font-mono text-xs">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status history */}
      {order.statusHistory?.length > 0 && (
        <div className="p-5 rounded-2xl border bg-card">
          <h3 className="font-medium text-sm mb-4">Order Timeline</h3>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium capitalize">{entry.status}</p>
                  <p className="text-xs text-muted-foreground">{entry.note}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(entry.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
