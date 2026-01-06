const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface SeoSettings {
  id: string | null;
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  robotsAllowAll: boolean;
  robotsDisallowPaths: string;
  robotsCustomRules: string;
  sitemapEnabled: boolean;
  sitemapIncludeArticles: boolean;
  sitemapIncludeCategories: boolean;
  sitemapChangeFrequency: string;
  googleAnalyticsId: string;
  googleVerification: string;
  ogImage: string;
  twitterHandle: string;
  createdAt: string | null;
  updatedAt: string | null;
}

const defaultSeoSettings: SeoSettings = {
  id: null,
  siteName: 'Tree',
  siteUrl: 'http://localhost:3000',
  metaTitle: 'Tree - Product Website',
  metaDescription: 'Product introduction and blog website',
  metaKeywords: '',
  robotsAllowAll: true,
  robotsDisallowPaths: '/admin/,/api/',
  robotsCustomRules: '',
  sitemapEnabled: true,
  sitemapIncludeArticles: true,
  sitemapIncludeCategories: true,
  sitemapChangeFrequency: 'weekly',
  googleAnalyticsId: '',
  googleVerification: '',
  ogImage: '',
  twitterHandle: '',
  createdAt: null,
  updatedAt: null,
};

export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const res = await fetch(`${API_URL}/api/public/seo`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch SEO settings:', res.status);
      return defaultSeoSettings;
    }

    const json = await res.json();
    return json.data || defaultSeoSettings;
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return defaultSeoSettings;
  }
}

export function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}
