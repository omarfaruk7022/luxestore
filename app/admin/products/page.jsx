"use client";
import { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  X,
  Check,
  Star,
  Package,
  Upload,
} from "lucide-react";
import { productApi, categoryApi } from "@/lib/api";
import { formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  category: "",
  images: [],
  material: "",
  brand: "LuxeWear",
  tags: "",
  isFeatured: false,
  isNewArrival: false,
  isBestSeller: false,

  variants: [
    {
      size: "M",
      color: "Black",
      colorHex: "#000000",
      stock: 10,
      purchasePrice: "",
      price: "",
      discountPrice: "",
      images: [],
    },
  ],
};

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", page, search],
    queryFn: () =>
      productApi
        .getAll({ page, limit: 10, search: search || undefined })
        .then((r) => r.data),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll().then((r) => r.data.categories),
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({
      ...product,
      category: product.category?._id || "",
      tags: product.tags?.join(", ") || "",
      images: product.images?.length ? product.images : [""],
      discountPrice: product.discountPrice || "",
    });
    setEditId(product._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        images: form.images.filter(Boolean),
      };
      if (editId) {
        await productApi.update(editId, payload);
        toast.success("Product updated");
      } else {
        await productApi.create(payload);
        toast.success("Product created");
      }
      queryClient.invalidateQueries(["admin-products"]);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      const res = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images.filter(Boolean), ...data.urls],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productApi.delete(id);
      queryClient.invalidateQueries(["admin-products"]);
      toast.success("Product deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateVariant = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const handleVariantImageUpload = async (variantIndex, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      const res = await fetch("/api/upload/images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => {
          const variants = [...prev.variants];
          variants[variantIndex] = {
            ...variants[variantIndex],
            images: [...(variants[variantIndex].images || []), ...data.urls],
          };
          return { ...prev, variants };
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  console.log(products);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light">Products</h1>
          {pagination && (
            <p className="text-muted-foreground text-sm mt-1">
              {pagination.total} products
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
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
          placeholder="Search products..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border bg-card text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Products table */}
      <div className="rounded-2xl border bg-card w-full max-w-[100vw] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Rating",
                  "Sold",
                  "Badges",
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
                ? Array(8)
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
                : products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-3 md:px-4 first:pl-4 md:first:pl-6">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="flex items-center gap-2 md:gap-3"
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl overflow-hidden bg-secondary shrink-0">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[120px] md:max-w-[180px]">
                              {product.name}
                            </p>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-mono truncate max-w-[120px] md:max-w-none">
                              {product.slug}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-3 md:px-4 text-muted-foreground whitespace-nowrap text-[11px] md:text-sm">
                        {product.category?.name}
                      </td>
                      <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                        <p className="font-semibold text-[11px] md:text-sm">
                          {formatPrice(product.basePrice)}
                        </p>
                        <p className="text-[10px] md:text-xs text-muted-foreground">
                          {product.variants?.length} variants
                        </p>
                      </td>
                      <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "font-medium text-[11px] md:text-sm",
                            product.totalStock === 0
                              ? "text-destructive"
                              : product.totalStock < 10
                                ? "text-amber-500"
                                : "",
                          )}
                        >
                          {product.totalStock}
                        </span>
                      </td>
                      <td className="py-3 px-3 md:px-4 whitespace-nowrap">
                        {product.numReviews > 0 ? (
                          <div className="flex items-center gap-1 text-[11px] md:text-sm">
                            <Star
                              size={12}
                              fill="currentColor"
                              className="text-amber-400"
                            />
                            <span>{product.rating?.toFixed(1)}</span>
                            <span className="text-muted-foreground">
                              ({product.numReviews})
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[11px] md:text-sm">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 md:px-4 text-muted-foreground text-[11px] md:text-sm whitespace-nowrap">
                        {product.sold}
                      </td>
                      <td className="py-3 px-3 md:px-4 min-w-[120px]">
                        <div className="flex flex-wrap gap-1">
                          {product.isFeatured && (
                            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                              Featured
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              New
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 md:px-4 last:pr-4 md:last:pr-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <Edit2
                              size={14}
                              className="md:w-4 md:h-4 w-3.5 h-3.5"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                          >
                            <Trash2
                              size={14}
                              className="md:w-4 md:h-4 w-3.5 h-3.5"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
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

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-card z-10">
                <h2 className="font-semibold text-lg">
                  {editId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">
                      Product Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Slug *
                    </label>
                    <input
                      required
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Category *
                    </label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none"
                    >
                      <option value="">Select category</option>
                      {(categories || []).map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Purchase Price (৳) *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.purchasePrice}
                      onChange={(e) =>
                        setForm({ ...form, purchasePrice: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Price (৳) *
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Discount Price (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.discountPrice}
                      onChange={(e) =>
                        setForm({ ...form, discountPrice: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div> */}
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">
                      Short Description
                    </label>
                    <input
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm({ ...form, shortDescription: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Material
                    </label>
                    <input
                      value={form.material}
                      onChange={(e) =>
                        setForm({ ...form, material: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Brand
                    </label>
                    <input
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">
                      Tags (comma-separated)
                    </label>
                    <input
                      value={form.tags}
                      onChange={(e) =>
                        setForm({ ...form, tags: e.target.value })
                      }
                      placeholder="cotton, comfort, everyday"
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">
                      Product Images
                    </label>

                    {form.images.filter(Boolean).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {form.images.filter(Boolean).map((img, i) => (
                          <div
                            key={i}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border group"
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  images: form.images.filter((_, j) => j !== i),
                                })
                              }
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                              <X size={14} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className="flex flex-col items-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed cursor-pointer hover:bg-secondary/50 transition-colors">
                      <Upload size={20} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {uploading ? "Uploading..." : "Click to upload images"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploading}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {/* Images */}
                  {/* <div className="col-span-2">
                    <label className="text-sm font-medium mb-1.5 block">
                      Image URLs
                    </label>
                    {form.images.map((img, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          value={img}
                          onChange={(e) => {
                            const imgs = [...form.images];
                            imgs[i] = e.target.value;
                            setForm({ ...form, images: imgs });
                          }}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                        {form.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                images: form.images.filter((_, j) => j !== i),
                              })
                            }
                            className="p-2.5 rounded-xl border hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, images: [...form.images, ""] })
                      }
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add image
                    </button>
                  </div> */}

                  {/* Badges */}
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-3 block">
                      Product Badges
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {[
                        ["isFeatured", "Featured"],
                        ["isNewArrival", "New Arrival"],
                        ["isBestSeller", "Best Seller"],
                      ].map(([key, label]) => (
                        <label
                          key={key}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={form[key]}
                            onChange={(e) =>
                              setForm({ ...form, [key]: e.target.checked })
                            }
                            className="w-4 h-4 accent-accent"
                          />
                          <span className="text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Variants</label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            variants: [
                              ...form.variants,
                              {
                                size: "M",
                                color: "Black",
                                colorHex: "#000000",
                                stock: 10,
                                purchasePrice: "",
                                price: "",
                                discountPrice: "",
                                images: [],
                              },
                            ],
                          })
                        }
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Add variant
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.variants.map((v, i) => (
                        <div className="grid grid-cols-8 gap-2 items-center">
                          <input
                            value={v.size}
                            onChange={(e) =>
                              updateVariant(i, "size", e.target.value)
                            }
                            placeholder="Size"
                            className="px-3 py-2 rounded-xl border text-sm"
                          />

                          <input
                            value={v.color}
                            onChange={(e) =>
                              updateVariant(i, "color", e.target.value)
                            }
                            placeholder="Color"
                            className="px-3 py-2 rounded-xl border text-sm"
                          />

                          <input
                            type="color"
                            value={v.colorHex}
                            onChange={(e) =>
                              updateVariant(i, "colorHex", e.target.value)
                            }
                            className="h-10 rounded-xl border"
                          />

                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) =>
                              updateVariant(i, "stock", Number(e.target.value))
                            }
                            placeholder="Stock"
                            className="px-3 py-2 rounded-xl border text-sm"
                          />

                          {/* ✅ NEW */}
                          <input
                            type="number"
                            value={v.purchasePrice}
                            onChange={(e) =>
                              updateVariant(
                                i,
                                "purchasePrice",
                                Number(e.target.value),
                              )
                            }
                            placeholder="Purchase"
                            className="px-3 py-2 rounded-xl border text-sm"
                          />

                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) =>
                              updateVariant(i, "price", Number(e.target.value))
                            }
                            placeholder="Price"
                            className="px-3 py-2 rounded-xl border text-sm"
                          />

                          <input
                            type="number"
                            value={v.discountPrice || ""}
                            onChange={(e) =>
                              updateVariant(
                                i,
                                "discountPrice",
                                Number(e.target.value),
                              )
                            }
                            placeholder="Discount"
                            className="px-3 py-2 rounded-xl border text-sm"
                          />
                          <div className="col-span-8">
                            {/* Upload Box */}
                            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer hover:border-accent transition">
                              <span className="text-xs text-muted-foreground">
                                Click or drag images
                              </span>

                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleVariantImageUpload(i, e)}
                                className="hidden"
                              />
                            </label>

                            {/* Preview Grid */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-3">
                              {v.images?.map((img, idx) => (
                                <div
                                  key={idx}
                                  className="relative group border rounded-xl overflow-hidden"
                                >
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-full h-20 object-cover"
                                  />

                                  {/* Overlay */}
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      setDeleting(idx);

                                      try {
                                        const imageToDelete = v.images[idx];

                                        const res = await fetch(
                                          "/api/upload/images",
                                          {
                                            method: "DELETE",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              url: imageToDelete,
                                            }),
                                          },
                                        );

                                        const data = await res.json();

                                        if (data.success) {
                                          const updatedImages = v.images.filter(
                                            (_, j) => j !== idx,
                                          );
                                          updateVariant(
                                            i,
                                            "images",
                                            updatedImages,
                                          );
                                        }
                                      } catch (err) {
                                        console.error(err);
                                      } finally {
                                        setDeleting(null);
                                      }
                                    }}
                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded"
                                  >
                                    {deleting === idx
                                      ? "Deleting..."
                                      : "Remove"}
                                  </button>

                                  {/* Thumbnail badge */}
                                  {idx === 0 && (
                                    <span className="absolute top-1 left-1 text-[10px] bg-accent text-white px-1 rounded">
                                      Main
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    <Check size={15} />
                    {saving
                      ? "Saving..."
                      : editId
                        ? "Update Product"
                        : "Create Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
