'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Modal, Form, Input, InputNumber, Switch, Card, Typography, Tooltip, Row, Col, Statistic, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined, CheckCircleOutlined, CloseCircleOutlined, UndoOutlined, RestOutlined } from '@ant-design/icons';
import { getAdminCategories, createCategory, updateCategory, deleteCategory, getTrashCategories, restoreCategory, permanentDeleteCategory } from '@/lib/categories';
import ImageUpload, { getImageUrl } from '@/components/admin/ImageUpload';
import Image from 'next/image';
import type { Category, CategoryRequest } from '@/types';

const { Title, Text } = Typography;

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [trashCategories, setTrashCategories] = useState<Category[]>([]);
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
      message.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const loadTrash = async () => {
    setLoading(true);
    try {
      const result = await getTrashCategories();
      setTrashCategories(result);
    } catch {
      message.error('Không thể tải thùng rác');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'categories') {
      loadCategories();
    } else {
      loadTrash();
    }
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Đã chuyển vào thùng rác');
      loadCategories();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError?.response?.data?.message || 'Không thể xoá danh mục';
      message.error(errorMessage);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreCategory(id);
      message.success('Đã khôi phục danh mục');
      loadTrash();
    } catch {
      message.error('Không thể khôi phục');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await permanentDeleteCategory(id);
      message.success('Đã xoá vĩnh viễn');
      loadTrash();
    } catch {
      message.error('Không thể xoá');
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
        sectionTitle: category.sectionTitle,
        sectionSubtitle: category.sectionSubtitle,
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
      const normalizedValues = {
        ...values,
        imageUrl: typeof values.imageUrl === 'object' && values.imageUrl !== null
          ? (values.imageUrl as { url?: string }).url
          : values.imageUrl,
      };

      if (editingId) {
        await updateCategory(editingId, normalizedValues);
        message.success('Đã cập nhật danh mục');
      } else {
        await createCategory(normalizedValues);
        message.success('Đã tạo danh mục');
      }
      setModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Category save error:', error);
      message.error('Thao tác thất bại');
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
      title: 'Danh mục',
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
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (desc: string) => desc ? <Text type="secondary">{desc}</Text> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Bài viết',
      dataIndex: 'articleCount',
      key: 'articleCount',
      width: 100,
      render: (count: number) => <Tag color="blue">{count || 0} bài</Tag>,
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      render: (order: number) => <Text type="secondary">{order}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'} icon={active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {active ? 'Hoạt động' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Category) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Xoá danh mục?"
            description={record.articleCount ? `Danh mục có ${record.articleCount} bài viết. Hãy di chuyển bài viết trước.` : 'Danh mục sẽ được chuyển vào thùng rác.'}
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
      title: 'Danh mục',
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
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (desc: string) => desc ? <Text type="secondary">{desc}</Text> : <Text type="secondary">-</Text>,
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
      render: (_: unknown, record: Category) => (
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
            description="Danh mục sẽ bị xoá hoàn toàn và không thể khôi phục."
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

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">Danh mục</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openModal()}>
          Tạo danh mục
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Tổng danh mục</Text>}
              value={categories.length}
              prefix={<FolderOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Đang hoạt động</Text>}
              value={activeCategories}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Tổng bài viết</Text>}
              value={totalArticles}
              prefix={<FolderOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'categories',
            label: (
              <span>
                <FolderOutlined /> Danh mục ({categories.length})
              </span>
            ),
            children: (
              <Card className="shadow-sm">
                <Table
                  columns={columns}
                  dataSource={categories}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'trash',
            label: (
              <span>
                <RestOutlined /> Thùng rác ({trashCategories.length})
              </span>
            ),
            children: (
              <Card className="shadow-sm">
                <Table
                  columns={trashColumns}
                  dataSource={trashCategories}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                  locale={{ emptyText: 'Thùng rác trống' }}
                />
              </Card>
            ),
          },
        ]}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FolderOutlined />
            {editingId ? 'Sửa danh mục' : 'Tạo danh mục mới'}
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
            label="Tên danh mục"
            rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}
          >
            <Input
              placeholder="Tên danh mục"
              size="large"
              onChange={(e) => !editingId && generateSlug(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            extra="Định danh URL. Tự động tạo từ tên."
          >
            <Input placeholder="danh-muc-slug" addonBefore="/category/" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea
              rows={3}
              placeholder="Mô tả ngắn về danh mục"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="Ảnh danh mục" extra="Ảnh thumbnail hiển thị ở trang chủ và trang danh mục">
            <ImageUpload folder="categories" placeholder="Upload ảnh danh mục (khuyến nghị: 800x600px)" showAttributes />
          </Form.Item>

          <Form.Item
            name="sectionTitle"
            label="Tiêu đề Section (Trang chủ)"
            extra="Tiêu đề hiển thị trên section của danh mục ở trang chủ. VD: TINH HOA TRAM HUONG"
          >
            <Input placeholder="VD: TINH HOA TRAM HUONG" />
          </Form.Item>

          <Form.Item
            name="sectionSubtitle"
            label="Phụ đề Section"
            extra="Phụ đề nhỏ hiển thị bên dưới tiêu đề. VD: CURATED BY DUC VIET"
          >
            <Input placeholder="VD: CURATED BY DUC VIET" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sortOrder" label="Thứ tự" initialValue={0}>
                <InputNumber min={0} className="w-full" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="active" label="Trạng thái" valuePropName="checked" initialValue={true}>
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Ẩn"
                  className="mt-2"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 mt-4">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Huỷ</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingId ? 'Cập nhật' : 'Tạo danh mục'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
