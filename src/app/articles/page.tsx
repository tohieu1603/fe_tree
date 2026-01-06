import Link from 'next/link';
import Image from 'next/image';
import { Article, Category, ApiResponse, PageResponse } from '@/types';
import { Navbar, Footer } from '@/components/public';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getArticles(page = 0, search = ''): Promise<PageResponse<Article> | null> {
  try {
    let url = `${API_URL}/api/public/articles?page=${page}&size=12`;
    if (search) {
      url = `${API_URL}/api/public/articles/search?keyword=${encodeURIComponent(search)}&page=${page}&size=12`;
    }
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/public/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: ApiResponse<Category[]> = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Bài Viết',
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '0');
  const search = params.search || '';
  const [data, categories] = await Promise.all([getArticles(page, search), getCategories()]);
  const articles = data?.content || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {search ? `Tim kiem: "${search}"` : 'Tat ca bai viet'}
        </h1>
        <p className="text-gray-600 mb-8">
          {data?.totalElements || 0} bai viet
        </p>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/articles"
              className={`px-3 py-1.5 text-sm rounded-lg border ${!search ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
            >
              Tat ca
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:border-gray-400"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Khong tim thay bai viet nao</p>
            <Link href="/" className="text-gray-900 hover:underline">← Quay ve trang chu</Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/article/${article.slug}`} className="block">
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    {article.category && (
                      <span className="text-sm text-gray-500">{article.category.name}</span>
                    )}
                    <h2 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-gray-600 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {article.summary || article.content.substring(0, 120)}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                      <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>{article.readingTime || 5} phut doc</span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {page > 0 && (
                  <Link
                    href={`/articles?page=${page - 1}${search ? `&search=${search}` : ''}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    ← Truoc
                  </Link>
                )}
                <span className="px-4 py-2 text-gray-600">
                  Trang {page + 1} / {data.totalPages}
                </span>
                {page < data.totalPages - 1 && (
                  <Link
                    href={`/articles?page=${page + 1}${search ? `&search=${search}` : ''}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Sau →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
