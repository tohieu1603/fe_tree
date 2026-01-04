/**
 * SSR API functions for Articles
 * Dùng fetch() thuần để Next.js có thể cache và revalidate
 * Sử dụng trong Server Components (không có 'use client')
 */

import type { ApiResponse, Article, PageResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getPublishedArticles(page = 0, size = 10): Promise<PageResponse<Article>> {
  const empty: PageResponse<Article> = { content: [], totalElements: 0, totalPages: 0, size, page, first: true, last: true };
  try {
    const res = await fetch(`${API_URL}/api/public/articles?page=${page}&size=${size}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return empty;
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data;
  } catch {
    return empty;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: ApiResponse<Article> = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function searchArticles(keyword: string, page = 0, size = 10): Promise<PageResponse<Article>> {
  const empty: PageResponse<Article> = { content: [], totalElements: 0, totalPages: 0, size, page, first: true, last: true };
  try {
    const res = await fetch(
      `${API_URL}/api/public/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return empty;
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data;
  } catch {
    return empty;
  }
}

export async function getArticlesByCategory(categoryId: string, page = 0, size = 10): Promise<PageResponse<Article>> {
  const empty: PageResponse<Article> = { content: [], totalElements: 0, totalPages: 0, size, page, first: true, last: true };
  try {
    const res = await fetch(
      `${API_URL}/api/public/categories/${categoryId}/articles?page=${page}&size=${size}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return empty;
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data;
  } catch {
    return empty;
  }
}
