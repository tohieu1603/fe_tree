'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Form, Input, Select, Button, Card, message, Row, Col, Image,
  Divider, Typography, Space, Tag, Switch, Collapse, Avatar, InputNumber
} from 'antd';
import {
  SaveOutlined, ArrowLeftOutlined, EyeOutlined, PictureOutlined,
  SendOutlined, TagsOutlined, ClockCircleOutlined, StarOutlined,
  CommentOutlined, LinkOutlined, GlobalOutlined, CloseOutlined,
  UserOutlined, ThunderboltOutlined, CheckCircleOutlined,
  FileSearchOutlined, CopyOutlined, CodeOutlined, BulbOutlined,
  SyncOutlined, EditOutlined
} from '@ant-design/icons';
import BlockEditor, { ContentBlock, blocksToMarkdown } from '@/components/admin/BlockEditor';
import ImageUpload, { ImageData } from '@/components/admin/ImageUpload';
import { createArticle } from '@/lib/articles';
import { getAdminCategories } from '@/lib/categories';
import { getUser } from '@/lib/auth';
import type { Category, ArticleRequest, User } from '@/types';

const { Title, Text } = Typography;

export default function NewArticlePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    summary: '',
    featuredImage: '' as string | ImageData,
    tags: '',
    isFeatured: false,
    allowComments: true,
    sourceUrl: '',
    customReadingTime: null as number | null,
  });

  useEffect(() => {
    getAdminCategories().then(setCategories).catch(console.error);
    setCurrentUser(getUser());
  }, []);

  const updateFormData = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const onFinish = async (values: ArticleRequest) => {
    if (contentBlocks.length === 0) {
      message.error('Noi dung bai viet khong duoc de trong');
      return;
    }
    setLoading(true);
    try {
      // Convert blocks to markdown for storage
      const content = blocksToMarkdown(contentBlocks);

      // Extract image data
      const imageData = typeof formData.featuredImage === 'object' ? formData.featuredImage : null;
      const imageUrl = typeof formData.featuredImage === 'string'
        ? formData.featuredImage
        : formData.featuredImage?.url || '';

      // Extract table of contents from headings
      const tableOfContents = contentBlocks
        .filter(b => ['H2', 'H3', 'H4'].includes(b.type) && b.content.trim())
        .map(b => ({ type: b.type, content: b.content, anchor: b.anchor }));

      await createArticle({
        ...values,
        content,
        contentBlocks: JSON.stringify(contentBlocks),
        tableOfContents: JSON.stringify(tableOfContents),
        summary: formData.summary,
        featuredImage: imageUrl,
        featuredImageAlt: imageData?.alt || '',
        featuredImageWidth: imageData?.width,
        featuredImageHeight: imageData?.height,
        tags: formData.tags,
        isFeatured: formData.isFeatured,
        allowComments: formData.allowComments,
        sourceUrl: formData.sourceUrl,
        readingTime: formData.customReadingTime || readingTime,
      });
      message.success('Tao bai viet thanh cong!');
      router.push('/admin/articles');
    } catch {
      message.error('Tao bai viet that bai');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    form.setFieldValue('status', 'PUBLISHED');
    form.submit();
  };

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setFieldValue('slug', slug);
  };

  // Calculate reading time from blocks
  const wordCount = contentBlocks.reduce((acc, b) => acc + b.content.split(/\s+/).filter(Boolean).length, 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-10 py-4 -mt-4 -mx-6 px-6 border-b">
        <div className="flex items-center gap-4">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/admin/articles')} />
          <Title level={3} className="!mb-0">Tao bai viet moi</Title>
          <Tag color="orange">Nhap</Tag>
        </div>
        <Space>
          <Button icon={<CloseOutlined />} onClick={() => router.push('/admin/articles')}>
            Huy
          </Button>
          <Button icon={<EyeOutlined />} disabled>Xem truoc</Button>
          <Button
            type="default"
            htmlType="submit"
            form="articleForm"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Luu nhap
          </Button>
          <Button
            type="primary"
            onClick={handlePublish}
            loading={loading}
            icon={<SendOutlined />}
          >
            Xuat ban
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        id="articleForm"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'DRAFT', allowComments: true }}
      >
        <Row gutter={24}>
          {/* Main Content */}
          <Col xs={24} xl={16}>
            {/* Title & Summary Card */}
            <Card className="mb-4 shadow-sm">
              <Form.Item
                name="title"
                rules={[{ required: true, message: 'Tieu de bat buoc' }]}
              >
                <Input
                  placeholder="Nhap tieu de bai viet..."
                  size="large"
                  className="text-2xl font-semibold border-0 border-b rounded-none px-0 focus:shadow-none"
                  onChange={(e) => generateSlug(e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Tom tat" className="mb-0">
                <Input.TextArea
                  value={formData.summary}
                  onChange={(e) => updateFormData('summary', e.target.value)}
                  placeholder="Mo ta ngan ve bai viet (hien thi tren card bai viet)..."
                  rows={3}
                  showCount
                  maxLength={300}
                />
              </Form.Item>
            </Card>

            {/* Content Editor */}
            <Card
              title="Noi dung"
              className="shadow-sm mb-4"
              extra={
                <Space>
                  <Tag icon={<ClockCircleOutlined />}>~{readingTime} phut doc</Tag>
                  <Text type="secondary">{wordCount} tu</Text>
                  <Text type="secondary">{contentBlocks.length} blocks</Text>
                </Space>
              }
            >
              <BlockEditor value={contentBlocks} onChange={setContentBlocks} />
            </Card>

            {/* Tags */}
            <Card title="The" className="shadow-sm mb-4" extra={<TagsOutlined />}>
              <Input
                placeholder="Nhap the, cach nhau bang dau phay (vd: cong nghe, tin tuc, huong dan)"
                value={formData.tags}
                onChange={(e) => updateFormData('tags', e.target.value)}
                prefix={<TagsOutlined className="text-gray-400" />}
              />
              {formData.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, i) => (
                    tag.trim() && <Tag key={i} color="blue">{tag.trim()}</Tag>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} xl={8}>
            {/* Author Info */}
            <Card title="Tac gia" className="mb-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500" />
                <div>
                  <Text strong className="block">{currentUser?.fullName || 'Admin'}</Text>
                  <Text type="secondary" className="text-sm">{currentUser?.email}</Text>
                </div>
              </div>
            </Card>

            {/* Reading Time */}
            <Card
              title={<span><ClockCircleOutlined className="mr-2" />Thoi gian doc</span>}
              className="mb-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <InputNumber
                  value={formData.customReadingTime || readingTime}
                  onChange={(v) => updateFormData('customReadingTime', v)}
                  min={1}
                  max={60}
                  className="w-20"
                />
                <Text>phut</Text>
              </div>
              <Text type="secondary" className="text-xs mt-2 block">
                Tu dong tinh tu noi dung (~200 tu/phut)
              </Text>
            </Card>

            {/* AI SEO Assistant */}
            <Card
              title={<span><ThunderboltOutlined className="mr-2 text-yellow-500" />AI SEO Assistant</span>}
              className="mb-4 shadow-sm"
            >
              <Collapse ghost size="small" className="-mx-3">
                <Collapse.Panel
                  header={<span><EditOutlined className="mr-2" />SEO Score (AI)</span>}
                  key="seo-score"
                >
                  <Button type="primary" ghost block icon={<SyncOutlined />}>
                    Phan tich SEO
                  </Button>
                  <Text type="secondary" className="text-xs mt-2 block">
                    Phan tich va cham diem SEO cho bai viet
                  </Text>
                </Collapse.Panel>

                <Collapse.Panel
                  header={<span><BulbOutlined className="mr-2" />Smart Meta Generator</span>}
                  key="meta-gen"
                >
                  <Button block icon={<ThunderboltOutlined />}>
                    Tao Meta tu dong
                  </Button>
                  <Text type="secondary" className="text-xs mt-2 block">
                    Tu dong tao meta title, description tu noi dung
                  </Text>
                </Collapse.Panel>

                <Collapse.Panel
                  header={<span><LinkOutlined className="mr-2" />Internal Links</span>}
                  key="internal-links"
                >
                  <Button block icon={<FileSearchOutlined />}>
                    Tim lien ket noi bo
                  </Button>
                  <Text type="secondary" className="text-xs mt-2 block">
                    Goi y cac bai viet lien quan de lien ket
                  </Text>
                </Collapse.Panel>

                <Collapse.Panel
                  header={<span><CopyOutlined className="mr-2" />Duplicate Check</span>}
                  key="duplicate"
                >
                  <Button block icon={<CheckCircleOutlined />}>
                    Kiem tra trung lap
                  </Button>
                  <Text type="secondary" className="text-xs mt-2 block">
                    Kiem tra noi dung trung lap voi bai viet khac
                  </Text>
                </Collapse.Panel>

                <Collapse.Panel
                  header={<span><CodeOutlined className="mr-2" />Schema Generator</span>}
                  key="schema"
                >
                  <Button block icon={<CodeOutlined />}>
                    Tao Schema Markup
                  </Button>
                  <Text type="secondary" className="text-xs mt-2 block">
                    Tao structured data cho Google
                  </Text>
                </Collapse.Panel>
              </Collapse>
            </Card>

            {/* Content Optimizer */}
            <Card
              title={<span><BulbOutlined className="mr-2 text-orange-500" />Content Optimizer</span>}
              className="mb-4 shadow-sm"
            >
              <Button type="primary" ghost block icon={<ThunderboltOutlined />}>
                Phan tich & Goi y
              </Button>
              <Text type="secondary" className="text-xs mt-2 block">
                AI se phan tich noi dung va dua ra goi y cu the
              </Text>
            </Card>

            {/* Publish Settings */}
            <Card title="Cai dat xuat ban" className="mb-4 shadow-sm">
              <Form.Item name="status" label="Trang thai">
                <Select
                  options={[
                    { value: 'DRAFT', label: 'Nhap' },
                    { value: 'PUBLISHED', label: 'Da xuat ban' },
                    { value: 'ARCHIVED', label: 'Luu tru' },
                  ]}
                />
              </Form.Item>

              <Form.Item name="categoryId" label="Danh muc">
                <Select
                  placeholder="Chon danh muc"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                />
              </Form.Item>

              <Form.Item name="slug" label="Duong dan URL" extra="Tu dong tao tu tieu de">
                <Input addonBefore="/article/" placeholder="duong-dan-bai-viet" />
              </Form.Item>

              <Divider className="my-3" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StarOutlined className="text-yellow-500" />
                  <Text>Bai viet noi bat</Text>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onChange={(v) => updateFormData('isFeatured', v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CommentOutlined className="text-blue-500" />
                  <Text>Cho phep binh luan</Text>
                </div>
                <Switch
                  checked={formData.allowComments}
                  onChange={(v) => updateFormData('allowComments', v)}
                />
              </div>
            </Card>

            {/* Featured Image */}
            <Card title="Anh dai dien" className="mb-4 shadow-sm">
              <ImageUpload
                value={formData.featuredImage}
                onChange={(val) => updateFormData('featuredImage', val)}
                folder="articles"
                showAttributes={true}
                placeholder="Upload anh dai dien (1200x630px)"
              />
              <Text type="secondary" className="text-xs mt-2 block">
                Kich thuoc khuyen nghi: 1200x630px. Ho tro alt text, kich thuoc cho SEO.
              </Text>
            </Card>

            {/* Source URL */}
            <Card title="Nguon bai viet" className="mb-4 shadow-sm">
              <Input
                placeholder="URL nguon tham khao (neu co)"
                value={formData.sourceUrl}
                onChange={(e) => updateFormData('sourceUrl', e.target.value)}
                prefix={<LinkOutlined />}
              />
            </Card>

            {/* SEO Settings */}
            <Collapse defaultActiveKey={[]} className="mb-4">
              <Collapse.Panel header="Cai dat SEO" key="seo" extra={<GlobalOutlined />}>
                <Form.Item
                  name="metaTitle"
                  label="Tieu de SEO"
                  extra="De trong se dung tieu de bai viet"
                >
                  <Input placeholder="Tieu de SEO (toi da 60 ky tu)" showCount maxLength={60} />
                </Form.Item>

                <Form.Item
                  name="metaDescription"
                  label="Mo ta SEO"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Mo ta SEO (toi da 160 ky tu)"
                    showCount
                    maxLength={160}
                  />
                </Form.Item>

                <Form.Item name="metaKeywords" label="Tu khoa SEO">
                  <Input placeholder="tu-khoa-1, tu-khoa-2" />
                </Form.Item>

                <Form.Item name="canonicalUrl" label="Canonical URL">
                  <Input placeholder="https://..." prefix={<GlobalOutlined />} />
                </Form.Item>

                <Divider className="my-3" />
                <div className="bg-gray-50 p-3 rounded">
                  <Text strong className="text-green-700 block mb-1">Xem truoc tren Google</Text>
                  <Text className="text-blue-600 block truncate text-sm">
                    {form.getFieldValue('metaTitle') || form.getFieldValue('title') || 'Tieu de bai viet'}
                  </Text>
                  <Text type="secondary" className="text-xs block">
                    yoursite.com/article/{form.getFieldValue('slug') || 'duong-dan'}
                  </Text>
                  <Text type="secondary" className="text-xs line-clamp-2">
                    {form.getFieldValue('metaDescription') || formData.summary || 'Mo ta bai viet se hien thi o day...'}
                  </Text>
                </div>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
