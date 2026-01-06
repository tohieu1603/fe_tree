'use client';

import { useEffect, useState } from 'react';
import { Card, Form, Input, Switch, Select, Button, Typography, Tabs, Space, message, Spin, Divider, Alert } from 'antd';
import { SettingOutlined, GlobalOutlined, RobotOutlined, FileTextOutlined, GoogleOutlined, ShareAltOutlined, SaveOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface SeoSettings {
  id?: string;
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  robotsAllowAll: boolean;
  robotsDisallowPaths: string;
  robotsCustomRules: string;
  sitemapEnabled: boolean;
  sitemapIncludeArticles: boolean;
  sitemapIncludeCategories: boolean;
  sitemapChangeFrequency: string;
  googleAnalyticsId: string;
  googleVerification: string;
  ogImage: string;
  twitterHandle: string;
}

const defaultSettings: SeoSettings = {
  siteName: 'Tree',
  siteUrl: 'http://localhost:3000',
  metaTitle: 'Tree - Product Website',
  metaDescription: 'Product introduction and blog website',
  metaKeywords: '',
  robotsAllowAll: true,
  robotsDisallowPaths: '/admin/,/api/',
  robotsCustomRules: '',
  sitemapEnabled: true,
  sitemapIncludeArticles: true,
  sitemapIncludeCategories: true,
  sitemapChangeFrequency: 'weekly',
  googleAnalyticsId: '',
  googleVerification: '',
  ogImage: '',
  twitterHandle: '',
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const loadSettings = async () => {
    try {
      const res = await api.get('/api/admin/seo');
      const data = res.data.data;
      form.setFieldsValue(data || defaultSettings);
    } catch {
      form.setFieldsValue(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (values: SeoSettings) => {
    setSaving(true);
    try {
      // Clean up values before sending
      const cleanValues = {
        ...values,
        // Ensure URL has protocol
        siteUrl: values.siteUrl?.startsWith('http') ? values.siteUrl : `https://${values.siteUrl}`,
        // Convert empty strings to null for optional fields
        googleAnalyticsId: values.googleAnalyticsId || null,
        googleVerification: values.googleVerification || null,
        ogImage: values.ogImage || null,
        twitterHandle: values.twitterHandle || null,
        robotsCustomRules: values.robotsCustomRules || null,
      };
      await api.put('/api/admin/seo', cleanValues);
      message.success('Cài đặt đã được lưu');
    } catch (error: unknown) {
      console.error('SEO save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lưu thất bại. Vui lòng kiểm tra lại dữ liệu.';
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
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
          <GlobalOutlined /> Chung
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="siteName" label="Tên website" rules={[{ required: true }]}>
            <Input placeholder="Tree" size="large" />
          </Form.Item>
          <Form.Item name="siteUrl" label="URL website" rules={[{ required: true, message: 'Vui lòng nhập URL website' }]}>
            <Input placeholder="https://example.com" size="large" />
          </Form.Item>
          <Divider />
          <Form.Item name="metaTitle" label="Meta Title mặc định">
            <Input placeholder="Tree - Product Website" />
          </Form.Item>
          <Form.Item name="metaDescription" label="Meta Description mặc định">
            <TextArea rows={3} placeholder="Mô tả ngắn gọn về website" showCount maxLength={160} />
          </Form.Item>
          <Form.Item name="metaKeywords" label="Meta Keywords">
            <Input placeholder="keyword1, keyword2, keyword3" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'robots',
      label: (
        <span className="flex items-center gap-2">
          <RobotOutlined /> Robots.txt
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Alert
            message="Robots.txt cho phép hoặc chặn bot tìm kiếm crawl các trang của bạn"
            type="info"
            showIcon
            className="mb-4"
          />
          <Form.Item name="robotsAllowAll" label="Cho phép tất cả bot" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item name="robotsDisallowPaths" label="Đường dẫn bị chặn" extra="Phân cách bằng dấu phẩy, ví dụ: /admin/,/api/">
            <Input placeholder="/admin/,/api/" />
          </Form.Item>
          <Form.Item name="robotsCustomRules" label="Quy tắc tùy chỉnh" extra="Thêm quy tắc robots.txt tùy chỉnh">
            <TextArea rows={5} placeholder="User-agent: Googlebot&#10;Allow: /" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'sitemap',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined /> Sitemap
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Alert
            message="Sitemap giúp công cụ tìm kiếm tìm thấy và index nội dung của bạn"
            type="info"
            showIcon
            className="mb-4"
          />
          <Form.Item name="sitemapEnabled" label="Bật Sitemap" valuePropName="checked">
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
          <Form.Item name="sitemapIncludeArticles" label="Bao gồm bài viết" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item name="sitemapIncludeCategories" label="Bao gồm danh mục" valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item name="sitemapChangeFrequency" label="Tần suất thay đổi">
            <Select
              options={[
                { value: 'always', label: 'Luôn luôn' },
                { value: 'hourly', label: 'Hàng giờ' },
                { value: 'daily', label: 'Hàng ngày' },
                { value: 'weekly', label: 'Hàng tuần' },
                { value: 'monthly', label: 'Hàng tháng' },
                { value: 'yearly', label: 'Hàng năm' },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'analytics',
      label: (
        <span className="flex items-center gap-2">
          <GoogleOutlined /> Analytics
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="googleAnalyticsId" label="Google Analytics ID" extra="Ví dụ: G-XXXXXXXXXX hoặc UA-XXXXXXXX-X">
            <Input placeholder="G-XXXXXXXXXX" />
          </Form.Item>
          <Form.Item name="googleVerification" label="Google Search Console" extra="Meta tag verification code">
            <Input placeholder="google-site-verification code" />
          </Form.Item>
        </div>
      ),
    },
    {
      key: 'social',
      label: (
        <span className="flex items-center gap-2">
          <ShareAltOutlined /> Mạng xã hội
        </span>
      ),
      children: (
        <div className="space-y-4">
          <Form.Item name="ogImage" label="Open Graph Image" extra="URL hình ảnh mặc định khi chia sẻ">
            <Input placeholder="https://example.com/og-image.jpg" />
          </Form.Item>
          <Form.Item name="twitterHandle" label="Twitter Handle" extra="Không bao gồm @">
            <Input placeholder="twitterhandle" addonBefore="@" />
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
            <SettingOutlined /> Cài đặt SEO
          </Title>
          <Text type="secondary">Quản lý sitemap, robots.txt và SEO metadata</Text>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={saving}
          onClick={() => form.submit()}
        >
          Lưu thay đổi
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

      <Card className="shadow-sm mt-4">
        <Title level={5}>Xem trước</Title>
        <Paragraph type="secondary">
          <ul className="list-disc pl-5 space-y-1">
            <li><a href="/robots.txt" target="_blank" rel="noopener noreferrer">/robots.txt</a> - File robots.txt</li>
            <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">/sitemap.xml</a> - XML Sitemap</li>
          </ul>
        </Paragraph>
      </Card>
    </div>
  );
}
