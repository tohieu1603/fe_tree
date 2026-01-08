import api from './api';
import type { ApiResponse, PageResponse, Article, ArticleRequest } from '@/types';

// Admin endpoints
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

// Trash endpoints
export const getTrashArticles = async (page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Article>>>(`/api/admin/articles/trash?page=${page}&size=${size}`);
  return response.data.data;
};

export const restoreArticle = async (id: string) => {
  const response = await api.post<ApiResponse<Article>>(`/api/admin/articles/${id}/restore`);
  return response.data.data;
};

export const permanentDeleteArticle = async (id: string) => {
  await api.delete(`/api/admin/articles/${id}/permanent`);
};

export const convertHtmlToMarkdown = async (html: string): Promise<string> => {
  const response = await api.post<ApiResponse<{ markdown: string }>>('/api/admin/articles/convert-html', { html });
  return response.data.data.markdown;
};

// Public endpoints
export const getPublicArticles = async (page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Article>>>(`/api/public/articles?page=${page}&size=${size}`);
  return response.data.data;
};

export const getPublicArticle = async (slug: string) => {
  const response = await api.get<ApiResponse<Article>>(`/api/public/articles/${slug}`);
  return response.data.data;
};

export const searchArticles = async (keyword: string, page = 0, size = 10) => {
  const response = await api.get<ApiResponse<PageResponse<Article>>>(`/api/public/articles/search?keyword=${keyword}&page=${page}&size=${size}`);
  return response.data.data;
};
