'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function EditorialBanner() {
  return (
    <section className="px-[18px]">
      {/* Banner với margin 2 bên - Giống Gucci */}
      <Link
        href="/category/vong-tay"
        className="group block relative w-full h-[70vh] md:h-[85vh] overflow-hidden"
      >
        {/* Background Image with smooth zoom on hover */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/uploads/products/vong-tay-tram-huong-1.jpg"
            alt="Vong Tay Tram Huong"
            fill
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
            priority
          />
        </div>

        {/* Content Layout - Top label + Bottom title/button */}
        <div className="absolute inset-0 flex flex-col items-center justify-between py-12 md:py-16">
          {/* Top label - "WOMEN" style */}
          <div
            className="px-5 py-2.5 text-[11px] tracking-[0.25em] uppercase font-medium"
            style={{
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
            }}
          >
            VONG TAY
          </div>

          {/* Bottom section - Title + Button */}
          <div className="flex flex-col items-center gap-6 md:gap-8">
            {/* Title - "Fashion Jewellery" style */}
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-center"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: '#ffffff',
              }}
            >
              Vong Tay Tram Huong
            </h2>

            {/* Shop Now Button - Gucci style */}
            <button
              className="px-10 py-4 text-[11px] tracking-[0.2em] uppercase font-medium border border-white text-white
                         transition-all duration-300 ease-out
                         hover:bg-white hover:text-black"
            >
              MUA NGAY
            </button>
          </div>
        </div>
      </Link>
    </section>
  );
}
