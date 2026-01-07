'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
  linkText: string;
  linkUrl: string;
}

interface MenuItem {
  label: string;
  href: string;
}

// Font presets - matching backend options
const fontPresets = {
  elegant: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', -apple-system, sans-serif",
  },
  modern: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'DM Sans', -apple-system, sans-serif",
  },
  minimal: {
    heading: "'Crimson Pro', Georgia, serif",
    body: "'Source Sans 3', -apple-system, sans-serif",
  },
  luxury: {
    heading: "'Cinzel', Georgia, serif",
    body: "'Lato', -apple-system, sans-serif",
  },
  classic: {
    heading: "'Libre Baskerville', Georgia, serif",
    body: "'Open Sans', -apple-system, sans-serif",
  },
  artistic: {
    heading: "'Bodoni Moda', Georgia, serif",
    body: "'Nunito', -apple-system, sans-serif",
  }
} as const;

// Color palettes - matching backend options
const colorPalettes = {
  warmGold: {
    primary: '#c9a962',
    secondary: '#8b7355',
    accent: '#d4c5a9',
    bgDark: '#1a1510',
    bgLight: '#fdfbf7',
    textDark: '#2c2416',
    textLight: '#d4c5a9',
  },
  deepBrown: {
    primary: '#8b6914',
    secondary: '#5c4a1f',
    accent: '#c4a35a',
    bgDark: '#1c1810',
    bgLight: '#f9f6f0',
    textDark: '#3d3425',
    textLight: '#c4a35a',
  },
  honeyAmber: {
    primary: '#d4a574',
    secondary: '#a67c52',
    accent: '#e8c9a3',
    bgDark: '#241d14',
    bgLight: '#fef9f3',
    textDark: '#352b1e',
    textLight: '#e8c9a3',
  },
  antiqueGold: {
    primary: '#b8860b',
    secondary: '#8b6914',
    accent: '#daa520',
    bgDark: '#18150e',
    bgLight: '#faf8f2',
    textDark: '#2e2817',
    textLight: '#daa520',
  },
  rosewood: {
    primary: '#9c6b5e',
    secondary: '#6b4a42',
    accent: '#c9a090',
    bgDark: '#1a1412',
    bgLight: '#fdf8f6',
    textDark: '#3c2e2a',
    textLight: '#c9a090',
  },
  sandalwood: {
    primary: '#a68b5b',
    secondary: '#7a6642',
    accent: '#d4bc8a',
    bgDark: '#1e1a14',
    bgLight: '#fcf9f4',
    textDark: '#3a3228',
    textLight: '#d4bc8a',
  }
} as const;

type FontPreset = keyof typeof fontPresets;
type ColorPalette = keyof typeof colorPalettes;

// Border radius presets
const borderRadiusPresets = {
  none: {
    xs: '0',
    sm: '0',
    md: '0',
    lg: '0',
    xl: '0',
    full: '0',
  },
  subtle: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  rounded: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  pill: {
    xs: '9999px',
    sm: '9999px',
    md: '9999px',
    lg: '9999px',
    xl: '9999px',
    full: '9999px',
  },
} as const;

type BorderRadius = keyof typeof borderRadiusPresets;

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  phone?: string; // alias for contactPhone
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  zaloUrl: string;
  footerText: string;
  copyrightText: string;
  heroTitle: string;
  heroSubtitle: string;
  categorySectionTitle: string;
  categorySectionSubtitle: string;
  serviceSectionTitle: string;
  services: ServiceItem[];
  navLeftMenu: MenuItem[];
  navRightMenu: MenuItem[];
  fontPreset: string;
  colorPalette: string;
  borderRadius: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'Duc Viet',
  siteTagline: 'Tinh Hoa Tram Huong',
  siteDescription: 'Chuyen cung cap vong tay tram huong, tuong phat, nhang tram, tinh dau tram huong thien nhien 100%',
  logoUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  tiktokUrl: '',
  zaloUrl: '',
  footerText: '',
  copyrightText: '2024 Duc Viet. All rights reserved.',
  heroTitle: 'TRAM HUONG',
  heroSubtitle: 'Tinh Hoa Thien Nhien Viet Nam',
  categorySectionTitle: 'Tinh Hoa Tram Huong',
  categorySectionSubtitle: 'Curated By Duc Viet',
  serviceSectionTitle: 'DUC VIET SERVICES',
  services: [
    {
      title: 'GIAO HANG TAN NOI',
      description: 'Mien phi giao hang toan quoc cho don hang tu 2 trieu dong.',
      imageUrl: '/uploads/products/vong-tay-tram-huong-2.jpg',
      linkText: 'Tim Hieu Them',
      linkUrl: '/about',
    },
    {
      title: 'TU VAN CHUYEN GIA',
      description: 'Doi ngu chuyen gia tram huong tu van mien phi.',
      imageUrl: '/uploads/products/tuong-phat-tram-huong-1.jpg',
      linkText: 'Lien He Ngay',
      linkUrl: '/contact',
    },
    {
      title: 'BAO HANH TRON DOI',
      description: 'Cam ket bao hanh tron doi cho tat ca san pham tram huong.',
      imageUrl: '/uploads/products/nhang-tram-huong.jpg',
      linkText: 'Chinh Sach Bao Hanh',
      linkUrl: '/warranty',
    },
  ],
  navLeftMenu: [
    { label: 'Bộ Sưu Tập', href: '/products' },
    { label: 'Câu Chuyện', href: '/articles' },
  ],
  navRightMenu: [
    { label: 'Về Chúng Tôi', href: '/about' },
    { label: 'Liên Hệ', href: '/contact' },
  ],
  fontPreset: 'elegant',
  colorPalette: 'warmGold',
  borderRadius: 'subtle',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  loading: true,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Apply CSS variables based on theme settings
function applyTheme(fontPreset: string, colorPalette: string, borderRadius: string) {
  const fonts = fontPresets[fontPreset as FontPreset] || fontPresets.elegant;
  const colors = colorPalettes[colorPalette as ColorPalette] || colorPalettes.warmGold;
  const radii = borderRadiusPresets[borderRadius as BorderRadius] || borderRadiusPresets.subtle;

  const root = document.documentElement;
  root.style.setProperty('--font-heading', fonts.heading);
  root.style.setProperty('--font-body', fonts.body);
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--bg-dark', colors.bgDark);
  root.style.setProperty('--bg-light', colors.bgLight);
  root.style.setProperty('--text-dark', colors.textDark);
  root.style.setProperty('--text-light', colors.textLight);

  // Border radius variables
  root.style.setProperty('--radius-xs', radii.xs);
  root.style.setProperty('--radius-sm', radii.sm);
  root.style.setProperty('--radius-md', radii.md);
  root.style.setProperty('--radius-lg', radii.lg);
  root.style.setProperty('--radius-xl', radii.xl);
  root.style.setProperty('--radius-full', radii.full);
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/public/site-settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            const newSettings = {
              ...defaultSettings,
              ...data.data,
              phone: data.data.contactPhone // alias for convenience
            };
            setSettings(newSettings);

            // Apply theme from backend settings
            applyTheme(
              newSettings.fontPreset || 'elegant',
              newSettings.colorPalette || 'warmGold',
              newSettings.borderRadius || 'subtle'
            );
          }
        }
      } catch {
        // Use default settings on error, apply default theme
        applyTheme('elegant', 'warmGold', 'subtle');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
