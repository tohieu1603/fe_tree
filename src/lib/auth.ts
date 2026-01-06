import Cookies from 'js-cookie';
import api from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:';

const cookieOptions: Cookies.CookieAttributes = {
  expires: 1,
  secure: isProduction,
  sameSite: 'lax',
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
