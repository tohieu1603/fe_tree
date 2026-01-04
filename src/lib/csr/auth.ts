/**
 * CSR API functions for Auth (Admin)
 * Dùng axios với JWT token
 */

import api from './api';
import Cookies from 'js-cookie';
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

  Cookies.set('token', token, { expires: 1 }); // 1 day
  Cookies.set('user', JSON.stringify(user), { expires: 1 });

  return response.data.data;
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  window.location.href = '/admin/login';
};

export const getToken = () => Cookies.get('token');

export const getUser = () => {
  const user = Cookies.get('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getToken();
