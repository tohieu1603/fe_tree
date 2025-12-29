'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import TurndownService from 'turndown';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: number;
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'] as unknown as (keyof HTMLElementTagNameMap)[],
  replacement: (content) => `~~${content}~~`,
});

export default function MarkdownEditor({ value = '', onChange, height = 500 }: MarkdownEditorProps) {
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const html = e.clipboardData.getData('text/html');
      if (html && html.trim()) {
        e.preventDefault();
        const markdown = turndownService.turndown(html);
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const newValue = value.substring(0, start) + markdown + value.substring(end);
        onChange?.(newValue);
      }
    },
    [value, onChange]
  );

  return (
    <div data-color-mode="light" onPaste={handlePaste}>
      <MDEditor
        value={value}
        onChange={(val) => onChange?.(val || '')}
        height={height}
        preview="live"
        visibleDragbar={false}
      />
    </div>
  );
}
