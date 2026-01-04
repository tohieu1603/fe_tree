'use client';

import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-stone-950 text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/20 rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative">
        {/* Section Header */}
        <span className="text-xs tracking-[0.3em] uppercase text-amber-500 block mb-4">
          Về Chúng Tôi
        </span>
        <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">
          Trầm Hương Tree
        </h2>
        <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-16">
          Chúng tôi tự hào mang đến những sản phẩm trầm hương thiên nhiên 100%,
          được khai thác và chế tác bởi những nghệ nhân lành nghề với tâm huyết và sự tận tâm.
          Mỗi sản phẩm là một tác phẩm nghệ thuật độc đáo, kết tinh từ thiên nhiên và bàn tay khéo léo của con người.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 md:gap-16 mb-16">
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-light text-amber-500 mb-2">10+</div>
            <div className="text-white/40 text-sm tracking-[0.15em] uppercase">Năm Kinh Nghiệm</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-light text-amber-500 mb-2">500+</div>
            <div className="text-white/40 text-sm tracking-[0.15em] uppercase">Sản Phẩm</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-6xl font-light text-amber-500 mb-2">100%</div>
            <div className="text-white/40 text-sm tracking-[0.15em] uppercase">Thiên Nhiên</div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/about"
          className="inline-block px-12 py-4 border border-white/30 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-stone-900 transition-all duration-500"
        >
          Tìm Hiểu Thêm
        </Link>
      </div>
    </section>
  );
}
