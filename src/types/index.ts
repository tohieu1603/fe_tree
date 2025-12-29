export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  active: boolean;
  articleCount: number;
  parentId?: string;
  parentName?: string;
  level: number;
  children?: Category[];
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  contentHtml?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  tags?: string;
  readingTime?: number;
  isFeatured?: boolean;
  allowComments?: boolean;
  publishedAt?: string;
  sourceUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  category?: Category;
  author?: {
    id: string;
    fullName: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRequest {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  tags?: string;
  readingTime?: number;
  isFeatured?: boolean;
  allowComments?: boolean;
  publishedAt?: string;
  sourceUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  status?: string;
  categoryId?: string;
}

export interface CategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  active?: boolean;
  parentId?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  featuredImage?: string;
  images?: string[];
  price?: number;
  originalPrice?: number;
  sku?: string;
  dimensions?: string;
  material?: string;
  color?: string;
  weight?: number;
  stockQuantity?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  viewCount?: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}
