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
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
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
        {/* Image Container */}
        <div className="relative" style={{ aspectRatio: '313/417', backgroundColor: 'var(--bg-light)' }}>
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
                <span style={{ color: 'var(--color-primary)', opacity: 0.1 }} className="text-7xl font-light">
                  {siteName?.[0] || 'T'}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {hasMultiple && (
            <div
              className={`absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundColor: 'color-mix(in srgb, var(--text-dark) 10%, transparent)' }}
            >
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${((currentIndex + 1) / totalImages) * 100}%`,
                  backgroundColor: 'color-mix(in srgb, var(--text-dark) 80%, transparent)'
                }}
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-4">
          <h3
            className="text-[13px] leading-[1.4] line-clamp-2"
            style={{ color: 'var(--text-dark)' }}
          >
            {product.name}
          </h3>
          <p
            className="text-[13px] mt-1"
            style={{ color: 'var(--text-dark)' }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      {/* Navigation Arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={goPrev}
            className={`absolute left-0 top-[37.5%] -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center
              transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--text-dark)' }} />
            </svg>
          </button>
          <button
            onClick={goNext}
            className={`absolute right-0 top-[37.5%] translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center
              transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--text-dark)' }} />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch categories
      const catsRes = await fetch(`${API_URL}/api/public/categories`);
      if (catsRes.ok) {
        const catsData: ApiResponse<Category[]> = await catsRes.json();
        setCategories(catsData.data.filter(c => c.sortOrder >= 10));
      }

      // Build products URL
      const sort = sortBy === 'newest' ? 'createdAt,desc'
        : sortBy === 'price_asc' ? 'price,asc'
        : sortBy === 'price_desc' ? 'price,desc'
        : 'name,asc';

      let url = `${API_URL}/api/public/products?page=${page}&size=12&sort=${sort}`;
      if (selectedCategory) {
        url = `${API_URL}/api/public/products?categorySlug=${selectedCategory}&page=${page}&size=12&sort=${sort}`;
      }

      const prodRes = await fetch(url);
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
  }, [sortBy, page, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div
          className="w-6 h-6 border border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Navigation */}
      <NavigationBar categories={categories} />

      {/* Hero Section */}
      <section
        className="relative h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--bg-dark)' }}
      >
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1609167830220-7164aa360951?w=1920&q=80"
            alt="Products"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 text-center px-6">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: 'color-mix(in srgb, var(--text-light) 60%, transparent)' }}
          >
            {settings.siteName || 'DUC VIET'}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-light)' }}
          >
            Bộ Sưu Tập
          </h1>
          <p
            className="mt-4 text-sm md:text-base max-w-xl mx-auto"
            style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
          >
            Khám phá các sản phẩm trầm hương cao cấp, được chế tác thủ công tinh xảo
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <nav
        className="border-b sticky top-16 md:top-20 z-40"
        style={{
          backgroundColor: 'var(--bg-light)',
          borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
        }}
      >
        <div className="px-4 md:px-10 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-6 md:gap-8 h-12 min-w-max">
            <button
              onClick={() => { setSelectedCategory(null); setPage(0); }}
              className={`text-[11px] tracking-[0.05em] uppercase whitespace-nowrap transition-colors py-3 border-b-2 -mb-[1px]`}
              style={{
                color: !selectedCategory ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 60%, transparent)',
                borderColor: !selectedCategory ? 'var(--text-dark)' : 'transparent',
                fontWeight: !selectedCategory ? 500 : 400,
              }}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(0); }}
                className={`text-[11px] tracking-[0.05em] uppercase whitespace-nowrap transition-colors py-3 border-b-2 -mb-[1px]`}
                style={{
                  color: selectedCategory === cat.slug ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 60%, transparent)',
                  borderColor: selectedCategory === cat.slug ? 'var(--text-dark)' : 'transparent',
                  fontWeight: selectedCategory === cat.slug ? 500 : 400,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sort & Filter Bar */}
      <div
        className="border-b sticky top-[112px] md:top-[128px] z-30"
        style={{
          backgroundColor: 'var(--bg-light)',
          borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
        }}
      >
        <div className="px-4 md:px-10">
          <div className="flex items-center justify-between h-12">
            {/* Left: Sort */}
            <div className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-dark)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
              </svg>
              Sắp xếp:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-none cursor-pointer focus:outline-none font-medium"
                style={{ color: 'var(--text-dark)' }}
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá: Thấp - Cao</option>
                <option value="price_desc">Giá: Cao - Thấp</option>
                <option value="name_asc">A - Z</option>
              </select>
            </div>

            {/* Right: Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[12px] hover:opacity-60 transition-opacity"
              style={{ color: 'var(--text-dark)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        className={`border-b overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${showFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          backgroundColor: 'var(--bg-light)',
          borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
        }}
      >
        <div className="px-4 md:px-10 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4
                className="text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
              >
                Danh mục
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => { setSelectedCategory(null); setPage(0); setShowFilters(false); }}
                    className="text-sm transition-colors"
                    style={{
                      color: !selectedCategory ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 50%, transparent)',
                      fontWeight: !selectedCategory ? 500 : 400
                    }}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => { setSelectedCategory(cat.slug); setPage(0); setShowFilters(false); }}
                      className="text-sm transition-colors"
                      style={{
                        color: selectedCategory === cat.slug ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 50%, transparent)',
                        fontWeight: selectedCategory === cat.slug ? 500 : 400
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
              >
                Khoảng giá
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>
                <li><button className="hover:opacity-60 transition-opacity">Dưới 5 triệu</button></li>
                <li><button className="hover:opacity-60 transition-opacity">5 - 10 triệu</button></li>
                <li><button className="hover:opacity-60 transition-opacity">10 - 20 triệu</button></li>
                <li><button className="hover:opacity-60 transition-opacity">Trên 20 triệu</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="px-4 md:px-10 py-6">
        <p
          className="text-[11px] tracking-[0.1em]"
          style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}
        >
          {totalElements} sản phẩm
        </p>
      </div>

      {/* Products Grid */}
      <main className="px-4 md:px-8 lg:px-12 pb-16" style={{ backgroundColor: 'var(--bg-light)' }}>
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p
              className="text-sm mb-4"
              style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
            >
              Không có sản phẩm nào
            </p>
            <Link
              href="/"
              className="text-[12px] tracking-wider uppercase underline underline-offset-4 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--text-dark)' }}
            >
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} siteName={settings.siteName} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`text-[11px] tracking-[0.15em] uppercase transition-opacity ${
                      page === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-50'
                    }`}
                    style={{ color: 'var(--text-dark)' }}
                  >
                    ← Trước
                  </button>
                  <span
                    className="text-[11px]"
                    style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
                  >
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className={`text-[11px] tracking-[0.15em] uppercase transition-opacity ${
                      page >= totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-50'
                    }`}
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Sau →
                  </button>
                </div>
                <p
                  className="text-[10px]"
                  style={{ color: 'color-mix(in srgb, var(--text-dark) 30%, transparent)' }}
                >
                  {products.length} / {totalElements} sản phẩm
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
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
