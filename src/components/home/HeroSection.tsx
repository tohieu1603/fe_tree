'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function HeroSection() {
  const { settings } = useSiteSettings();
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const diff = targetRef.current - progressRef.current;
      progressRef.current += diff * 0.06;

      if (Math.abs(diff) > 0.0001) {
        applyTransforms();
      }

      rafId = requestAnimationFrame(animate);
    };

    const applyTransforms = () => {
      const p = progressRef.current;

      if (textRef.current) {
        const scale = 1 - p * 0.85;
        const opacity = Math.max(0, 1 - p * 1.5);
        const y = p * -80;
        textRef.current.style.transform = `scale(${scale}) translateY(${y}px)`;
        textRef.current.style.opacity = String(opacity);
      }

      if (subtitleRef.current) {
        const opacity = Math.max(0, 1 - p * 3);
        subtitleRef.current.style.opacity = String(opacity);
      }

      if (indicatorRef.current) {
        const opacity = Math.max(0, 1 - p * 3);
        indicatorRef.current.style.opacity = String(opacity);
      }

      if (bgRef.current) {
        const scale = 1 + p * 0.1;
        const y = p * 50;
        bgRef.current.style.transform = `scale(${scale}) translateY(${y}px)`;
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      targetRef.current = Math.min(scrollY / (vh * 0.6), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Background - Trầm hương atmosphere */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: 'center center' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1602498498304-c9eec1a5f04f?w=1920&q=90"
          alt="Trầm Hương"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark warm overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, color-mix(in srgb, var(--bg-dark) 40%, transparent) 0%, color-mix(in srgb, var(--bg-dark) 60%, transparent) 100%)'
          }}
        />
      </div>

      {/* Centered Logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          ref={textRef}
          className="will-change-transform text-center"
        >
          {/* Main Logo - responsive font size based on text length */}
          <h1
            style={{
              color: 'var(--text-light)',
              fontFamily: 'var(--font-heading)',
              fontSize: `min(${Math.max(8, 18 - ((settings.siteName || 'DUC VIET').length - 2) * 1.2)}vw, ${Math.max(80, 280 - ((settings.siteName || 'DUC VIET').length - 2) * 15)}px)`,
              fontWeight: 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              userSelect: 'none',
            }}
          >
            {settings.siteName || 'DUC VIET'}
          </h1>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-24 text-center">
        <p
          ref={subtitleRef}
          style={{
            color: 'color-mix(in srgb, var(--text-light) 60%, transparent)',
            fontFamily: 'var(--font-heading)',
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          {settings.heroSubtitle || 'Tinh Hoa Thiên Nhiên • Nghệ Thuật Thủ Công'}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-10 left-1/2 z-10"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <span
            style={{
              color: 'color-mix(in srgb, var(--text-light) 40%, transparent)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Khám phá
          </span>
          <div
            style={{
              width: '1px',
              height: '50px',
              background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-primary) 60%, transparent), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
