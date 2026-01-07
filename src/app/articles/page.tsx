'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article, Category, ApiResponse, PageResponse } from '@/types';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import NavigationBar from '@/components/home/NavigationBar';
import FooterSection from '@/components/home/FooterSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Article Card - Gucci style
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden mb-4" style={{ backgroundColor: 'var(--bg-light)' }}>
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--bg-light))' }}
          >
            <span style={{ color: 'var(--color-primary)', opacity: 0.3 }} className="text-6xl font-light">
              B
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        {article.category && (
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: 'var(--color-secondary)' }}
          >
            {article.category.name}
          </p>
        )}
        <h3
          className="text-base md:text-lg leading-snug line-clamp-2 mb-2 group-hover:underline underline-offset-4"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
        >
          {article.title}
        </h3>
        <p
          className="text-sm line-clamp-2 mb-3"
          style={{ color: 'color-mix(in srgb, var(--text-dark) 60%, transparent)' }}
        >
          {article.summary || article.content?.substring(0, 120)}
        </p>
        <div
          className="flex items-center gap-3 text-[11px]"
          style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
        >
          <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
          <span>•</span>
          <span>{article.readingTime || 5} phút đọc</span>
        </div>
      </div>
    </Link>
  );
}

export default function ArticlesPage() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch categories
      const catsRes = await fetch(`${API_URL}/api/public/categories`);
      if (catsRes.ok) {
        const catsData: ApiResponse<Category[]> = await catsRes.json();
        setCategories(catsData.data);
      }

      // Fetch articles
      let url = `${API_URL}/api/public/articles?page=${page}&size=12`;
      if (selectedCategory) {
        url = `${API_URL}/api/public/categories/${selectedCategory}/articles?page=${page}&size=12`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const pageData: PageResponse<Article> = data.data;
        setArticles(pageData.content || []);
        setTotalPages(pageData.totalPages);
        setTotalElements(pageData.totalElements);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get article categories only
  const articleCategories = categories.filter(c => c.sortOrder < 10);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div
          className="w-6 h-6 border border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Navigation */}
      <NavigationBar categories={categories} />

      {/* Hero Section */}
      <section
        className="relative h-[50vh] md:h-[60vh] flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-dark)' }}
      >
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&q=80"
            alt="Articles"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: 'color-mix(in srgb, var(--text-light) 60%, transparent)' }}
          >
            {settings.siteName || 'DUC VIET'}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-light)' }}
          >
            Câu Chuyện
          </h1>
          <p
            className="mt-4 text-sm md:text-base max-w-xl mx-auto"
            style={{ color: 'color-mix(in srgb, var(--text-light) 70%, transparent)' }}
          >
            Khám phá những câu chuyện, kiến thức và cảm hứng về trầm hương
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <nav
        className="border-b sticky top-16 md:top-20 z-40"
        style={{
          backgroundColor: 'var(--bg-light)',
          borderColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)'
        }}
      >
        <div className="px-4 md:px-10 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-6 md:gap-8 h-12 min-w-max">
            <button
              onClick={() => { setSelectedCategory(null); setPage(0); }}
              className={`text-[11px] tracking-[0.05em] uppercase whitespace-nowrap transition-colors py-3 border-b-2 -mb-[1px]`}
              style={{
                color: !selectedCategory ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 60%, transparent)',
                borderColor: !selectedCategory ? 'var(--text-dark)' : 'transparent',
                fontWeight: !selectedCategory ? 500 : 400,
              }}
            >
              Tất cả
            </button>
            {articleCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(0); }}
                className={`text-[11px] tracking-[0.05em] uppercase whitespace-nowrap transition-colors py-3 border-b-2 -mb-[1px]`}
                style={{
                  color: selectedCategory === cat.slug ? 'var(--text-dark)' : 'color-mix(in srgb, var(--text-dark) 60%, transparent)',
                  borderColor: selectedCategory === cat.slug ? 'var(--text-dark)' : 'transparent',
                  fontWeight: selectedCategory === cat.slug ? 500 : 400,
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Articles Count */}
      <div className="px-4 md:px-10 py-6">
        <p
          className="text-[11px] tracking-[0.1em]"
          style={{ color: 'color-mix(in srgb, var(--text-dark) 50%, transparent)' }}
        >
          {totalElements} bài viết
        </p>
      </div>

      {/* Articles Grid */}
      <main className="px-4 md:px-8 lg:px-12 pb-16">
        {articles.length === 0 ? (
          <div className="text-center py-24">
            <p
              className="text-sm mb-4"
              style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
            >
              Không có bài viết nào
            </p>
            <Link
              href="/"
              className="text-[12px] tracking-wider uppercase underline underline-offset-4 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--text-dark)' }}
            >
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`text-[11px] tracking-[0.15em] uppercase transition-opacity ${
                      page === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-50'
                    }`}
                    style={{ color: 'var(--text-dark)' }}
                  >
                    ← Trước
                  </button>
                  <span
                    className="text-[11px]"
                    style={{ color: 'color-mix(in srgb, var(--text-dark) 40%, transparent)' }}
                  >
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className={`text-[11px] tracking-[0.15em] uppercase transition-opacity ${
                      page >= totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-50'
                    }`}
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Sau →
                  </button>
                </div>
                <p
                  className="text-[10px]"
                  style={{ color: 'color-mix(in srgb, var(--text-dark) 30%, transparent)' }}
                >
                  {articles.length} / {totalElements} bài viết
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <FooterSection />

      {/* CSS */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
