'use client';
import Link from 'next/link';
import { Leaf, Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '@/components/layout/StoreProvider';

export default function NatureFooter() {
  const { settings } = useStore();
  return (
    <footer className="bg-accent/5 border-t border-accent/20 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="font-bold text-lg">{settings.storeName}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{settings.tagline}</p>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, href: settings.socialLinks?.instagram },
                { Icon: Twitter, href: settings.socialLinks?.twitter },
                { Icon: Facebook, href: settings.socialLinks?.facebook },
                { Icon: Youtube, href: settings.socialLinks?.youtube },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href || '#'} className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-5">Shop</p>
            <ul className="space-y-3">
              {['New Arrivals', 'Best Sellers', 'Sale', 'All Products'].map((item) => (
                <li key={item}><Link href="/shop" className="text-sm text-muted-foreground hover:text-accent transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-5">Help</p>
            <ul className="space-y-3">
              {['Shipping Info', 'Returns', 'Size Guide', 'Track Order', 'FAQ'].map((item) => (
                <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold text-sm mb-5">Contact</p>
            <ul className="space-y-3">
              {settings.address && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground"><MapPin size={14} className="text-accent mt-0.5 shrink-0" />{settings.address}</li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><Phone size={14} className="text-accent shrink-0" />{settings.phone}</li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2 text-sm text-muted-foreground"><Mail size={14} className="text-accent shrink-0" />{settings.email}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['bKash', 'Nagad', 'COD', 'Card'].map((m) => (
              <span key={m} className="px-2.5 py-1 text-xs rounded-full border border-accent/20 text-muted-foreground">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
