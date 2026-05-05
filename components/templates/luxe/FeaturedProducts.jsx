'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import ProductCard from './ProductCard';
import { ArrowRight, Leaf, Shield, Recycle, Award, Zap, Heart } from 'lucide-react';

// ─── FeaturedProducts ─────────────────────────────────────────────────────────
export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getFeatured().then((r) => r.data.products),
  });
  const products = data?.slice(0, 4) || [];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-sm text-accent font-medium uppercase tracking-widest mb-2">Curated Picks</p>
            <h2 className="font-display text-4xl md:text-5xl font-light">Featured Products</h2>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors group">
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array(4).fill(null).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] rounded-2xl shimmer mb-4" />
                <div className="h-4 w-3/4 rounded shimmer mb-2" />
                <div className="h-4 w-1/2 rounded shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── BrandValues ──────────────────────────────────────────────────────────────
export function BrandValues() {
  const values = [
    { icon: Leaf, title: 'Sustainably Sourced', desc: 'Materials ethically sourced from certified suppliers worldwide.' },
    { icon: Shield, title: 'Skin-Safe Certified', desc: 'Every fabric tested and certified safe for sensitive skin.' },
    { icon: Recycle, title: 'Eco Packaging', desc: 'All packaging is 100% recyclable and plastic-free.' },
    { icon: Award, title: 'Premium Quality', desc: 'Each piece passes 22-point quality checks before shipping.' },
    { icon: Zap, title: 'Fast Delivery', desc: 'Express delivery across Bangladesh within 24–48 hours.' },
    { icon: Heart, title: 'Customer First', desc: 'Hassle-free 30-day returns with no questions asked.' },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-sm text-accent font-medium uppercase tracking-widest mb-3">Why LuxeWear</p>
        <h2 className="font-display text-4xl md:text-5xl font-light">Built on Values</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {values.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Icon size={22} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── NewArrivals ──────────────────────────────────────────────────────────────
export function NewArrivals() {
  const { data } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productApi.getAll({ newArrival: true, limit: 4 }).then((r) => r.data.products),
  });
  const products = data || [];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-sm text-accent font-medium uppercase tracking-widest mb-2">Just Dropped</p>
            <h2 className="font-display text-4xl md:text-5xl font-light">New Arrivals</h2>
          </div>
          <Link href="/shop?newArrival=true" className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors group">
            See All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Fatima Rahman', rating: 5, text: 'Absolutely love the quality! The cotton feel is so soft and comfortable throughout the day. Will definitely reorder.', location: 'Dhaka' },
  { name: 'Karim Hassan', rating: 5, text: 'Best undergarments I\'ve ever owned. The modal boxer briefs are like wearing a cloud. Worth every taka.', location: 'Chittagong' },
  { name: 'Nadia Islam', rating: 5, text: 'Finally found a brand that gets it right. The fit is perfect and doesn\'t move around. Super fast delivery too!', location: 'Sylhet' },
  { name: 'Arif Ahmed', rating: 4, text: 'Great product range and the packaging is beautiful. The thermal set is perfect for winter. Highly recommended.', location: 'Rajshahi' },
];

export function Testimonials() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-sm text-accent font-medium uppercase tracking-widest mb-3">Reviews</p>
        <h2 className="font-display text-4xl md:text-5xl font-light">What Our Customers Say</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border bg-card"
          >
            <div className="flex items-center gap-0.5 mb-3">
              {Array(review.rating).fill(null).map((_, j) => (
                <span key={j} className="text-amber-400 text-sm">★</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">"{review.text}"</p>
            <div>
              <p className="text-sm font-medium">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
