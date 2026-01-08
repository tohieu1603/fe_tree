'use client';

import { useState, useCallback } from 'react';
import { Upload, Button, message, Image, Space, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, DragOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload';
import api from '@/lib/api';
import { getImageUrl } from './ImageUpload';

interface MultiImageUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  folder?: 'categories' | 'products' | 'articles' | 'banners';
  maxCount?: number;
  maxSize?: number; // in MB
}

export default function MultiImageUpload({
  value = [],
  onChange,
  folder = 'products',
  maxCount = 10,
  maxSize = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

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

    // Check max count
    if (value.length >= maxCount) {
      message.error(`Chỉ được upload tối đa ${maxCount} ảnh!`);
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = folder === 'categories' ? '/api/admin/upload/category'
        : folder === 'products' ? '/api/admin/upload/product'
        : folder === 'banners' ? '/api/admin/upload/banner'
        : folder === 'articles' ? '/api/admin/upload/article'
        : '/api/admin/upload';

      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data.data.url;
      onChange?.([...value, url]);
      message.success('Upload thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload thất bại!');
    } finally {
      setUploading(false);
    }
    return false;
  }, [folder, maxCount, maxSize, onChange, value]);

  const handleDelete = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange?.(newValue);
  };

  const handlePreview = (url: string) => {
    setPreviewImage(getImageUrl(url));
    setPreviewOpen(true);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    const newValue = [...value];
    const [removed] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, removed);
    onChange?.(newValue);
  };

  const uploadProps: UploadProps = {
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: handleUpload,
    disabled: uploading || value.length >= maxCount,
    multiple: true,
  };

  return (
    <div className="multi-image-upload">
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative group w-[100px] h-[100px] border rounded-lg overflow-hidden bg-gray-50"
          >
            <Image
              src={getImageUrl(url)}
              alt={`Image ${index + 1}`}
              width={100}
              height={100}
              style={{ objectFit: 'cover' }}
              preview={false}
              className="cursor-pointer"
              onClick={() => handlePreview(url)}
            />

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <div className="flex gap-1">
                <Tooltip title="Xem">
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(url)}
                    className="!text-white hover:!text-blue-300"
                  />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(index)}
                    className="!text-white hover:!text-red-400"
                  />
                </Tooltip>
              </div>
              {/* Move buttons */}
              <div className="flex gap-1 mt-1">
                <Tooltip title="Di chuyển trái">
                  <Button
                    type="text"
                    size="small"
                    disabled={index === 0}
                    onClick={() => moveImage(index, index - 1)}
                    className="!text-white hover:!text-blue-300 !text-xs"
                  >
                    ←
                  </Button>
                </Tooltip>
                <Tooltip title="Di chuyển phải">
                  <Button
                    type="text"
                    size="small"
                    disabled={index === value.length - 1}
                    onClick={() => moveImage(index, index + 1)}
                    className="!text-white hover:!text-blue-300 !text-xs"
                  >
                    →
                  </Button>
                </Tooltip>
              </div>
            </div>

            {/* Index badge */}
            <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload button */}
        {value.length < maxCount && (
          <Upload {...uploadProps}>
            <div className="w-[100px] h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
              ) : (
                <>
                  <PlusOutlined className="text-2xl text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Thêm ảnh</span>
                </>
              )}
            </div>
          </Upload>
        )}
      </div>

      {/* Counter */}
      <div className="mt-2 text-xs text-gray-400">
        {value.length}/{maxCount} ảnh
      </div>

      {/* Preview modal */}
      <Image
        wrapperStyle={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (vis) => setPreviewOpen(vis),
          src: previewImage,
        }}
      />
    </div>
  );
}
