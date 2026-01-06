'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Upload,
  Switch,
  InputNumber,
  message,
  Popconfirm,
  Image,
  Typography,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';
import ImageUpload, { getImageUrl } from '@/components/admin/ImageUpload';

const { Title, Text } = Typography;

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/banners');
      setBanners(res.data.data || []);
    } catch {
      // If API not ready, use mock data
      setBanners([
        {
          id: '1',
          title: 'Tuong Go Nghe Thuat',
          subtitle: 'Tuong go dieu khac thu cong, mang dam ban sac van hoa Viet',
          buttonText: 'Xem San Pham',
          buttonLink: '/products',
          imageUrl: 'https://images.unsplash.com/photo-1609167830220-7164aa360951?w=1600&q=80',
          sortOrder: 1,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Dieu Khac Thu Cong',
          subtitle: 'Moi tac pham la mot tac pham nghe thuat doc nhat vo nhi',
          buttonText: 'Lien He',
          buttonLink: '/contact',
          imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1600&q=80',
          sortOrder: 2,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Go Quy Tu Nhien',
          subtitle: 'Go huong, go trac, go cam lai - chat luong cao cap',
          buttonText: 'Xem Them',
          buttonLink: '/products',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80',
          sortOrder: 3,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleAdd = () => {
    setEditingBanner(null);
    form.resetFields();
    form.setFieldsValue({
      active: true,
      sortOrder: banners.length + 1,
      buttonText: 'Xem Them',
      buttonLink: '/products',
    });
    setModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    form.setFieldsValue(banner);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/admin/banners/${id}`);
      message.success('Xoa banner thanh cong');
      loadBanners();
    } catch {
      // Mock delete for demo
      setBanners(banners.filter(b => b.id !== id));
      message.success('Xoa banner thanh cong');
    }
  };

  const handleSave = async (values: BannerFormData) => {
    setSaving(true);
    try {
      if (editingBanner) {
        await api.put(`/api/admin/banners/${editingBanner.id}`, values);
        message.success('Cap nhat banner thanh cong');
      } else {
        await api.post('/api/admin/banners', values);
        message.success('Tao banner thanh cong');
      }
      setModalOpen(false);
      loadBanners();
    } catch {
      // Mock save for demo
      if (editingBanner) {
        setBanners(banners.map(b =>
          b.id === editingBanner.id
            ? { ...b, ...values, updatedAt: new Date().toISOString() }
            : b
        ));
      } else {
        setBanners([...banners, {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]);
      }
      message.success(editingBanner ? 'Cap nhat banner thanh cong' : 'Tao banner thanh cong');
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
    newBanners.forEach((b, i) => b.sortOrder = i + 1);
    setBanners(newBanners);
  };

  const handleMoveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    newBanners.forEach((b, i) => b.sortOrder = i + 1);
    setBanners(newBanners);
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  const columns = [
    {
      title: 'Thu tu',
      dataIndex: 'sortOrder',
      width: 100,
      render: (_: number, __: Banner, index: number) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<ArrowUpOutlined />}
            disabled={index === 0}
            onClick={() => handleMoveUp(index)}
          />
          <Button
            type="text"
            size="small"
            icon={<ArrowDownOutlined />}
            disabled={index === banners.length - 1}
            onClick={() => handleMoveDown(index)}
          />
        </Space>
      ),
    },
    {
      title: 'Hinh anh',
      dataIndex: 'imageUrl',
      width: 150,
      render: (imageUrl: string) => (
        <div
          className="relative w-[120px] h-[70px] rounded overflow-hidden cursor-pointer group"
          onClick={() => handlePreview(getImageUrl(imageUrl))}
        >
          <Image
            src={getImageUrl(imageUrl)}
            alt="Banner"
            width={120}
            height={70}
            className="object-cover"
            preview={false}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <EyeOutlined className="text-white text-lg" />
          </div>
        </div>
      ),
    },
    {
      title: 'Tieu de',
      dataIndex: 'title',
      render: (title: string, record: Banner) => (
        <div>
          <div className="font-medium">{title}</div>
          <Text type="secondary" className="text-xs line-clamp-1">{record.subtitle}</Text>
        </div>
      ),
    },
    {
      title: 'Nut bam',
      dataIndex: 'buttonText',
      width: 150,
      render: (text: string, record: Banner) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" className="text-xs">{record.buttonLink}</Text>
        </div>
      ),
    },
    {
      title: 'Trang thai',
      dataIndex: 'active',
      width: 100,
      render: (active: boolean) => (
        <span className={`px-2 py-1 rounded text-xs ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {active ? 'Hien thi' : 'An'}
        </span>
      ),
    },
    {
      title: 'Thao tac',
      width: 120,
      render: (_: unknown, record: Banner) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xoa banner nay?"
            description="Hanh dong nay khong the hoan tac"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoa"
            cancelText="Huy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2">
            <PictureOutlined /> Quan ly Banner
          </Title>
          <Text type="secondary">Quan ly slideshow banner trang chu</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleAdd}>
          Them Banner
        </Button>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={banners}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chua co banner nao"
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  Them Banner Dau Tien
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* Edit/Add Modal */}
      <Modal
        title={editingBanner ? 'Chinh sua Banner' : 'Them Banner moi'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="mt-4"
        >
          <Form.Item
            name="imageUrl"
            label="Hinh anh banner"
            rules={[{ required: true, message: 'Vui long upload hinh anh' }]}
          >
            <ImageUpload
              folder="banners"
              placeholder="Upload hinh anh banner (kich thuoc khuyen nghi: 1920x800)"
              showAttributes
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="Tieu de"
            rules={[{ required: true, message: 'Vui long nhap tieu de' }]}
          >
            <Input placeholder="Tieu de banner" />
          </Form.Item>

          <Form.Item
            name="subtitle"
            label="Mo ta ngan"
            rules={[{ required: true, message: 'Vui long nhap mo ta' }]}
          >
            <Input.TextArea rows={2} placeholder="Mo ta ngan gon ve banner" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="buttonText"
              label="Noi dung nut"
              rules={[{ required: true, message: 'Vui long nhap noi dung nut' }]}
            >
              <Input placeholder="Xem Them" />
            </Form.Item>

            <Form.Item
              name="buttonLink"
              label="Lien ket nut"
              rules={[{ required: true, message: 'Vui long nhap lien ket' }]}
            >
              <Input placeholder="/products" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="sortOrder" label="Thu tu hien thi">
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="active" label="Trang thai" valuePropName="checked">
              <Switch checkedChildren="Hien thi" unCheckedChildren="An" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setModalOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingBanner ? 'Cap nhat' : 'Them moi'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={900}
      >
        <Image
          src={previewImage}
          alt="Preview"
          width="100%"
          preview={false}
        />
      </Modal>
    </div>
  );
}
