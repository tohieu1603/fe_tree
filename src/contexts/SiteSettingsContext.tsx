'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
  linkText: string;
  linkUrl: string;
}

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
            setSettings({ ...defaultSettings, ...data.data });
          }
        }
      } catch {
        // Use default settings on error
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
