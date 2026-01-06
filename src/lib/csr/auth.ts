/**
 * CSR API functions for Auth (Admin)
 * Dùng axios với JWT token
 */

import api from './api';
import Cookies from 'js-cookie';
import type { ApiResponse } from '@/types';

const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';

// Get root domain for cookie sharing between subdomains (e.g., tramducviet.com and api.tramducviet.com)
const getRootDomain = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const hostname = window.location.hostname;
  if (hostname === 'localhost') return undefined;
  // Extract root domain (e.g., "tramducviet.com" from "www.tramducviet.com")
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    return '.' + parts.slice(-2).join('.');
  }
  return undefined;
};

const cookieOptions: Cookies.CookieAttributes = {
  expires: 1,
  secure: isProduction,
  sameSite: 'lax',
  domain: getRootDomain(),
};

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

  Cookies.set('token', token, cookieOptions);
  Cookies.set('user', JSON.stringify(user), cookieOptions);

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
