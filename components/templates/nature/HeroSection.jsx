'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Recycle, Shield } from 'lucide-react';
import { useStore } from '@/components/layout/StoreProvider';

export default function NatureHero() {
  const { settings } = useStore();
  return (
    <section className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-accent/5 via-background to-secondary/30 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-8">
              <Leaf size={13} /> {settings.tagline || 'Naturally crafted'}
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              Feel Good,<br />
              <span className="text-accent">Inside Out.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md">
              Sustainably sourced, skin-friendly fabrics crafted for your everyday comfort. Because feeling good starts with what you wear.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-12">
              <Link href="/shop"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-semibold hover:opacity-90 transition-opacity">
                Shop Now <ArrowRight size={15} />
              </Link>
              <Link href="/shop?newArrival=true"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-accent/30 text-accent font-semibold hover:bg-accent/10 transition-colors">
                New Arrivals
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3">
              {[
                { icon: Leaf, text: 'Eco Friendly' },
                { icon: Shield, text: 'Skin Safe' },
                { icon: Recycle, text: 'Sustainable' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-xs font-medium text-accent">
                  <Icon size={12} /> {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image side — organic shapes */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="relative hidden lg:block">
            {/* Main image — blob shape via border-radius */}
            <div className="relative w-full aspect-[4/5]"
              style={{ borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%' }}
              className="overflow-hidden bg-accent/10">
              <Image src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
                alt="Premium wear" fill className="object-cover" />
            </div>
            {/* Floating stat card */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: 'spring' }}
              className="absolute -bottom-4 -left-8 bg-card rounded-2xl p-4 shadow-xl border border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Leaf size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Happy Customers</p>
                  <p className="font-bold text-lg">12,400+</p>
                </div>
              </div>
            </motion.div>
            {/* Rating card */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: 'spring' }}
              className="absolute top-8 -right-6 bg-card rounded-2xl p-3 shadow-xl border border-accent/20">
              <p className="text-xs text-muted-foreground mb-1">Customer Rating</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
              </div>
              <p className="text-xs font-semibold mt-0.5">4.9 / 5.0</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
