'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

interface Banner {
  id: string;
  imageUrl: string;
  bannerType: string;
  labelText: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
}

// Default values
const defaultBanner = {
  imageUrl: 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=1600&q=80',
  labelText: 'VONG TAY',
  title: 'Vong Tay Tram Huong',
  buttonText: 'MUA NGAY',
  buttonLink: '/products/category/vong-tay',
};

export default function EditorialBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/banners`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            // Find EDITORIAL banner
            const editorialBanner = data.data.find((b: Banner) => b.bannerType === 'EDITORIAL');
            if (editorialBanner && editorialBanner.active) {
              setBanner(editorialBanner);
            }
          }
        }
      } catch {
        // Use default values on error
      }
    };
    fetchBanner();
  }, []);

  const displayImage = getImageUrl(banner?.imageUrl) || getImageUrl(defaultBanner.imageUrl);
  const displayLabel = banner?.labelText || defaultBanner.labelText;
  const displayTitle = banner?.title || defaultBanner.title;
  const displayButton = banner?.buttonText || defaultBanner.buttonText;
  const displayLink = banner?.buttonLink || defaultBanner.buttonLink;

  return (
    <section className="px-[18px]">
      {/* Banner với margin 2 bên - Giống Gucci */}
      <Link
        href={displayLink}
        className="group block relative w-full h-[70vh] md:h-[85vh] overflow-hidden"
      >
        {/* Background Image with smooth zoom on hover */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={displayImage}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
          />
        </div>

        {/* Content Layout - Center title + Bottom button */}
        <div className="absolute inset-0 flex flex-col items-center">
          {/* Top label - Category tag */}
          <div className="pt-12 md:pt-16">
            <div
              className="px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
              }}
            >
              {displayLabel}
            </div>
          </div>

          {/* Center - Banner Title (main headline) */}
          <div className="flex-1 flex items-center justify-center px-4">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-center"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: '#ffffff',
              }}
            >
              {displayTitle}
            </h2>
          </div>

          {/* Bottom - CTA Button */}
          <div className="pb-12 md:pb-16">
            <button
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium border border-white text-white
                         transition-all duration-300 ease-out
                         hover:bg-white hover:text-black"
            >
              {displayButton}
            </button>
          </div>
        </div>
      </Link>
    </section>
  );
}
