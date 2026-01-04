/**
 * SSR API functions for Products
 * Dùng fetch() thuần để Next.js có thể cache và revalidate
 * Sử dụng trong Server Components (không có 'use client')
 */

import type { ApiResponse, Product, PageResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data: ApiResponse<Product> = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(slug: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/products/${slug}/related`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Product[]> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export async function getActiveProducts(page = 0, size = 12): Promise<PageResponse<Product>> {
  const empty: PageResponse<Product> = { content: [], totalElements: 0, totalPages: 0, size, page, first: true, last: true };
  try {
    const res = await fetch(`${API_URL}/api/public/products?page=${page}&size=${size}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return empty;
    const data: ApiResponse<PageResponse<Product>> = await res.json();
    return data.data;
  } catch {
    return empty;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/products/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Product[]> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export async function searchProducts(keyword: string, page = 0, size = 12): Promise<PageResponse<Product>> {
  const empty: PageResponse<Product> = { content: [], totalElements: 0, totalPages: 0, size, page, first: true, last: true };
  try {
    const res = await fetch(
      `${API_URL}/api/public/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return empty;
    const data: ApiResponse<PageResponse<Product>> = await res.json();
    return data.data;
  } catch {
    return empty;
  }
}

export async function getProductsByCategory(categoryId: string, page = 0, size = 12): Promise<PageResponse<Product>> {
  const empty: PageResponse<Product> = { content: [], totalElements: 0, totalPages: 0, size, page, first: true, last: true };
  try {
    const res = await fetch(
      `${API_URL}/api/public/products/category/${categoryId}?page=${page}&size=${size}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return empty;
    const data: ApiResponse<PageResponse<Product>> = await res.json();
    return data.data;
  } catch {
    return empty;
  }
}
