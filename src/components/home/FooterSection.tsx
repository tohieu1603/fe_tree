'use client';

import Link from 'next/link';

export default function FooterSection() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section - Giống Gucci */}
      <div className="py-16 md:py-24 text-center px-6">
        <p className="text-[11px] tracking-[0.3em] uppercase mb-8 text-white/50">
          Sign Up For Updates
        </p>
        <h3
          className="text-2xl md:text-3xl lg:text-4xl font-light mb-12 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Nhan thong tin ve bo suu tap moi va tin tuc tu Duc Viet
        </h3>
        <button className="text-sm tracking-[0.15em] uppercase flex items-center gap-2 mx-auto hover:opacity-70 transition-opacity">
          <span className="text-xl">+</span>
          <span className="underline underline-offset-4">Đăng Ký</span>
        </button>
      </div>

      {/* Links Section */}
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            {/* Column 1 - Help */}
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-6 text-white/40">
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
                      className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-2"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 - About */}
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-6 text-white/40">
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
                      className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-2"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Connect */}
            <div>
              <h4 className="text-[11px] tracking-[0.15em] uppercase mb-6 text-white/40">
                Kết Nối
              </h4>
              <ul className="space-y-3">
                {['Facebook', 'Instagram', 'Zalo'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-2"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-6 py-6">
        <p className="text-[10px] text-white/30 text-center">
          © 2024 Duc Viet - All rights reserved.
        </p>
      </div>

      {/* GIANT LOGO - Giống Gucci - Chiếm gần hết màn hình */}
      <div className="overflow-hidden">
        <h2
          className="text-center font-light uppercase whitespace-nowrap"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(120px, 25vw, 400px)',
            letterSpacing: '0.1em',
            lineHeight: 0.85,
            color: '#ffffff',
            paddingBottom: '0.1em',
          }}
        >
          Duc Viet
        </h2>
      </div>
    </footer>
  );
}
