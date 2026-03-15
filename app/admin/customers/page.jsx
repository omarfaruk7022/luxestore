"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, Shield } from "lucide-react";
import { adminApi } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () =>
      adminApi
        .getUsers({ page, limit: 15, search: search || undefined })
        .then((r) => r.data),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  const handleToggle = async (userId, currentStatus) => {
    setTogglingId(userId);
    try {
      await adminApi.toggleUser(userId);
      queryClient.invalidateQueries(["admin-users"]);
      toast.success(currentStatus ? "User deactivated" : "User activated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 w-full ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light">Customers</h1>
          {pagination && (
            <p className="text-muted-foreground text-sm mt-1">
              {pagination.total} registered users
            </p>
          )}
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="rounded-2xl border bg-card w-full max-w-[100vw] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                {[
                  "Customer",
                  "Role",
                  "Phone",
                  "Joined",
                  "Status",
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
                        {Array(6)
                          .fill(null)
                          .map((_, j) => (
                            <td key={j} className="py-4 px-3 md:px-4">
                              <div className="h-4 rounded shimmer" />
                            </td>
                          ))}
                      </tr>
                    ))
                : users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-3 md:px-4 first:pl-4 md:first:pl-6">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="text-accent text-sm font-semibold">
                              {user.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[100px] md:max-w-none">{user.name}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[100px] md:max-w-none">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-4">
                        <span
                          className={cn(
                            "flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap",
                            user.role === "admin"
                              ? "bg-violet-100 dark:bg-violet-900/30 text-white dark:text-violet-300"
                              : "bg-secondary text-muted-foreground",
                          )}
                        >
                          {user.role === "admin" && <Shield size={10} className="md:w-3 md:h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 md:px-4 text-muted-foreground whitespace-nowrap text-[11px] md:text-sm">
                        {user.phone || "—"}
                      </td>
                      <td className="py-3 px-3 md:px-4 text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-3 md:px-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap",
                            user.isActive
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
                          )}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-3 md:px-4 last:pr-4 md:last:pr-6 whitespace-nowrap">
                        {user.role !== "admin" && (
                          <button
                            onClick={() =>
                              handleToggle(user._id, user.isActive)
                            }
                            disabled={togglingId === user._id}
                            className={cn(
                              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] md:text-xs font-medium transition-colors disabled:opacity-50",
                              user.isActive
                                ? "hover:bg-destructive/10 hover:text-destructive"
                                : "hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-700",
                            )}
                          >
                            {user.isActive ? (
                              <UserX size={12} className="md:w-3.5 md:h-3.5" />
                            ) : (
                              <UserCheck size={12} className="md:w-3.5 md:h-3.5" />
                            )}
                            <span className="hidden sm:inline">
                              {togglingId === user._id
                                ? "..."
                                : user.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

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
