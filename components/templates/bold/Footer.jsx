'use client';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { useStore } from '@/components/layout/StoreProvider';

export default function BoldFooter() {
  const { settings } = useStore();
  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="max-w-screen-xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <p className="text-accent font-black text-2xl uppercase tracking-tighter mb-3">{settings.storeName}</p>
          <p className="text-white/50 text-xs leading-relaxed mb-6">{settings.tagline}</p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href={Object.values(settings.socialLinks || {})[i] || '#'}
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white text-xs font-black uppercase tracking-widest mb-5">Shop</p>
          <ul className="space-y-3">
            {['New Arrivals', 'Best Sellers', 'Sale', 'All Products'].map((item) => (
              <li key={item}><Link href="/shop" className="text-white/50 text-xs hover:text-accent transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white text-xs font-black uppercase tracking-widest mb-5">Help</p>
          <ul className="space-y-3">
            {['Shipping Info', 'Returns', 'Track Order', 'FAQ'].map((item) => (
              <li key={item}><a href="#" className="text-white/50 text-xs hover:text-accent transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white text-xs font-black uppercase tracking-widest mb-5">Contact</p>
          <p className="text-white/50 text-xs mb-2">{settings.email}</p>
          <p className="text-white/50 text-xs mb-2">{settings.phone}</p>
          <p className="text-white/50 text-xs">{settings.address}</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
        <div className="flex gap-2">
          {['bKash', 'Nagad', 'COD', 'Card'].map((m) => (
            <span key={m} className="text-[10px] border border-white/20 px-2 py-1 text-white/40">{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
