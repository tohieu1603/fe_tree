'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface NavigationBarProps {
  categories: Category[];
}

export default function NavigationBar({ categories }: NavigationBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const diff = targetRef.current - progressRef.current;
      progressRef.current += diff * 0.1;

      if (headerRef.current) {
        const p = progressRef.current;
        const isScrolled = p > 0.5;

        // Warm cream background when scrolled
        headerRef.current.style.backgroundColor = isScrolled
          ? 'rgba(253, 251, 247, 0.98)'
          : 'transparent';
        headerRef.current.style.backdropFilter = isScrolled ? 'blur(12px)' : 'none';
        headerRef.current.style.boxShadow = isScrolled
          ? '0 1px 0 rgba(201, 169, 98, 0.1)'
          : 'none';

        const links = headerRef.current.querySelectorAll('a, button');
        links.forEach((el) => {
          (el as HTMLElement).style.color = isScrolled ? '#2c2416' : '#d4c5a9';
        });
      }

      if (logoRef.current) {
        const logoOpacity = Math.max(0, (progressRef.current - 0.7) * 3.33);
        logoRef.current.style.opacity = String(Math.min(logoOpacity, 1));
        logoRef.current.style.pointerEvents = logoOpacity > 0.3 ? 'auto' : 'none';
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const vh = window.innerHeight;
      targetRef.current = Math.min(window.scrollY / (vh * 0.6), 1);
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
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ transition: 'background-color 0.3s, backdrop-filter 0.3s, box-shadow 0.3s' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left nav */}
            <nav className="hidden lg:flex items-center gap-12">
              <Link
                href="/products"
                className="text-[13px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Bộ Sưu Tập
              </Link>
              <Link
                href="/articles"
                className="text-[13px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Câu Chuyện
              </Link>
            </nav>

            {/* Center logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2"
            >
              <span
                ref={logoRef}
                className="text-xl md:text-2xl tracking-[0.25em] uppercase font-normal"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  opacity: 0,
                  transition: 'color 0.3s',
                }}
              >
                Duc Viet
              </span>
            </Link>

            {/* Right nav */}
            <nav className="hidden lg:flex items-center gap-12">
              <Link
                href="/about"
                className="text-[13px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Về Chúng Tôi
              </Link>
              <Link
                href="/contact"
                className="text-[13px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity font-medium"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Liên Hệ
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="absolute top-0 left-0 w-80 h-full"
            style={{
              backgroundColor: '#fdfbf7',
              boxShadow: '4px 0 40px rgba(0,0,0,0.2)'
            }}
          >
            <div className="p-8">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-6 p-2 text-[#2c2416]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div
                className="text-xl tracking-[0.25em] uppercase font-normal mb-12"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: '#2c2416',
                }}
              >
                Duc Viet
              </div>

              <nav className="space-y-1">
                {[
                  { href: '/', label: 'Trang Chủ' },
                  { href: '/products', label: 'Bộ Sưu Tập' },
                  { href: '/articles', label: 'Câu Chuyện' },
                  { href: '/about', label: 'Về Chúng Tôi' },
                  { href: '/contact', label: 'Liên Hệ' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-base tracking-[0.12em] uppercase border-b hover:pl-3 transition-all"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: '#2c2416',
                      borderColor: 'rgba(201, 169, 98, 0.15)',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {categories.length > 0 && (
                <div className="mt-10 pt-8 border-t" style={{ borderColor: 'rgba(201, 169, 98, 0.2)' }}>
                  <p
                    className="text-[11px] tracking-[0.2em] uppercase mb-6"
                    style={{ color: '#8b7355' }}
                  >
                    Danh Mục
                  </p>
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-sm hover:text-[#c9a962] transition-colors"
                      style={{ color: '#5a4a3a' }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
