import Link from 'next/link';
import Image from 'next/image';
import { Product, Category, Article, ApiResponse, PageResponse } from '@/types';
import BannerSlideshow from '@/components/BannerSlideshow';
import Navbar from '@/components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/products?size=8`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<PageResponse<Product>> = await res.json();
    return data.data.content;
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/products/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Product[]> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    // Filter only product categories (sort_order >= 10)
    return data.data.filter(cat => cat.sortOrder >= 10);
  } catch {
    return [];
  }
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/articles?size=4`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data.content;
  } catch {
    return [];
  }
}

function formatPrice(price?: number): string {
  if (!price) return 'Lien he';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function calculateDiscount(price?: number, originalPrice?: number): number | null {
  if (!price || !originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

export const metadata = {
  title: 'Tree - Tuong go nghe thuat',
  description: 'Chuyen cung cap tuong go dieu khac thu cong, tuong Phat, tuong Di Lac, tuong phong thuy cao cap',
  openGraph: {
    title: 'Tree - Tuong go nghe thuat',
    description: 'Tuong go dieu khac thu cong, chat luong cao',
    type: 'website',
  },
};

// Category images
const categoryImages: Record<string, string> = {
  'tuong-phat': 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=400&q=80',
  'tuong-di-lac': 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&q=80',
  'tuong-tam-da': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'tuong-nghe-thuat': 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=400&q=80',
};

export default async function HomePage() {
  const [products, featuredProducts, categories, articles] = await Promise.all([
    getProducts(),
    getFeaturedProducts(),
    getCategories(),
    getArticles(),
  ]);

  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar categories={categories} />

      <BannerSlideshow />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-8 text-center">Danh Muc San Pham</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-stone-200"
                >
                  <Image
                    src={categoryImages[cat.slug] || 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=400&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-semibold text-sm md:text-base">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {displayFeatured.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800">San Pham Noi Bat</h2>
              <Link href="/products" className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                Xem tat ca →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {displayFeatured.map((product) => {
                const discount = calculateDiscount(product.price, product.originalPrice);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-md transition"
                  >
                    <div className="relative aspect-square bg-stone-100">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-medium text-stone-800 group-hover:text-amber-700 transition line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-amber-700 font-semibold text-sm md:text-base">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > (product.price || 0) && (
                          <span className="text-stone-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* About Section - Simple */}
      <section className="py-12 md:py-16 bg-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">Ve Tree</h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            Tree chuyen cung cap cac san pham tuong go dieu khac thu cong, duoc che tac boi cac nghe nhan
            lang nghe truyen thong. Moi tac pham la mot tac pham nghe thuat doc nhat, mang dam ban sac
            van hoa Viet Nam.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-stone-600">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700">10+</div>
              <div className="text-sm">Nam kinh nghiem</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700">500+</div>
              <div className="text-sm">San pham da ban</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700">100%</div>
              <div className="text-sm">Thu cong</div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products */}
      {products.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800">San Pham Moi</h2>
              <Link href="/products" className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                Xem tat ca →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const discount = calculateDiscount(product.price, product.originalPrice);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-white rounded-lg overflow-hidden border border-stone-200 hover:shadow-md transition"
                  >
                    <div className="relative aspect-square bg-stone-100">
                      {product.featuredImage ? (
                        <Image
                          src={product.featuredImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-medium text-stone-800 group-hover:text-amber-700 transition line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <span className="text-amber-700 font-semibold text-sm md:text-base">{formatPrice(product.price)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {articles.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800">Bai Viet Moi</h2>
              <Link href="/blog" className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                Xem tat ca →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group"
                >
                  <div className="relative aspect-video bg-stone-200 rounded-lg overflow-hidden mb-3">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-100">
                        <svg className="w-8 h-8 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">{formatDate(article.createdAt)}</span>
                  <h3 className="font-medium text-stone-800 group-hover:text-amber-700 transition line-clamp-2 mt-1">
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-amber-700">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Lien He Dat Hang</h2>
          <p className="text-amber-100 mb-6">
            Hotline: <a href="tel:0123456789" className="font-semibold">0123 456 789</a>
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-white text-amber-700 font-medium rounded hover:bg-amber-50 transition"
          >
            Lien he ngay
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-stone-300 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Tree</h3>
              <p className="text-sm text-stone-400">
                Tuong go dieu khac thu cong, chat luong cao.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">San Pham</h4>
              <ul className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-white transition">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">Thong Tin</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">Gioi thieu</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Lien he</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-3">Lien He</h4>
              <ul className="space-y-2 text-sm">
                <li>Hotline: 0123 456 789</li>
                <li>Email: info@tree.vn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700 mt-8 pt-6 text-center text-xs text-stone-500">
            © 2025 Tree
          </div>
        </div>
      </footer>
    </div>
  );
}
