'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

interface ArticleShowcaseProps {
  articles: Article[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticleShowcase({ articles }: ArticleShowcaseProps) {
  if (articles.length === 0) return null;

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 4);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] uppercase text-amber-700 block mb-4">
            Kiến Thức
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight">
            Bài Viết Mới
          </h2>
          <div className="w-16 h-px bg-amber-600 mx-auto mt-8" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Article */}
          <Link href={`/article/${featuredArticle.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 mb-6">
              {featuredArticle.featuredImage ? (
                <Image
                  src={getImageUrl(featuredArticle.featuredImage)}
                  alt={featuredArticle.title}
                  unoptimized
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                  <span className="text-6xl opacity-20">✦</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-amber-700 tracking-[0.15em] uppercase">
                  {featuredArticle.category?.name || 'Kiến Thức'}
                </span>
                <span className="text-stone-300">—</span>
                <span className="text-stone-400">{formatDate(featuredArticle.createdAt)}</span>
              </div>
              <h3 className="text-2xl font-light text-stone-900 group-hover:text-amber-700 transition-colors leading-tight">
                {featuredArticle.title}
              </h3>
              {featuredArticle.summary && (
                <p className="text-stone-500 line-clamp-2">{featuredArticle.summary}</p>
              )}
            </div>
          </Link>

          {/* Grid Articles */}
          <div className="space-y-6">
            {gridArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group flex gap-6"
              >
                <div className="relative w-32 md:w-40 aspect-square overflow-hidden bg-stone-100 flex-shrink-0">
                  {article.featuredImage ? (
                    <Image
                      src={getImageUrl(article.featuredImage)}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
                      <span className="text-3xl opacity-20">✦</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center py-2">
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="text-amber-700 tracking-wider uppercase">
                      {article.category?.name || 'Kiến Thức'}
                    </span>
                  </div>
                  <h3 className="text-lg font-light text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <span className="text-stone-400 text-xs mt-2">
                    {formatDate(article.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <Link
            href="/articles"
            className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-stone-700 hover:text-stone-900 group"
          >
            <span className="w-12 h-px bg-stone-300 group-hover:w-20 transition-all duration-300" />
            Xem Tất Cả Bài Viết
            <span className="w-12 h-px bg-stone-300 group-hover:w-20 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
