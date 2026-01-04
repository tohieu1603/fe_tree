/**
 * Utility functions - Dùng chung cho SSR và CSR
 */

export function formatPrice(price?: number): string {
  if (!price) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function formatPriceShort(price?: number): string {
  if (!price) return 'Liên hệ';
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

export function calculateDiscount(price?: number, originalPrice?: number): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatDate(date?: string | Date): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date?: string | Date): string {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
