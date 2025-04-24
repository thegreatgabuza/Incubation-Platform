import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { Row, Col, Card, Typography, Space, Statistic, Tabs } from "antd";
import { TeamOutlined, CalendarOutlined, StarOutlined } from "@ant-design/icons";
import { ConsultantAssignments } from "./ConsultantAssignments";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface UserIdentity {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  [key: string]: any;
}

export const ConsultantDashboardPage: React.FC = () => {
  const { data: user } = useGetIdentity<UserIdentity>();

  return (
    <div style={{ padding: "20px" }}>
      <Title level={3}>Consultant Dashboard</Title>
      <Text>Welcome back, {user?.name || "Consultant"}</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="Assigned Participants" 
              value={2} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="Upcoming Sessions" 
              value={1} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="Feedback Rating" 
              value={4.5} 
              suffix="/ 5" 
              precision={1}
              prefix={<StarOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="My Assignments" key="1">
            <ConsultantAssignments />
          </TabPane>
          <TabPane tab="My Calendar" key="2">
            <div style={{ padding: '20px 0' }}>
              <Text>Calendar view coming soon.</Text>
            </div>
          </TabPane>
          <TabPane tab="Resources" key="3">
            <div style={{ padding: '20px 0' }}>
              <Text>Resources for consultants coming soon.</Text>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}; 