'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { login, register, isAuthenticated } from '@/lib/auth';

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/admin');
    }
  }, [router]);

  const onLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful!');
      window.location.href = '/admin';
    } catch {
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: { email: string; password: string; fullName: string }) => {
    setLoading(true);
    try {
      await register(values.email, values.password, values.fullName);
      message.success('Registration successful!');
      window.location.href = '/admin';
    } catch {
      message.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">Admin Panel</Title>

        <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={[
          {
            key: 'login',
            label: 'Login',
            children: (
              <Form onFinish={onLogin} layout="vertical">
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please enter password' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">Login</Button>
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'register',
            label: 'Register',
            children: (
              <Form onFinish={onRegister} layout="vertical">
                <Form.Item name="fullName" rules={[{ required: true, message: 'Please enter full name' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}>
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password min 6 chars' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large">Register</Button>
                </Form.Item>
              </Form>
            ),
          },
        ]} />
      </Card>
    </div>
  );
}
