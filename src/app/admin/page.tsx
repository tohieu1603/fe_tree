'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Space, Button, Spin } from 'antd';
import {
  FileTextOutlined,
  FolderOutlined,
  EyeOutlined,
  PlusOutlined,
  RiseOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { getAdminArticles } from '@/lib/articles';
import { getAdminCategories } from '@/lib/categories';
import type { Article, Category } from '@/types';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ articles: 0, published: 0, drafts: 0, categories: 0, views: 0 });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [articlesData, categoriesData] = await Promise.all([
          getAdminArticles(0, 5),
          getAdminCategories(),
        ]);

        const published = articlesData.content.filter(a => a.status === 'PUBLISHED').length;
        const drafts = articlesData.content.filter(a => a.status === 'DRAFT').length;
        const totalViews = articlesData.content.reduce((sum, a) => sum + (a.viewCount || 0), 0);

        setStats({
          articles: articlesData.totalElements,
          published,
          drafts,
          categories: categoriesData.length,
          views: totalViews,
        });
        setRecentArticles(articlesData.content);
        setCategories(categoriesData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const articleColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title: string, record: Article) => (
        <a onClick={() => router.push(`/admin/articles/${record.id}`)} className="text-blue-600 hover:underline cursor-pointer">
          {title}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
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
      render: (count: number) => <Text type="secondary">{count || 0}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: string) => <Text type="secondary">{new Date(date).toLocaleDateString()}</Text>,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">Dashboard</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push('/admin/articles/new')}>
          New Article
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Articles</Text>}
              value={stats.articles}
              prefix={<FileTextOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Published</Text>}
              value={stats.published}
              prefix={<RiseOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Categories</Text>}
              value={stats.categories}
              prefix={<FolderOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Views</Text>}
              value={stats.views}
              prefix={<EyeOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Articles"
            className="shadow-sm"
            extra={
              <Button type="link" onClick={() => router.push('/admin/articles')}>
                View All
              </Button>
            }
          >
            <Table
              columns={articleColumns}
              dataSource={recentArticles}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Categories" className="shadow-sm mb-4" extra={
            <Button type="link" onClick={() => router.push('/admin/categories')}>
              Manage
            </Button>
          }>
            <Space direction="vertical" className="w-full">
              {categories.map((cat) => (
                <div key={cat.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <FolderOutlined className="text-gray-400" />
                    <Text>{cat.name}</Text>
                  </div>
                  <Tag>{cat.articleCount || 0} articles</Tag>
                </div>
              ))}
              {categories.length === 0 && (
                <Text type="secondary" className="text-center py-4 block">No categories yet</Text>
              )}
            </Space>
          </Card>

          <Card title="Quick Actions" className="shadow-sm">
            <Space direction="vertical" className="w-full">
              <Button block icon={<PlusOutlined />} onClick={() => router.push('/admin/articles/new')}>
                Create Article
              </Button>
              <Button block icon={<FolderOutlined />} onClick={() => router.push('/admin/categories')}>
                Manage Categories
              </Button>
              <Button block icon={<EditOutlined />} onClick={() => router.push('/admin/articles')}>
                Edit Articles
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
