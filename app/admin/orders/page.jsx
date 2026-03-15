"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Eye, Edit2, Check } from "lucide-react";
import { adminApi } from "@/lib/api";
import {
  formatPrice,
  formatDate,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  cn,
} from "@/lib/utils";
import toast from "react-hot-toast";

const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [paymentFilter, setPaymentFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    orderStatus: "",
    paymentStatus: "",
    trackingNumber: "",
    note: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", page, statusFilter, paymentFilter],
    queryFn: () =>
      adminApi
        .getOrders({
          page,
          limit: 15,
          status: statusFilter || undefined,
          paymentStatus: paymentFilter || undefined,
        })
        .then((r) => r.data),
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  const openEdit = (order) => {
    setEditingOrder(order._id);
    setEditForm({
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber || "",
      note: "",
    });
  };

  const handleUpdate = async (orderId) => {
    setUpdatingId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, editForm);
      queryClient.invalidateQueries(["admin-orders"]);
      setEditingOrder(null);
      toast.success("Order updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light">Orders</h1>
          {pagination && (
            <p className="text-muted-foreground text-sm mt-1">
              {pagination.total} total orders
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="appearance-none pl-4 pr-8 py-2.5 text-sm rounded-xl border bg-card cursor-pointer outline-none"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
        </div>
        <div className="relative">
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
            className="appearance-none pl-4 pr-8 py-2.5 text-sm rounded-xl border bg-card cursor-pointer outline-none"
          >
            <option value="">All Payments</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
          />
        </div>
        {(statusFilter || paymentFilter) && (
          <button
            onClick={() => {
              setStatusFilter("");
              setPaymentFilter("");
            }}
            className="px-4 py-2.5 text-sm rounded-xl border hover:bg-secondary transition-colors text-muted-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card w-full max-w-[100vw] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                {[
                  "Order #",
                  "Customer",
                  "Items",
                  "Total",
                  "Payment",
                  "Order Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap first:pl-4 md:first:pl-6 last:pr-4 md:last:pr-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading
                ? Array(10)
                    .fill(null)
                    .map((_, i) => (
                      <tr key={i}>
                        {Array(8)
                          .fill(null)
                          .map((_, j) => (
                            <td key={j} className="py-4 px-3 md:px-4">
                              <div className="h-4 rounded shimmer" />
                            </td>
                          ))}
                      </tr>
                    ))
                : orders.map((order) => (
                    <>
                      <tr
                        key={order._id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 px-3 md:px-4 first:pl-4 md:first:pl-6 font-mono text-[10px] md:text-xs font-medium whitespace-nowrap">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-3 md:px-4 min-w-[120px]">
                          <p className="font-medium truncate max-w-[150px]">
                            {order.user?.name}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[150px]">
                            {order.user?.phone}
                          </p>
                        </td>
                        <td className="py-3 px-3 md:px-4 text-muted-foreground whitespace-nowrap">
                          {order.items?.length}
                        </td>
                        <td className="py-3 px-3 md:px-4 font-semibold whitespace-nowrap">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[10px] md:text-xs rounded-full font-medium capitalize",
                              PAYMENT_STATUS_COLORS[order.paymentStatus],
                            )}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "px-2 py-0.5 text-[10px] md:text-xs rounded-full font-medium capitalize",
                              ORDER_STATUS_COLORS[order.orderStatus],
                            )}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 md:px-4 text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-3 md:px-4 last:pr-4 md:last:pr-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                editingOrder === order._id
                                  ? setEditingOrder(null)
                                  : openEdit(order)
                              }
                              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                            >
                              <Edit2
                                size={14}
                                className="md:w-4 md:h-4 w-3.5 h-3.5"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline edit row */}
                      {editingOrder === order._id && (
                        <tr
                          key={`edit-${order._id}`}
                          className="bg-secondary/20"
                        >
                          <td colSpan={8} className="px-6 py-4">
                            <div className="flex flex-wrap items-end gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block">
                                  Order Status
                                </label>
                                <select
                                  value={editForm.orderStatus}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      orderStatus: e.target.value,
                                    })
                                  }
                                  className="px-3 py-2 text-sm rounded-xl border bg-card outline-none"
                                >
                                  {ORDER_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">
                                  Payment Status
                                </label>
                                <select
                                  value={editForm.paymentStatus}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      paymentStatus: e.target.value,
                                    })
                                  }
                                  className="px-3 py-2 text-sm rounded-xl border bg-card outline-none"
                                >
                                  {PAYMENT_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">
                                  Tracking Number
                                </label>
                                <input
                                  value={editForm.trackingNumber}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      trackingNumber: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. BD-123456"
                                  className="px-3 py-2 text-sm rounded-xl border bg-card outline-none w-40"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block">
                                  Note
                                </label>
                                <input
                                  value={editForm.note}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      note: e.target.value,
                                    })
                                  }
                                  placeholder="Status note..."
                                  className="px-3 py-2 text-sm rounded-xl border bg-card outline-none w-48"
                                />
                              </div>
                              <button
                                onClick={() => handleUpdate(order._id)}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50"
                              >
                                <Check size={14} />
                                {updatingId === order._id
                                  ? "Saving..."
                                  : "Save"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 rounded-xl border text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <AdminOrdersContent />
    </Suspense>
  );
}
