'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { productApi, categoryApi } from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import CartDrawer from '@/components/cart/CartDrawer';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Sellers', value: '-sold' },
  { label: 'Top Rated', value: '-rating' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const params = {
    page, limit: 12, sort,
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedSizes.length && { size: selectedSizes.join(',') }),
    ...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
    ...(priceRange[1] < 5000 && { maxPrice: priceRange[1] }),
    ...(search && { search }),
    ...(searchParams.get('newArrival') === 'true' && { newArrival: true }),
    ...(searchParams.get('bestSeller') === 'true' && { bestSeller: true }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getAll(params).then((r) => r.data),
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getAll().then((r) => r.data.categories),
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const toggleSize = (size) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSizes([]);
    setPriceRange([0, 5000]);
    setPage(1);
  };

  const hasActiveFilters = selectedCategory || selectedSizes.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-light">
              {search ? `"${search}"` : selectedCategory ? (categories?.find(c => c.slug === selectedCategory)?.name || 'Shop') : 'All Products'}
            </h1>
            {pagination && (
              <p className="text-sm text-muted-foreground mt-1">{pagination.total} products</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="appearance-none pl-4 pr-8 py-2.5 text-sm rounded-xl border bg-card cursor-pointer outline-none focus:ring-2 focus:ring-ring"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${filtersOpen ? 'bg-foreground text-background' : 'bg-card hover:bg-secondary'}`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-64 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="text-xs text-accent hover:underline flex items-center gap-1">
                        <X size={12} /> Clear all
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => { setSelectedCategory(''); setPage(1); }}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-foreground text-background' : 'hover:bg-secondary'}`}
                      >
                        All Products
                      </button>
                      {(categories || []).map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                          className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.slug ? 'bg-foreground text-background' : 'hover:bg-secondary'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${selectedSizes.includes(size) ? 'bg-foreground text-background border-foreground' : 'hover:bg-secondary'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Price Range</h4>
                    <div className="space-y-2">
                      <input
                        type="range" min={0} max={5000} step={50}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-foreground"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>৳{priceRange[0]}</span>
                        <span>৳{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(12).fill(null).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] rounded-2xl shimmer mb-4" />
                    <div className="h-4 w-3/4 rounded shimmer mb-2" />
                    <div className="h-4 w-1/2 rounded shimmer" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-display text-3xl font-light mb-2">No products found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2.5 rounded-full border text-sm font-medium hover:bg-secondary transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-secondary transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${page === p ? 'bg-foreground text-background' : 'border hover:bg-secondary'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-secondary transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <CartDrawer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}
