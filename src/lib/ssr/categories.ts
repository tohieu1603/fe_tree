/**
 * SSR API functions for Categories
 * Dùng fetch() thuần để Next.js có thể cache và revalidate
 * Sử dụng trong Server Components (không có 'use client')
 */

import type { ApiResponse, Category } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export async function getProductCategories(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter(cat => cat.sortOrder >= 10);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: ApiResponse<Category> = await res.json();
    return data.data;
  } catch {
    return null;
  }
}
