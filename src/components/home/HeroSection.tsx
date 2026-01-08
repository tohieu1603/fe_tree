'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

interface SlideItem {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface Banner {
  id: string;
  imageUrl: string;
  slides: SlideItem[];
  bannerType: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// Default fallback slides
const defaultSlides: SlideItem[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1602498498304-c9eec1a5f04f?w=1920&q=90',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=1920&q=90',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
  },
];

export default function HeroSection() {
  const { settings } = useSiteSettings();
  const [slides, setSlides] = useState<SlideItem[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [banner, setBanner] = useState<Banner | null>(null);

  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Fetch first active HERO banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/banners`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            // Find HERO banner
            const heroBanner = data.data.find((b: Banner) => b.bannerType === 'HERO' || !b.bannerType) || data.data[0];
            setBanner(heroBanner);

            // Use slides array if available, otherwise create from imageUrl
            if (heroBanner.slides && heroBanner.slides.length > 0) {
              const bannerSlides = heroBanner.slides.map((slide: SlideItem) => ({
                ...slide,
                imageUrl: getImageUrl(slide.imageUrl),
              }));
              setSlides(bannerSlides);
            } else if (heroBanner.imageUrl) {
              setSlides([{
                imageUrl: getImageUrl(heroBanner.imageUrl),
                title: heroBanner.title || '',
                subtitle: heroBanner.subtitle || '',
                buttonText: heroBanner.buttonText || '',
                buttonLink: heroBanner.buttonLink || '',
              }]);
            }
          }
        }
      } catch {
        // Use default slides on error
      }
    };
    fetchBanner();
  }, []);

  // Get current slide content (fallback to banner defaults)
  // Priority: slide.title > banner.title (siteName only when no banner data at all)
  const currentSlide = slides[currentIndex] || slides[0];
  const hasBannerData = banner !== null;
  const displayTitle = currentSlide?.title || banner?.title || (hasBannerData ? '' : (settings.siteName || 'DUC VIET'));
  const displaySubtitle = currentSlide?.subtitle || banner?.subtitle || settings.heroSubtitle || 'Tinh Hoa Thiên Nhiên • Nghệ Thuật Thủ Công';

  // Auto-advance carousel
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [nextImage, slides.length]);

  // Scroll animation
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
      {/* Background carousel */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: 'center center' }}
      >
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.imageUrl}
            alt={slide.title || `Banner ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: 'center center' }}
          />
        ))}
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
              fontSize: `min(${Math.max(8, 18 - (displayTitle.length - 2) * 1.2)}vw, ${Math.max(80, 280 - (displayTitle.length - 2) * 15)}px)`,
              fontWeight: 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              userSelect: 'none',
            }}
          >
            {displayTitle}
          </h1>
        </div>
      </div>

      {/* Bottom tagline - positioned above scroll indicator */}
      <div className="absolute bottom-36 left-0 right-0 z-10 text-center">
        <p
          ref={subtitleRef}
          style={{
            color: 'color-mix(in srgb, var(--text-light) 70%, transparent)',
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            fontWeight: 400,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}
        >
          {displaySubtitle}
        </p>
      </div>

      {/* Carousel indicators - positioned below tagline */}
      {slides.length > 1 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white/80 w-6'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator - at bottom */}
      <div
        ref={indicatorRef}
        className="absolute bottom-6 left-1/2 z-10"
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-primary) 60%, transparent), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
