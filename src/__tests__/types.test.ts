import type { Article, Category, ApiResponse, PageResponse } from '@/types';

describe('Type Definitions', () => {
  it('Article type has correct structure', () => {
    const article: Article = {
      id: '1',
      title: 'Test Article',
      slug: 'test-article',
      content: '# Hello',
      status: 'PUBLISHED',
      viewCount: 10,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    expect(article.id).toBe('1');
    expect(article.status).toBe('PUBLISHED');
  });

  it('Category type has correct structure', () => {
    const category: Category = {
      id: '1',
      name: 'Tech',
      slug: 'tech',
      sortOrder: 1,
      active: true,
      articleCount: 5,
      createdAt: '2024-01-01',
    };

    expect(category.name).toBe('Tech');
    expect(category.active).toBe(true);
  });

  it('ApiResponse type wraps data correctly', () => {
    const response: ApiResponse<string> = {
      success: true,
      message: 'OK',
      data: 'test data',
    };

    expect(response.success).toBe(true);
    expect(response.data).toBe('test data');
  });

  it('PageResponse type has pagination fields', () => {
    const page: PageResponse<Article> = {
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };

    expect(page.first).toBe(true);
    expect(page.totalPages).toBe(0);
  });
});
