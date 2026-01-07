'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

interface NavigationBarProps {
  categories: Category[];
}

export default function NavigationBar({ categories }: NavigationBarProps) {
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      const diff = targetRef.current - progressRef.current;
      progressRef.current += diff * 0.1;

      if (headerRef.current) {
        const p = progressRef.current;
        const isScrolled = p > 0.5;

        // Use CSS variables for colors
        const bgLight = getComputedStyle(document.documentElement).getPropertyValue('--bg-light').trim() || '#fdfbf7';
        const textDark = getComputedStyle(document.documentElement).getPropertyValue('--text-dark').trim() || '#2c2416';
        const textLight = getComputedStyle(document.documentElement).getPropertyValue('--text-light').trim() || '#d4c5a9';
        const colorPrimary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#c9a962';

        headerRef.current.style.backgroundColor = isScrolled
          ? `color-mix(in srgb, ${bgLight} 98%, transparent)`
          : 'transparent';
        headerRef.current.style.backdropFilter = isScrolled ? 'blur(12px)' : 'none';
        headerRef.current.style.boxShadow = isScrolled
          ? `0 1px 0 color-mix(in srgb, ${colorPrimary} 10%, transparent)`
          : 'none';

        const links = headerRef.current.querySelectorAll('a, button');
        links.forEach((el) => {
          (el as HTMLElement).style.color = isScrolled ? textDark : textLight;
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
            {/* Left nav - dynamic from settings */}
            <nav className="hidden lg:flex items-center gap-12">
              {(settings.navLeftMenu?.length > 0 ? settings.navLeftMenu : [
                { label: 'Bộ Sưu Tập', href: '/products' },
                { label: 'Câu Chuyện', href: '/articles' },
              ]).map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-[13px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity font-medium"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Center logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2"
            >
              <div
                ref={logoRef}
                style={{
                  opacity: 0,
                  transition: 'opacity 0.3s',
                }}
              >
                {getImageUrl(settings.logoUrl) ? (
                  <Image
                    src={getImageUrl(settings.logoUrl)}
                    alt={settings.siteName || 'Logo'}
                    width={120}
                    height={40}
                    unoptimized
                    className="h-8 md:h-10 w-auto object-contain"
                  />
                ) : (
                  <span
                    className="text-xl md:text-2xl tracking-[0.25em] uppercase font-normal"
                    style={{
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {settings.siteName || 'Duc Viet'}
                  </span>
                )}
              </div>
            </Link>

            {/* Right nav - dynamic from settings */}
            <nav className="hidden lg:flex items-center gap-12">
              {(settings.navRightMenu?.length > 0 ? settings.navRightMenu : [
                { label: 'Về Chúng Tôi', href: '/about' },
                { label: 'Liên Hệ', href: '/contact' },
              ]).map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-[13px] tracking-[0.2em] uppercase hover:opacity-60 transition-opacity font-medium"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.label}
                </Link>
              ))}
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
              backgroundColor: 'var(--bg-light)',
              boxShadow: '4px 0 40px rgba(0,0,0,0.2)'
            }}
          >
            <div className="p-8">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-6 p-2"
                style={{ color: 'var(--text-dark)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-12">
                {getImageUrl(settings.logoUrl) ? (
                  <Image
                    src={getImageUrl(settings.logoUrl)}
                    alt={settings.siteName || 'Logo'}
                    width={120}
                    height={40}
                    unoptimized
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div
                    className="text-xl tracking-[0.25em] uppercase font-normal"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--text-dark)',
                    }}
                  >
                    {settings.siteName || 'Duc Viet'}
                  </div>
                )}
              </div>

              <nav className="space-y-1">
                {/* Home link always first */}
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 text-base tracking-[0.12em] uppercase border-b hover:pl-3 transition-all"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--text-dark)',
                    borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                  }}
                >
                  Trang Chủ
                </Link>
                {/* Left menu items */}
                {(settings.navLeftMenu?.length > 0 ? settings.navLeftMenu : [
                  { label: 'Bộ Sưu Tập', href: '/products' },
                  { label: 'Câu Chuyện', href: '/articles' },
                ]).map((item, index) => (
                  <Link
                    key={`left-${index}`}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-base tracking-[0.12em] uppercase border-b hover:pl-3 transition-all"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--text-dark)',
                      borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Right menu items */}
                {(settings.navRightMenu?.length > 0 ? settings.navRightMenu : [
                  { label: 'Về Chúng Tôi', href: '/about' },
                  { label: 'Liên Hệ', href: '/contact' },
                ]).map((item, index) => (
                  <Link
                    key={`right-${index}`}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-base tracking-[0.12em] uppercase border-b hover:pl-3 transition-all"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--text-dark)',
                      borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {categories.length > 0 && (
                <div className="mt-10 pt-8 border-t" style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                  <p
                    className="text-[11px] tracking-[0.2em] uppercase mb-6"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Danh Mục
                  </p>
                  {categories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-sm transition-colors"
                      style={{ color: 'color-mix(in srgb, var(--text-dark) 70%, transparent)' }}
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
