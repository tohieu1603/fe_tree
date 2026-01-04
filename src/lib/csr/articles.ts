/**
 * CSR API functions for Articles (Admin)
 * Dùng axios với JWT token
 * Sử dụng trong Client Components ('use client')
 */

import api from './api';
import type { ApiResponse, Article, ArticleRequest, PageResponse } from '@/types';

export const getAdminArticles = async (page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Article>>>(`/api/admin/articles?page=${page}&size=${size}`);
  return response.data.data;
};

export const getAdminArticle = async (id: string) => {
  const response = await api.get<ApiResponse<Article>>(`/api/admin/articles/${id}`);
  return response.data.data;
};

export const createArticle = async (data: ArticleRequest) => {
  const response = await api.post<ApiResponse<Article>>('/api/admin/articles', data);
  return response.data.data;
};

export const updateArticle = async (id: string, data: ArticleRequest) => {
  const response = await api.put<ApiResponse<Article>>(`/api/admin/articles/${id}`, data);
  return response.data.data;
};

export const deleteArticle = async (id: string) => {
  await api.delete(`/api/admin/articles/${id}`);
};

export const convertHtmlToMarkdown = async (html: string) => {
  const response = await api.post<ApiResponse<string>>('/api/admin/articles/convert-html', { html });
  return response.data.data;
};
