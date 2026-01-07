'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

const defaultServices = [
  {
    title: 'GIAO HANG TAN NOI',
    description: 'Mien phi giao hang toan quoc cho don hang tu 2 trieu dong.',
    imageUrl: '/uploads/products/vong-tay-tram-huong-2.jpg',
    linkUrl: '/about',
    linkText: 'Tim Hieu Them',
  },
  {
    title: 'TU VAN CHUYEN GIA',
    description: 'Doi ngu chuyen gia tram huong tu van mien phi.',
    imageUrl: '/uploads/products/tuong-phat-tram-huong-1.jpg',
    linkUrl: '/contact',
    linkText: 'Lien He Ngay',
  },
  {
    title: 'BAO HANH TRON DOI',
    description: 'Cam ket bao hanh tron doi cho tat ca san pham tram huong.',
    imageUrl: '/uploads/products/nhang-tram-huong.jpg',
    linkUrl: '/warranty',
    linkText: 'Chinh Sach Bao Hanh',
  },
];

export default function ServiceSection() {
  const { settings } = useSiteSettings();
  const services = settings.services?.length > 0 ? settings.services : defaultServices;
  const sectionTitle = settings.serviceSectionTitle || 'DUC VIET SERVICES';

  return (
    <section className="bg-white py-20 md:py-32">
      {/* Title */}
      <div className="text-center mb-16 md:mb-20">
        <h2
          className="text-xl md:text-2xl tracking-[0.2em] uppercase font-light"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {sectionTitle}
        </h2>
      </div>

      {/* Services Grid */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => (
            <div key={index} className="group text-center">
              {/* Service Image with play button overlay style */}
              <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] mb-8">
                <Image
                  src={getImageUrl(service.imageUrl) || 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=800&q=80'}
                  alt={service.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Play button overlay like Gucci */}
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-black ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Service Title */}
              <h3 className="text-sm md:text-base tracking-[0.15em] uppercase font-medium mb-4">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-[13px] md:text-sm leading-relaxed text-gray-600 mb-6 max-w-sm mx-auto">
                {service.description}
              </p>

              {/* Link with underline */}
              <Link
                href={service.linkUrl || '#'}
                className="inline-block text-[13px] tracking-[0.05em] underline underline-offset-4 hover:no-underline transition-all"
              >
                {service.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
