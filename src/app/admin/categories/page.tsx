'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Modal, Form, Input, InputNumber, Switch, Card, Typography, Tooltip, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, CheckCircleOutlined, CloseCircleOutlined, PictureOutlined } from '@ant-design/icons';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/lib/categories';
import ImageUpload, { getImageUrl } from '@/components/admin/ImageUpload';
import Image from 'next/image';
import type { Category, CategoryRequest } from '@/types';

const { Title, Text } = Typography;

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const result = await getAdminCategories();
      setCategories(result);
    } catch {
      message.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Category deleted');
      loadCategories();
    } catch {
      message.error('Failed to delete category');
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        sortOrder: category.sortOrder,
        active: category.active,
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ sortOrder: categories.length, active: true });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (values: CategoryRequest) => {
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, values);
        message.success('Category updated');
      } else {
        await createCategory(values);
        message.success('Category created');
      }
      setModalOpen(false);
      loadCategories();
    } catch {
      message.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setFieldValue('slug', slug);
  };

  const totalArticles = categories.reduce((sum, c) => sum + (c.articleCount || 0), 0);
  const activeCategories = categories.filter(c => c.active).length;

  const columns = [
    {
      title: 'Category',
      key: 'category',
      render: (_: unknown, record: Category) => (
        <div className="flex items-center gap-3">
          {record.imageUrl ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden relative">
              <Image
                src={getImageUrl(record.imageUrl)}
                alt={record.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FolderOutlined className="text-blue-500 text-lg" />
            </div>
          )}
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary" className="text-xs">/{record.slug}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (desc: string) => desc ? <Text type="secondary">{desc}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Articles',
      dataIndex: 'articleCount',
      key: 'articleCount',
      width: 100,
      render: (count: number) => <Tag color="blue">{count || 0} articles</Tag>,
    },
    {
      title: 'Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (order: number) => <Text type="secondary">{order}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Category) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this category?"
            description="Articles in this category will become uncategorized."
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

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">Categories</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openModal()}>
          New Category
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Categories</Text>}
              value={categories.length}
              prefix={<FolderOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Active Categories</Text>}
              value={activeCategories}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Total Articles</Text>}
              value={totalArticles}
              prefix={<FolderOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FolderOutlined />
            {editingId ? 'Edit Category' : 'New Category'}
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input
              placeholder="Category name"
              size="large"
              onChange={(e) => !editingId && generateSlug(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            extra="URL-friendly identifier. Auto-generated from name."
          >
            <Input placeholder="category-slug" addonBefore="/category/" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={3}
              placeholder="Brief description of this category"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="Ảnh danh mục" extra="Ảnh thumbnail hiển thị ở trang chủ và trang danh mục">
            <ImageUpload folder="categories" placeholder="Upload ảnh danh mục (khuyến nghị: 800x600px)" showAttributes />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="Sort Order" initialValue={0}>
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="active" label="Status" valuePropName="checked" initialValue={true}>
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  className="mt-2"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 mt-4">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingId ? 'Update Category' : 'Create Category'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
