'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Button, Space, Tag, Popconfirm, message, Input, Card, Typography, Select, Row, Col, Avatar, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { getAdminArticles, deleteArticle } from '@/lib/articles';
import { getAdminCategories } from '@/lib/categories';
import type { Article, PageResponse, Category } from '@/types';

const { Title, Text } = Typography;

export default function ArticlesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PageResponse<Article> | null>(null);
  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({ search: '', status: '', categoryId: '' });

  const loadArticles = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const result = await getAdminArticles(p, 10);
      setData(result);
    } catch {
      message.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles(page);
    getAdminCategories().then(setCategories).catch(console.error);
  }, [page, loadArticles]);

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      message.success('Article deleted');
      loadArticles(page);
    } catch {
      message.error('Failed to delete article');
    }
  };

  const columns = [
    {
      title: 'Article',
      key: 'article',
      render: (_: unknown, record: Article) => (
        <div className="flex items-center gap-3">
          {record.featuredImage ? (
            <Avatar shape="square" size={48} src={record.featuredImage} />
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
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 140,
      render: (name: string) => name ? <Tag>{name}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : status === 'DRAFT' ? 'orange' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      render: (count: number) => (
        <Space>
          <EyeOutlined className="text-gray-400" />
          <Text>{count || 0}</Text>
        </Space>
      ),
    },
    {
      title: 'Author',
      dataIndex: ['author', 'fullName'],
      key: 'author',
      width: 120,
      render: (name: string) => <Text type="secondary">{name || '-'}</Text>,
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 110,
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Text type="secondary">{new Date(date).toLocaleDateString()}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Article) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/admin/articles/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this article?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
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
        <Title level={3} className="!mb-0">Articles</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => router.push('/admin/articles/new')}>
          New Article
        </Button>
      </div>

      <Card className="shadow-sm mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10}>
            <Input
              placeholder="Search articles..."
              prefix={<SearchOutlined className="text-gray-400" />}
              size="large"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Status"
              size="large"
              className="w-full"
              allowClear
              value={filters.status || undefined}
              onChange={(val) => setFilters({ ...filters, status: val || '' })}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Category"
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
              Clear
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
            showTotal: (total) => `${total} articles`,
          }}
        />
      </Card>
    </div>
  );
}
