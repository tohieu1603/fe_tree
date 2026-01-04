'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function HeroSection() {
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
      style={{ backgroundColor: '#1a1510' }}
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
            background: 'linear-gradient(to bottom, rgba(26, 21, 16, 0.4) 0%, rgba(26, 21, 16, 0.6) 100%)'
          }}
        />
      </div>

      {/* Centered Logo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div
          ref={textRef}
          className="will-change-transform text-center"
        >
          {/* Main Logo */}
          <h1
            style={{
              color: '#d4c5a9',
              fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
              fontSize: 'min(18vw, 280px)',
              fontWeight: 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              userSelect: 'none',
            }}
          >
            DUC VIET
          </h1>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-24 text-center">
        <p
          ref={subtitleRef}
          style={{
            color: 'rgba(212, 197, 169, 0.6)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
        >
          Tinh Hoa Thiên Nhiên • Nghệ Thuật Thủ Công
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
              color: 'rgba(212, 197, 169, 0.4)',
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
              background: 'linear-gradient(to bottom, rgba(201, 169, 98, 0.6), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
