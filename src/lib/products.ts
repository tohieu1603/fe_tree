import api from './api';
import type { ApiResponse, Product, ProductRequest, PageResponse } from '@/types';

// Admin endpoints
export const getAdminProducts = async (page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(`/api/admin/products?page=${page}&size=${size}`);
  return response.data.data;
};

export const getAdminProduct = async (id: string) => {
  const response = await api.get<ApiResponse<Product>>(`/api/admin/products/${id}`);
  return response.data.data;
};

export const createProduct = async (data: ProductRequest) => {
  const response = await api.post<ApiResponse<Product>>('/api/admin/products', data);
  return response.data.data;
};

export const updateProduct = async (id: string, data: ProductRequest) => {
  const response = await api.put<ApiResponse<Product>>(`/api/admin/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/api/admin/products/${id}`);
};

// Trash endpoints
export const getTrashProducts = async (page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(`/api/admin/products/trash?page=${page}&size=${size}`);
  return response.data.data;
};

export const restoreProduct = async (id: string) => {
  const response = await api.post<ApiResponse<Product>>(`/api/admin/products/${id}/restore`);
  return response.data.data;
};

export const permanentDeleteProduct = async (id: string) => {
  await api.delete(`/api/admin/products/${id}/permanent`);
};

// Public endpoints
export const getPublicProducts = async (page = 0, size = 12) => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(`/api/public/products?page=${page}&size=${size}`);
  return response.data.data;
};

export const getPublicProduct = async (slug: string) => {
  const response = await api.get<ApiResponse<Product>>(`/api/public/products/${slug}`);
  return response.data.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get<ApiResponse<Product[]>>('/api/public/products/featured');
  return response.data.data;
};
