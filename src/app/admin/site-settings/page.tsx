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
  MenuOutlined,
  BgColorsOutlined,
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

interface MenuItem {
  label: string;
  href: string;
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
  navLeftMenu: MenuItem[];
  navRightMenu: MenuItem[];
  fontPreset: string;
  colorPalette: string;
  borderRadius: string;
}

// Font presets
const fontPresets = [
  { value: 'elegant', label: 'Elegant', description: 'Cormorant Garamond + Inter - Sang trọng, cổ điển' },
  { value: 'modern', label: 'Modern', description: 'Playfair Display + DM Sans - Hiện đại, thanh lịch' },
  { value: 'minimal', label: 'Minimal', description: 'Crimson Pro + Source Sans - Tối giản, dễ đọc' },
  { value: 'luxury', label: 'Luxury', description: 'Cinzel + Lato - Cao cấp, quý phái' },
  { value: 'classic', label: 'Classic', description: 'Libre Baskerville + Open Sans - Truyền thống' },
  { value: 'artistic', label: 'Artistic', description: 'Bodoni Moda + Nunito - Nghệ thuật, ấn tượng' },
];

// Color palettes
const colorPalettes = [
  { value: 'warmGold', label: 'Vàng Ấm', color: '#c9a962', description: 'Trầm hương vàng kim cổ điển' },
  { value: 'deepBrown', label: 'Nâu Sâu', color: '#8b6914', description: 'Màu gỗ trầm đậm' },
  { value: 'honeyAmber', label: 'Hổ Phách', color: '#d4a574', description: 'Hổ phách mật ong' },
  { value: 'antiqueGold', label: 'Vàng Cổ', color: '#b8860b', description: 'Vàng cổ điển quý tộc' },
  { value: 'rosewood', label: 'Gỗ Hồng', color: '#9c6b5e', description: 'Gỗ hồng sang trọng' },
  { value: 'sandalwood', label: 'Gỗ Đàn', color: '#a68b5b', description: 'Gỗ đàn hương tự nhiên' },
];

// Border radius presets
const borderRadiusPresets = [
  { value: 'none', label: 'Không bo', description: 'Góc vuông hoàn toàn', preview: '0' },
  { value: 'subtle', label: 'Bo nhẹ', description: 'Bo góc tinh tế, thanh lịch', preview: '4px' },
  { value: 'rounded', label: 'Bo tròn', description: 'Bo góc rõ ràng, mềm mại', preview: '12px' },
  { value: 'pill', label: 'Hình viên', description: 'Bo tròn hoàn toàn', preview: '9999px' },
];

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
  navLeftMenu: [
    { label: 'Bộ Sưu Tập', href: '/products' },
    { label: 'Câu Chuyện', href: '/articles' },
  ],
  navRightMenu: [
    { label: 'Về Chúng Tôi', href: '/about' },
    { label: 'Liên Hệ', href: '/contact' },
  ],
  fontPreset: 'elegant',
  colorPalette: 'warmGold',
  borderRadius: 'subtle',
};

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [navLeftMenu, setNavLeftMenu] = useState<MenuItem[]>([]);
  const [navRightMenu, setNavRightMenu] = useState<MenuItem[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);
  const [editingMenuSide, setEditingMenuSide] = useState<'left' | 'right'>('left');
  const [form] = Form.useForm();
  const [serviceForm] = Form.useForm();
  const [menuForm] = Form.useForm();

  const loadSettings = async () => {
    try {
      const res = await api.get('/api/admin/site-settings');
      const data = res.data.data;
      if (data) {
        form.setFieldsValue(data);
        setServices(data.services || []);
        setNavLeftMenu(data.navLeftMenu || []);
        setNavRightMenu(data.navRightMenu || []);
      } else {
        form.setFieldsValue(defaultSettings);
        setServices(defaultSettings.services);
        setNavLeftMenu(defaultSettings.navLeftMenu);
        setNavRightMenu(defaultSettings.navRightMenu);
      }
    } catch {
      form.setFieldsValue(defaultSettings);
      setServices(defaultSettings.services);
      setNavLeftMenu(defaultSettings.navLeftMenu);
      setNavRightMenu(defaultSettings.navRightMenu);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Helper to normalize imageUrl from object to string
  const normalizeImageUrl = (url: unknown): string | undefined => {
    if (typeof url === 'object' && url !== null && 'url' in url) {
      return (url as { url?: string }).url;
    }
    return url as string | undefined;
  };

  const handleSave = async (values: SiteSettings) => {
    setSaving(true);
    try {
      // Normalize all image URLs
      const normalizedValues = {
        ...values,
        logoUrl: normalizeImageUrl(values.logoUrl),
        logoDarkUrl: normalizeImageUrl(values.logoDarkUrl),
        faviconUrl: normalizeImageUrl(values.faviconUrl),
        services: services.map(s => ({
          ...s,
          imageUrl: normalizeImageUrl(s.imageUrl) || '',
        })),
        navLeftMenu,
        navRightMenu,
      };
      await api.put('/api/admin/site-settings', normalizedValues);
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

  // Menu handlers
  const handleAddMenu = (side: 'left' | 'right') => {
    setEditingMenuSide(side);
    setEditingMenuIndex(null);
    menuForm.resetFields();
    setMenuModalOpen(true);
  };

  const handleEditMenu = (side: 'left' | 'right', index: number) => {
    setEditingMenuSide(side);
    setEditingMenuIndex(index);
    const menu = side === 'left' ? navLeftMenu : navRightMenu;
    menuForm.setFieldsValue(menu[index]);
    setMenuModalOpen(true);
  };

  const handleDeleteMenu = (side: 'left' | 'right', index: number) => {
    if (side === 'left') {
      setNavLeftMenu(navLeftMenu.filter((_, i) => i !== index));
    } else {
      setNavRightMenu(navRightMenu.filter((_, i) => i !== index));
    }
  };

  const handleMenuSave = (values: MenuItem) => {
    if (editingMenuSide === 'left') {
      if (editingMenuIndex !== null) {
        const newMenu = [...navLeftMenu];
        newMenu[editingMenuIndex] = values;
        setNavLeftMenu(newMenu);
      } else {
        setNavLeftMenu([...navLeftMenu, values]);
      }
    } else {
      if (editingMenuIndex !== null) {
        const newMenu = [...navRightMenu];
        newMenu[editingMenuIndex] = values;
        setNavRightMenu(newMenu);
      } else {
        setNavRightMenu([...navRightMenu, values]);
      }
    }
    setMenuModalOpen(false);
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
      key: 'navigation',
      label: (
        <span className="flex items-center gap-2">
          <MenuOutlined /> Menu
        </span>
      ),
      children: (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Title level={5} className="!mb-0">Menu ben trai</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddMenu('left')}>
                Them
              </Button>
            </div>
            <List
              bordered
              dataSource={navLeftMenu}
              locale={{ emptyText: 'Chua co menu nao' }}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditMenu('left', index)} />,
                    <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteMenu('left', index)} />,
                  ]}
                >
                  <List.Item.Meta title={item.label} description={item.href} />
                </List.Item>
              )}
            />
          </div>

          <Divider />

          <div>
            <div className="flex justify-between items-center mb-3">
              <Title level={5} className="!mb-0">Menu ben phai</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddMenu('right')}>
                Them
              </Button>
            </div>
            <List
              bordered
              dataSource={navRightMenu}
              locale={{ emptyText: 'Chua co menu nao' }}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditMenu('right', index)} />,
                    <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteMenu('right', index)} />,
                  ]}
                >
                  <List.Item.Meta title={item.label} description={item.href} />
                </List.Item>
              )}
            />
          </div>
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
    {
      key: 'theme',
      label: (
        <span className="flex items-center gap-2">
          <BgColorsOutlined /> Giao dien
        </span>
      ),
      children: (
        <div className="space-y-6">
          <div>
            <Title level={5}>Font chu</Title>
            <Text type="secondary" className="block mb-4">Chon kieu font cho tieu de va noi dung</Text>
            <Form.Item name="fontPreset">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fontPresets.map((font) => (
                  <div
                    key={font.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                      form.getFieldValue('fontPreset') === font.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => form.setFieldValue('fontPreset', font.value)}
                  >
                    <div className="font-semibold text-base">{font.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{font.description}</div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          <Divider />

          <div>
            <Title level={5}>Mau sac</Title>
            <Text type="secondary" className="block mb-4">Chon bang mau chu dao cho website</Text>
            <Form.Item name="colorPalette">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {colorPalettes.map((palette) => (
                  <div
                    key={palette.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-400 ${
                      form.getFieldValue('colorPalette') === palette.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => form.setFieldValue('colorPalette', palette.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: palette.color }}
                      />
                      <div>
                        <div className="font-semibold">{palette.label}</div>
                        <div className="text-xs text-gray-500">{palette.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          <Divider />

          <div>
            <Title level={5}>Bo goc (Border Radius)</Title>
            <Text type="secondary" className="block mb-4">Chon kieu bo goc cho anh, nut, input va cac thanh phan khac</Text>
            <Form.Item name="borderRadius">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {borderRadiusPresets.map((preset) => (
                  <div
                    key={preset.value}
                    className={`p-4 border cursor-pointer transition-all hover:border-blue-400 ${
                      form.getFieldValue('borderRadius') === preset.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    style={{ borderRadius: preset.preview }}
                    onClick={() => form.setFieldValue('borderRadius', preset.value)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 mb-2"
                        style={{ borderRadius: preset.preview }}
                      />
                      <div className="font-semibold text-sm">{preset.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Form.Item>
          </div>

          <Divider />

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text type="secondary">
              <strong>Luu y:</strong> Sau khi luu thay doi, vui long refresh trang nguoi dung de xem ket qua.
            </Text>
          </div>
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

      {/* Menu Modal */}
      <Modal
        title={editingMenuIndex !== null ? 'Chinh sua menu' : 'Them menu'}
        open={menuModalOpen}
        onCancel={() => setMenuModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={menuForm} layout="vertical" onFinish={handleMenuSave} className="mt-4">
          <Form.Item name="label" label="Ten hien thi" rules={[{ required: true }]}>
            <Input placeholder="Bo Suu Tap" />
          </Form.Item>
          <Form.Item name="href" label="Duong dan" rules={[{ required: true }]}>
            <Input placeholder="/products" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setMenuModalOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit">
              {editingMenuIndex !== null ? 'Cap nhat' : 'Them'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
