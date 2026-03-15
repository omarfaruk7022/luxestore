'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Phone, Mail } from 'lucide-react';
import useAuthStore from '@/store/authStore';

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border bg-card">
        <h2 className="font-semibold text-lg mb-6">Profile Information</h2>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-accent font-display text-3xl font-semibold">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 text-xs rounded-full bg-accent/10 text-accent font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email" disabled value={user?.email}
                className="w-full pl-11 pr-4 py-3 rounded-xl border bg-secondary text-sm outline-none opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: '—' },
          { label: 'Wishlist Items', value: '—' },
          { label: 'Member Since', value: new Date(user?.createdAt).getFullYear() || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="p-5 rounded-2xl border bg-card text-center">
            <p className="font-display text-3xl font-light mb-1">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
