'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

// Default fallback image
const defaultImage = 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=800&q=80';

interface CategoryShowcaseProps {
  categories: Category[];
}

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  // Split categories into featured (first 2) and grid (rest)
  const featuredCategories = categories.slice(0, 2);
  const gridCategories = categories.slice(2, 6);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-amber-700 block mb-4">
            Bộ Sưu Tập
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
            Danh Mục Sản Phẩm
          </h2>
          <div className="w-16 h-px bg-amber-600 mx-auto mt-8" />
        </div>

        {/* Featured Categories - Full Width */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {featuredCategories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-stone-100"
            >
              <Image
                src={getImageUrl(cat.imageUrl) || defaultImage}
                alt={cat.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <span className="text-white/70 text-xs tracking-[0.2em] uppercase mb-2">
                  {index === 0 ? 'Bán Chạy' : 'Mới Nhất'}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-light tracking-wide mb-4">
                  {cat.name}
                </h3>
                <div className="overflow-hidden">
                  <span className="inline-flex items-center text-white text-sm tracking-[0.15em] uppercase transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    Khám Phá
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-4 border border-white/0 group-hover:border-white/30 transition-all duration-500" />
            </Link>
          ))}
        </div>

        {/* Grid Categories */}
        {gridCategories.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gridCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-stone-100"
              >
                <Image
                  src={getImageUrl(cat.imageUrl) || defaultImage}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-lg font-light tracking-wide text-center">
                    {cat.name}
                  </h3>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-16">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-stone-700 hover:text-stone-900 group"
          >
            <span className="w-12 h-px bg-stone-300 group-hover:w-20 transition-all duration-300" />
            Xem Tất Cả Sản Phẩm
            <span className="w-12 h-px bg-stone-300 group-hover:w-20 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
