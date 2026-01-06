import api from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', { email, password });
  const { token, user } = response.data.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return response.data.data;
};

export const register = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', { email, password, fullName });
  const { token, user } = response.data.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};
