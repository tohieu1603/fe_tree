'use client';

import Link from 'next/link';
import type { Category } from '@/types';

interface FooterProps {
  categories?: Category[];
}

export default function Footer({ categories = [] }: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold text-gray-900">Tree</Link>
            <p className="text-gray-600 text-sm mt-3">
              Blog chia se kien thuc va kinh nghiem
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Lien ket</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900">Trang chu</Link></li>
              <li><Link href="/articles" className="text-gray-600 hover:text-gray-900">Bai viet</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900">Gioi thieu</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Lien he</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Danh muc</h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-gray-600 hover:text-gray-900">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Lien he</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: contact@tree.com</li>
              <li>Phone: 1900-xxxx</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Tree. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
