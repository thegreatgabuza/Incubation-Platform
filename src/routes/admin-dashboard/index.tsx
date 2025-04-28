import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Tabs, 
  Divider, 
  Button,
  Space
} from "antd";
import { 
  UserOutlined, 
  TeamOutlined, 
  SettingOutlined, 
  FileSearchOutlined,
  FormOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { UserManagement } from "@/components/user-management";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export const AdminDashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity<UserIdentity>();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Admin Dashboard</Title>
      <Text type="secondary">System administration and user management</Text>
      
      <Divider />
      
      {/* Stats Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Total Users" 
              value={35} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Forms & Templates" 
              value={12} 
              prefix={<FormOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="System Configurations" 
              value={8} 
              prefix={<SettingOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic 
              title="Audit Logs" 
              value={157} 
              prefix={<FileSearchOutlined />} 
            />
            <Text type="secondary">Last 30 days</Text>
          </Card>
        </Col>
      </Row>
      
      {/* Main Tabs */}
      <Tabs defaultActiveKey="users">
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              User Management
            </span>
          } 
          key="users"
        >
          <Card title="User Administration">
            <UserManagement />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <FormOutlined />
              Forms & Templates
            </span>
          } 
          key="forms"
        >
          <Card title="Form Management">
            <div style={{ marginBottom: '16px' }}>
              <Text>Create and manage form templates for applications, evaluations, and compliance checklists.</Text>
            </div>
            
            <Space>
              <Button 
                type="primary" 
                icon={<FormOutlined />}
                onClick={() => navigate('/admin/forms')}
              >
                Manage Forms
              </Button>
              
              <Button
                icon={<FileTextOutlined />}
                onClick={() => navigate('/admin/forms')}
              >
                View Submissions
              </Button>
            </Space>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              Settings
            </span>
          } 
          key="settings"
        >
          <Card title="System Configuration">
            <p>This section is under development.</p>
            <p>Here you will be able to manage system-wide settings, customize the platform appearance, and configure notifications.</p>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage; 