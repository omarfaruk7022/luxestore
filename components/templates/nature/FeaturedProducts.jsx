'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Shield, Recycle, Award, Truck, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function NatureProductCard({ product, index = 0 }) {
  const variant = product.variants?.[0];
  const price = variant?.discountPrice || variant?.price;
  const originalPrice = variant?.discountPrice ? variant?.price : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
      <Link href={`/shop/${product.slug}`} className="group block bg-card rounded-3xl overflow-hidden border border-accent/10 hover:shadow-lg hover:border-accent/30 transition-all duration-300">
        <div className="relative aspect-[4/5] overflow-hidden bg-accent/5">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-semibold">New</span>
            )}
            {originalPrice && (
              <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">Sale</span>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[10px] text-accent font-medium uppercase tracking-widest mb-1">{product.category?.name}</p>
          <h3 className="text-sm font-semibold mb-2 leading-snug group-hover:text-accent transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm">{price ? formatPrice(price) : 'TBA'}</span>
              {originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>}
            </div>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function NatureFeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getFeatured().then((r) => r.data.products),
  });
  const products = data?.slice(0, 4) || [];

  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
          <Leaf size={11} /> Curated for you
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
      </motion.div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array(4).fill(null).map((_, i) => <div key={i} className="aspect-[4/5] rounded-3xl shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p, i) => <NatureProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
      <div className="text-center mt-10">
        <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white transition-colors">
          View All Products <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

export function NatureBrandValues() {
  const values = [
    { icon: Leaf, title: 'Sustainably Sourced', desc: 'Ethically sourced from certified suppliers.' },
    { icon: Shield, title: 'Skin-Safe', desc: 'Tested and certified for sensitive skin.' },
    { icon: Recycle, title: 'Eco Packaging', desc: '100% recyclable, plastic-free packaging.' },
    { icon: Award, title: 'Premium Quality', desc: '22-point quality check on every piece.' },
    { icon: Truck, title: 'Fast Delivery', desc: '24–48hrs across Bangladesh.' },
    { icon: Heart, title: 'Easy Returns', desc: '30-day hassle-free returns.' },
  ];

  return (
    <section className="py-20 bg-accent/5 rounded-[3rem] mx-4 md:mx-8">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium mb-4">
            <Leaf size={11} /> Why choose us
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Built on Good Values</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-accent/10 hover:border-accent/30 hover:-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-2xl bg-accent/15 flex items-center justify-center mb-4">
                <Icon size={20} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NatureNewArrivals() {
  const { data } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productApi.getAll({ newArrival: true, limit: 4 }).then((r) => r.data.products),
  });
  const products = data || [];

  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
            <Leaf size={11} /> Just dropped
          </div>
          <h2 className="text-4xl font-bold tracking-tight">New Arrivals</h2>
        </div>
        <Link href="/shop?newArrival=true" className="hidden md:flex items-center gap-2 text-accent text-sm font-semibold hover:underline">
          See All <ArrowRight size={14} />
        </Link>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((p, i) => <NatureProductCard key={p._id} product={p} index={i} />)}
      </div>
    </section>
  );
}

export function NatureTestimonials() {
  const reviews = [
    { name: 'Fatima Rahman', rating: 5, text: 'Love the eco-friendly packaging and the quality is amazing!', location: 'Dhaka' },
    { name: 'Karim Hassan', rating: 5, text: 'So soft on skin. Finally a brand that cares about materials.', location: 'Chittagong' },
    { name: 'Nadia Islam', rating: 5, text: 'Perfect fit, fast delivery, and beautiful packaging!', location: 'Sylhet' },
    { name: 'Arif Ahmed', rating: 4, text: 'Great products, very comfortable. Will definitely order again.', location: 'Rajshahi' },
  ];

  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
          <Heart size={11} /> Customer love
        </div>
        <h2 className="text-4xl font-bold tracking-tight">What Our Customers Say</h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="bg-card rounded-3xl p-6 border border-accent/10">
            <div className="flex gap-0.5 mb-3">{Array(r.rating).fill(null).map((_, j) => <span key={j} className="text-amber-400">★</span>)}</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{r.text}"</p>
            <div>
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-accent">{r.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
