// layouts/RoleLayout.tsx
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Space, Typography, Avatar, message, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  UserOutlined, 
  DollarOutlined, 
  FileTextOutlined, 
  BarChartOutlined, 
  BankOutlined,
  AuditOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const RoleLayout = ({ role }: { role: 'funder' | 'incubatee' | 'consultant' | 'operations' }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('User');
  
  useEffect(() => {
    // Get user info when component mounts
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email || 'User');
    }
  }, []);
  
  // Define menu items based on role
  const menuItems = {
    funder: [
      { key: 'dashboard', icon: <BankOutlined />, label: <Link to="/funder">Dashboard</Link> },
      { key: 'portfolio', icon: <DollarOutlined />, label: <Link to="/funder/portfolio">My Portfolio</Link> },
      { key: 'due-diligence', icon: <AuditOutlined />, label: <Link to="/funder/due-diligence">Due Diligence</Link> },
      { key: 'analytics', icon: <BarChartOutlined />, label: <Link to="/funder/analytics">Analytics</Link> },
      { key: 'documents', icon: <FileTextOutlined />, label: <Link to="/funder/documents">Documents</Link> },
      { key: 'calendar', icon: <CalendarOutlined />, label: <Link to="/funder/calendar">Calendar</Link> },
    ],
    incubatee: [
      { key: 'dashboard', label: <Link to="/incubatee">Dashboard</Link> },
      { key: 'submit', label: <Link to="/incubatee/submit">Submit Project</Link> },
      { key: 'documents', label: <Link to="/incubatee/documents">Documents</Link> },
    ],
    consultant: [
      { key: 'dashboard', label: <Link to="/consultant">Dashboard</Link> },
      { key: 'feedback', label: <Link to="/consultant/feedback">Feedback</Link> },
      { key: 'analytics', label: <Link to="/consultant/analytics">Analytics</Link> },
    ],
    operations: [
      { key: 'dashboard', label: <Link to="/operations">Dashboard</Link> },
      { key: 'participants', label: <Link to="/operations/participants">Participants</Link> },
      { key: 'approvals', label: <Link to="/operations/approvals">Approvals</Link> },
      { key: 'reports', label: <Link to="/operations/reports">Reports</Link> },
      { key: 'resources', label: <Link to="/operations/resources">Resources</Link> },
    ],
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('access_token');
      message.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout. Please try again.');
    }
  };

  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate(`/${role}/profile`)
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => navigate(`/${role}/settings`)
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Layout>
      <Sider>
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }}>
          {role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </div>
        <Menu 
          items={menuItems[role]} 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={['dashboard']}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text>{userName}</Text>
              <DownOutlined />
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: '24px', minHeight: 'calc(100vh - 112px)', background: '#fff' }}>
          <Outlet /> {/* Sub-routes render here */}
        </Content>
      </Layout>
    </Layout>
  );
};
