'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function BoldProductCard({ product, index = 0 }) {
  const variant = product.variants?.[0];
  const price = variant?.discountPrice || variant?.price;
  const originalPrice = variant?.discountPrice ? variant?.price : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.07 }}>
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          {product.images?.[1] && (
            <Image src={product.images[1]} alt={product.name} fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          {/* Bold badge */}
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              {product.isNewArrival && (
                <span className="bg-accent text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">New</span>
              )}
              {product.isBestSeller && (
                <span className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-2 py-1">🔥 Hot</span>
              )}
            </div>
            {originalPrice && (
              <span className="bg-accent text-white text-[10px] font-black px-2 py-1">
                SALE
              </span>
            )}
          </div>
          {/* Quick shop overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-white text-xs font-bold uppercase tracking-widest py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            Quick Shop →
          </div>
          {product.totalStock === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="bg-foreground text-background text-xs font-bold uppercase tracking-widest px-4 py-2">Sold Out</span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{product.category?.name}</p>
        <h3 className="text-sm font-bold uppercase tracking-wide mb-1 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black">{price ? formatPrice(price) : 'TBA'}</span>
          {originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>}
        </div>
      </Link>
    </motion.div>
  );
}

export function BoldFeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getFeatured().then((r) => r.data.products),
  });
  const products = data?.slice(0, 4) || [];

  return (
    <section className="py-20 max-w-screen-xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        className="flex items-end justify-between mb-10">
        <div>
          <p className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-2">— Featured</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">Top Picks</h2>
        </div>
        <Link href="/shop" className="hidden md:flex items-center gap-2 bg-accent text-white px-5 py-3 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
          View All <ArrowRight size={13} />
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(null).map((_, i) => <div key={i} className="aspect-[3/4] shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => <BoldProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
    </section>
  );
}

export function BoldBrandValues() {
  const items = [
    { icon: Zap, label: 'Fast Delivery', desc: '24–48hrs across BD' },
    { icon: Shield, label: 'Premium Quality', desc: '22-point quality check' },
    { icon: Truck, label: 'Free Shipping', desc: 'On orders over ৳999' },
    { icon: RotateCcw, label: 'Easy Returns', desc: '30-day returns' },
  ];
  return (
    <section className="bg-foreground py-14">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent flex items-center justify-center shrink-0">
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-black uppercase tracking-wider">{label}</p>
              <p className="text-white/50 text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BoldNewArrivals() {
  const { data } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productApi.getAll({ newArrival: true, limit: 4 }).then((r) => r.data.products),
  });
  const products = data || [];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className="flex items-end justify-between mb-10">
          <div>
            <p className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-2">— Just Dropped</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">New Arrivals</h2>
          </div>
          <Link href="/shop?newArrival=true" className="hidden md:flex items-center gap-2 border-2 border-foreground px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors">
            See All <ArrowRight size={13} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => <BoldProductCard key={p._id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

export function BoldTestimonials() {
  const reviews = [
    { name: 'Fatima Rahman', rating: 5, text: 'Best quality I\'ve found in Bangladesh. Fast delivery!', location: 'Dhaka' },
    { name: 'Karim Hassan', rating: 5, text: 'Premium products at fair prices. Highly recommend.', location: 'Chittagong' },
    { name: 'Nadia Islam', rating: 5, text: 'Amazing fit and super comfortable. Will reorder!', location: 'Sylhet' },
    { name: 'Arif Ahmed', rating: 4, text: 'Great packaging and fast shipping. Love the brand.', location: 'Rajshahi' },
  ];

  return (
    <section className="py-20 max-w-screen-xl mx-auto px-6">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
        <p className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-2">— Reviews</p>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">What They Say</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="border-l-4 border-accent pl-4 py-2">
            <div className="flex gap-0.5 mb-2">{Array(r.rating).fill(null).map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">"{r.text}"</p>
            <p className="text-xs font-black uppercase tracking-wider">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.location}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
