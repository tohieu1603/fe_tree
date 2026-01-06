'use client';

import { useState, useCallback } from 'react';
import { Upload, Button, message, Image, Space, Input, Modal, Form, InputNumber } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
export function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

export interface ImageData {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  backlink?: string;  // Link URL when clicking image
  srcset?: string;    // Responsive image srcset
  title?: string;     // Image title for tooltip
}

interface ImageUploadProps {
  value?: string | ImageData;
  onChange?: (value: string | ImageData | undefined) => void;
  folder?: 'categories' | 'products' | 'articles' | 'banners' | 'logos';
  showAttributes?: boolean;
  placeholder?: string;
  maxSize?: number; // in MB
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'articles',
  showAttributes = false,
  placeholder = 'Click để upload hoặc kéo thả ảnh vào đây',
  maxSize = 10,
  accept = 'image/*',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [form] = Form.useForm();

  // Normalize value
  const rawUrl = typeof value === 'string' ? value : value?.url;
  const imageUrl = getImageUrl(rawUrl);
  const imageData: ImageData | undefined = typeof value === 'object' ? value : rawUrl ? { url: rawUrl } : undefined;

  const handleUpload = useCallback(async (file: RcFile) => {
    // Validate file size
    if (file.size / 1024 / 1024 > maxSize) {
      message.error(`File phải nhỏ hơn ${maxSize}MB!`);
      return false;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ cho phép upload file ảnh!');
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = folder === 'categories' ? '/api/admin/upload/category'
        : folder === 'products' ? '/api/admin/upload/product'
        : folder === 'banners' ? '/api/admin/upload/banner'
        : folder === 'logos' ? '/api/admin/upload/logo'
        : folder === 'articles' ? '/api/admin/upload/article'
        : '/api/admin/upload';

      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data.data.url;

      if (showAttributes) {
        // Get image dimensions using full URL
        const img = new window.Image();
        img.onload = () => {
          onChange?.({ url, width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          onChange?.({ url });
        };
        img.src = getImageUrl(url);
      } else {
        onChange?.(url);
      }

      message.success('Upload thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload thất bại!');
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  }, [folder, maxSize, onChange, showAttributes]);

  const handleDelete = useCallback(async () => {
    if (!imageUrl) return;

    try {
      await api.delete('/api/admin/upload', { params: { path: imageUrl } });
      onChange?.(undefined);
      message.success('Đã xóa ảnh');
    } catch {
      // Still clear the value even if delete fails
      onChange?.(undefined);
    }
  }, [imageUrl, onChange]);

  const handleAttributesSave = (values: Partial<ImageData>) => {
    if (imageData) {
      onChange?.({ ...imageData, ...values });
    }
    setAttributesOpen(false);
  };

  const openAttributes = () => {
    form.setFieldsValue({
      alt: imageData?.alt || '',
      title: imageData?.title || '',
      width: imageData?.width,
      height: imageData?.height,
      backlink: imageData?.backlink || '',
      srcset: imageData?.srcset || '',
    });
    setAttributesOpen(true);
  };

  const uploadProps: UploadProps = {
    accept,
    showUploadList: false,
    beforeUpload: handleUpload,
    disabled: uploading,
  };

  return (
    <div className="image-upload-wrapper">
      {imageUrl ? (
        <div className="relative group">
          <div className="relative border rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={imageData?.alt || 'Uploaded image'}
              preview={{
                visible: previewOpen,
                onVisibleChange: setPreviewOpen,
              }}
              style={{ maxHeight: 200, objectFit: 'contain', width: '100%' }}
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="primary"
                ghost
                icon={<PictureOutlined />}
                onClick={() => setPreviewOpen(true)}
              >
                Xem
              </Button>
              {showAttributes && (
                <Button
                  type="primary"
                  ghost
                  icon={<EditOutlined />}
                  onClick={openAttributes}
                >
                  Thuộc tính
                </Button>
              )}
              <Button
                danger
                ghost
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </div>
          </div>

          {/* Image info */}
          {showAttributes && imageData && (
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div className="flex flex-wrap gap-2">
                {imageData.width && imageData.height && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{imageData.width} × {imageData.height}px</span>
                )}
                {imageData.alt && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded" title="Alt text">
                    Alt: {imageData.alt.length > 30 ? imageData.alt.slice(0, 30) + '...' : imageData.alt}
                  </span>
                )}
                {imageData.backlink && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded" title={imageData.backlink}>
                    🔗 Backlink
                  </span>
                )}
                {imageData.srcset && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    📐 Srcset
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Replace button */}
          <Upload {...uploadProps} className="mt-2">
            <Button icon={<UploadOutlined />} loading={uploading} block>
              Thay đổi ảnh
            </Button>
          </Upload>
        </div>
      ) : (
        <Upload.Dragger {...uploadProps} className="!p-4">
          <p className="ant-upload-drag-icon">
            <PictureOutlined style={{ fontSize: 32, color: '#999' }} />
          </p>
          <p className="ant-upload-text text-sm">{placeholder}</p>
          <p className="ant-upload-hint text-xs text-gray-400">
            Hỗ trợ: JPG, PNG, GIF, WebP (tối đa {maxSize}MB)
          </p>
        </Upload.Dragger>
      )}

      {/* Attributes Modal */}
      <Modal
        title="Thuộc tính ảnh SEO"
        open={attributesOpen}
        onCancel={() => setAttributesOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAttributesSave}>
          <Form.Item
            name="alt"
            label="Alt text (Văn bản thay thế)"
            extra="Mô tả ảnh cho SEO và accessibility - quan trọng cho Google hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập alt text' }]}
          >
            <Input placeholder="VD: Vòng tay trầm hương cao cấp 12mm" />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title (Tiêu đề tooltip)"
            extra="Hiển thị khi di chuột qua ảnh"
          >
            <Input placeholder="VD: Vòng tay trầm hương thiên nhiên" />
          </Form.Item>

          <Form.Item
            name="backlink"
            label="Backlink URL"
            extra="URL chuyển đến khi click vào ảnh (để trống nếu không cần)"
          >
            <Input placeholder="VD: https://example.com/san-pham/vong-tay" />
          </Form.Item>

          <Form.Item
            name="srcset"
            label="Srcset (Responsive)"
            extra="Các kích thước ảnh responsive, cách nhau bởi dấu phẩy. VD: image-320w.jpg 320w, image-640w.jpg 640w"
          >
            <Input.TextArea
              rows={2}
              placeholder="VD: /uploads/products/img-sm.jpg 320w, /uploads/products/img-md.jpg 640w, /uploads/products/img-lg.jpg 1280w"
            />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item name="width" label="Chiều rộng (px)" className="flex-1">
              <InputNumber min={1} placeholder="auto" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="height" label="Chiều cao (px)" className="flex-1">
              <InputNumber min={1} placeholder="auto" style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
