import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Article {
  slug: string;
  updatedAt: string;
}

interface Category {
  slug: string;
}

interface SeoSettings {
  siteUrl: string;
  sitemapEnabled: boolean;
  sitemapIncludeArticles: boolean;
  sitemapIncludeCategories: boolean;
  sitemapChangeFrequency: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
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

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/articles?size=1000`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data?.content || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSeoSettings();

  // Return empty if sitemap is disabled
  if (settings?.sitemapEnabled === false) {
    return [];
  }

  const SITE_URL = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const changeFreq = (settings?.sitemapChangeFrequency || 'weekly') as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

  const [articles, categories] = await Promise.all([
    settings?.sitemapIncludeArticles !== false ? getArticles() : Promise.resolve([]),
    settings?.sitemapIncludeCategories !== false ? getCategories() : Promise.resolve([]),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: changeFreq,
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}
