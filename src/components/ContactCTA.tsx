'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ContactCTA() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1920&q=80"
          alt="Contact"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-6">
          Liên Hệ Đặt Hàng
        </h2>
        <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
          Chúng tôi sẵn sàng tư vấn và hỗ trợ bạn chọn sản phẩm phù hợp nhất
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="tel:0123456789"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-stone-900 text-sm tracking-[0.15em] uppercase hover:bg-stone-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            0123 456 789
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 border border-white/50 text-white text-sm tracking-[0.15em] uppercase hover:bg-white hover:text-stone-900 transition-all duration-500"
          >
            Gửi Tin Nhắn
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
