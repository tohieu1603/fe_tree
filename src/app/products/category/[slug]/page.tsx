'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category, ApiResponse, PageResponse } from '@/types';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import NavigationBar from '@/components/home/NavigationBar';
import FooterSection from '@/components/home/FooterSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';

function formatPrice(price?: number): string {
  if (!price) return 'Liên hệ';
  return '$' + new Intl.NumberFormat('en-US').format(Math.round(price / 1000));
}

// Product Card - Gucci style
function ProductCard({ product, siteName }: { product: Product; siteName?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const allImages = [
    product.featuredImage,
    ...(product.images || [])
  ].filter(Boolean) as string[];

  const totalImages = allImages.length;
  const hasMultiple = totalImages > 1;

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % totalImages);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + totalImages) % totalImages);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0);
      }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container - Gucci style: 3:4 aspect ratio, very light gray bg */}
        <div className="relative bg-[#fcfcfc]" style={{ aspectRatio: '313/417' }}>
          {/* Centered square image area */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ aspectRatio: '1/1', margin: '0 auto', width: '100%', maxHeight: '75%' }}>
            {allImages.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center p-[8%]">
                <div className="relative w-full h-full">
                  <Image
                    src={allImages[currentIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-black/5 text-7xl font-light">
                  {siteName?.[0] || 'T'}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar - bottom of container */}
          {hasMultiple && (
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div
                className="h-full bg-black/80 transition-all duration-200"
                style={{ width: `${((currentIndex + 1) / totalImages) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-4">
          <h3 className="text-[13px] text-black leading-[1.4] line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[13px] text-black mt-1">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      {/* Navigation Arrows - positioned between products like Gucci */}
      {hasMultiple && (
        <>
          <button
            onClick={goPrev}
            className={`absolute left-0 top-[37.5%] -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center
              transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={goNext}
            className={`absolute right-0 top-[37.5%] translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center
              transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default function CategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { settings } = useSiteSettings();
  const [slug, setSlug] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  const fetchData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const catRes = await fetch(`${API_URL}/api/public/categories/${slug}`);
      if (catRes.ok) {
        const catData: ApiResponse<Category> = await catRes.json();
        setCategory(catData.data);
      }

      const catsRes = await fetch(`${API_URL}/api/public/categories`);
      if (catsRes.ok) {
        const catsData: ApiResponse<Category[]> = await catsRes.json();
        setCategories(catsData.data.filter(c => c.sortOrder >= 10));
      }

      const sort = sortBy === 'newest' ? 'createdAt,desc'
        : sortBy === 'price_asc' ? 'price,asc'
        : sortBy === 'price_desc' ? 'price,desc'
        : 'name,asc';

      const prodRes = await fetch(`${API_URL}/api/public/products?categorySlug=${slug}&page=${page}&size=12&sort=${sort}`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        const pageData: PageResponse<Product> = prodData.data;
        setProducts(pageData.content || []);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [slug, sortBy, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl mb-4">Không tìm thấy danh mục</h1>
          <Link href="/products" className="underline underline-offset-4 text-sm">Xem tất cả sản phẩm</Link>
        </div>
      </div>
    );
  }

  const bannerImage = category.bannerImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80';

  return (
    <div className="min-h-screen bg-white">
      {/* Shared Navigation */}
      <NavigationBar categories={categories} />

      {/* Hero Banner - Gucci style with left-aligned content */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <Image
          src={bannerImage}
          alt={category.name}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        {/* Content - left aligned */}
        <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-3">
            {settings.siteName || 'TREE'}
          </p>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl text-white font-light leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 text-sm md:text-base text-white/80 max-w-xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {/* Sub-categories Navigation */}
      <nav className="border-b border-black/10 sticky top-16 md:top-20 bg-white z-40">
        <div className="px-4 md:px-10 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-6 md:gap-8 h-12 min-w-max">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                href={`/products/category/${cat.slug}`}
                className={`text-[11px] tracking-[0.05em] uppercase whitespace-nowrap transition-colors py-3 border-b-2 -mb-[1px]
                  ${cat.slug === slug
                    ? 'text-black border-black font-medium'
                    : 'text-black/60 border-transparent hover:text-black'
                  }
                  ${index === 0 ? '' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Sort & Filter Bar */}
      <div className="border-b border-black/10 sticky top-[112px] md:top-[128px] bg-white z-30">
        <div className="px-4 md:px-10">
          <div className="flex items-center justify-between h-12">
            {/* Left: Sort */}
            <button className="flex items-center gap-2 text-[12px] hover:opacity-60 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
              Sort By:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-none cursor-pointer focus:outline-none font-medium"
              >
                <option value="newest">Recommended</option>
                <option value="price_asc">Price Low - High</option>
                <option value="price_desc">Price High - Low</option>
                <option value="name_asc">A - Z</option>
              </select>
            </button>

            {/* Right: Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[12px] hover:opacity-60 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        className={`bg-white border-b border-black/10 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${showFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 md:px-10 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-sm text-black/50 hover:text-black transition-colors">
                    All Products
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link
                      href={`/products/category/${cat.slug}`}
                      className={`text-sm transition-colors ${cat.slug === slug ? 'text-black font-medium' : 'text-black/50 hover:text-black'}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-4">Price</h4>
              <ul className="space-y-2 text-sm text-black/50">
                <li><button className="hover:text-black transition-colors">Under $5,000</button></li>
                <li><button className="hover:text-black transition-colors">$5,000 - $10,000</button></li>
                <li><button className="hover:text-black transition-colors">$10,000 - $20,000</button></li>
                <li><button className="hover:text-black transition-colors">Over $20,000</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="bg-white px-4 md:px-8 lg:px-12 py-6">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-black/40 text-sm mb-4">Không có sản phẩm trong danh mục này</p>
            <Link href="/products" className="text-[12px] tracking-wider uppercase underline underline-offset-4 hover:opacity-60 transition-opacity">
              Xem tất cả sản phẩm
            </Link>
          </div>
        ) : (
          <>
            {/* Grid - Gucci style: white bg, gap between items, no borders */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} siteName={settings.siteName} />
              ))}
            </div>

            {/* Pagination & Count */}
            <div className="mt-12 flex flex-col items-center gap-4">
              {totalPages > 1 && (
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`text-[11px] tracking-[0.15em] uppercase transition-opacity ${
                      page === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-50'
                    }`}
                  >
                    ← Prev
                  </button>
                  <span className="text-[11px] text-black/40">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className={`text-[11px] tracking-[0.15em] uppercase transition-opacity ${
                      page >= totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-50'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
              <p className="text-[10px] text-black/30">
                {products.length} of {totalElements} items
              </p>
            </div>
          </>
        )}
      </main>

      {/* Shared Footer */}
      <FooterSection />

      {/* CSS */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
