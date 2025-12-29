'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { Category } from '@/types';

interface NavbarProps {
  categories?: Category[];
}

export default function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/articles?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navItems = [
    { href: '/', label: 'Trang chu' },
    { href: '/articles', label: 'Bai viet' },
    { href: '/about', label: 'Gioi thieu' },
    { href: '/contact', label: 'Lien he' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Tree
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {categories.length > 0 && (
                <div className="relative group">
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Danh muc
                  </button>
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </nav>

            {/* Search & Mobile Menu */}
            <div className="flex items-center gap-4">
              <form onSubmit={handleSearch} className="hidden sm:flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tim kiem..."
                  className="w-40 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                />
              </form>
              <Link href="/admin" className="hidden md:block text-sm text-gray-500 hover:text-gray-700">
                Admin
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-600"
              >
                <MenuOutlined className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <CloseOutlined />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg ${
                    isActive(item.href) ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-gray-600"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
