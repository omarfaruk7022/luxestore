'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { categoryApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', slug: '', description: '', sortOrder: 0 };

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryApi.getAll().then((r) => r.data.categories),
  });

  const categories = data || [];

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (cat) => { setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', sortOrder: cat.sortOrder }); setEditId(cat._id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await categoryApi.update(editId, form); toast.success('Category updated'); }
      else { await categoryApi.create(form); toast.success('Category created'); }
      queryClient.invalidateQueries(['admin-categories']);
      queryClient.invalidateQueries(['categories']);
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await categoryApi.delete(id);
      queryClient.invalidateQueries(['admin-categories']);
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="rounded-2xl border bg-card w-full max-w-[100vw] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                {['Name', 'Slug', 'Description', 'Sort Order', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap first:pl-4 md:first:pl-6 last:pr-4 md:last:pr-6">{h}</th>
                ))}
              </tr>
          </thead>
            <tbody className="divide-y">
            {isLoading ? (
              Array(6).fill(null).map((_, i) => (
                <tr key={i}>{Array(6).fill(null).map((_, j) => <td key={j} className="py-4 px-3 md:px-4"><div className="h-4 rounded shimmer" /></td>)}</tr>
              ))
            ) : categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-3 md:px-4 first:pl-4 md:first:pl-6 font-medium whitespace-nowrap">{cat.name}</td>
                <td className="py-3 px-3 md:px-4 font-mono text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{cat.slug}</td>
                <td className="py-3 px-3 md:px-4 text-muted-foreground max-w-[120px] md:max-w-xs truncate">{cat.description || '—'}</td>
                <td className="py-3 px-3 md:px-4 text-muted-foreground whitespace-nowrap">{cat.sortOrder}</td>
                <td className="py-3 px-3 md:px-4 text-muted-foreground text-[10px] md:text-xs whitespace-nowrap">{formatDate(cat.createdAt)}</td>
                <td className="py-3 px-3 md:px-4 last:pr-4 md:last:pr-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Edit2 size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"><Trash2 size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card rounded-2xl border shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="font-semibold">{editId ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-secondary"><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name *</label>
                  <input required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Slug *</label>
                  <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50">
                    <Check size={14} />{saving ? 'Saving...' : editId ? 'Update' : 'Create'}
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
