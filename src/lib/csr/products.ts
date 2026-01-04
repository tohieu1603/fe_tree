/**
 * CSR API functions for Products (Admin)
 * Dùng axios với JWT token
 * Sử dụng trong Client Components ('use client')
 */

import api from './api';
import type { ApiResponse, Product, PageResponse } from '@/types';

export const getAdminProducts = async (page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Product>>>(`/api/admin/products?page=${page}&size=${size}`);
  return response.data.data;
};

export const getAdminProduct = async (id: string) => {
  const response = await api.get<ApiResponse<Product>>(`/api/admin/products/${id}`);
  return response.data.data;
};

export const createProduct = async (data: Partial<Product>) => {
  const response = await api.post<ApiResponse<Product>>('/api/admin/products', data);
  return response.data.data;
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const response = await api.put<ApiResponse<Product>>(`/api/admin/products/${id}`, data);
  return response.data.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/api/admin/products/${id}`);
};
