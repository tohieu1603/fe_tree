/**
 * CSR API functions for Categories (Admin)
 * Dùng axios với JWT token
 * Sử dụng trong Client Components ('use client')
 */

import api from './api';
import type { ApiResponse, Category, CategoryRequest, PageResponse, Article } from '@/types';

export const getAdminCategories = async () => {
  const response = await api.get<ApiResponse<Category[]>>('/api/admin/categories');
  return response.data.data;
};

export const getAdminCategory = async (id: string) => {
  const response = await api.get<ApiResponse<Category>>(`/api/admin/categories/${id}`);
  return response.data.data;
};

export const createCategory = async (data: CategoryRequest) => {
  const response = await api.post<ApiResponse<Category>>('/api/admin/categories', data);
  return response.data.data;
};

export const updateCategory = async (id: string, data: CategoryRequest) => {
  const response = await api.put<ApiResponse<Category>>(`/api/admin/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id: string) => {
  await api.delete(`/api/admin/categories/${id}`);
};

export const getCategoryArticles = async (id: string, page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Article>>>(`/api/public/categories/${id}/articles?page=${page}&size=${size}`);
  return response.data.data;
};
