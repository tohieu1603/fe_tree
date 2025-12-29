import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SeoSettings {
  siteUrl: string;
  robotsAllowAll: boolean;
  robotsDisallowPaths: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function getSeoSettings(): Promise<SeoSettings | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/seo`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: ApiResponse<SeoSettings> = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSeoSettings();

  const baseUrl = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const disallowPaths = settings?.robotsDisallowPaths?.split(',').map(p => p.trim()).filter(Boolean) || ['/admin/', '/api/'];

  return {
    rules: [
      {
        userAgent: '*',
        allow: settings?.robotsAllowAll !== false ? '/' : undefined,
        disallow: disallowPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
