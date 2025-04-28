// layouts/RoleLayout.tsx
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export const RoleLayout = ({ role }: { role: 'funder' | 'incubatee' | 'consultant' }) => {
  // Define menu items based on role
  const menuItems = {
    funder: [
      { key: 'dashboard', label: <Link to="/funder">Dashboard</Link> },
      { key: 'approvals', label: <Link to="/funder/approvals">Approvals</Link> },
      { key: 'budget', label: <Link to="/funder/budget">Budget</Link> },
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
  };

  return (
    <Layout>
      <Sider>
        <Menu 
          items={menuItems[role]} 
          theme="dark" 
          mode="inline" 
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px' }}>
          <Outlet /> {/* Sub-routes render here */}
        </Content>
      </Layout>
    </Layout>
  );
};
