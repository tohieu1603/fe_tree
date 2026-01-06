'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Tabs,
  Space,
  message,
  Spin,
  Divider,
  List,
  Modal,
} from 'antd';
import {
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string;
  linkText: string;
  linkUrl: string;
}

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  zaloUrl: string;
  footerText: string;
  copyrightText: string;
  heroTitle: string;
  heroSubtitle: string;
  categorySectionTitle: string;
  categorySectionSubtitle: string;
  serviceSectionTitle: string;
  services: ServiceItem[];
}

const defaultSettings: SiteSettings = {
  siteName: 'Duc Viet',
  siteTagline: 'Tinh Hoa Tram Huong',
  siteDescription: '',
  logoUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  tiktokUrl: '',
  zaloUrl: '',
  footerText: '',
  copyrightText: '2024 Duc Viet. All rights reserved.',
  heroTitle: 'TRAM HUONG',
  heroSubtitle: 'Tinh Hoa Thien Nhien Viet Nam',
  categorySectionTitle: 'Tinh Hoa Tram Huong',
  categorySectionSubtitle: 'Curated By Duc Viet',
  serviceSectionTitle: 'DUC VIET SERVICES',
  services: [],
};

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [serviceForm] = Form.useForm();

  const loadSettings = async () => {
    try {
      const res = await api.get('/api/admin/site-settings');
      const data = res.data.data;
      if (data) {
        form.setFieldsValue(data);
        setServices(data.services || []);
      } else {
        form.setFieldsValue(defaultSettings);
        setServices(defaultSettings.services);
      }
    } catch {
      form.setFieldsValue(defaultSettings);
      setServices(defaultSettings.services);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (values: SiteSettings) => {
    setSaving(true);
    try {
      await api.put('/api/admin/site-settings', { ...values, services });
      message.success('Cai dat da duoc luu');
    } catch {
      message.error('Luu that bai');
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    setEditingServiceIndex(null);
    serviceForm.resetFields();
    setServiceModalOpen(true);
  };

  const handleEditService = (index: number) => {
    setEditingServiceIndex(index);
    serviceForm.setFieldsValue(services[index]);
    setServiceModalOpen(true);
  };

  const handleDeleteService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  const handleServiceSave = (values: ServiceItem) => {
    if (editingServiceIndex !== null) {
      const newServices = [...services];
      newServices[editingServiceIndex] = values;
      setServices(newServices);
    } else {
      setServices([...services, values]);
    }
    setServiceModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const items = [
    {
      key: 'general',
      label: (
        <span className="flex items-center gap-2">
          <GlobalOutlined /> Thong tin chung
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="siteName" label="Ten website" rules={[{ required: true }]}>
            <Input placeholder="Duc Viet" size="large" />
          </Form.Item>
          <Form.Item name="siteTagline" label="Slogan">
            <Input placeholder="Tinh Hoa Tram Huong" />
          </Form.Item>
          <Form.Item name="siteDescription" label="Mo ta website">
            <TextArea rows={3} placeholder="Mo ta ngan gon ve website" />
          </Form.Item>
          <Divider />
          <Form.Item name="logoUrl" label="Logo">
            <ImageUpload folder="logos" placeholder="Upload logo website" showAttributes />
          </Form.Item>
          <Form.Item name="logoDarkUrl" label="Logo Dark Mode">
            <ImageUpload folder="logos" placeholder="Upload logo cho dark mode" showAttributes />
          </Form.Item>
          <Form.Item name="faviconUrl" label="Favicon">
            <ImageUpload folder="logos" placeholder="Upload favicon (32x32 hoặc 64x64 px)" maxSize={1} showAttributes />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'contact',
      label: (
        <span className="flex items-center gap-2">
          <MailOutlined /> Lien he
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="contactEmail" label="Email">
            <Input placeholder="contact@example.com" prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item name="contactPhone" label="So dien thoai">
            <Input placeholder="0123 456 789" prefix={<PhoneOutlined />} />
          </Form.Item>
          <Form.Item name="contactAddress" label="Dia chi">
            <TextArea rows={2} placeholder="123 Duong ABC, Quan XYZ, TP.HCM" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'social',
      label: (
        <span className="flex items-center gap-2">
          <FacebookOutlined /> Mang xa hoi
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="facebookUrl" label="Facebook">
            <Input placeholder="https://facebook.com/yourpage" prefix={<FacebookOutlined />} />
          </Form.Item>
          <Form.Item name="instagramUrl" label="Instagram">
            <Input placeholder="https://instagram.com/yourpage" prefix={<InstagramOutlined />} />
          </Form.Item>
          <Form.Item name="youtubeUrl" label="YouTube">
            <Input placeholder="https://youtube.com/@yourchannel" prefix={<YoutubeOutlined />} />
          </Form.Item>
          <Form.Item name="tiktokUrl" label="TikTok">
            <Input placeholder="https://tiktok.com/@yourpage" />
          </Form.Item>
          <Form.Item name="zaloUrl" label="Zalo">
            <Input placeholder="https://zalo.me/yourpage" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'homepage',
      label: (
        <span className="flex items-center gap-2">
          <HomeOutlined /> Trang chu
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Title level={5}>Hero Section</Title>
          <Form.Item name="heroTitle" label="Tieu de Hero">
            <Input placeholder="TRAM HUONG" />
          </Form.Item>
          <Form.Item name="heroSubtitle" label="Phu de Hero">
            <Input placeholder="Tinh Hoa Thien Nhien Viet Nam" />
          </Form.Item>

          <Divider />
          <Title level={5}>Category Section</Title>
          <Form.Item name="categorySectionTitle" label="Tieu de">
            <Input placeholder="Tinh Hoa Tram Huong" />
          </Form.Item>
          <Form.Item name="categorySectionSubtitle" label="Phu de">
            <Input placeholder="Curated By Duc Viet" />
          </Form.Item>

          <Divider />
          <Title level={5}>Service Section</Title>
          <Form.Item name="serviceSectionTitle" label="Tieu de">
            <Input placeholder="DUC VIET SERVICES" />
          </Form.Item>

          <div className="flex justify-between items-center mb-2">
            <Text strong>Danh sach dich vu</Text>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddService}>
              Them dich vu
            </Button>
          </div>
          <List
            bordered
            dataSource={services}
            locale={{ emptyText: 'Chua co dich vu nao' }}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditService(index)}
                  />,
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteService(index)}
                  />,
                ]}
              >
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: 'footer',
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined /> Footer
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="footerText" label="Noi dung Footer">
            <TextArea rows={3} placeholder="Gioi thieu ngan ve cong ty..." />
          </Form.Item>
          <Form.Item name="copyrightText" label="Copyright">
            <Input placeholder="2024 Duc Viet. All rights reserved." />
          </Form.Item>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2">
            <SettingOutlined /> Cai dat Website
          </Title>
          <Text type="secondary">Quan ly thong tin, logo, noi dung trang chu</Text>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={saving}
          onClick={() => form.submit()}
        >
          Luu thay doi
        </Button>
      </div>

      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={defaultSettings}
        >
          <Tabs items={items} />
        </Form>
      </Card>

      {/* Service Modal */}
      <Modal
        title={editingServiceIndex !== null ? 'Chinh sua dich vu' : 'Them dich vu'}
        open={serviceModalOpen}
        onCancel={() => setServiceModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={serviceForm} layout="vertical" onFinish={handleServiceSave} className="mt-4">
          <Form.Item name="title" label="Tieu de" rules={[{ required: true }]}>
            <Input placeholder="GIAO HANG TAN NOI" />
          </Form.Item>
          <Form.Item name="description" label="Mo ta" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="Mo ta dich vu..." />
          </Form.Item>
          <Form.Item name="imageUrl" label="Hinh anh">
            <ImageUpload folder="products" placeholder="Upload hinh anh dich vu" showAttributes />
          </Form.Item>
          <Form.Item name="linkText" label="Noi dung link">
            <Input placeholder="Tim Hieu Them" />
          </Form.Item>
          <Form.Item name="linkUrl" label="URL link">
            <Input placeholder="/about" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setServiceModalOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit">
              {editingServiceIndex !== null ? 'Cap nhat' : 'Them'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
