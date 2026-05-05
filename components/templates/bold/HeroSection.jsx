'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { useStore } from '@/components/layout/StoreProvider';

export default function BoldHero() {
  const { settings } = useStore();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-foreground">
      {/* Background */}
      <Image src="https://images.unsplash.com/photo-1542060748-10c28b62716f?w=1600"
        alt="Hero" fill className="object-cover opacity-30" priority />

      {/* Diagonal accent */}
      <div className="absolute -right-32 top-0 bottom-0 w-1/2 bg-accent/20 skew-x-[-8deg] -z-0" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-20 w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-accent text-white text-xs font-bold tracking-widest uppercase px-4 py-2 mb-8">
            <Zap size={12} /> {settings.tagline || 'New Drop'}
          </motion.div>

          <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}
            className="text-white text-6xl md:text-8xl lg:text-[110px] font-black uppercase leading-none tracking-tighter mb-4">
            WEAR<br />
            <span className="text-accent">BOLD.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white/60 text-lg mb-10 max-w-md">
            Premium streetwear crafted for those who don't blend in.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4">
            <Link href="/shop"
              className="flex items-center gap-3 bg-accent text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link href="/shop?newArrival=true"
              className="flex items-center gap-3 border-2 border-white text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-foreground transition-colors">
              New Drops
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex gap-10 mt-16 pt-10 border-t border-white/20">
            {[['12K+', 'Happy Customers'], ['500+', 'Products'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label}>
                <p className="text-white font-black text-2xl">{val}</p>
                <p className="text-white/50 text-xs uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
