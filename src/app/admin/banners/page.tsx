'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Typography,
  Empty,
  Tabs,
  Select,
  List,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';
import ImageUpload, { getImageUrl } from '@/components/admin/ImageUpload';

const { Title, Text } = Typography;

interface SlideItem {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  slides: SlideItem[];
  bannerType: string;
  labelText: string;
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
  bannerType: string;
  labelText: string;
  active: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [slideForm] = Form.useForm();

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/banners');
      setBanners(res.data.data || []);
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const heroBanner = banners.find(b => b.bannerType === 'HERO' || !b.bannerType);
  const editorialBanner = banners.find(b => b.bannerType === 'EDITORIAL');

  const handleEdit = (banner: Banner | null, type: string) => {
    setEditingBanner(banner);
    if (banner) {
      form.setFieldsValue({
        ...banner,
      });
      setSlides(banner.slides || []);
    } else {
      form.resetFields();
      form.setFieldsValue({
        active: true,
        buttonText: type === 'HERO' ? 'Xem Them' : 'MUA NGAY',
        buttonLink: '/products',
        bannerType: type,
        labelText: type === 'EDITORIAL' ? 'VONG TAY' : '',
      });
      setSlides([]);
    }
    setModalOpen(true);
  };

  const normalizeImageUrl = (url: unknown): string => {
    if (typeof url === 'object' && url !== null && 'url' in url) {
      return (url as { url?: string }).url || '';
    }
    return (url as string) || '';
  };

  const handleSave = async (values: BannerFormData) => {
    setSaving(true);
    try {
      const normalizedValues = {
        ...values,
        imageUrl: normalizeImageUrl(values.imageUrl),
        slides: slides.map(s => ({
          ...s,
          imageUrl: normalizeImageUrl(s.imageUrl),
        })),
        sortOrder: values.bannerType === 'HERO' ? 1 : 2,
      };

      if (editingBanner) {
        await api.put(`/api/admin/banners/${editingBanner.id}`, normalizedValues);
        message.success('Cap nhat banner thanh cong');
      } else {
        await api.post('/api/admin/banners', normalizedValues);
        message.success('Tao banner thanh cong');
      }
      setModalOpen(false);
      loadBanners();
    } catch (error) {
      console.error('Save error:', error);
      message.error('Co loi xay ra khi luu banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Xac nhan xoa',
      content: 'Ban co chac muon xoa banner nay?',
      onOk: async () => {
        try {
          await api.delete(`/api/admin/banners/${id}`);
          message.success('Xoa banner thanh cong');
          loadBanners();
        } catch {
          message.error('Co loi khi xoa banner');
        }
      },
    });
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setPreviewOpen(true);
  };

  // Slide handlers
  const handleAddSlide = () => {
    setEditingSlideIndex(null);
    slideForm.resetFields();
    slideForm.setFieldsValue({
      buttonText: 'Xem Them',
      buttonLink: '/products',
    });
    setSlideModalOpen(true);
  };

  const handleEditSlide = (index: number) => {
    setEditingSlideIndex(index);
    slideForm.setFieldsValue(slides[index]);
    setSlideModalOpen(true);
  };

  const handleDeleteSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSlideSubmit = (values: SlideItem) => {
    const normalizedSlide = {
      ...values,
      imageUrl: normalizeImageUrl(values.imageUrl),
    };

    if (editingSlideIndex !== null) {
      const newSlides = [...slides];
      newSlides[editingSlideIndex] = normalizedSlide;
      setSlides(newSlides);
    } else {
      setSlides([...slides, normalizedSlide]);
    }
    setSlideModalOpen(false);
  };

  const renderBannerCard = (banner: Banner | undefined, type: string, title: string, description: string) => (
    <Card className="shadow-sm mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Title level={4} className="!mb-1">{title}</Title>
          <Text type="secondary">{description}</Text>
        </div>
        <Button
          type="primary"
          icon={banner ? <EditOutlined /> : <PlusOutlined />}
          onClick={() => handleEdit(banner || null, type)}
        >
          {banner ? 'Chinh sua' : 'Tao moi'}
        </Button>
      </div>

      {banner ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-xs ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {banner.active ? 'Hien thi' : 'An'}
            </span>
            <span className="text-sm text-gray-500">
              {type === 'HERO' ? `${banner.slides?.length || 0} slides` : banner.title}
            </span>
          </div>

          {type === 'HERO' && banner.slides && banner.slides.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {banner.slides.map((slide, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                  onClick={() => handlePreview(getImageUrl(slide.imageUrl))}
                >
                  <img
                    src={getImageUrl(slide.imageUrl)}
                    alt={slide.title || `Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <EyeOutlined className="text-white text-2xl" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                    <div className="font-medium truncate">{slide.title || `Slide ${index + 1}`}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : type === 'EDITORIAL' && banner.imageUrl ? (
            <div
              className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
              onClick={() => handlePreview(getImageUrl(banner.imageUrl))}
            >
              <img
                src={getImageUrl(banner.imageUrl)}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <EyeOutlined className="text-white text-2xl" />
              </div>
              {banner.labelText && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                  {banner.labelText}
                </div>
              )}
            </div>
          ) : (
            <Empty description="Chua co anh" />
          )}

          <Button type="link" danger className="p-0" onClick={() => handleDelete(banner.id)}>
            Xoa banner
          </Button>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chua co banner" />
      )}
    </Card>
  );

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-6">
        <Title level={3} className="!mb-1 flex items-center gap-2">
          <PictureOutlined /> Quan ly Banner
        </Title>
        <Text type="secondary">Quan ly Hero slideshow va Editorial banner</Text>
      </div>

      {loading ? (
        <Card loading />
      ) : (
        <>
          {renderBannerCard(
            heroBanner,
            'HERO',
            'Hero Banner (Slideshow)',
            'Banner chinh trang chu voi nhieu slides, moi slide co title/subtitle/button rieng'
          )}

          {renderBannerCard(
            editorialBanner,
            'EDITORIAL',
            'Editorial Banner',
            'Banner giua trang voi hinh anh lon va noi dung quang cao'
          )}
        </>
      )}

      {/* Edit/Add Banner Modal */}
      <Modal
        title={editingBanner ? 'Chinh sua Banner' : 'Tao Banner'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="mt-4"
        >
          <Form.Item name="bannerType" hidden>
            <Input />
          </Form.Item>

          <Tabs
            items={[
              {
                key: 'content',
                label: 'Noi dung chinh',
                children: (
                  <div className="space-y-4">
                    <Form.Item
                      name="title"
                      label="Tieu de chinh"
                      rules={[{ required: true, message: 'Vui long nhap tieu de' }]}
                    >
                      <Input placeholder="Tieu de hien thi tren banner" size="large" />
                    </Form.Item>

                    <Form.Item name="subtitle" label="Mo ta ngan">
                      <Input.TextArea rows={2} placeholder="Mo ta ngan gon" />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) => prev.bannerType !== curr.bannerType}
                    >
                      {({ getFieldValue }) =>
                        getFieldValue('bannerType') === 'EDITORIAL' && (
                          <Form.Item name="labelText" label="Label (nhan)">
                            <Input placeholder="VD: VONG TAY" />
                          </Form.Item>
                        )
                      }
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item name="buttonText" label="Noi dung nut">
                        <Input placeholder="Xem Them" />
                      </Form.Item>
                      <Form.Item name="buttonLink" label="Lien ket nut">
                        <Input placeholder="/products" />
                      </Form.Item>
                    </div>

                    <Form.Item name="active" label="Trang thai" valuePropName="checked">
                      <Switch checkedChildren="Hien thi" unCheckedChildren="An" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: 'slides',
                label: form.getFieldValue('bannerType') === 'EDITORIAL' ? 'Hinh anh' : 'Slides',
                children: (
                  <div className="space-y-4">
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, curr) => prev.bannerType !== curr.bannerType}
                    >
                      {({ getFieldValue }) =>
                        getFieldValue('bannerType') === 'EDITORIAL' ? (
                          <Form.Item name="imageUrl" label="Hinh anh banner">
                            <ImageUpload folder="banners" placeholder="Upload hinh anh banner" />
                          </Form.Item>
                        ) : (
                          <div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                              <p className="text-sm text-blue-700">
                                Moi slide co the co title, subtitle va button rieng. Neu de trong, se dung noi dung chinh.
                              </p>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                              <Text strong>Danh sach Slides ({slides.length})</Text>
                              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSlide}>
                                Them Slide
                              </Button>
                            </div>

                            <List
                              bordered
                              dataSource={slides}
                              locale={{ emptyText: 'Chua co slide nao' }}
                              renderItem={(slide, index) => (
                                <List.Item
                                  actions={[
                                    <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEditSlide(index)} />,
                                    <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSlide(index)} />,
                                  ]}
                                >
                                  <List.Item.Meta
                                    avatar={
                                      slide.imageUrl && (
                                        <img
                                          src={getImageUrl(slide.imageUrl)}
                                          alt=""
                                          className="w-20 h-12 object-cover rounded"
                                        />
                                      )
                                    }
                                    title={slide.title || `Slide ${index + 1}`}
                                    description={slide.subtitle || 'Khong co mo ta'}
                                  />
                                </List.Item>
                              )}
                            />

                            <Divider />

                            <Form.Item
                              name="imageUrl"
                              label="Anh mac dinh (fallback)"
                              help="Anh nay duoc su dung neu khong co slide nao"
                            >
                              <ImageUpload folder="banners" placeholder="Upload anh mac dinh" />
                            </Form.Item>
                          </div>
                        )
                      }
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button onClick={() => setModalOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              {editingBanner ? 'Cap nhat' : 'Tao moi'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Slide Modal */}
      <Modal
        title={editingSlideIndex !== null ? 'Chinh sua Slide' : 'Them Slide'}
        open={slideModalOpen}
        onCancel={() => setSlideModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={slideForm} layout="vertical" onFinish={handleSlideSubmit} className="mt-4">
          <Form.Item
            name="imageUrl"
            label="Hinh anh"
            rules={[{ required: true, message: 'Vui long upload hinh anh' }]}
          >
            <ImageUpload folder="banners" placeholder="Upload hinh anh slide" />
          </Form.Item>

          <Form.Item name="title" label="Tieu de (tuy chon)">
            <Input placeholder="De trong de dung tieu de chinh" />
          </Form.Item>

          <Form.Item name="subtitle" label="Mo ta (tuy chon)">
            <Input.TextArea rows={2} placeholder="De trong de dung mo ta chinh" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="buttonText" label="Noi dung nut">
              <Input placeholder="Xem Them" />
            </Form.Item>
            <Form.Item name="buttonLink" label="Lien ket">
              <Input placeholder="/products" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setSlideModalOpen(false)}>Huy</Button>
            <Button type="primary" htmlType="submit">
              {editingSlideIndex !== null ? 'Cap nhat' : 'Them'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={1000}
      >
        <img src={previewImage} alt="Preview" className="w-full" />
      </Modal>
    </div>
  );
}
