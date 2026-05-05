'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
  'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=1200',
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background -z-10" />

      {/* Decorative circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full border text-xs font-medium tracking-widest uppercase mb-6 text-accent border-accent/30"
            >
              New Collection 2025
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-6 text-balance"
            >
              Comfort
              <br />
              <em className="text-accent not-italic">Redefined.</em>
              <br />
              Every Day.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md"
            >
              Premium undergarments crafted from the finest materials. Designed for those who believe comfort is the foundation of confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/shop"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-all"
              >
                Shop Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?newArrival=true"
                className="px-7 py-3.5 rounded-full border font-medium hover:bg-secondary transition-colors"
              >
                New Arrivals
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 mt-12"
            >
              {[
                { icon: ShieldCheck, text: 'Quality Guarantee' },
                { icon: Truck, text: 'Free Shipping ৳999+' },
                { icon: RotateCcw, text: 'Easy Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon size={15} className="text-accent" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="aspect-[3/4] rounded-3xl overflow-hidden mt-10"
              >
                <Image src={HERO_IMAGES[0]} alt="Premium comfort" fill className="object-cover" />
              </motion.div>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="aspect-[3/4] rounded-3xl overflow-hidden"
              >
                <Image src={HERO_IMAGES[1]} alt="Premium style" fill className="object-cover" />
              </motion.div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="absolute -bottom-4 -left-6 glass rounded-2xl p-4 shadow-xl"
            >
              <p className="text-xs text-muted-foreground mb-0.5">Monthly Sales</p>
              <p className="font-display text-2xl font-semibold">12,400+</p>
              <p className="text-xs text-accent mt-1">↑ 24% this month</p>
            </motion.div>

            {/* Rating card */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="absolute top-4 -right-4 glass rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-xs font-medium">4.9 / 5.0 Rating</p>
              <p className="text-xs text-muted-foreground">2,800+ reviews</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
