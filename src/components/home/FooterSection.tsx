'use client';

import Link from 'next/link';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function FooterSection() {
  const { settings } = useSiteSettings();
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
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

      {/* GIANT LOGO - Giống Gucci - Responsive based on text length */}
      <div className="overflow-hidden">
        <h2
          className="text-center font-light uppercase whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: `clamp(${Math.max(60, 120 - ((settings.siteName || 'Duc Viet').length - 2) * 8)}px, ${Math.max(10, 25 - ((settings.siteName || 'Duc Viet').length - 2) * 1.5)}vw, ${Math.max(150, 400 - ((settings.siteName || 'Duc Viet').length - 2) * 25)}px)`,
            letterSpacing: '0.1em',
            lineHeight: 0.85,
            color: 'var(--text-light)',
            paddingBottom: '0.1em',
          }}
        >
          {settings.siteName || 'Duc Viet'}
        </h2>
      </div>
    </footer>
  );
}
