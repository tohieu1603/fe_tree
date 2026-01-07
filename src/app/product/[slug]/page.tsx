'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category, ApiResponse } from '@/types';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import NavigationBar from '@/components/home/NavigationBar';
import FooterSection from '@/components/home/FooterSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function formatPrice(price?: number): string {
  if (!price) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

function calculateDiscount(price?: number, originalPrice?: number): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// Product Gallery Component
function ProductGallery({ images, productName, discount }: { images: string[]; productName: string; discount: number | null }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="aspect-square flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-light)' }}
      >
        <span style={{ color: 'var(--color-primary)', opacity: 0.2 }} className="text-9xl font-light">T</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-light)' }}>
        <Image
          src={images[selectedIndex]}
          alt={productName}
          fill
          className="object-contain"
          priority
        />
        {discount && (
          <span
            className="absolute top-4 left-4 px-3 py-1.5 text-xs font-medium"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-light)' }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 relative overflow-hidden border-2 transition-all duration-200 ${
                selectedIndex === index ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
              style={{
                borderColor: selectedIndex === index ? 'var(--text-dark)' : 'transparent',
                backgroundColor: 'var(--bg-light)'
              }}
            >
              <Image
                src={img}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Related Product Card
function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden mb-3" style={{ backgroundColor: 'var(--bg-light)' }}>
        {product.featuredImage ? (
          <Image
            src={product.featuredImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span style={{ color: 'var(--color-primary)', opacity: 0.2 }} className="text-5xl font-light">T</span>
          </div>
        )}
      </div>
      <h4
        className="text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2"
        style={{ color: 'var(--text-dark)' }}
      >
        {product.name}
      </h4>
      <p className="text-sm mt-1" style={{ color: 'var(--text-dark)' }}>
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { settings } = useSiteSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');

  const fetchData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      // Fetch product
      const prodRes = await fetch(`${API_URL}/api/public/products/${slug}`);
      if (prodRes.ok) {
        const prodData: ApiResponse<Product> = await prodRes.json();
        setProduct(prodData.data);

        // Fetch related products
        if (prodData.data.category?.slug) {
          const relRes = await fetch(`${API_URL}/api/public/products?categorySlug=${prodData.data.category.slug}&size=4`);
          if (relRes.ok) {
            const relData = await relRes.json();
            const related = (relData.data?.content || []).filter((p: Product) => p.slug !== slug);
            setRelatedProducts(related.slice(0, 4));
          }
        }
      }

      // Fetch categories
      const catsRes = await fetch(`${API_URL}/api/public/categories`);
      if (catsRes.ok) {
        const catsData: ApiResponse<Category[]> = await catsRes.json();
        setCategories(catsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

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

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
        <NavigationBar categories={categories} />
        <div className="flex flex-col items-center justify-center py-32">
          <h1 className="text-xl mb-4" style={{ color: 'var(--text-dark)' }}>Không tìm thấy sản phẩm</h1>
          <Link
            href="/products"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity"
            style={{ color: 'var(--text-dark)' }}
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);
  const allImages = [product.featuredImage, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Navigation */}
      <NavigationBar categories={categories} />

      {/* Breadcrumb */}
      <div className="px-4 md:px-10 py-4">
        <nav className="flex items-center gap-2 text-[11px] tracking-wide" style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>
          <Link href="/" className="hover:opacity-60 transition-opacity">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:opacity-60 transition-opacity">Sản phẩm</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/products/category/${product.category.slug}`} className="hover:opacity-60 transition-opacity">
                {product.category.name}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Product Detail */}
      <main className="px-4 md:px-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={allImages} productName={product.name} discount={discount} />

          {/* Product Info */}
          <div className="lg:py-8">
            {/* Category */}
            {product.category && (
              <Link
                href={`/products/category/${product.category.slug}`}
                className="text-[10px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity"
                style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}
              >
                {product.category.name}
              </Link>
            )}

            {/* Title */}
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-light mt-2 mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span
                className="text-2xl md:text-3xl font-light"
                style={{ color: 'var(--text-dark)' }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > (product.price || 0) && (
                <>
                  <span
                    className="text-lg line-through"
                    style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
                  >
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span
                    className="text-xs px-2 py-1"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--text-light)' }}
                  >
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Summary */}
            {product.summary && (
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: 'color-mix(in srgb, var(--text-dark) 70%, transparent)' }}
              >
                {product.summary}
              </p>
            )}

            {/* Specs Summary */}
            <div
              className="border-t border-b py-6 mb-8 space-y-3"
              style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}
            >
              {product.sku && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>Mã SP</span>
                  <span style={{ color: 'var(--text-dark)' }}>{product.sku}</span>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>Chất liệu</span>
                  <span style={{ color: 'var(--text-dark)' }}>{product.material}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>Kích thước</span>
                  <span style={{ color: 'var(--text-dark)' }}>{product.dimensions}</span>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>Màu sắc</span>
                  <span style={{ color: 'var(--text-dark)' }}>{product.color}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>Tình trạng</span>
                <span style={{ color: (product.stockQuantity || 0) > 0 ? 'var(--color-primary)' : '#dc2626' }}>
                  {(product.stockQuantity || 0) > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={`tel:${settings.phone || '0123456789'}`}
                className="flex-1 py-4 text-center text-[12px] tracking-[0.15em] uppercase font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'var(--text-dark)',
                  color: 'var(--text-light)'
                }}
              >
                Gọi ngay: {settings.phone || '0123 456 789'}
              </a>
              <a
                href={`https://zalo.me/${(settings.phone || '0123456789').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 border text-[12px] tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:opacity-60"
                style={{
                  borderColor: 'var(--text-dark)',
                  color: 'var(--text-dark)'
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                </svg>
                Zalo
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: '100%', subtitle: 'Thủ công' },
                { title: 'Bảo hành', subtitle: 'Trọn đời' },
                { title: 'Miễn phí', subtitle: 'Ship nội thành' }
              ].map((badge, i) => (
                <div
                  key={i}
                  className="text-center py-4 px-2"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--bg-light))' }}
                >
                  <div className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{badge.title}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>{badge.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          {/* Tab Headers */}
          <div
            className="flex border-b"
            style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}
          >
            {[
              { key: 'description', label: 'Mô tả' },
              { key: 'specs', label: 'Thông số' },
              { key: 'shipping', label: 'Vận chuyển' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-4 text-[11px] tracking-[0.15em] uppercase border-b-2 -mb-[1px] transition-colors`}
                style={{
                  color: activeTab === tab.key ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 50%, transparent)',
                  borderColor: activeTab === tab.key ? 'var(--text-dark)' : 'transparent',
                  fontWeight: activeTab === tab.key ? 500 : 400
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div
                className="prose prose-sm max-w-none"
                style={{ color: 'color-mix(in srgb, var(--text-dark) 80%, transparent)' }}
              >
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Chưa có mô tả chi tiết cho sản phẩm này.</p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4 max-w-xl">
                {product.sku && <SpecRow label="Mã sản phẩm" value={product.sku} />}
                {product.material && <SpecRow label="Chất liệu" value={product.material} />}
                {product.dimensions && <SpecRow label="Kích thước" value={product.dimensions} />}
                {product.color && <SpecRow label="Màu sắc" value={product.color} />}
                {product.weight && <SpecRow label="Trọng lượng" value={`${product.weight} kg`} />}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 max-w-xl text-sm" style={{ color: 'color-mix(in srgb, var(--text-dark) 70%, transparent)' }}>
                <p><strong style={{ color: 'var(--text-dark)' }}>Miễn phí giao hàng:</strong> Áp dụng cho đơn hàng nội thành TP.HCM và Hà Nội.</p>
                <p><strong style={{ color: 'var(--text-dark)' }}>Giao hàng toàn quốc:</strong> 2-5 ngày làm việc tùy khu vực.</p>
                <p><strong style={{ color: 'var(--text-dark)' }}>Đóng gói cẩn thận:</strong> Sản phẩm được đóng gói kỹ lưỡng, chống va đập.</p>
                <p><strong style={{ color: 'var(--text-dark)' }}>Chính sách đổi trả:</strong> Đổi trả trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-xl md:text-2xl font-light"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
              >
                Sản Phẩm Tương Tự
              </h2>
              {product.category && (
                <Link
                  href={`/products/category/${product.category.slug}`}
                  className="text-[11px] tracking-[0.15em] uppercase hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--text-dark)' }}
                >
                  Xem tất cả →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <RelatedProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
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
        .prose h1, .prose h2, .prose h3, .prose h4 {
          color: var(--text-dark);
          font-family: var(--font-heading);
        }
        .prose p {
          line-height: 1.8;
        }
        .prose ul, .prose ol {
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

// Spec Row Component
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex justify-between py-3 border-b"
      style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}
    >
      <span className="text-sm" style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>{value}</span>
    </div>
  );
}
