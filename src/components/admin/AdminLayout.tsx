'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Button, Typography, Avatar, Dropdown, Spin, Badge, Breadcrumb, Tooltip, Switch } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { logout, getUser, isAuthenticated } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';
import type { User } from '@/types';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/articles', icon: <FileTextOutlined />, label: 'Bai viet' },
  { key: '/admin/categories', icon: <FolderOutlined />, label: 'Danh muc' },
  { key: '/admin/settings', icon: <SettingOutlined />, label: 'Cai dat SEO' },
];

const getBreadcrumbItems = (pathname: string): { title: React.ReactNode; href?: string }[] => {
  const items: { title: React.ReactNode; href?: string }[] = [
    { title: <HomeOutlined />, href: '/admin' }
  ];

  if (pathname.includes('/articles')) {
    items.push({ title: 'Bai viet', href: '/admin/articles' });
    if (pathname.includes('/new')) {
      items.push({ title: 'Tao moi' });
    } else if (pathname.match(/\/articles\/[^/]+$/)) {
      items.push({ title: 'Chinh sua' });
    }
  } else if (pathname.includes('/categories')) {
    items.push({ title: 'Danh muc', href: '/admin/categories' });
  } else if (pathname.includes('/settings')) {
    items.push({ title: 'Cai dat SEO', href: '/admin/settings' });
  } else if (pathname === '/admin') {
    items.push({ title: 'Dashboard' });
  }

  return items;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  const isDark = mode === 'dark';

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        window.location.href = '/admin/login';
        return;
      }
      setUser(getUser());
      setChecking(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Ho so', disabled: true },
      { key: 'settings', icon: <SettingOutlined />, label: 'Cai dat', disabled: true },
      { type: 'divider' as const },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Dang xuat', onClick: handleLogout, danger: true },
    ],
  };

  if (checking) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text type="secondary">Dang tai...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const breadcrumbItems = getBreadcrumbItems(pathname);

  return (
    <Layout className="min-h-screen">
      {/* Light Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={240}
        className={`shadow-sm border-r ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
        style={{
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          background: isDark ? '#1f2937' : '#ffffff',
        }}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center justify-center border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          {collapsed ? (
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GlobalOutlined className="text-white text-lg" />
              </div>
              <div>
                <Title level={5} className={`!mb-0 ${isDark ? '!text-white' : '!text-gray-800'}`}>Tree Admin</Title>
                <Text type="secondary" className="text-xs">Quan ly noi dung</Text>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <Menu
          theme={isDark ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[
            pathname.startsWith('/admin/articles') ? '/admin/articles' :
            pathname.startsWith('/admin/categories') ? '/admin/categories' :
            pathname.startsWith('/admin/settings') ? '/admin/settings' : '/admin'
          ]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          className="border-none mt-2 px-2"
          style={{ background: 'transparent' }}
        />

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          {!collapsed && (
            <div className="flex items-center justify-between">
              <Text type="secondary" className="text-xs">Tree CMS v1.0</Text>
              <Tooltip title={isDark ? 'Che do sang' : 'Che do toi'}>
                <Switch
                  size="small"
                  checked={isDark}
                  onChange={toggleTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                />
              </Tooltip>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <Tooltip title={isDark ? 'Che do sang' : 'Che do toi'}>
                <Button
                  type="text"
                  size="small"
                  icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                />
              </Tooltip>
            </div>
          )}
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header
          className={`px-6 flex items-center justify-between shadow-sm sticky top-0 z-10 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          style={{
            background: isDark ? '#1f2937' : '#ffffff',
            borderBottom: `1px solid ${isDark ? '#374151' : '#f3f4f6'}`,
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <Tooltip title="Tim kiem">
              <Button type="text" icon={<SearchOutlined />} />
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Thong bao">
              <Badge count={3} size="small">
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
            </Tooltip>

            {/* View Site */}
            <Tooltip title="Xem trang web">
              <Button
                type="text"
                icon={<GlobalOutlined />}
                onClick={() => window.open('/', '_blank')}
              />
            </Tooltip>

            {/* Theme Toggle - Mobile */}
            <Tooltip title={isDark ? 'Che do sang' : 'Che do toi'}>
              <Button
                type="text"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className="sm:hidden"
              />
            </Tooltip>

            {/* User Menu */}
            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
              <div className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <Badge dot status="success">
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                </Badge>
                <div className="hidden sm:block">
                  <Text strong className={`block leading-tight text-sm ${isDark ? 'text-white' : ''}`}>{user.fullName}</Text>
                  <Text type="secondary" className="text-xs">{user.role}</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content
          className={`m-4 p-6 rounded-xl shadow-sm min-h-[calc(100vh-120px)] ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          style={{ background: isDark ? '#1f2937' : '#ffffff' }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
