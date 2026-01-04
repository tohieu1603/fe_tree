'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
}

// 4 ảnh trầm hương từ uploads
const categoryImages: Record<string, string> = {
  'vong-tay': '/uploads/categories/cat-vong-tay.jpg',
  'tuong-phat': '/uploads/categories/cat-tuong-phat.jpg',
  'nhang-tram': '/uploads/categories/cat-nhang.jpg',
  'tinh-dau': '/uploads/categories/cat-tinh-dau.jpg',
};

// Fallback categories
const defaultCategories = [
  { id: 1, slug: 'vong-tay', name: 'Vòng Tay' },
  { id: 2, slug: 'tuong-phat', name: 'Tượng Gỗ' },
  { id: 3, slug: 'nhang-tram', name: 'Nhang Trầm' },
  { id: 4, slug: 'tinh-dau', name: 'Tinh Dầu' },
];

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const displayCategories = categories.length >= 4
    ? categories.slice(0, 4)
    : defaultCategories;

  return (
    <section className="bg-white">
      {/* Title - Giống "CURATED BY THE HOUSE" của Gucci */}
      <div className="text-center pt-16 pb-10 md:pt-20 md:pb-12">
        <p
          className="text-[11px] tracking-[0.3em] uppercase text-black/40 mb-4"
        >
          Curated By Duc Viet
        </p>
        <h2
          className="text-lg md:text-xl tracking-[0.15em] uppercase font-normal"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Tinh Hoa Tram Huong
        </h2>
      </div>

      {/* 4 Categories - Giống Gucci với padding lớn */}
      <div className="px-6 md:px-12 lg:px-20 pb-16 md:pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              {/* Product Image - Nền xám nhạt như Gucci với hover mượt */}
              <div className="aspect-[3/4] relative overflow-hidden bg-[#f0f0f0]">
                <Image
                  src={categoryImages[category.slug] || categoryImages['nhang-tram']}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
                />
              </div>

              {/* Category Name - Bên dưới ảnh */}
              <p
                className="text-center text-[13px] md:text-sm tracking-[0.05em] mt-5 group-hover:underline underline-offset-4"
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
