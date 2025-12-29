'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className={`text-xl font-bold transition ${
              isScrolled ? 'text-stone-800' : 'text-white'
            }`}
          >
            Tree
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium transition ${
                isScrolled
                  ? 'text-stone-600 hover:text-stone-800'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Trang chu
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsProductsDropdownOpen(true)}
              onMouseLeave={() => setIsProductsDropdownOpen(false)}
            >
              <Link
                href="/products"
                className={`font-medium transition flex items-center gap-1 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-amber-800'
                    : 'text-white hover:text-amber-200'
                }`}
              >
                San pham
                <svg
                  className={`w-4 h-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 transition-all duration-200 ${
                  isProductsDropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <Link
                  href="/products"
                  className="block px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition font-medium border-b"
                >
                  Tat ca san pham
                </Link>
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="block px-4 py-3 text-gray-600 hover:bg-amber-50 hover:text-amber-800 transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className={`font-medium transition ${
                isScrolled
                  ? 'text-stone-600 hover:text-stone-800'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Gioi thieu
            </Link>
            <Link
              href="/blog"
              className={`font-medium transition ${
                isScrolled
                  ? 'text-stone-600 hover:text-stone-800'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition ${
                isScrolled
                  ? 'text-stone-600 hover:text-stone-800'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Lien he
            </Link>
          </nav>

          {/* Right Side - Search & Admin */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className={`p-2 rounded-full transition ${
                isScrolled
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              href="/admin"
              className={`text-sm transition ${
                isScrolled
                  ? 'text-stone-500 hover:text-stone-700'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-[500px] shadow-lg' : 'max-h-0'
        }`}
      >
        <nav className="px-4 py-4 space-y-2">
          <Link
            href="/"
            className="block py-3 text-gray-700 hover:text-amber-800 font-medium border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trang chu
          </Link>
          <Link
            href="/products"
            className="block py-3 text-gray-700 hover:text-amber-800 font-medium border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            San pham
          </Link>
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="block py-2 pl-4 text-gray-500 hover:text-amber-800 text-sm border-b"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="block py-3 text-gray-700 hover:text-amber-800 font-medium border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gioi thieu
          </Link>
          <Link
            href="/blog"
            className="block py-3 text-gray-700 hover:text-amber-800 font-medium border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="block py-3 text-gray-700 hover:text-amber-800 font-medium border-b"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lien he
          </Link>
          <Link
            href="/admin"
            className="block py-3 text-amber-800 hover:text-amber-900 font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
