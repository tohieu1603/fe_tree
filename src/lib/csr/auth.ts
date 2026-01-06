/**
 * CSR API functions for Auth (Admin)
 * Dùng axios với JWT token stored in localStorage
 */

import api from './api';
import type { ApiResponse } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const login = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', data);
  const { token, user } = response.data.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/admin/login';
};

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getToken();
