'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, Store, Eye, EyeOff,
  RefreshCw, Copy, Check, AlertCircle, Database, Mail, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function SuperAdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approving, setApproving] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState('');

  const headers = { 'Content-Type': 'application/json', 'x-super-admin-key': key };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/super-admin/requests?status=${filter}`, { headers });
      const data = await res.json();
      if (data.success) setRequests(data.requests);
      else toast.error(data.message);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/super-admin/requests', { headers: { 'x-super-admin-key': key } });
      const data = await res.json();
      if (data.success) { setAuthed(true); setRequests(data.requests); }
      else toast.error('Wrong super admin key');
    } catch { toast.error('Auth failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (authed) load(); }, [filter, authed]);

  const approve = async (id) => {
    setApproving(true);
    try {
      const res = await fetch(`/api/super-admin/requests/${id}/approve`, { method: 'POST', headers });
      const data = await res.json();
      if (data.success) {
        toast.success('Store created!');
        setCredentials(data.credentials);
        load();
      } else toast.error(data.message);
    } catch { toast.error('Failed to approve'); }
    finally { setApproving(false); }
  };

  const reject = async (id) => {
    try {
      const res = await fetch(`/api/super-admin/requests/${id}/reject`, {
        method: 'POST', headers, body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) { toast.success('Request rejected'); setSelected(null); load(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to reject'); }
  };

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  // ── Auth screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-secondary/30 ">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-card border rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground mx-auto mb-6">
            <Database size={20} className="text-background" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-1">Super Admin</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">Enter your secret key to access the panel</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="password" value={key} onChange={(e) => setKey(e.target.value)}
              placeholder="Super admin key..." required
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
              {loading ? 'Verifying...' : 'Access Panel'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage store requests and approvals</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Credentials modal */}
        <AnimatePresence>
          {credentials && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-card border rounded-3xl p-8 shadow-2xl max-w-md w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">Store Created!</h3>
                    <p className="text-xs text-muted-foreground">Share these credentials with the client</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Store Name', value: credentials.storeName },
                    { label: 'Database', value: credentials.dbName },
                    { label: 'Admin Email', value: credentials.adminEmail },
                    { label: 'Temp Password', value: credentials.tempPassword, secret: true },
                  ].map(({ label, value, secret }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                        <p className="text-sm font-mono font-medium">
                          {secret && !showPass ? '••••••••' : value}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {secret && (
                          <button onClick={() => setShowPass(!showPass)} className="p-1.5 rounded-lg hover:bg-background transition-colors cursor-pointer">
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                        <button onClick={() => copy(value, label)} className="p-1.5 rounded-lg hover:bg-background transition-colors cursor-pointer">
                          {copied === label ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-5">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    ⚠️ Save the temp password now — it won't be shown again. The client must change it after first login.
                  </p>
                </div>

                <button onClick={() => setCredentials(null)}
                  className="w-full py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reject modal */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-card border rounded-3xl p-8 shadow-2xl max-w-sm w-full">
                <h3 className="font-bold text-lg mb-2">Reject Request</h3>
                <p className="text-sm text-muted-foreground mb-5">Optionally provide a reason for <strong>{selected.storeName}</strong></p>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection..." rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none mb-4" />
                <div className="flex gap-3">
                  <button onClick={() => setSelected(null)}
                    className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-secondary transition-colors cursor-pointer">Cancel</button>
                  <button onClick={() => reject(selected._id)}
                    className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">Reject</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-secondary p-1 rounded-xl w-fit mb-6">
          {['pending', 'approved', 'rejected'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all cursor-pointer ${filter === s ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Request list */}
        {loading ? (
          <div className="grid gap-4">
            {Array(3).fill(null).map((_, i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Store size={40} className="mx-auto mb-4 opacity-30" />
            <p>No {filter} requests</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <motion.div key={req._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card border rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">{req.storeName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLE[req.status]}`}>
                        {req.status}
                      </span>
                      {req.businessType && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                          {req.businessType}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Store size={13} /> {req.ownerName}</span>
                      <span className="flex items-center gap-1.5"><Mail size={13} /> {req.email}</span>
                      <span className="flex items-center gap-1.5"><Phone size={13} /> {req.phone}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} /> {new Date(req.createdAt).toLocaleDateString('en-BD')}</span>
                    </div>
                    {req.message && <p className="text-sm text-muted-foreground mt-2 italic">"{req.message}"</p>}
                    {req.dbName && (
                      <p className="text-xs font-mono text-accent mt-2 flex items-center gap-1.5">
                        <Database size={11} /> {req.dbName}
                      </p>
                    )}
                    {req.rejectedReason && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1.5">
                        <AlertCircle size={11} /> {req.rejectedReason}
                      </p>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => approve(req._id)} disabled={approving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
                        <CheckCircle size={14} /> {approving ? 'Creating...' : 'Approve'}
                      </button>
                      <button onClick={() => setSelected(req)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive text-destructive text-xs font-semibold hover:bg-destructive/5 transition-colors cursor-pointer">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
