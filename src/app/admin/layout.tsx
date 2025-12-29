'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ThemeProvider>
      {pathname === '/admin/login' ? children : <AdminLayout>{children}</AdminLayout>}
    </ThemeProvider>
  );
}
