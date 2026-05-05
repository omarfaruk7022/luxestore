'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/components/layout/StoreProvider';

export default function MinimalHero() {
  const { settings } = useStore();
  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      {/* Full bleed background image */}
      <Image
        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600"
        alt="Hero" fill className="object-cover object-center" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content — bottom left */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-20 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-white/70 text-sm tracking-[0.3em] uppercase mb-4 font-medium">
            {settings.tagline || 'New Season'}
          </p>
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-8">
            The Edit<br />
            <span className="font-light italic">2025</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/shop"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white/90 transition-colors">
              Shop Now <ArrowRight size={14} />
            </Link>
            <Link href="/shop?newArrival=true"
              className="inline-flex items-center gap-2 border border-white text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors">
              New Arrivals
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
