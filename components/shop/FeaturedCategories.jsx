'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api';

const CATEGORY_IMAGES = {
  'classic-briefs': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
  'boxer-collection': 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600',
  'premium-undershirts': 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
  'loungewear': 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600',
  'athletic-wear': 'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600',
  'thermal-collection': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
};

export default function FeaturedCategories() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then((r) => r.data.categories),
  });

  const categories = data || [];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-sm text-accent font-medium uppercase tracking-widest mb-2">Collections</p>
          <h2 className="font-display text-4xl md:text-5xl font-light">Shop by Category</h2>
        </div>
        <Link href="/shop" className="hidden md:block text-sm font-medium underline underline-offset-4 hover:text-accent transition-colors">
          View All
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(categories.length ? categories : Array(6).fill(null)).map((cat, i) => (
          <motion.div
            key={cat?._id || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            {cat ? (
              <Link href={`/shop?category=${cat.slug}`} className="group block">
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-3 relative">
                  <Image
                    src={CATEGORY_IMAGES[cat.slug] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm font-medium text-center group-hover:text-accent transition-colors">{cat.name}</p>
              </Link>
            ) : (
              <div>
                <div className="aspect-square rounded-2xl shimmer mb-3" />
                <div className="h-4 w-3/4 mx-auto rounded shimmer" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
