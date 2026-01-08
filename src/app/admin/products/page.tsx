'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Modal, Form, Input, InputNumber, Switch, Card, Typography, Tooltip, Row, Col, Statistic, Tabs, Image, Select, Collapse, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined, UndoOutlined, ExclamationCircleOutlined, RestOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { getAdminProducts, createProduct, updateProduct, deleteProduct, getTrashProducts, restoreProduct, permanentDeleteProduct } from '@/lib/products';
import { getAdminCategories } from '@/lib/categories';
import ImageUpload, { getImageUrl } from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';
import type { Product, ProductRequest, Category, PageResponse } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PageResponse<Product> | null>(null);
  const [trashProducts, setTrashProducts] = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [currentPage, setCurrentPage] = useState(0);
  const [trashPage, setTrashPage] = useState(0);
  const [form] = Form.useForm();

  const loadProducts = async (page = 0) => {
    setLoading(true);
    try {
      const result = await getAdminProducts(page, 10);
      setProducts(result);
      setCurrentPage(page);
    } catch {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadTrash = async (page = 0) => {
    setLoading(true);
    try {
      const result = await getTrashProducts(page, 10);
      setTrashProducts(result);
      setTrashPage(page);
    } catch {
      message.error('Không thể tải thùng rác');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await getAdminCategories();
      setCategories(result);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'trash') {
      loadTrash();
    }
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Đã chuyển sản phẩm vào thùng rác');
      loadProducts(currentPage);
      if (activeTab === 'trash') loadTrash(trashPage);
    } catch {
      message.error('Không thể xóa sản phẩm');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreProduct(id);
      message.success('Đã khôi phục sản phẩm');
      loadTrash(trashPage);
      loadProducts(currentPage);
    } catch {
      message.error('Không thể khôi phục sản phẩm');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await permanentDeleteProduct(id);
      message.success('Đã xóa vĩnh viễn sản phẩm');
      loadTrash(trashPage);
    } catch {
      message.error('Không thể xóa vĩnh viễn sản phẩm');
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        summary: product.summary,
        description: product.description,
        featuredImage: product.featuredImage,
        images: product.images || [],
        price: product.price,
        originalPrice: product.originalPrice,
        sku: product.sku,
        dimensions: product.dimensions,
        material: product.material,
        color: product.color,
        weight: product.weight,
        stockQuantity: product.stockQuantity,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        categoryId: product.category?.id,
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ isActive: true, isFeatured: false, stockQuantity: 0, images: [] });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (values: ProductRequest) => {
    setSubmitting(true);
    try {
      // Normalize featuredImage
      let featuredImage = values.featuredImage;
      if (typeof featuredImage === 'object' && featuredImage !== null) {
        featuredImage = (featuredImage as { url?: string }).url;
      }

      // Normalize images array
      let images = values.images || [];
      if (Array.isArray(images)) {
        images = images.map((img: string | { url?: string }) => {
          if (typeof img === 'object' && img !== null) {
            return (img as { url?: string }).url || '';
          }
          return img;
        }).filter(Boolean);
      }

      const normalizedValues = {
        ...values,
        featuredImage,
        images,
      };

      if (editingId) {
        await updateProduct(editingId, normalizedValues);
        message.success('Đã cập nhật sản phẩm');
      } else {
        await createProduct(normalizedValues);
        message.success('Đã tạo sản phẩm mới');
      }
      setModalOpen(false);
      loadProducts(currentPage);
    } catch (error) {
      console.error('Product save error:', error);
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
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setFieldValue('slug', slug);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const productColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_: unknown, record: Product) => (
        <div className="flex items-center gap-3">
          {record.featuredImage ? (
            <Image
              src={getImageUrl(record.featuredImage)}
              alt={record.name}
              width={60}
              height={60}
              className="object-cover rounded"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-[60px] h-[60px] rounded bg-gray-100 flex items-center justify-center">
              <ShoppingOutlined className="text-gray-400 text-xl" />
            </div>
          )}
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary" className="text-xs">/{record.slug}</Text>
            </div>
            {record.sku && (
              <Text type="secondary" className="text-xs">SKU: {record.sku}</Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      key: 'price',
      width: 150,
      render: (_: unknown, record: Product) => (
        <div>
          <Text strong className="text-blue-600">{formatPrice(record.price)}</Text>
          {record.originalPrice && record.originalPrice > (record.price || 0) && (
            <div>
              <Text type="secondary" delete className="text-xs">{formatPrice(record.originalPrice)}</Text>
              <Tag color="red" className="ml-1 text-xs">
                -{Math.round((1 - (record.price || 0) / record.originalPrice) * 100)}%
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 130,
      render: (name: string) => name ? <Tag color="blue">{name}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 80,
      render: (qty: number) => (
        <Tag color={qty > 10 ? 'green' : qty > 0 ? 'orange' : 'red'}>
          {qty || 0}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_: unknown, record: Product) => (
        <Space direction="vertical" size={0}>
          <Tag color={record.isActive ? 'success' : 'default'} icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
            {record.isActive ? 'Hiển thị' : 'Ẩn'}
          </Tag>
          {record.isFeatured && <Tag color="gold">Nổi bật</Tag>}
        </Space>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 90,
      render: (count: number) => (
        <Space>
          <EyeOutlined className="text-gray-400" />
          <Text type="secondary">{count || 0}</Text>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_: unknown, record: Product) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Chuyển vào thùng rác?"
            description="Bạn có thể khôi phục sau từ thùng rác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const trashColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_: unknown, record: Product) => (
        <div className="flex items-center gap-3">
          {record.featuredImage ? (
            <Image
              src={getImageUrl(record.featuredImage)}
              alt={record.name}
              width={50}
              height={50}
              className="object-cover rounded opacity-60"
            />
          ) : (
            <div className="w-[50px] h-[50px] rounded bg-gray-100 flex items-center justify-center">
              <ShoppingOutlined className="text-gray-400 text-lg" />
            </div>
          )}
          <div>
            <Text type="secondary">{record.name}</Text>
            <div>
              <Text type="secondary" className="text-xs">/{record.slug}</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      key: 'price',
      width: 150,
      render: (_: unknown, record: Product) => (
        <Text type="secondary">{formatPrice(record.price)}</Text>
      ),
    },
    {
      title: 'Ngày xóa',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Product) => (
        <Space>
          <Tooltip title="Khôi phục">
            <Button type="primary" ghost icon={<UndoOutlined />} onClick={() => handleRestore(record.id)}>
              Khôi phục
            </Button>
          </Tooltip>
          <Popconfirm
            title="Xóa vĩnh viễn?"
            description="Thao tác này không thể hoàn tác."
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handlePermanentDelete(record.id)}
            okText="Xóa vĩnh viễn"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa vĩnh viễn">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalProducts = products?.totalElements || 0;
  const activeProducts = products?.content.filter(p => p.isActive).length || 0;
  const trashCount = trashProducts?.totalElements || 0;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="!mb-0">Quản lý sản phẩm</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openModal()}>
          Thêm sản phẩm
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Tổng sản phẩm</Text>}
              value={totalProducts}
              prefix={<ShoppingOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Đang hiển thị</Text>}
              value={activeProducts}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm">
            <Statistic
              title={<Text type="secondary">Trong thùng rác</Text>}
              value={trashCount}
              prefix={<RestOutlined className="text-red-500" />}
              valueStyle={{ color: trashCount > 0 ? '#ff4d4f' : undefined }}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'products',
              label: `Sản phẩm (${totalProducts})`,
              children: (
                <Table
                  columns={productColumns}
                  dataSource={products?.content || []}
                  rowKey="id"
                  loading={loading && activeTab === 'products'}
                  pagination={{
                    current: currentPage + 1,
                    pageSize: 10,
                    total: products?.totalElements || 0,
                    onChange: (page) => loadProducts(page - 1),
                    showTotal: (total) => `Tổng ${total} sản phẩm`,
                  }}
                />
              ),
            },
            {
              key: 'trash',
              label: (
                <span>
                  <RestOutlined /> Thùng rác {trashCount > 0 && <Tag color="red">{trashCount}</Tag>}
                </span>
              ),
              children: (
                <Table
                  columns={trashColumns}
                  dataSource={trashProducts?.content || []}
                  rowKey="id"
                  loading={loading && activeTab === 'trash'}
                  pagination={{
                    current: trashPage + 1,
                    pageSize: 10,
                    total: trashProducts?.totalElements || 0,
                    onChange: (page) => loadTrash(page - 1),
                  }}
                  locale={{ emptyText: 'Thùng rác trống' }}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShoppingOutlined />
            {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          {/* Basic Info */}
          <Card size="small" title="Thông tin cơ bản" className="mb-4">
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="name"
                  label="Tên sản phẩm"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <Input
                    placeholder="Nhập tên sản phẩm"
                    size="large"
                    onChange={(e) => !editingId && generateSlug(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="slug"
                  label="Đường dẫn (Slug)"
                  extra="Tự động tạo từ tên"
                >
                  <Input placeholder="duong-dan-san-pham" addonBefore="/" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="summary" label="Mô tả ngắn">
              <TextArea rows={2} placeholder="Mô tả ngắn gọn về sản phẩm (hiển thị trong danh sách)" showCount maxLength={300} />
            </Form.Item>

            <Form.Item name="description" label="Mô tả chi tiết">
              <TextArea rows={5} placeholder="Mô tả chi tiết sản phẩm (hỗ trợ xuống dòng)" />
            </Form.Item>
          </Card>

          {/* Images */}
          <Card size="small" title="Hình ảnh" className="mb-4">
            <Form.Item name="featuredImage" label="Ảnh đại diện" extra="Ảnh chính hiển thị trong danh sách sản phẩm">
              <ImageUpload folder="products" placeholder="Upload ảnh đại diện (khuyến nghị: 800x800px)" />
            </Form.Item>

            <Form.Item name="images" label="Thư viện ảnh" extra="Thêm nhiều ảnh để hiển thị chi tiết sản phẩm">
              <MultiImageUpload folder="products" maxCount={10} />
            </Form.Item>
          </Card>

          {/* Pricing & Inventory */}
          <Card size="small" title="Giá & Kho hàng" className="mb-4">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="price" label="Giá bán (VND)" rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}>
                  <InputNumber
                    className="w-full"
                    size="large"
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as unknown as 0}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="originalPrice" label="Giá gốc (nếu có giảm giá)">
                  <InputNumber
                    className="w-full"
                    size="large"
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as unknown as 0}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="stockQuantity" label="Số lượng trong kho">
                  <InputNumber className="w-full" size="large" min={0} placeholder="0" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="sku" label="Mã SKU">
                  <Input placeholder="VD: TH-001" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="categoryId" label="Danh mục">
                  <Select
                    placeholder="Chọn danh mục"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="material" label="Chất liệu">
                  <Input placeholder="VD: Trầm hương tự nhiên" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Product Details */}
          <Card size="small" title="Chi tiết sản phẩm" className="mb-4">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="dimensions" label="Kích thước">
                  <Input placeholder="VD: 10 x 5 x 2 cm" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="color" label="Màu sắc">
                  <Input placeholder="VD: Nâu đen tự nhiên" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="weight" label="Trọng lượng (gram)">
                  <InputNumber className="w-full" min={0} step={1} placeholder="VD: 50" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* SEO Settings */}
          <Collapse
            items={[
              {
                key: 'seo',
                label: 'Cài đặt SEO (Tùy chọn)',
                children: (
                  <>
                    <Form.Item name="metaTitle" label="Meta Title" extra="Tiêu đề hiển thị trên Google (để trống sẽ dùng tên sản phẩm)">
                      <Input placeholder="Tiêu đề SEO" showCount maxLength={70} />
                    </Form.Item>
                    <Form.Item name="metaDescription" label="Meta Description" extra="Mô tả hiển thị trên Google">
                      <TextArea rows={2} placeholder="Mô tả SEO ngắn gọn" showCount maxLength={160} />
                    </Form.Item>
                    <Form.Item name="metaKeywords" label="Meta Keywords" extra="Các từ khóa cách nhau bởi dấu phẩy">
                      <Input placeholder="VD: trầm hương, vòng tay, phong thủy" />
                    </Form.Item>
                  </>
                ),
              },
            ]}
            className="mb-4"
          />

          {/* Status */}
          <Card size="small" title="Trạng thái" className="mb-4">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="isActive" label="Hiển thị sản phẩm" valuePropName="checked">
                  <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isFeatured" label="Sản phẩm nổi bật" valuePropName="checked">
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Divider />

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                {editingId ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
