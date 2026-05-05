'use client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

function MinimalProductCard({ product, large = false }) {
  const variant = product.variants?.[0];
  const price = variant?.discountPrice || variant?.price;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-secondary ${large ? 'aspect-[4/5]' : 'aspect-square'} mb-3`}>
        {product.images?.[0] && (
          <Image src={product.images[0]} alt={product.name} fill
            className="object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={14} />
        </div>
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] font-bold tracking-widest uppercase px-2 py-1">New</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.category?.name}</p>
      <h3 className="text-sm font-semibold mb-1 group-hover:underline underline-offset-2 transition-all">{product.name}</h3>
      <p className="text-sm font-medium">{price ? formatPrice(price) : 'TBA'}</p>
    </Link>
  );
}

export function MinimalFeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productApi.getFeatured().then((r) => r.data.products),
  });
  const products = data?.slice(0, 5) || [];

  return (
    <section className="py-20 max-w-screen-xl mx-auto px-6">
      <div className="flex items-center justify-between mb-10 border-b pb-4">
        <h2 className="text-2xl font-bold tracking-tight uppercase">Featured</h2>
        <Link href="/shop" className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1 hover:opacity-60 transition-opacity">
          View All <ArrowUpRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array(5).fill(null).map((_, i) => <div key={i} className="aspect-square shimmer rounded" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* First product large */}
          {products[0] && (
            <div className="col-span-2 md:col-span-1 row-span-2">
              <MinimalProductCard product={products[0]} large />
            </div>
          )}
          {products.slice(1, 5).map((p) => (
            <MinimalProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export function MinimalBrandValues() {
  const features = [
    { label: 'Free Returns', desc: '30-day hassle-free returns' },
    { label: 'Fast Delivery', desc: '24-48hrs across Bangladesh' },
    { label: 'Secure Payment', desc: 'bKash, Nagad, Card & COD' },
    { label: 'Premium Quality', desc: '22-point quality check' },
  ];
  return (
    <section className="border-y py-12">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {features.map((f) => (
          <div key={f.label}>
            <p className="text-sm font-bold uppercase tracking-widest mb-1">{f.label}</p>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MinimalNewArrivals() {
  const { data } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productApi.getAll({ newArrival: true, limit: 4 }).then((r) => r.data.products),
  });
  const products = data || [];

  return (
    <section className="py-20 bg-secondary/40">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10 border-b pb-4">
          <h2 className="text-2xl font-bold tracking-tight uppercase">New Arrivals</h2>
          <Link href="/shop?newArrival=true" className="text-xs font-semibold tracking-widest uppercase flex items-center gap-1 hover:opacity-60 transition-opacity">
            See All <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => <MinimalProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function MinimalTestimonials() {
  const reviews = [
    { name: 'Fatima R.', text: 'Absolutely love the quality! So soft and comfortable.', location: 'Dhaka' },
    { name: 'Karim H.', text: 'Best products I\'ve owned. Worth every taka.', location: 'Chittagong' },
    { name: 'Nadia I.', text: 'Perfect fit and super fast delivery!', location: 'Sylhet' },
  ];
  return (
    <section className="py-20 max-w-screen-xl mx-auto px-6">
      <h2 className="text-2xl font-bold tracking-tight uppercase mb-10 border-b pb-4">Reviews</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div key={r.name} className="border p-6">
            <div className="flex gap-0.5 mb-3">{Array(5).fill(null).map((_, i) => <span key={i} className="text-amber-400">★</span>)}</div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{r.text}"</p>
            <p className="text-xs font-bold uppercase tracking-wider">{r.name} — {r.location}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
