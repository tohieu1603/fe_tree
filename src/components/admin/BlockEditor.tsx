'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Button, Input, Select, Space, Typography, Tooltip, Popconfirm, Card, Empty, Modal,
  InputNumber, Image, Tabs, Collapse
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined,
  CopyOutlined, HolderOutlined, FileTextOutlined, PictureOutlined,
  LinkOutlined, UploadOutlined
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '@/lib/api';

const { Text } = Typography;
const { TextArea } = Input;

// Block types
export type BlockType = 'H2' | 'H3' | 'H4' | 'PARAGRAPH' | 'LIST' | 'QUOTE' | 'CODE' | 'IMAGE';

// Image block data structure
export interface ImageBlockData {
  url: string;
  alt: string;
  caption?: string;
  backlink?: string;
  credit?: string;
  creditUrl?: string;
  width?: number;
  height?: number;
  lazyLoad?: boolean;
  srcset?: string;
  sizes?: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  anchor?: string; // Auto-generated from heading content
  imageData?: ImageBlockData; // For IMAGE blocks
}

interface BlockEditorProps {
  value?: ContentBlock[];
  onChange?: (blocks: ContentBlock[]) => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Generate anchor from text
const generateAnchor = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 100);
};

// Parse HTML content to extract images and text
const parseHtmlToBlocks = (html: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract all images first
  const images = doc.querySelectorAll('img');
  images.forEach((img) => {
    const src = img.getAttribute('src') || img.getAttribute('data-src') || '';
    if (src) {
      blocks.push({
        id: generateId(),
        type: 'IMAGE',
        content: src,
        imageData: {
          url: src,
          alt: img.getAttribute('alt') || '',
          width: img.width || undefined,
          height: img.height || undefined,
          lazyLoad: true,
        },
      });
    }
  });

  // Extract headings
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const text = heading.textContent?.trim();
    if (text) {
      const tagName = heading.tagName.toLowerCase();
      const type: BlockType = tagName === 'h1' || tagName === 'h2' ? 'H2' :
                              tagName === 'h3' ? 'H3' : 'H4';
      blocks.push({
        id: generateId(),
        type,
        content: text,
        anchor: generateAnchor(text),
      });
    }
  });

  // Extract paragraphs
  doc.querySelectorAll('p').forEach((p) => {
    const text = p.textContent?.trim();
    if (text && text.length > 0) {
      blocks.push({
        id: generateId(),
        type: 'PARAGRAPH',
        content: text,
      });
    }
  });

  // Extract list items
  doc.querySelectorAll('li').forEach((li) => {
    const text = li.textContent?.trim();
    if (text) {
      blocks.push({
        id: generateId(),
        type: 'LIST',
        content: text,
      });
    }
  });

  // Extract blockquotes
  doc.querySelectorAll('blockquote').forEach((quote) => {
    const text = quote.textContent?.trim();
    if (text) {
      blocks.push({
        id: generateId(),
        type: 'QUOTE',
        content: text,
      });
    }
  });

  return blocks;
};

// Parse pasted text into blocks - now detects image URLs and HTML
const parseTextToBlocks = (text: string): ContentBlock[] => {
  // Check if text contains HTML (has tags)
  if (/<[^>]+>/.test(text)) {
    const htmlBlocks = parseHtmlToBlocks(text);
    if (htmlBlocks.length > 0) {
      return htmlBlocks;
    }
  }

  const lines = text.split('\n').filter(line => line.trim());
  const blocks: ContentBlock[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        id: generateId(),
        type: 'PARAGRAPH',
        content: currentParagraph.join(' '),
      });
      currentParagraph = [];
    }
  };

  // Regex to detect image URLs
  const imageUrlRegex = /^(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^\s]*)?)/i;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for image URLs
    const imageMatch = trimmed.match(imageUrlRegex);
    if (imageMatch) {
      flushParagraph();
      blocks.push({
        id: generateId(),
        type: 'IMAGE',
        content: imageMatch[1],
        imageData: {
          url: imageMatch[1],
          alt: '',
          lazyLoad: true,
        },
      });
      continue;
    }

    // Check for headings (lines that are short and look like titles)
    if (trimmed.length < 100 && !trimmed.endsWith('.') && !trimmed.endsWith(',')) {
      const words = trimmed.split(' ').length;
      if (words <= 10 && /^[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ]/.test(trimmed)) {
        flushParagraph();
        const anchor = generateAnchor(trimmed);
        blocks.push({
          id: generateId(),
          type: 'H3',
          content: trimmed,
          anchor,
        });
        continue;
      }
    }

    // Check for list items
    if (/^[-•*]\s/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      flushParagraph();
      blocks.push({
        id: generateId(),
        type: 'LIST',
        content: trimmed.replace(/^[-•*\d.)]+\s*/, ''),
      });
      continue;
    }

    // Otherwise, add to current paragraph
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  return blocks;
};

// Block type options
const blockTypeOptions = [
  { value: 'H2', label: 'H2 - Heading 2' },
  { value: 'H3', label: 'H3 - Heading 3' },
  { value: 'H4', label: 'H4 - Heading 4' },
  { value: 'PARAGRAPH', label: 'PARAGRAPH' },
  { value: 'LIST', label: 'LIST' },
  { value: 'QUOTE', label: 'QUOTE' },
  { value: 'CODE', label: 'CODE' },
  { value: 'IMAGE', label: 'IMAGE' },
];

// API URL for images
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const getImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
};

// Image Block Component
function ImageBlockEditor({
  imageData,
  onChange,
}: {
  imageData: ImageBlockData;
  onChange: (data: ImageBlockData) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/admin/upload/article', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.data.url;

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        onChange({ ...imageData, url, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        onChange({ ...imageData, url });
      };
      img.src = getImageUrl(url);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleUrlChange = (url: string) => {
    onChange({ ...imageData, url });
    // Try to get dimensions from URL
    if (url) {
      const img = new window.Image();
      img.onload = () => {
        onChange({ ...imageData, url, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = getImageUrl(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* URL or Upload */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: 'url',
            label: <span><LinkOutlined /> Nhập URL</span>,
            children: (
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                prefix={<PictureOutlined className="text-gray-400" />}
              />
            ),
          },
          {
            key: 'upload',
            label: <span><UploadOutlined /> Upload ảnh</span>,
            children: (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => fileInputRef.current?.click()}
                  loading={uploading}
                >
                  Chọn file ảnh
                </Button>
              </div>
            ),
          },
        ]}
      />

      {/* Preview */}
      {imageData.url && (
        <div className="border rounded p-2 bg-gray-50">
          <Image
            src={getImageUrl(imageData.url)}
            alt={imageData.alt || 'Preview'}
            style={{ maxHeight: 200, objectFit: 'contain' }}
            preview
          />
        </div>
      )}

      {/* Alt & Caption */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Text type="secondary" className="text-xs mb-1 block">Alt text (SEO)</Text>
          <Input
            placeholder="Mô tả ảnh cho SEO..."
            value={imageData.alt}
            onChange={(e) => onChange({ ...imageData, alt: e.target.value })}
          />
        </div>
        <div>
          <Text type="secondary" className="text-xs mb-1 block">Caption (chú thích)</Text>
          <Input
            placeholder="Chú thích hiển thị dưới ảnh..."
            value={imageData.caption || ''}
            onChange={(e) => onChange({ ...imageData, caption: e.target.value })}
          />
        </div>
      </div>

      {/* Backlink */}
      <div>
        <Text type="secondary" className="text-xs mb-1 block">Backlink URL (click ảnh chuyển đến)</Text>
        <Input
          placeholder="https://..."
          value={imageData.backlink || ''}
          onChange={(e) => onChange({ ...imageData, backlink: e.target.value })}
          prefix={<LinkOutlined className="text-gray-400" />}
        />
      </div>

      {/* Credit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Text type="secondary" className="text-xs mb-1 block">Nguồn ảnh (credit)</Text>
          <Input
            placeholder="Tên nguồn..."
            value={imageData.credit || ''}
            onChange={(e) => onChange({ ...imageData, credit: e.target.value })}
          />
        </div>
        <div>
          <Text type="secondary" className="text-xs mb-1 block">URL nguồn</Text>
          <Input
            placeholder="https://..."
            value={imageData.creditUrl || ''}
            onChange={(e) => onChange({ ...imageData, creditUrl: e.target.value })}
          />
        </div>
      </div>

      {/* Dimensions & Lazy Load */}
      <div className="grid grid-cols-4 gap-3">
        <div>
          <Text type="secondary" className="text-xs mb-1 block">W (px)</Text>
          <InputNumber
            placeholder="auto"
            value={imageData.width}
            onChange={(v) => onChange({ ...imageData, width: v || undefined })}
            min={1}
            className="w-full"
          />
        </div>
        <div>
          <Text type="secondary" className="text-xs mb-1 block">H (px)</Text>
          <InputNumber
            placeholder="auto"
            value={imageData.height}
            onChange={(v) => onChange({ ...imageData, height: v || undefined })}
            min={1}
            className="w-full"
          />
        </div>
        <div className="col-span-2">
          <Text type="secondary" className="text-xs mb-1 block">Lazy load</Text>
          <Select
            value={imageData.lazyLoad !== false ? 'lazy' : 'eager'}
            onChange={(v) => onChange({ ...imageData, lazyLoad: v === 'lazy' })}
            className="w-full"
            options={[
              { value: 'lazy', label: 'Lazy load' },
              { value: 'eager', label: 'Eager (load ngay)' },
            ]}
          />
        </div>
      </div>

      {/* Srcset & Sizes */}
      <Collapse size="small" ghost>
        <Collapse.Panel header="Responsive (srcset, sizes)" key="responsive">
          <div className="space-y-3">
            <div>
              <Text type="secondary" className="text-xs mb-1 block">
                srcset (VD: img-320.jpg 320w, img-640.jpg 640w)
              </Text>
              <Input
                placeholder="srcset cho responsive images..."
                value={imageData.srcset || ''}
                onChange={(e) => onChange({ ...imageData, srcset: e.target.value })}
              />
            </div>
            <div>
              <Text type="secondary" className="text-xs mb-1 block">
                sizes (VD: (max-width: 600px) 100vw, 50vw)
              </Text>
              <Input
                placeholder="sizes attribute..."
                value={imageData.sizes || ''}
                onChange={(e) => onChange({ ...imageData, sizes: e.target.value })}
              />
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}

// Sortable Block Item Wrapper
function SortableBlockItem({
  block,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBelow,
}: {
  block: ContentBlock;
  index: number;
  total: number;
  onChange: (block: ContentBlock) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  const isHeading = ['H2', 'H3', 'H4'].includes(block.type);
  const isImage = block.type === 'IMAGE';

  const handleContentChange = (content: string) => {
    const newBlock = { ...block, content };
    if (isHeading) {
      newBlock.anchor = generateAnchor(content);
    }
    onChange(newBlock);
  };

  const handleTypeChange = (type: BlockType) => {
    const newBlock = { ...block, type };
    if (['H2', 'H3', 'H4'].includes(type)) {
      newBlock.anchor = generateAnchor(block.content);
    } else {
      delete newBlock.anchor;
    }
    if (type === 'IMAGE' && !newBlock.imageData) {
      newBlock.imageData = { url: '', alt: '', lazyLoad: true };
    }
    onChange(newBlock);
  };

  const handleImageDataChange = (imageData: ImageBlockData) => {
    onChange({ ...block, content: imageData.url, imageData });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group border rounded-lg p-3 mb-3 bg-white hover:border-blue-300 transition-colors ${isDragging ? 'shadow-lg border-blue-400' : ''}`}
    >
      {/* Block Header */}
      <div className="flex items-center gap-2 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <HolderOutlined className="text-gray-400" />
        </div>
        <div className="flex items-center gap-1">
          <Text type="secondary" className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">
            {block.type}
          </Text>
          <Text type="secondary" className="text-xs">#{index + 1}</Text>
        </div>

        {isHeading && block.anchor && (
          <Text type="secondary" className="text-xs ml-2 truncate max-w-[300px]" title={block.anchor}>
            Anchor: {block.anchor}
          </Text>
        )}

        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip title="Di chuyển lên">
            <Button
              type="text"
              size="small"
              icon={<ArrowUpOutlined />}
              disabled={index === 0}
              onClick={onMoveUp}
            />
          </Tooltip>
          <Tooltip title="Di chuyển xuống">
            <Button
              type="text"
              size="small"
              icon={<ArrowDownOutlined />}
              disabled={index === total - 1}
              onClick={onMoveDown}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa block này?"
            onConfirm={onDelete}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </div>

      {/* Block Type Selector */}
      <div className="flex gap-2 mb-2">
        <Select
          value={block.type}
          onChange={handleTypeChange}
          options={blockTypeOptions}
          size="small"
          className="w-40"
        />
      </div>

      {/* Block Content */}
      {isImage ? (
        <ImageBlockEditor
          imageData={block.imageData || { url: '', alt: '', lazyLoad: true }}
          onChange={handleImageDataChange}
        />
      ) : block.type === 'CODE' ? (
        <TextArea
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Nhập code..."
          autoSize={{ minRows: 3, maxRows: 10 }}
          className="font-mono text-sm"
        />
      ) : (
        <TextArea
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={
            isHeading ? 'Nhập tiêu đề...' :
            block.type === 'LIST' ? 'Nhập nội dung list item...' :
            block.type === 'QUOTE' ? 'Nhập trích dẫn...' :
            'Nhập nội dung...'
          }
          autoSize={{ minRows: 1, maxRows: 8 }}
          className={isHeading ? 'font-semibold' : ''}
        />
      )}

      {/* Add block below button */}
      <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="dashed"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAddBelow}
        >
          Thêm block
        </Button>
      </div>
    </div>
  );
}

// Table of Contents Component
function TableOfContents({ blocks }: { blocks: ContentBlock[] }) {
  const headings = blocks.filter(b => ['H2', 'H3', 'H4'].includes(b.type) && b.content.trim());

  if (headings.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        Chưa có heading nào. Thêm H2, H3, H4 để tạo mục lục.
      </div>
    );
  }

  return (
    <ul className="list-disc list-inside space-y-1 text-sm">
      {headings.map((block) => (
        <li
          key={block.id}
          className={`${
            block.type === 'H2' ? 'ml-0 font-medium' :
            block.type === 'H3' ? 'ml-4' :
            'ml-8 text-gray-600'
          }`}
        >
          {block.content}
        </li>
      ))}
    </ul>
  );
}

export default function BlockEditor({ value = [], onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(value);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [uploadingPastedImage, setUploadingPastedImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(blocks)) {
      setBlocks(value);
    }
  }, [value]);

  const updateBlocks = useCallback((newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  }, [onChange]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      updateBlocks(arrayMove(blocks, oldIndex, newIndex));
    }
  }, [blocks, updateBlocks]);

  const addBlock = useCallback((type: BlockType = 'PARAGRAPH', afterIndex?: number) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: '',
    };
    if (type === 'IMAGE') {
      newBlock.imageData = { url: '', alt: '', lazyLoad: true };
    }
    if (afterIndex !== undefined) {
      const newBlocks = [...blocks];
      newBlocks.splice(afterIndex + 1, 0, newBlock);
      updateBlocks(newBlocks);
    } else {
      updateBlocks([...blocks, newBlock]);
    }
  }, [blocks, updateBlocks]);

  const updateBlock = useCallback((index: number, block: ContentBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = block;
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const deleteBlock = useCallback((index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const moveBlock = useCallback((from: number, to: number) => {
    if (to < 0 || to >= blocks.length) return;
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(from, 1);
    newBlocks.splice(to, 0, removed);
    updateBlocks(newBlocks);
  }, [blocks, updateBlocks]);

  const handlePasteToBlocks = () => {
    if (!pasteText.trim()) return;
    const newBlocks = parseTextToBlocks(pasteText);
    updateBlocks([...blocks, ...newBlocks]);
    setPasteText('');
    setPasteModalOpen(false);
  };

  // Handle paste event in modal textarea to capture images from clipboard
  const handlePasteInModal = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardData = e.clipboardData;

    // Check for image files in clipboard
    const imageFiles: File[] = [];
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    // If there are image files, upload them
    if (imageFiles.length > 0) {
      e.preventDefault(); // Prevent default paste behavior
      setUploadingPastedImage(true);

      try {
        const uploadedBlocks: ContentBlock[] = [];

        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await api.post('/api/admin/upload/article', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const url = res.data.data.url;

          uploadedBlocks.push({
            id: generateId(),
            type: 'IMAGE',
            content: url,
            imageData: {
              url,
              alt: '',
              lazyLoad: true,
            },
          });
        }

        // Add uploaded images to blocks
        updateBlocks([...blocks, ...uploadedBlocks]);
        setPasteModalOpen(false);
      } catch (error) {
        console.error('Error uploading pasted image:', error);
      } finally {
        setUploadingPastedImage(false);
      }
      return;
    }

    // Check for HTML content in clipboard
    const htmlContent = clipboardData.getData('text/html');
    if (htmlContent) {
      const htmlBlocks = parseHtmlToBlocks(htmlContent);
      if (htmlBlocks.length > 0) {
        e.preventDefault();
        // Add parsed blocks
        updateBlocks([...blocks, ...htmlBlocks]);
        setPasteModalOpen(false);
        return;
      }
    }

    // Let default paste behavior handle plain text
  };

  const handleImportJson = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          updateBlocks([...blocks, ...json.map(b => ({ ...b, id: generateId() }))]);
        }
      } catch {
        // Invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportJson = () => {
    const json = JSON.stringify(blocks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-blocks.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    updateBlocks([]);
  };

  // Count stats
  const headingCount = blocks.filter(b => ['H2', 'H3', 'H4'].includes(b.type)).length;
  const imageCount = blocks.filter(b => b.type === 'IMAGE').length;
  const wordCount = blocks.reduce((acc, b) => {
    if (b.type === 'IMAGE') return acc;
    return acc + b.content.split(/\s+/).filter(Boolean).length;
  }, 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="block-editor">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addBlock('PARAGRAPH')}>
          Thêm Block
        </Button>
        <Button icon={<PictureOutlined />} onClick={() => addBlock('IMAGE')}>
          Thêm Ảnh
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <Button icon={<FileTextOutlined />} onClick={handleImportJson}>
          Import JSON
        </Button>
        <Button icon={<CopyOutlined />} onClick={handleExportJson}>
          Export JSON
        </Button>
        <Button onClick={() => setPasteModalOpen(true)}>
          Paste to Blocks
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <Text type="secondary">{blocks.length} blocks</Text>
        <Text type="secondary">H: {headingCount}</Text>
        <Text type="secondary">Img: {imageCount}</Text>

        <div className="ml-auto">
          <Popconfirm
            title="Xóa tất cả blocks?"
            onConfirm={clearAll}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="text" icon={<DeleteOutlined />}>
              Xóa tất cả
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm text-gray-500">
        <span>~{readingTime} phút đọc</span>
        <span>{wordCount} từ</span>
      </div>

      {/* Table of Contents */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <HolderOutlined /> Mục lục (tự động từ Heading)
          </span>
        }
        className="mb-4"
        size="small"
      >
        <TableOfContents blocks={blocks} />
      </Card>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <Empty
          description="Chưa có block nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addBlock('H2')}>
              Thêm Heading
            </Button>
            <Button onClick={() => addBlock('PARAGRAPH')}>
              Thêm Paragraph
            </Button>
            <Button icon={<PictureOutlined />} onClick={() => addBlock('IMAGE')}>
              Thêm Ảnh
            </Button>
            <Button onClick={() => setPasteModalOpen(true)}>
              Paste to Blocks
            </Button>
          </Space>
        </Empty>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block, index) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                index={index}
                total={blocks.length}
                onChange={(b: ContentBlock) => updateBlock(index, b)}
                onDelete={() => deleteBlock(index)}
                onMoveUp={() => moveBlock(index, index - 1)}
                onMoveDown={() => moveBlock(index, index + 1)}
                onAddBelow={() => addBlock('PARAGRAPH', index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Paste Modal */}
      <Modal
        title="Paste to Blocks"
        open={pasteModalOpen}
        onCancel={() => setPasteModalOpen(false)}
        onOk={handlePasteToBlocks}
        okText="Chuyển thành Blocks"
        cancelText="Hủy"
        width={700}
        okButtonProps={{ loading: uploadingPastedImage }}
      >
        <div className="mb-3">
          <Text type="secondary">
            Paste nội dung vào đây. Hệ thống sẽ tự động phân tích và tạo các blocks tương ứng.
            <br />
            - <strong>Copy ảnh từ web</strong>: Paste trực tiếp, ảnh sẽ được upload tự động
            <br />
            - <strong>Copy text có ảnh</strong>: HTML sẽ được phân tích, ảnh được trích xuất
            <br />
            - URL ảnh (jpg, png, gif, webp) sẽ tạo IMAGE block
            <br />
            - Các dòng ngắn viết hoa sẽ được nhận diện là heading
            <br />
            - Dòng bắt đầu bằng - hoặc số sẽ là list
          </Text>
        </div>
        {uploadingPastedImage && (
          <div className="mb-3 p-3 bg-blue-50 rounded text-blue-700 text-center">
            Đang upload ảnh từ clipboard...
          </div>
        )}
        <TextArea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          onPaste={handlePasteInModal}
          placeholder="Paste nội dung tại đây (Ctrl+V hoặc Cmd+V)..."
          rows={15}
          disabled={uploadingPastedImage}
        />
      </Modal>
    </div>
  );
}

// Export blocks to markdown
export function blocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'H2':
        return `## ${block.content}`;
      case 'H3':
        return `### ${block.content}`;
      case 'H4':
        return `#### ${block.content}`;
      case 'LIST':
        return `- ${block.content}`;
      case 'QUOTE':
        return `> ${block.content}`;
      case 'CODE':
        return `\`\`\`\n${block.content}\n\`\`\``;
      case 'IMAGE':
        const img = block.imageData;
        if (img) {
          let md = `![${img.alt || ''}](${img.url})`;
          if (img.caption) md += `\n*${img.caption}*`;
          return md;
        }
        return `![](${block.content})`;
      default:
        return block.content;
    }
  }).join('\n\n');
}

// Parse markdown to blocks
export function markdownToBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.split('\n');
  const blocks: ContentBlock[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        id: generateId(),
        type: 'PARAGRAPH',
        content: currentParagraph.join(' '),
      });
      currentParagraph = [];
    }
  };

  // Regex for markdown images
  const imageRegex = /^!\[(.*?)\]\((.*?)\)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // Images
    const imageMatch = trimmed.match(imageRegex);
    if (imageMatch) {
      flushParagraph();
      blocks.push({
        id: generateId(),
        type: 'IMAGE',
        content: imageMatch[2],
        imageData: {
          url: imageMatch[2],
          alt: imageMatch[1],
          lazyLoad: true,
        },
      });
      continue;
    }

    // Headings
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      const content = trimmed.replace('## ', '');
      blocks.push({ id: generateId(), type: 'H2', content, anchor: generateAnchor(content) });
    } else if (trimmed.startsWith('### ')) {
      flushParagraph();
      const content = trimmed.replace('### ', '');
      blocks.push({ id: generateId(), type: 'H3', content, anchor: generateAnchor(content) });
    } else if (trimmed.startsWith('#### ')) {
      flushParagraph();
      const content = trimmed.replace('#### ', '');
      blocks.push({ id: generateId(), type: 'H4', content, anchor: generateAnchor(content) });
    }
    // List
    else if (trimmed.startsWith('- ')) {
      flushParagraph();
      blocks.push({ id: generateId(), type: 'LIST', content: trimmed.replace('- ', '') });
    }
    // Quote
    else if (trimmed.startsWith('> ')) {
      flushParagraph();
      blocks.push({ id: generateId(), type: 'QUOTE', content: trimmed.replace('> ', '') });
    }
    // Regular text
    else {
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  return blocks;
}
