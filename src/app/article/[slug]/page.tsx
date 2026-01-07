'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Article, Category, ApiResponse, PageResponse } from '@/types';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import NavigationBar from '@/components/home/NavigationBar';
import FooterSection from '@/components/home/FooterSection';
import ArticleContent from '@/components/public/ArticleContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { settings } = useSiteSettings();

  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      // Fetch article
      const articleRes = await fetch(`${API_URL}/api/public/articles/${slug}`);
      if (articleRes.ok) {
        const articleData: ApiResponse<Article> = await articleRes.json();
        setArticle(articleData.data);

        // Fetch related articles
        if (articleData.data.category?.id) {
          const relRes = await fetch(`${API_URL}/api/public/categories/${articleData.data.category.id}/articles?size=5`);
          if (relRes.ok) {
            const relData: ApiResponse<PageResponse<Article>> = await relRes.json();
            setRelatedArticles(relData.data.content.filter(a => a.id !== articleData.data.id).slice(0, 3));
          }
        }
      }

      // Fetch categories
      const catsRes = await fetch(`${API_URL}/api/public/categories`);
      if (catsRes.ok) {
        const catsData: ApiResponse<Category[]> = await catsRes.json();
        setCategories(catsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div
          className="w-8 h-8 border-2 border-t-transparent animate-spin"
          style={{
            borderColor: 'var(--color-primary)',
            borderTopColor: 'transparent',
            borderRadius: 'var(--radius-full)'
          }}
        />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
        <NavigationBar categories={categories} />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1
            className="text-3xl mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
          >
            Không tìm thấy bài viết
          </h1>
          <Link
            href="/articles"
            className="px-8 py-3 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-light)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            Xem tất cả bài viết
          </Link>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Navigation */}
      <NavigationBar categories={categories} />

      {/* Article Header - Editorial Style */}
      <header className="pt-24 md:pt-32 pb-12 md:pb-16" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase mb-8">
            <Link
              href="/"
              className="transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-secondary)' }}
            >
              Trang chủ
            </Link>
            <span style={{ color: 'var(--color-secondary)', opacity: 0.5 }}>/</span>
            <Link
              href="/articles"
              className="transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-secondary)' }}
            >
              Bài viết
            </Link>
            {article.category && (
              <>
                <span style={{ color: 'var(--color-secondary)', opacity: 0.5 }}>/</span>
                <Link
                  href={`/category/${article.category.slug}`}
                  className="transition-opacity hover:opacity-60"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {article.category.name}
                </Link>
              </>
            )}
          </nav>

          {/* Category Badge */}
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase mb-6 transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--bg-dark)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {article.category.name}
            </Link>
          )}

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.15] mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
          >
            {article.title}
          </h1>

          {/* Meta Info */}
          <div
            className="flex flex-wrap items-center gap-6 text-[11px] tracking-[0.05em]"
            style={{ color: 'var(--color-secondary)' }}
          >
            {article.author && (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--bg-dark)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <span className="text-[10px] font-medium uppercase">
                    {article.author.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
                <span>{article.author.fullName}</span>
              </div>
            )}
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {formatDate(article.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {article.readingTime || 5} phút đọc
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {(article.viewCount || 0).toLocaleString()} lượt xem
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image - Full Width */}
      {article.featuredImage && (
        <div className="w-full max-w-6xl mx-auto px-6 mb-12 md:mb-16">
          <div
            className="relative aspect-[21/9] overflow-hidden"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {article.featuredImageCaption && (
            <p
              className="text-center text-[11px] mt-4 italic"
              style={{ color: 'var(--color-secondary)' }}
            >
              {article.featuredImageCaption}
            </p>
          )}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Summary/Excerpt */}
            {article.summary && (
              <div
                className="mb-10 pb-10 border-b"
                style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
              >
                <p
                  className="text-xl md:text-2xl leading-relaxed"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
                >
                  {article.summary}
                </p>
              </div>
            )}

            {/* Article Content */}
            <div className="article-content">
              <ArticleContent content={article.content} />
            </div>

            {/* Tags */}
            {article.tags && (
              <div
                className="flex flex-wrap gap-2 mt-12 pt-10 border-t"
                style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
              >
                <span
                  className="text-[10px] tracking-[0.15em] uppercase mr-2"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  Tags:
                </span>
                {article.tags.split(',').map((tag, i) =>
                  tag.trim() && (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-[10px] tracking-[0.05em] transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--bg-light))',
                        color: 'var(--text-dark)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      {tag.trim()}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Source */}
            {article.sourceUrl && (
              <div
                className="mt-6 text-[11px]"
                style={{ color: 'var(--color-secondary)' }}
              >
                Nguồn:{' '}
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {article.sourceUrl}
                </a>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Share Section */}
              <div
                className="p-6"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--bg-light))',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <h3
                  className="text-[11px] tracking-[0.2em] uppercase mb-5"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  Chia sẻ bài viết
                </h3>
                <div className="flex gap-3">
                  <button
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-80 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--bg-dark)',
                      color: 'var(--text-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-80 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--bg-dark)',
                      color: 'var(--text-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-80 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--bg-dark)',
                      color: 'var(--text-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`, '_blank')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-80 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--bg-dark)',
                      color: 'var(--text-light)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Đã sao chép link!');
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Author Card */}
              {article.author && (
                <div
                  className="p-6"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--bg-light))',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <h3
                    className="text-[11px] tracking-[0.2em] uppercase mb-5"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Tác giả
                  </h3>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--bg-dark)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      <span className="text-lg font-medium uppercase">
                        {article.author.fullName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-medium"
                        style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
                      >
                        {article.author.fullName}
                      </p>
                      {article.author.email && (
                        <p className="text-[11px]" style={{ color: 'var(--color-secondary)' }}>
                          {article.author.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Articles in Sidebar */}
              {relatedArticles.length > 0 && (
                <div>
                  <h3
                    className="text-[11px] tracking-[0.2em] uppercase mb-5"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Bài viết liên quan
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relArticle) => (
                      <Link
                        key={relArticle.id}
                        href={`/article/${relArticle.slug}`}
                        className="group flex gap-4"
                      >
                        <div
                          className="relative w-20 h-20 flex-shrink-0 overflow-hidden"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--bg-light))',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          {relArticle.featuredImage ? (
                            <Image
                              src={relArticle.featuredImage}
                              alt={relArticle.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span style={{ color: 'var(--color-primary)', opacity: 0.3 }} className="text-2xl">
                                B
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2"
                            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-dark)' }}
                          >
                            {relArticle.title}
                          </h4>
                          <p
                            className="text-[10px] mt-1.5"
                            style={{ color: 'var(--color-secondary)' }}
                          >
                            {formatDate(relArticle.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* More Articles Section */}
      {relatedArticles.length > 0 && (
        <section
          className="py-20 md:py-28"
          style={{ backgroundColor: 'var(--bg-dark)' }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-4"
                style={{ color: 'var(--color-primary)' }}
              >
                Khám phá thêm
              </p>
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-light)' }}
              >
                Đọc Tiếp
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relArticle) => (
                <Link
                  key={relArticle.id}
                  href={`/article/${relArticle.slug}`}
                  className="group"
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden mb-5"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    {relArticle.featuredImage ? (
                      <Image
                        src={relArticle.featuredImage}
                        alt={relArticle.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, var(--bg-dark))' }}
                      >
                        <span style={{ color: 'var(--color-primary)', opacity: 0.3 }} className="text-5xl font-light">
                          B
                        </span>
                      </div>
                    )}
                  </div>
                  {relArticle.category && (
                    <span
                      className="text-[9px] tracking-[0.2em] uppercase"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {relArticle.category.name}
                    </span>
                  )}
                  <h3
                    className="text-lg mt-2 leading-snug line-clamp-2 group-hover:underline underline-offset-4"
                    style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-light)' }}
                  >
                    {relArticle.title}
                  </h3>
                  <p
                    className="text-[11px] mt-3"
                    style={{ color: 'color-mix(in srgb, var(--text-light) 50%, transparent)' }}
                  >
                    {formatDate(relArticle.createdAt)}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/articles"
                className="inline-block px-8 py-3 text-[11px] tracking-[0.2em] uppercase border transition-all duration-300 hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-[var(--bg-dark)]"
                style={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Xem tất cả bài viết
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <FooterSection />

      {/* Article Content Styles */}
      <style jsx global>{`
        .article-content {
          font-family: var(--font-body);
          color: var(--text-dark);
          font-size: 1.0625rem;
          line-height: 1.85;
        }
        .article-content p {
          margin-bottom: 1.75em;
        }
        .article-content h2 {
          font-family: var(--font-heading);
          font-size: 1.875rem;
          font-weight: 400;
          margin-top: 2.5em;
          margin-bottom: 0.75em;
          color: var(--text-dark);
        }
        .article-content h3 {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 400;
          margin-top: 2em;
          margin-bottom: 0.5em;
          color: var(--text-dark);
        }
        .article-content h4 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 500;
          margin-top: 1.75em;
          margin-bottom: 0.5em;
          color: var(--text-dark);
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.75em;
          padding-left: 1.75em;
        }
        .article-content li {
          margin-bottom: 0.75em;
        }
        .article-content blockquote {
          border-left: 3px solid var(--color-primary);
          padding: 1.5em 0 1.5em 2em;
          margin: 2.5em 0;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-style: italic;
          color: var(--text-dark);
          background: color-mix(in srgb, var(--color-primary) 5%, var(--bg-light));
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          margin: 2.5em 0;
          border-radius: var(--radius-md);
        }
        .article-content figure {
          margin: 2.5em 0;
        }
        .article-content figcaption {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-secondary);
          margin-top: 0.75em;
          font-style: italic;
        }
        .article-content a {
          color: var(--color-primary);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s;
        }
        .article-content a:hover {
          opacity: 0.7;
        }
        .article-content pre {
          background: var(--bg-dark);
          color: var(--text-light);
          padding: 1.5em;
          border-radius: var(--radius-md);
          overflow-x: auto;
          margin: 2em 0;
        }
        .article-content code {
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 0.9em;
        }
        .article-content :not(pre) > code {
          background: color-mix(in srgb, var(--color-primary) 10%, var(--bg-light));
          padding: 0.2em 0.4em;
          border-radius: var(--radius-xs);
        }
        .article-content hr {
          border: none;
          height: 1px;
          background: color-mix(in srgb, var(--color-primary) 20%, transparent);
          margin: 3em 0;
        }
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2em 0;
        }
        .article-content th,
        .article-content td {
          border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
          padding: 0.75em 1em;
          text-align: left;
        }
        .article-content th {
          background: color-mix(in srgb, var(--color-primary) 10%, var(--bg-light));
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
