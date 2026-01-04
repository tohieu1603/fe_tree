'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface LuxuryNavbarProps {
  categories: Category[];
}

// Smooth easing function
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export default function LuxuryNavbar({ categories }: LuxuryNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    const smoothScroll = () => {
      const current = smoothProgress;
      const target = targetProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        const newProgress = current + diff * 0.1; // Slightly faster for navbar
        setSmoothProgress(newProgress);
        rafRef.current = requestAnimationFrame(smoothScroll);
      } else {
        setSmoothProgress(target);
        rafRef.current = null;
      }
    };

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
      targetProgressRef.current = progress;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [smoothProgress]);

  const easedProgress = easeOutExpo(smoothProgress);

  // Dynamic styles based on scroll
  const isScrolled = easedProgress > 0.25;

  // Logo animation: xuất hiện mượt từ scale 0.8 và opacity 0
  const logoProgress = Math.max(0, (easedProgress - 0.4) / 0.6); // Start at 40%, complete at 100%
  const logoScale = 0.8 + logoProgress * 0.2;
  const logoOpacity = logoProgress;

  // Header background opacity
  const headerBgOpacity = Math.min(easedProgress * 1.5, 0.98);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-700"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${headerBgOpacity})`,
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          boxShadow: isScrolled ? '0 1px 30px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link
                href="/products"
                className="text-[13px] tracking-[0.12em] uppercase transition-all duration-500 font-light hover-underline-smooth"
                style={{
                  color: isScrolled ? '#44403c' : 'rgba(255,255,255,0.9)',
                }}
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
              >
                Sản Phẩm
              </Link>
              <Link
                href="/articles"
                className="text-[13px] tracking-[0.12em] uppercase transition-all duration-500 font-light hover-underline-smooth"
                style={{
                  color: isScrolled ? '#44403c' : 'rgba(255,255,255,0.9)',
                }}
              >
                Bài Viết
              </Link>
              <Link
                href="/about"
                className="text-[13px] tracking-[0.12em] uppercase transition-all duration-500 font-light hover-underline-smooth"
                style={{
                  color: isScrolled ? '#44403c' : 'rgba(255,255,255,0.9)',
                }}
              >
                Giới Thiệu
              </Link>
            </nav>

            {/* Center Logo - Animated smoothly */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 will-change-transform"
              style={{
                opacity: logoOpacity,
                transform: `translateX(-50%) scale(${logoScale})`,
                pointerEvents: logoOpacity > 0.5 ? 'auto' : 'none',
              }}
            >
              <span
                className="text-2xl md:text-[26px] font-light tracking-[0.25em] uppercase transition-colors duration-500"
                style={{
                  color: isScrolled ? '#1c1917' : '#ffffff',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                TREE
              </span>
            </Link>

            {/* Right Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link
                href="/contact"
                className="text-[13px] tracking-[0.12em] uppercase transition-all duration-500 font-light hover-underline-smooth"
                style={{
                  color: isScrolled ? '#44403c' : 'rgba(255,255,255,0.9)',
                }}
              >
                Liên Hệ
              </Link>
              <button
                className="p-2 transition-all duration-500 rounded-full hover:bg-stone-100/50"
                style={{
                  color: isScrolled ? '#44403c' : 'rgba(255,255,255,0.9)',
                }}
                aria-label="Tìm kiếm"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link
                href="/admin"
                className="text-[11px] tracking-[0.1em] uppercase transition-all duration-500 font-light"
                style={{
                  color: isScrolled ? '#a8a29e' : 'rgba(255,255,255,0.5)',
                }}
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 transition-all duration-500 rounded-full"
              style={{
                color: isScrolled ? '#44403c' : '#ffffff',
              }}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Products Dropdown */}
        <div
          className="absolute top-full left-0 right-0 overflow-hidden transition-all duration-500 ease-out"
          style={{
            maxHeight: isProductsDropdownOpen && isScrolled ? '400px' : '0',
            opacity: isProductsDropdownOpen && isScrolled ? 1 : 0,
            backgroundColor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: isProductsDropdownOpen ? '0 20px 40px rgba(0,0,0,0.08)' : 'none',
          }}
          onMouseEnter={() => setIsProductsDropdownOpen(true)}
          onMouseLeave={() => setIsProductsDropdownOpen(false)}
        >
          <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group text-center"
                >
                  <div className="aspect-square bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl overflow-hidden mb-4 transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.02]">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">✦</span>
                    </div>
                  </div>
                  <span className="text-sm text-stone-600 group-hover:text-amber-700 transition-colors duration-500 font-light">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ${
          isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-700"
          style={{ opacity: isMobileMenuOpen ? 1 : 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className="absolute top-0 right-0 w-full max-w-sm h-full bg-white transition-transform duration-700 ease-out"
          style={{
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            boxShadow: '-20px 0 60px rgba(0,0,0,0.1)',
          }}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-16">
              <span
                className="text-2xl font-light tracking-[0.25em]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                TREE
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800 transition-colors duration-300 rounded-full hover:bg-stone-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              {[
                { href: '/', label: 'Trang Chủ' },
                { href: '/products', label: 'Sản Phẩm' },
                { href: '/articles', label: 'Bài Viết' },
                { href: '/about', label: 'Giới Thiệu' },
                { href: '/contact', label: 'Liên Hệ' },
              ].map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-4 text-lg tracking-[0.08em] uppercase border-b border-stone-100 text-stone-700 hover:text-amber-700 hover:pl-2 transition-all duration-500 font-light"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="block py-3 pl-4 text-sm tracking-[0.08em] border-b border-stone-50 text-stone-400 hover:text-amber-700 hover:pl-6 transition-all duration-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-10 left-8 right-8">
              <Link
                href="/admin"
                className="block text-center py-3 text-xs tracking-[0.15em] uppercase text-stone-400 hover:text-stone-600 transition-colors duration-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
