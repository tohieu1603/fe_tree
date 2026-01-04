'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LuxuryHeroProps {
  onScrollProgress?: (progress: number) => void;
}

// Smooth easing function - giống Gucci
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export default function LuxuryHero({ onScrollProgress }: LuxuryHeroProps) {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    // Smooth interpolation với requestAnimationFrame
    const smoothScroll = () => {
      const current = smoothProgress;
      const target = targetProgressRef.current;
      const diff = target - current;

      // Lerp với tốc độ mượt hơn
      if (Math.abs(diff) > 0.001) {
        const newProgress = current + diff * 0.08;
        setSmoothProgress(newProgress);
        rafRef.current = requestAnimationFrame(smoothScroll);
      } else {
        setSmoothProgress(target);
        rafRef.current = null;
      }
    };

    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / (heroHeight * 0.7), 1);

      targetProgressRef.current = progress;
      onScrollProgress?.(progress);

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smoothProgress, onScrollProgress]);

  // Sử dụng easing cho các giá trị animation
  const easedProgress = easeOutExpo(smoothProgress);

  // Logo: Bắt đầu từ scale 1, thu nhỏ dần và di chuyển lên
  const logoScale = 1 - easedProgress * 0.6;
  const logoOpacity = 1 - easedProgress * 1.2;
  const logoY = -easedProgress * 100;

  // Content opacity với smooth fade
  const contentOpacity = Math.max(0, 1 - easedProgress * 2);

  // Parallax background
  const bgScale = 1 + easedProgress * 0.15;
  const bgY = easedProgress * 80;

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-stone-950"
    >
      {/* Background Image with smooth parallax */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `scale(${bgScale}) translateY(${bgY}px)`,
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1609167830220-7164aa360951?w=1920&q=90"
          alt="Trầm Hương Tree"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay mềm mại hơn */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      {/* Centered Logo - TREE với animation mượt */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none will-change-transform"
        style={{
          opacity: Math.max(0, logoOpacity),
          transform: `scale(${Math.max(0.4, logoScale)}) translateY(${logoY}px)`,
        }}
      >
        <h1
          className="text-[18vw] md:text-[14vw] lg:text-[12vw] font-extralight text-white tracking-[0.2em] md:tracking-[0.3em] uppercase select-none"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}
        >
          TREE
        </h1>
      </div>

      {/* Subtitle and CTA với smooth fade */}
      <div
        className="absolute bottom-24 md:bottom-32 left-0 right-0 text-center z-20 px-4 will-change-transform"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${easedProgress * 30}px)`,
        }}
      >
        <p className="text-white/70 text-xs md:text-sm tracking-[0.3em] uppercase mb-8 font-light">
          Trầm Hương Thiên Nhiên Cao Cấp
        </p>
        <Link
          href="/products"
          className="inline-block px-10 py-4 border border-white/40 text-white text-xs tracking-[0.25em] uppercase
                     hover:bg-white hover:text-stone-900 transition-all duration-700 ease-out
                     rounded-none backdrop-blur-sm"
        >
          Khám Phá Bộ Sưu Tập
        </Link>
      </div>

      {/* Scroll indicator với animation mềm */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        style={{ opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/40 to-white/60 animate-pulse" />
          <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-light">
            Cuộn xuống
          </span>
        </div>
      </div>

      {/* Side decorative elements - mềm mại hơn */}
      <div
        className="absolute top-1/2 left-10 -translate-y-1/2 z-10 hidden xl:block"
        style={{ opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30" />
          <span
            className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}
          >
            Since 2015
          </span>
          <div className="w-px h-16 bg-gradient-to-t from-transparent to-white/30" />
        </div>
      </div>

      <div
        className="absolute top-1/2 right-10 -translate-y-1/2 z-10 hidden xl:block"
        style={{ opacity: contentOpacity }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/30" />
          <span
            className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light"
            style={{
              writingMode: 'vertical-lr',
              textOrientation: 'mixed',
            }}
          >
            100% Natural
          </span>
          <div className="w-px h-16 bg-gradient-to-t from-transparent to-white/30" />
        </div>
      </div>
    </section>
  );
}
