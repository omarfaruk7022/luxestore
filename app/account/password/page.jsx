'use client';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await authApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Current Password', key: 'currentPassword', showKey: 'current' },
    { label: 'New Password', key: 'newPassword', showKey: 'new' },
    { label: 'Confirm New Password', key: 'confirmPassword', showKey: 'confirm' },
  ];

  return (
    <div className="p-6 rounded-2xl border bg-card max-w-md">
      <h2 className="font-semibold text-lg mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ label, key, showKey }) => (
          <div key={key}>
            <label className="text-sm font-medium mb-1.5 block">{label}</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={show[showKey] ? 'text' : 'password'}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full pl-11 pr-12 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
