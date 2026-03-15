import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-display font-bold">L</span>
              </div>
              <span className="font-display text-xl font-semibold">LuxeWear</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Premium intimate wear crafted for comfort, style, and confidence. Experience the luxury of quality undergarments designed for everyday living.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Shop</h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Best Sellers', 'Classic Briefs', 'Boxer Collection', 'Undershirts', 'Loungewear', 'Athletic Wear', 'Sale'].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Help</h4>
            <ul className="space-y-3">
              {['Size Guide', 'Shipping Info', 'Returns & Exchanges', 'Track Order', 'FAQ', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">House 12, Road 5, Gulshan-2, Dhaka-1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground shrink-0" />
                <a href="tel:+8801700000000" className="text-sm text-muted-foreground hover:text-foreground transition-colors">+880 1700-000000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground shrink-0" />
                <a href="mailto:hello@luxewear.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">hello@luxewear.com</a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-sm font-medium mb-3">Subscribe to our newsletter</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LuxeWear. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'bKash', 'Nagad', 'COD'].map((method) => (
              <span key={method} className="px-2.5 py-1 text-xs border rounded-md font-medium text-muted-foreground">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
