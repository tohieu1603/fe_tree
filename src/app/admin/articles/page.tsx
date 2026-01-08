'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Tag, Popconfirm, message, Input, Card, Typography, Select, Row, Col, Avatar, Tooltip, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, FilterOutlined, UndoOutlined, RestOutlined } from '@ant-design/icons';
import { getAdminArticles, deleteArticle, getTrashArticles, restoreArticle, permanentDeleteArticle } from '@/lib/articles';
import { getAdminCategories } from '@/lib/categories';
import type { Article, PageResponse, Category } from '@/types';

const { Title, Text } = Typography;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${API_URL}${path}`;
  return path;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PageResponse<Article> | null>(null);
  const [trashData, setTrashData] = useState<PageResponse<Article> | null>(null);
  const [page, setPage] = useState(0);
  const [trashPage, setTrashPage] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({ search: '', status: '', categoryId: '' });

  const loadArticles = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const result = await getAdminArticles(p, 10);
      setData(result);
    } catch {
      message.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrash = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const result = await getTrashArticles(p, 10);
      setTrashData(result);
    } catch {
      message.error('Không thể tải thùng rác');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'articles') {
      loadArticles(page);
    } else {
      loadTrash(trashPage);
    }
    getAdminCategories().then(setCategories).catch(console.error);
  }, [page, trashPage, activeTab, loadArticles, loadTrash]);

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      message.success('Đã chuyển vào thùng rác');
      loadArticles(page);
    } catch {
      message.error('Không thể xoá bài viết');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreArticle(id);
      message.success('Đã khôi phục bài viết');
      loadTrash(trashPage);
    } catch {
      message.error('Không thể khôi phục');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await permanentDeleteArticle(id);
      message.success('Đã xoá vĩnh viễn');
      loadTrash(trashPage);
    } catch {
      message.error('Không thể xoá');
    }
  };

  const columns = [
    {
      title: 'Bài viết',
      key: 'article',
      render: (_: unknown, record: Article) => (
        <div className="flex items-center gap-3">
          {record.featuredImage ? (
            <Avatar shape="square" size={48} src={getImageUrl(record.featuredImage)} />
          ) : (
            <Avatar shape="square" size={48} className="bg-gray-200 text-gray-500">
              {record.title.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <a
              onClick={() => router.push(`/admin/articles/${record.id}`)}
              className="text-blue-600 hover:underline cursor-pointer font-medium block truncate"
            >
              {record.title}
            </a>
            <Text type="secondary" className="text-xs">
              /{record.slug}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 140,
      render: (name: string) => name ? <Tag>{name}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : status === 'DRAFT' ? 'orange' : 'default'}>
          {status === 'PUBLISHED' ? 'Đã xuất bản' : status === 'DRAFT' ? 'Nháp' : 'Lưu trữ'}
        </Tag>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (count: number) => (
        <Space>
          <EyeOutlined className="text-gray-400" />
          <Text>{count || 0}</Text>
        </Space>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: ['author', 'fullName'],
      key: 'author',
      width: 120,
      render: (name: string) => <Text type="secondary">{name || '-'}</Text>,
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 110,
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Text type="secondary">{new Date(date).toLocaleDateString('vi-VN')}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Article) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/articles/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Xoá bài viết?"
            description="Bài viết sẽ được chuyển vào thùng rác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xoá">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const trashColumns = [
    {
      title: 'Bài viết',
      key: 'article',
      render: (_: unknown, record: Article) => (
        <div className="flex items-center gap-3">
          {record.featuredImage ? (
            <Avatar shape="square" size={48} src={getImageUrl(record.featuredImage)} />
          ) : (
            <Avatar shape="square" size={48} className="bg-gray-200 text-gray-500">
              {record.title.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <Text className="font-medium block truncate">{record.title}</Text>
            <Text type="secondary" className="text-xs">/{record.slug}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 140,
      render: (name: string) => name ? <Tag>{name}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : status === 'DRAFT' ? 'orange' : 'default'}>
          {status === 'PUBLISHED' ? 'Đã xuất bản' : status === 'DRAFT' ? 'Nháp' : 'Lưu trữ'}
        </Tag>
      ),
    },
    {
      title: 'Đã xoá',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      width: 130,
      render: (date: string) => date ? (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Text type="secondary">{new Date(date).toLocaleDateString('vi-VN')}</Text>
        </Tooltip>
      ) : '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Article) => (
        <Space>
          <Tooltip title="Khôi phục">
            <Button
              type="text"
              icon={<UndoOutlined />}
              onClick={() => handleRestore(record.id)}
              className="text-green-600"
            />
          </Tooltip>
          <Popconfirm
            title="Xoá vĩnh viễn?"
            description="Bài viết sẽ bị xoá hoàn toàn và không thể khôi phục."
            onConfirm={() => handlePermanentDelete(record.id)}
            okText="Xoá vĩnh viễn"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xoá vĩnh viễn">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = data?.content.filter(article => {
    if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && article.status !== filters.status) {
      return false;
    }
    if (filters.categoryId && article.category?.id !== filters.categoryId) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">Bài viết</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => router.push('/admin/articles/new')}>
          Tạo bài viết
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          if (key === 'articles') {
            setPage(0);
          } else {
            setTrashPage(0);
          }
        }}
        items={[
          {
            key: 'articles',
            label: (
              <span>
                <EditOutlined /> Bài viết ({data?.totalElements || 0})
              </span>
            ),
            children: (
              <>
                <Card className="shadow-sm mb-4">
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={10}>
                      <Input
                        placeholder="Tìm kiếm bài viết..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        size="large"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        allowClear
                      />
                    </Col>
                    <Col xs={12} md={5}>
                      <Select
                        placeholder="Trạng thái"
                        size="large"
                        className="w-full"
                        allowClear
                        value={filters.status || undefined}
                        onChange={(val) => setFilters({ ...filters, status: val || '' })}
                        options={[
                          { value: 'DRAFT', label: 'Nháp' },
                          { value: 'PUBLISHED', label: 'Đã xuất bản' },
                          { value: 'ARCHIVED', label: 'Lưu trữ' },
                        ]}
                      />
                    </Col>
                    <Col xs={12} md={5}>
                      <Select
                        placeholder="Danh mục"
                        size="large"
                        className="w-full"
                        allowClear
                        value={filters.categoryId || undefined}
                        onChange={(val) => setFilters({ ...filters, categoryId: val || '' })}
                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                      />
                    </Col>
                    <Col xs={24} md={4}>
                      <Button
                        icon={<FilterOutlined />}
                        size="large"
                        block
                        onClick={() => setFilters({ search: '', status: '', categoryId: '' })}
                      >
                        Xoá lọc
                      </Button>
                    </Col>
                  </Row>
                </Card>

                <Card className="shadow-sm">
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      current: page + 1,
                      total: data?.totalElements,
                      pageSize: 10,
                      onChange: (p) => setPage(p - 1),
                      showSizeChanger: false,
                      showTotal: (total) => `${total} bài viết`,
                    }}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'trash',
            label: (
              <span>
                <RestOutlined /> Thùng rác ({trashData?.totalElements || 0})
              </span>
            ),
            children: (
              <Card className="shadow-sm">
                <Table
                  columns={trashColumns}
                  dataSource={trashData?.content}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    current: trashPage + 1,
                    total: trashData?.totalElements,
                    pageSize: 10,
                    onChange: (p) => setTrashPage(p - 1),
                    showSizeChanger: false,
                    showTotal: (total) => `${total} bài viết trong thùng rác`,
                  }}
                  locale={{ emptyText: 'Thùng rác trống' }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
