'use client';
import Link from 'next/link';
import { useStore } from '@/components/layout/StoreProvider';

export default function MinimalFooter() {
  const { settings } = useStore();
  return (
    <footer className="border-t mt-20">
      <div className="max-w-screen-xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="text-base font-bold uppercase tracking-widest mb-3">{settings.storeName}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{settings.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4">Shop</p>
          <ul className="space-y-2">
            {['New Arrivals', 'Best Sellers', 'Sale'].map((i) => (
              <li key={i}><Link href="/shop" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{i}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4">Help</p>
          <ul className="space-y-2">
            {['Shipping', 'Returns', 'Track Order', 'FAQ'].map((i) => (
              <li key={i}><a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{i}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4">Contact</p>
          <p className="text-xs text-muted-foreground">{settings.email}</p>
          <p className="text-xs text-muted-foreground mt-1">{settings.phone}</p>
          <p className="text-xs text-muted-foreground mt-1">{settings.address}</p>
        </div>
      </div>
      <div className="border-t px-6 py-4 max-w-screen-xl mx-auto flex items-center justify-between">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        <div className="flex gap-2">
          {['bKash', 'Nagad', 'COD'].map((m) => (
            <span key={m} className="text-[10px] border px-2 py-0.5 text-muted-foreground">{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
