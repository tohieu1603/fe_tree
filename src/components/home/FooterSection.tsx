'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

export default function FooterSection() {
  const { settings } = useSiteSettings();
  const footerLogo = getImageUrl(settings.logoDarkUrl) || getImageUrl(settings.logoUrl);
  return (
    <footer style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-light)' }}>
      {/* Newsletter Section - Giống Gucci */}
      <div className="py-16 md:py-24 text-center px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase mb-8" style={{ color: 'color-mix(in srgb, var(--text-light) 50%, transparent)' }}>
          Sign Up For Updates
        </p>
        <h3
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Nhan thong tin ve bo suu tap moi va tin tuc tu Duc Viet
        </h3>
        <button className="text-sm tracking-[0.15em] uppercase flex items-center gap-2 mx-auto hover:opacity-70 transition-opacity">
          <span className="text-xl">+</span>
          <span className="underline underline-offset-4">Đăng Ký</span>
        </button>
      </div>

      {/* Links Section */}
      <div className="border-t" style={{ borderColor: 'color-mix(in srgb, var(--text-light) 10%, transparent)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
            {/* Logo - Top Left */}
            <div className="col-span-2 md:col-span-1 mb-4 md:mb-0">
              {footerLogo ? (
                <Image
                  src={footerLogo}
                  alt={settings.siteName || 'Logo'}
                  width={160}
                  height={60}
                  unoptimized
                  className="h-12 md:h-16 w-auto object-contain opacity-80"
                />
              ) : (
                <h2
                  className="font-light uppercase"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text-light)',
                  }}
                >
                  {settings.siteName || 'Duc Viet'}
                </h2>
              )}
            </div>
            {/* Column 1 - Help */}
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-6" style={{ color: 'color-mix(in srgb, var(--text-light) 40%, transparent)' }}>
                Hỗ Trợ Khách Hàng
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Liên Hệ', href: '/contact' },
                  { name: 'Vận Chuyển', href: '/shipping' },
                  { name: 'Câu Hỏi Thường Gặp', href: '/faq' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors underline underline-offset-2"
                      style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 - About */}
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-6" style={{ color: 'color-mix(in srgb, var(--text-light) 40%, transparent)' }}>
                Ve Duc Viet
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Giới Thiệu', href: '/about' },
                  { name: 'Bài Viết', href: '/articles' },
                  { name: 'Sản Phẩm', href: '/products' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors underline underline-offset-2"
                      style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Connect */}
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-6" style={{ color: 'color-mix(in srgb, var(--text-light) 40%, transparent)' }}>
                Kết Nối
              </h4>
              <ul className="space-y-3">
                {settings.facebookUrl && (
                  <li>
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors underline underline-offset-2"
                      style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
                    >
                      Facebook
                    </a>
                  </li>
                )}
                {settings.instagramUrl && (
                  <li>
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors underline underline-offset-2"
                      style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {settings.zaloUrl && (
                  <li>
                    <a
                      href={settings.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors underline underline-offset-2"
                      style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
                    >
                      Zalo
                    </a>
                  </li>
                )}
                {!settings.facebookUrl && !settings.instagramUrl && !settings.zaloUrl && (
                  <>
                    <li><a href="#" className="text-sm transition-colors underline underline-offset-2" style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}>Facebook</a></li>
                    <li><a href="#" className="text-sm transition-colors underline underline-offset-2" style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}>Instagram</a></li>
                    <li><a href="#" className="text-sm transition-colors underline underline-offset-2" style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}>Zalo</a></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t px-6 py-6" style={{ borderColor: 'color-mix(in srgb, var(--text-light) 10%, transparent)' }}>
        <p className="text-[10px] text-center" style={{ color: 'color-mix(in srgb, var(--text-light) 30%, transparent)' }}>
          © {settings.copyrightText || `${new Date().getFullYear()} ${settings.siteName || 'Duc Viet'}. All rights reserved.`}
        </p>
      </div>

    </footer>
  );
}
