'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/components/layout/StoreProvider';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Palette, Layout, Store, Save, RotateCcw, Check, Eye } from 'lucide-react';
import api from '@/lib/api';

const TEMPLATES = [
  {
    id: 'luxe',
    name: 'Luxe',
    desc: 'Elegant serif luxury layout with floating cards and warm tones.',
    preview: 'bg-gradient-to-br from-amber-50 to-stone-100',
    accent: 'bg-amber-600',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Clean full-width editorial layout. Bold and typography-first.',
    preview: 'bg-gradient-to-br from-gray-50 to-white border',
    accent: 'bg-gray-900',
  },
  {
    id: 'bold',
    name: 'Bold',
    desc: 'Dark, energetic streetwear layout with large type and strong contrast.',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
    accent: 'bg-orange-500',
  },
  {
    id: 'nature',
    name: 'Nature',
    desc: 'Soft organic design with rounded cards and earthy green tones.',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-50',
    accent: 'bg-emerald-600',
  },
];

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary', hint: 'Main text & button color' },
  { key: 'secondary', label: 'Secondary', hint: 'Background for cards & sections' },
  { key: 'accent', label: 'Accent', hint: 'Highlights, badges, links' },
  { key: 'background', label: 'Background', hint: 'Page background color' },
  { key: 'foreground', label: 'Foreground', hint: 'Main text color' },
  { key: 'muted', label: 'Muted', hint: 'Subtle section backgrounds' },
  { key: 'border', label: 'Border', hint: 'Border & divider color' },
];

const TABS = [
  { id: 'template', label: 'Template', icon: Layout },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'store', label: 'Store Info', icon: Store },
];

export default function AdminSettings() {
  const { settings, setSettings } = useStore();
  const [tab, setTab] = useState('template');
  const [form, setForm] = useState({
    activeTemplate: 'luxe',
    colors: {},
    storeName: '',
    tagline: '',
    logo: '',
    phone: '',
    email: '',
    address: '',
    socialLinks: { facebook: '', instagram: '', twitter: '', youtube: '' },
    freeShippingThreshold: 999,
    metaTitle: '',
    metaDescription: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm((prev) => ({
        ...prev,
        activeTemplate: settings.activeTemplate || 'luxe',
        colors: settings.colors || {},
        storeName: settings.storeName || '',
        tagline: settings.tagline || '',
        logo: settings.logo || '',
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        socialLinks: settings.socialLinks || { facebook: '', instagram: '', twitter: '', youtube: '' },
        freeShippingThreshold: settings.freeShippingThreshold || 999,
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
      }));
    }
  }, [settings]);

  const setColor = (key, val) => {
    setForm((prev) => ({ ...prev, colors: { ...prev.colors, [key]: val } }));
  };

  const resetColor = (key) => {
    setForm((prev) => {
      const c = { ...prev.colors };
      delete c[key];
      return { ...prev, colors: c };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('luxe_token');
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
        toast.success('Settings saved!');
        // Re-inject colors
        window.location.reload();
      } else {
        toast.error(data.message || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-light">Store Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Customize your store's appearance and information</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary p-1 rounded-xl w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${tab === id ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── Template Tab ─────────────────────────────────────────────────── */}
      {tab === 'template' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <p className="text-sm text-muted-foreground">Select a design template for your store. Each template has a completely different layout.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setForm((p) => ({ ...p, activeTemplate: t.id }))}
                className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all cursor-pointer ${form.activeTemplate === t.id ? 'border-accent shadow-lg' : 'border-border hover:border-accent/40'}`}>
                {/* Preview block */}
                <div className={`h-28 ${t.preview} relative flex items-center justify-center gap-2 p-4`}>
                  <div className={`w-8 h-2 rounded-full ${t.accent}`} />
                  <div className="w-16 h-2 rounded-full bg-current opacity-20" />
                  <div className="w-10 h-2 rounded-full bg-current opacity-10" />
                  {form.activeTemplate === t.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm mb-1">{t.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Colors Tab ───────────────────────────────────────────────────── */}
      {tab === 'colors' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <p className="text-sm text-muted-foreground">Override your template's default colors. Leave empty to use template defaults.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COLOR_FIELDS.map(({ key, label, hint }) => (
              <div key={key} className="p-4 rounded-2xl border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                  {form.colors[key] && (
                    <button onClick={() => resetColor(key)} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer">
                      <RotateCcw size={11} /> Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <input type="color" value={form.colors[key] || '#000000'}
                    onChange={(e) => setColor(key, e.target.value)}
                    className="w-10 h-10 rounded-xl border cursor-pointer bg-transparent p-0.5" />
                  <input type="text" value={form.colors[key] || ''}
                    onChange={(e) => setColor(key, e.target.value)}
                    placeholder="e.g. #3b82f6 or hsl(220 90% 56%)"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border bg-background outline-none focus:ring-2 focus:ring-ring font-mono" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
            <p className="text-xs text-accent font-medium">💡 Tip: Use HEX (#3b82f6), RGB (rgb(59,130,246)), or HSL (hsl(220 90% 56%)) values. Changes apply after saving.</p>
          </div>
        </motion.div>
      )}

      {/* ── Store Info Tab ────────────────────────────────────────────────── */}
      {tab === 'store' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'storeName', label: 'Store Name', placeholder: 'My Fashion Store' },
              { key: 'tagline', label: 'Tagline', placeholder: 'Quality products for everyone' },
              { key: 'email', label: 'Email', placeholder: 'hello@mystore.com' },
              { key: 'phone', label: 'Phone', placeholder: '+880 1700-000000' },
              { key: 'logo', label: 'Logo URL', placeholder: 'https://...' },
              { key: 'freeShippingThreshold', label: 'Free Shipping Threshold (৳)', placeholder: '999', type: 'number' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-sm font-medium block mb-1.5">{label}</label>
                <input type={type || 'text'} value={form[key] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Address</label>
            <textarea value={form.address || ''} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              placeholder="House 12, Road 5, Dhaka-1212, Bangladesh" rows={2}
              className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['facebook', 'instagram', 'twitter', 'youtube'].map((platform) => (
              <div key={platform}>
                <label className="text-sm font-medium block mb-1.5 capitalize">{platform}</label>
                <input type="url" value={form.socialLinks?.[platform] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: e.target.value } }))}
                  placeholder={`https://${platform}.com/...`}
                  className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Meta Title (SEO)</label>
              <input value={form.metaTitle || ''} onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))}
                placeholder="My Store – Best Products in BD"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Meta Description (SEO)</label>
              <input value={form.metaDescription || ''} onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))}
                placeholder="Premium quality products..."
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
          <Save size={15} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
        <p className="text-xs text-muted-foreground">Changes will apply after saving.</p>
      </div>
    </div>
  );
}
