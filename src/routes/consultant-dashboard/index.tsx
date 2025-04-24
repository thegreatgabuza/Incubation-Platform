import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { Row, Col, Card, Typography, Space, Statistic } from "antd";
import { TeamOutlined, CalendarOutlined, StarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

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
              value={0} 
              prefix={<TeamOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="Upcoming Sessions" 
              value={0} 
              prefix={<CalendarOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic 
              title="Feedback Rating" 
              value={0} 
              suffix="/ 5" 
              precision={1}
              prefix={<StarOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="My Participants">
            <Text>No participants assigned yet.</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Upcoming Sessions">
            <Text>No upcoming sessions scheduled.</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConsultantDashboardPage; 