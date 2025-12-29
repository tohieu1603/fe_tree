'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';

interface TOCItem {
  id: string;
  text: string;
  level: number;
  number: string;
}

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Extract headings and generate numbered TOC
  const toc = useMemo(() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;
    let h2Count = 0;
    let h3Count = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      let number = '';
      if (level === 2) {
        h2Count++;
        h3Count = 0;
        number = `${h2Count}`;
      } else if (level === 3) {
        h3Count++;
        number = `${h2Count}.${h3Count}`;
      }

      items.push({ id, text, level, number });
    }

    return items;
  }, [content]);

  return (
    <div>
      {/* Table of Contents - inline trong bai viet */}
      {toc.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
          <h2 className="font-bold text-gray-900 mb-3">Muc luc</h2>
          <nav className="space-y-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-gray-600 hover:text-blue-600 ${
                  item.level === 3 ? 'pl-6 text-sm' : ''
                }`}
              >
                <span className="text-gray-400 mr-2">{item.number}.</span>
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-gray max-w-none
        prose-headings:font-bold prose-headings:text-gray-900
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:pt-4 prose-h2:border-t prose-h2:border-gray-100
        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-gray-700 prose-p:leading-7 prose-p:mb-4
        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-lg prose-img:my-6
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-600
        prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-li:text-gray-700
        prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-gray-800
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg
        prose-strong:text-gray-900
        prose-hr:my-8 prose-hr:border-gray-200
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug]}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
