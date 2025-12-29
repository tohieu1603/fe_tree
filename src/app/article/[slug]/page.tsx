import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Article, Category, ApiResponse, PageResponse } from '@/types';
import { Navbar, Footer } from '@/components/public';
import ArticleContent from '@/components/public/ArticleContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/public/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data: ApiResponse<Article> = await res.json();
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

async function getRelatedArticles(categoryId?: string): Promise<Article[]> {
  if (!categoryId) return [];
  try {
    const res = await fetch(`${API_URL}/api/public/categories/${categoryId}/articles?size=5`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiResponse<PageResponse<Article>> = await res.json();
    return data.data.content;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Khong tim thay bai viet' };

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary,
    keywords: article.metaKeywords,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.summary,
      type: 'article',
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, categories] = await Promise.all([getArticle(slug), getCategories()]);

  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(article.category?.id);
  const filteredRelated = relatedArticles.filter((a) => a.id !== article.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar categories={categories} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-900">Trang chu</Link>
          <span className="mx-2">/</span>
          {article.category && (
            <>
              <Link href={`/category/${article.category.slug}`} className="hover:text-gray-900">
                {article.category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-gray-400">Bai viet</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {/* Category */}
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="inline-block text-sm text-blue-600 hover:underline mb-3"
            >
              {article.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {article.author && (
              <span>{article.author.fullName}</span>
            )}
            <span>{formatDate(article.createdAt)}</span>
            <span>{(article.viewCount || 0).toLocaleString()} luot xem</span>
            <span>{article.readingTime || 5} phut doc</span>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <figure className="mb-8">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {article.featuredImageAlt && (
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {article.featuredImageAlt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Summary */}
        {article.summary && (
          <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-8">
            <p className="text-gray-700 italic">{article.summary}</p>
          </div>
        )}

        {/* Article Content */}
        <ArticleContent content={article.content} />

        {/* Tags */}
        {article.tags && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
            {article.tags.split(',').map((tag, i) =>
              tag.trim() && (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                  {tag.trim()}
                </span>
              )
            )}
          </div>
        )}

        {/* Source */}
        {article.sourceUrl && (
          <div className="mt-4 text-sm text-gray-500">
            Nguon:{' '}
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {article.sourceUrl}
            </a>
          </div>
        )}

        {/* Share */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t">
          <span className="text-gray-600 text-sm">Chia se:</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded hover:bg-gray-800">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Related Articles */}
        {filteredRelated.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Bai viet lien quan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRelated.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/article/${relatedArticle.slug}`}
                  className="group flex gap-4"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    {relatedArticle.featuredImage ? (
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(relatedArticle.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}
