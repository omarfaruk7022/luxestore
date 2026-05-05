'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, CheckCircle, Loader2, ArrowRight, Shield, Zap, Palette, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Palette, text: '4 beautiful design templates' },
  { icon: Zap, text: 'Full e-commerce features out of the box' },
  { icon: Database, text: 'Your own isolated database' },
  { icon: Shield, text: 'Admin panel with color customization' },
];

export default function PurchasePage() {
  const [form, setForm] = useState({
    storeName: '', ownerName: '', email: '', phone: '', businessType: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.storeName || !form.ownerName || !form.email || !form.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/store-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center p-10 rounded-3xl border bg-card shadow-xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Request Submitted!</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Thank you <strong>{form.ownerName}</strong>! Your store request for <strong>"{form.storeName}"</strong> has been received.
            We'll review it and get back to you at <strong>{form.email}</strong> within 24 hours.
          </p>
          <div className="p-4 rounded-2xl bg-accent/10 text-sm text-accent font-medium">
            After approval, your store will be automatically set up and credentials will be sent to your email.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-30 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
              <Store size={13} /> Get Your Store
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Launch Your<br />Online Store Today
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Fill out the form and our team will set up your fully customized e-commerce store within 24 hours.
            </p>

            <div className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <p className="text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 rounded-2xl bg-secondary/50 border">
              <p className="text-sm font-semibold mb-1">How it works</p>
              <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                <li>Fill out the request form</li>
                <li>Our team reviews and approves</li>
                <li>Your store is automatically created</li>
                <li>Login credentials sent to your email</li>
              </ol>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-card border rounded-3xl p-8 shadow-lg">
              <h2 className="text-xl font-bold mb-6">Submit Your Request</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Store Name *</label>
                    <input name="storeName" value={form.storeName} onChange={handleChange}
                      placeholder="Store Name" required
                      className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Your Name *</label>
                    <input name="ownerName" value={form.ownerName} onChange={handleChange}
                      placeholder="Your Name" required
                      className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="Email" required
                    className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="Phone" required
                    className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Business Type</label>
                  <select name="businessType" value={form.businessType} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select type...</option>
                    {['Fashion & Clothing', 'Electronics', 'Food & Grocery', 'Beauty & Health', 'Home & Living', 'Sports & Fitness', 'Other'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">Message (optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell us about your business..." rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <>Submit Request <ArrowRight size={15} /></>}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
