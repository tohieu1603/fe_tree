import Cookies from 'js-cookie';
import api from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';

// Get root domain for cookie sharing between subdomains
const getRootDomain = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const hostname = window.location.hostname;
  if (hostname === 'localhost') return undefined;
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

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password });
  const { token, user } = response.data.data;

  Cookies.set('token', token, cookieOptions);
  Cookies.set('user', JSON.stringify(user), cookieOptions);

  return response.data.data;
};

export const register = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', { email, password, fullName });
  const { token, user } = response.data.data;

  Cookies.set('token', token, cookieOptions);
  Cookies.set('user', JSON.stringify(user), cookieOptions);

  return response.data.data;
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const getUser = (): User | null => {
  const userStr = Cookies.get('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('token');
};
