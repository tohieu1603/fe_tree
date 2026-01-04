'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  if (products.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <section className="py-24 md:py-36" style={{ backgroundColor: '#fdfbf7' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          {subtitle && (
            <span
              className="text-[10px] tracking-[0.35em] uppercase block mb-5"
              style={{ color: '#8b7355' }}
            >
              {subtitle}
            </span>
          )}
          <h2
            className="text-xl md:text-2xl tracking-[0.2em] uppercase font-light"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#2c2416',
            }}
          >
            {title}
          </h2>
          {/* Decorative line */}
          <div
            className="w-16 h-[1px] mx-auto mt-8"
            style={{ backgroundColor: '#c9a962' }}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {products.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
            >
              {/* Product Image */}
              <div
                className="aspect-[3/4] relative overflow-hidden mb-6"
                style={{ backgroundColor: '#f5f3ef' }}
              >
                <Image
                  src={product.featuredImage || '/uploads/products/vong-tay-tram-huong-1.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[1s] ease-out group-hover:scale-105"
                />
                {/* Subtle overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: 'rgba(201, 169, 98, 0.05)' }}
                />
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3
                  className="text-base md:text-lg tracking-wide mb-2 line-clamp-1 group-hover:opacity-70 transition-opacity"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#2c2416',
                  }}
                >
                  {product.name}
                </h3>
                <p
                  className="text-sm tracking-wide"
                  style={{ color: '#8b7355' }}
                >
                  {product.price ? formatPrice(product.price) : 'Liên hệ'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-20 md:mt-28">
          <Link
            href="/products"
            className="group relative inline-block text-[12px] tracking-[0.2em] uppercase pb-3 transition-all duration-300"
            style={{ color: '#2c2416' }}
          >
            Xem Tất Cả Sản Phẩm
            <span
              className="absolute bottom-0 left-0 right-0 h-[1px] transform origin-left group-hover:scale-x-110 transition-transform duration-500"
              style={{ backgroundColor: '#c9a962' }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
