import Link from 'next/link';
import Image from 'next/image';
import { Product, Category, ApiResponse } from '@/types';
import Navbar from '@/components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/products?size=50`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.content || data.data || [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    return data.data.filter(cat => cat.sortOrder >= 10);
  } catch {
    return [];
  }
}

function formatPrice(price?: number): string {
  if (!price) return 'Lien he';
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
}

function calculateDiscount(price?: number, originalPrice?: number): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export const metadata = {
  title: 'San Pham | Tree - Tuong go nghe thuat',
  description: 'Kham pha bo suu tap tuong go dieu khac thu cong - Tuong Phat, Tuong Di Lac, Tuong Tam Da va nhieu tac pham nghe thuat khac',
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar categories={categories} />

      {/* Hero Banner */}
      <section className="relative h-[280px] bg-stone-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 to-stone-800/70" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1609167830220-7164aa360951?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <nav className="text-sm text-stone-400 mb-4 pt-16">
            <Link href="/" className="hover:text-white transition">Trang chu</Link>
            <span className="mx-2">/</span>
            <span className="text-white">San pham</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Bo Suu Tap Tuong Go</h1>
          <p className="text-stone-300 max-w-xl">
            Kham pha cac tac pham tuong go dieu khac thu cong, mang dam ban sac van hoa Viet Nam
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-stone-200 p-5 sticky top-20">
              <h3 className="font-semibold text-stone-800 mb-4">Danh Muc San Pham</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50 text-amber-700 font-medium"
                  >
                    <span>Tat ca san pham</span>
                    <span className="text-sm bg-amber-100 px-2 py-0.5 rounded">{products.length}</span>
                  </Link>
                </li>
                {categories.map((cat) => {
                  const count = products.filter(p => p.category?.id === cat.id).length;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition"
                      >
                        <span>{cat.name}</span>
                        <span className="text-sm text-stone-400">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Price Range */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <h3 className="font-semibold text-stone-800 mb-4">Khoang Gia</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <button className="w-full text-left py-2 px-3 rounded-lg text-stone-600 hover:bg-stone-50 transition">
                      Duoi 5 trieu
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left py-2 px-3 rounded-lg text-stone-600 hover:bg-stone-50 transition">
                      5 - 10 trieu
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left py-2 px-3 rounded-lg text-stone-600 hover:bg-stone-50 transition">
                      10 - 20 trieu
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left py-2 px-3 rounded-lg text-stone-600 hover:bg-stone-50 transition">
                      Tren 20 trieu
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Box */}
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="bg-amber-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-stone-600 mb-2">Can tu van?</p>
                  <a
                    href="tel:0123456789"
                    className="block w-full py-2 bg-amber-700 text-white font-medium rounded-lg hover:bg-amber-800 transition"
                  >
                    0123 456 789
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-stone-200 p-4">
              <p className="text-stone-600">
                Hien thi <span className="font-semibold text-stone-800">{products.length}</span> san pham
              </p>
              <div className="flex items-center gap-4">
                <select className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Moi nhat</option>
                  <option>Gia: Thap den cao</option>
                  <option>Gia: Cao den thap</option>
                  <option>Ten: A-Z</option>
                </select>
                <div className="hidden md:flex items-center gap-1 border border-stone-300 rounded-lg p-1">
                  <button className="p-1.5 rounded bg-amber-100 text-amber-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-1.5 rounded text-stone-400 hover:text-stone-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-stone-200">
                <svg className="w-16 h-16 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-stone-500">Chua co san pham nao</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => {
                  const discount = calculateDiscount(product.price, product.originalPrice);
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-lg hover:border-stone-300 transition-all duration-300"
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-stone-100 overflow-hidden">
                        {product.featuredImage ? (
                          <Image
                            src={product.featuredImage}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {discount && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{discount}%
                          </span>
                        )}
                        {/* Quick view overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-stone-800 text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                            Xem chi tiet
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        {product.category && (
                          <span className="text-xs text-amber-700 uppercase tracking-wide">{product.category.name}</span>
                        )}
                        <h3 className="font-medium text-stone-800 group-hover:text-amber-700 transition mt-1 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-lg font-bold text-amber-700">{formatPrice(product.price)}</span>
                          {product.originalPrice && product.originalPrice > (product.price || 0) && (
                            <span className="text-sm text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        {/* Material badge */}
                        {product.material && (
                          <div className="mt-2">
                            <span className="inline-block text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                              {product.material}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {products.length >= 12 && (
              <div className="mt-8 text-center">
                <button className="px-8 py-3 border-2 border-amber-700 text-amber-700 font-semibold rounded-lg hover:bg-amber-700 hover:text-white transition">
                  Xem them san pham
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Tree</h3>
              <p className="text-sm text-stone-400 leading-relaxed">
                Chuyen cung cap tuong go dieu khac thu cong, mang dam ban sac van hoa Viet.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">San Pham</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="text-stone-400 hover:text-white transition">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Thong Tin</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li><Link href="/about" className="hover:text-white transition">Gioi thieu</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Tin tuc</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Lien he</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Lien He</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>123 Duong ABC, Quan 1, TP.HCM</li>
                <li><a href="tel:0123456789" className="hover:text-white transition">0123 456 789</a></li>
                <li><a href="mailto:info@tree.vn" className="hover:text-white transition">info@tree.vn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-700">
          <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-stone-500">
            © 2025 Tree. Dieu khac tuong go thu cong.
          </div>
        </div>
      </footer>
    </div>
  );
}
