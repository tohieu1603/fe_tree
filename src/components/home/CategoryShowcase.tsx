'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface CategoryShowcaseProps {
  categories: Category[];
}

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

// Fallback categories
const defaultCategories = [
  { id: 1, slug: 'vong-tay', name: 'Vòng Tay', imageUrl: '' },
  { id: 2, slug: 'tuong-phat', name: 'Tượng Gỗ', imageUrl: '' },
  { id: 3, slug: 'nhang-tram', name: 'Nhang Trầm', imageUrl: '' },
  { id: 4, slug: 'tinh-dau', name: 'Tinh Dầu', imageUrl: '' },
];

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const { settings } = useSiteSettings();
  const displayCategories = categories.length >= 4
    ? categories.slice(0, 4)
    : defaultCategories;

  // Get section title/subtitle - priority: first category with sectionTitle > settings > default
  const firstCategoryWithSection = categories.find(c => c.sectionTitle || c.sectionSubtitle);
  const sectionTitle = firstCategoryWithSection?.sectionTitle || settings.categorySectionTitle || 'Tinh Hoa Tram Huong';
  const sectionSubtitle = firstCategoryWithSection?.sectionSubtitle || settings.categorySectionSubtitle || 'Curated By Duc Viet';

  return (
    <section style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Title - Giống "CURATED BY THE HOUSE" của Gucci */}
      <div className="text-center pt-16 pb-10 md:pt-20 md:pb-12">
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-4"
          style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
        >
          {sectionSubtitle}
        </p>
        <h2
          className="text-lg md:text-xl tracking-[0.15em] uppercase font-normal"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
        >
          {sectionTitle}
        </h2>
      </div>

      {/* 4 Categories - Giống Gucci với padding lớn */}
      <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category/${category.slug}`}
              className="group"
            >
              {/* Product Image - Nền xám nhạt như Gucci với hover mượt */}
              <div className="aspect-[3/4] relative overflow-hidden bg-[#f0f0f0]">
                <Image
                  src={getImageUrl(category.imageUrl) || defaultImage}
                  alt={category.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                />
              </div>

              {/* Category Name - Bên dưới ảnh */}
              <p
                className="text-center text-[13px] md:text-sm tracking-[0.05em] mt-5 group-hover:underline underline-offset-4"
                style={{ color: 'var(--text-dark)' }}
              >
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
