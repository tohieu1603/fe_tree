'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductShowcaseProps {
  products: Product[];
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
}

function formatPrice(price?: number): string {
  if (!price) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function calculateDiscount(price?: number, originalPrice?: number): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export default function ProductShowcase({
  products,
  title,
  subtitle,
  showViewAll = true,
}: ProductShowcaseProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <span className="text-xs tracking-[0.3em] uppercase text-amber-700 block mb-4">
              {subtitle}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
            {title}
          </h2>
          <div className="w-16 h-px bg-amber-600 mx-auto mt-8" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice);
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-white overflow-hidden mb-4">
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                      <span className="text-6xl opacity-20">✦</span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {discount && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-stone-900 text-white text-xs tracking-wider">
                        -{discount}%
                      </span>
                    </div>
                  )}

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-6 py-3 bg-white text-stone-900 text-sm tracking-[0.1em] uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Xem Chi Tiết
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-sm md:text-base text-stone-800 group-hover:text-amber-700 transition-colors line-clamp-2 mb-2 tracking-wide">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-amber-700 font-medium">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > (product.price || 0) && (
                      <span className="text-stone-400 line-through text-sm">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All */}
        {showViewAll && (
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-block px-12 py-4 border border-stone-300 text-stone-700 text-sm tracking-[0.2em] uppercase hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-500"
            >
              Xem Tất Cả
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
