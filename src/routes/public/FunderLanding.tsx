import React, { useState, useEffect, Suspense } from 'react';
import { 
  Layout, 
  Typography, 
  Card, 
  Button, 
  Row, 
  Col, 
  Tag, 
  Statistic, 
  Divider, 
  Space, 
  Tabs,
  Badge,
  Progress,
  Avatar,
  Spin,
  Alert
} from 'antd';
import { 
  FireOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  TeamOutlined,
  UserOutlined,
  BuildOutlined,
  ArrowRightOutlined,
  WarningOutlined,
  GlobalOutlined,
  BarChartOutlined,
  LikeOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, limit, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;

// Error boundary class for catching rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Landing page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Alert
            message="Something went wrong"
            description={
              <div>
                <p>We encountered an issue loading the platform content.</p>
                <p>Please try refreshing the page or contact support if the problem persists.</p>
                <p style={{ fontSize: '12px', marginTop: '20px' }}>
                  Error details: {this.state.error?.message || "Unknown error"}
                </p>
                <Button 
                  type="primary" 
                  onClick={() => window.location.reload()} 
                  style={{ marginTop: '20px' }}
                >
                  Refresh Page
                </Button>
              </div>
            }
            type="error"
            showIcon
            icon={<WarningOutlined />}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Loader component to show while suspending
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column' 
  }}>
    <Spin size="large" />
    <div style={{ marginTop: 20 }}>Loading the platform...</div>
  </div>
);

// Define a participant interface for type safety
interface Participant {
  id: string;
  name: string;
  logo?: string;
  category?: string;
  industry?: string;
  location?: string;
  description?: string;
  status?: string;
  stage?: string;
  team?: number;
  [key: string]: any; // For any additional fields from Firebase
}

// Platform statistics
const platformStats = [
  {
    title: "Active Participants",
    value: 125,
    icon: <TeamOutlined />
  },
  {
    title: "Support Community",
    value: "1.5K+",
    icon: <UserOutlined />
  },
  {
    title: "Success Stories",
    value: "85+",
    icon: <LikeOutlined />
  },
  {
    title: "Growth Rate",
    value: "72%",
    icon: <BarChartOutlined />
  }
];

// Props interface for the content component
interface PlatformLandingContentProps {
  data: Participant[];
  isLoading: boolean;
  error: string | null;
}

// This is the main content separated from data fetching logic
const PlatformLandingContent: React.FC<PlatformLandingContentProps> = ({ data, isLoading, error }) => {
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'trending':
      case 'active':
        return <Badge.Ribbon text={<><FireOutlined /> ACTIVE</>} color="green" />;
      case 'featured':
      case 'warning':
        return <Badge.Ribbon text="FEATURED" color="blue" />;
      case 'closed':
      case 'inactive':
        return <Badge.Ribbon text={<><CheckCircleOutlined /> INACTIVE</>} color="gray" />;
      default:
        return null;
    }
  };

  return (
    <Layout className="platform-landing-layout">
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1, 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 50px',
        background: '#fff'
      }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            size={32} 
            style={{ backgroundColor: '#1890ff', marginRight: 8 }}
          >Q</Avatar>
          <Title level={4} style={{ margin: 0 }}>Incubation Platform</Title>
        </div>
        <Space>
          <Button type="primary" ghost onClick={handleLoginClick}>Log in</Button>
          <Button type="primary" onClick={handleRegisterClick}>Sign up</Button>
        </Space>
      </Header>

      <Content style={{ padding: '0 50px' }}>
        {/* Hero Section */}
        <div className="hero-section" style={{ 
          textAlign: 'center', 
          padding: '60px 0',
          backgroundImage: 'linear-gradient(120deg, #e0f7fa 0%, #80deea 100%)',
          borderRadius: '0 0 20px 20px',
          marginBottom: 30
        }}>
          <Title level={1}>South Africa's Innovation Ecosystem</Title>
          <Paragraph style={{ fontSize: 18, maxWidth: 800, margin: '0 auto 20px' }}>
            Join our platform connecting entrepreneurs, investors, government entities, and corporates to build sustainable growth and innovation in South Africa.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              onClick={handleRegisterClick}
              style={{ height: 48, fontSize: 16, padding: '0 30px' }}
            >
              Join the Platform
            </Button>
            <Button 
              size="large" 
              style={{ height: 48, fontSize: 16 }}
              onClick={() => document.getElementById('participants')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Participants
            </Button>
          </Space>
        </div>

        {/* Stats Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
          {platformStats.map((stat, index) => (
            <Col key={index} xs={24} sm={12} md={6}>
              <Card>
                <Statistic 
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Platform Users */}
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <Title level={2}>Who Uses Our Platform</Title>
          <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
            <Col xs={24} sm={6}>
              <Card style={{ height: 240 }}>
                <GlobalOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }} />
                <Title level={4}>Government Entities</Title>
                <Paragraph>
                  Track economic development, monitor program effectiveness, and connect with innovative entrepreneurs.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card style={{ height: 240 }}>
                <BarChartOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }} />
                <Title level={4}>Investors</Title>
                <Paragraph>
                  Discover vetted opportunities, build relationships, and support South Africa's innovation ecosystem.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card style={{ height: 240 }}>
                <BuildOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }} />
                <Title level={4}>Entrepreneurs</Title>
                <Paragraph>
                  Access resources, mentorship, and connections to scale your impactful solution.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card style={{ height: 240 }}>
                <TeamOutlined style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }} />
                <Title level={4}>Corporates</Title>
                <Paragraph>
                  Connect with innovative startups, discover partnership opportunities, and support ecosystem development.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Featured Participants */}
        <div id="participants" style={{ marginTop: 60, marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title level={2}>Featured Participants</Title>
            <Tabs defaultActiveKey="all" style={{ marginBottom: 0 }}>
              <TabPane tab="All Participants" key="all" />
              <TabPane tab="Trending" key="trending" />
              <TabPane tab="New Entries" key="recent" />
              <TabPane tab="Success Stories" key="success" />
            </Tabs>
          </div>

          {error && (
            <Alert
              message="Notice"
              description={error}
              type="warning"
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Spin size="default" />
              <div style={{ marginTop: 10 }}>Refreshing data...</div>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {data.map((participant) => (
                <Col key={participant.id} xs={24} sm={12} lg={8} style={{ marginBottom: 20 }}>
                  <Card
                    hoverable
                    style={{ height: '100%', borderRadius: 8, overflow: 'hidden' }}
                    cover={
                      <div style={{ position: 'relative', height: 200, background: '#f0f2f5', overflow: 'hidden' }}>
                        {renderStatusTag(participant.status || 'active')}
                        {/* Use placeholder image if logo doesn't load */}
                        <img 
                          alt={participant.name || 'Program Participant'}
                          src={participant.logo || `https://via.placeholder.com/300x200?text=${encodeURIComponent(participant.name || 'Participant')}`}
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(participant.name || 'Participant')}`;
                          }}
                        />
                      </div>
                    }
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Tag color="blue">{participant.industry || participant.category || 'Other'}</Tag>
                          <Tag>{participant.location || 'South Africa'}</Tag>
                        </div>
                        <Avatar 
                          size="large" 
                          style={{ backgroundColor: '#1890ff' }}
                          icon={<UserOutlined />}
                        />
                      </div>
                      
                      <Title level={4} style={{ marginTop: 10, marginBottom: 5 }}>{participant.name || 'Unnamed Participant'}</Title>
                      
                      <Paragraph ellipsis={{ rows: 3 }} style={{ height: 66 }}>
                        {participant.description || 'No description available'}
                      </Paragraph>
                      
                      <div style={{ marginTop: 10, marginBottom: 5 }}>
                        <Space>
                          <Tag color="cyan">
                            {participant.stage || 'Growth Stage'}
                          </Tag>
                          {participant.team && (
                            <Tag color="purple">
                              Team: {participant.team}
                            </Tag>
                          )}
                        </Space>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <Tag icon={participant.status !== 'closed' && participant.status !== 'inactive' ? 
                          <ClockCircleOutlined /> : <CheckCircleOutlined />} 
                          color={participant.status !== 'closed' && participant.status !== 'inactive' ? "green" : "default"}>
                          {participant.status !== 'closed' && participant.status !== 'inactive' ? 'Active' : 'Inactive'}
                        </Tag>
                        
                        <Button 
                          type="primary" 
                          onClick={handleRegisterClick}
                        >
                          Learn More
                        </Button>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Button type="primary" size="large" onClick={handleRegisterClick}>
              Join The Platform <ArrowRightOutlined />
            </Button>
          </div>
        </div>
        
        {/* Why Join Section */}
        <div style={{ background: '#f0f5ff', padding: '50px', borderRadius: 10, marginBottom: 40 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Why Join Our Platform</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card style={{ height: 220 }}>
                <Title level={4}>Comprehensive Ecosystem</Title>
                <Paragraph>
                  Connect with all stakeholders in South Africa's innovation and entrepreneurship ecosystem in one place.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ height: 220 }}>
                <Title level={4}>Drive Economic Growth</Title>
                <Paragraph>
                  Support sustainable development by participating in initiatives that create jobs and solve real problems.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ height: 220 }}>
                <Title level={4}>Transparent Reporting</Title>
                <Paragraph>
                  Access regular updates and performance metrics to track impact and program effectiveness.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', padding: '50px', color: 'white' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white' }}>Incubation Platform</Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.65)' }}>
              Connecting entrepreneurs, investors, government entities, and corporates to build South Africa's future.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white' }}>Legal</Title>
            <div>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Terms of Service</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Privacy Policy</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Data Protection</a>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white' }}>Get Started</Title>
            <Space direction="vertical">
              <Button type="primary" ghost onClick={handleRegisterClick}>Register Now</Button>
              <Button type="link" style={{ color: 'rgba(255,255,255,0.65)' }} onClick={handleLoginClick}>Already have an account? Log in</Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
          © {new Date().getFullYear()} Quantilytix Incubation Platform. All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

// Data fetcher component
const DataFetcher = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set document title
    document.title = "Incubation Platform • South Africa's Innovation Ecosystem";
    
    // Use the static participants data directly instead of Firebase fetching
    const dashboardParticipants = [
      { id: '1', name: 'TechSolutions Inc.', stage: 'Early', mentorAssigned: 'Yes', nextReview: '2023-11-15', status: 'Active' },
      { id: '2', name: 'GreenEnergy Startup', stage: 'Growth', mentorAssigned: 'Yes', nextReview: '2023-11-10', status: 'Active' },
      { id: '3', name: 'HealthTech Innovations', stage: 'Scaling', mentorAssigned: 'No', nextReview: '2023-11-20', status: 'Warning' },
      { id: '4', name: 'EdTech Solutions', stage: 'Early', mentorAssigned: 'Yes', nextReview: '2023-12-05', status: 'Active' },
      { id: '5', name: 'FinTech Revolution', stage: 'Growth', mentorAssigned: 'No', nextReview: '2023-11-25', status: 'Warning' },
    ];
    
    // Transform the dashboard participants
    const transformedParticipants: Participant[] = dashboardParticipants.map(participant => ({
      id: participant.id,
      name: participant.name,
      logo: {
        'TechSolutions Inc.': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=60',
        'GreenEnergy Startup': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=60',
        'HealthTech Innovations': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60',
        'EdTech Solutions': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60',
        'FinTech Revolution': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60'
      }[participant.name] || `https://placehold.co/300x200/1e293b/ffffff?text=${encodeURIComponent(participant.name)}&font=open-sans`,
      industry: {
        'TechSolutions Inc.': 'Software', 
        'GreenEnergy Startup': 'Renewable Energy',
        'HealthTech Innovations': 'Healthcare',
        'EdTech Solutions': 'Education',
        'FinTech Revolution': 'Finance'
      }[participant.name] || 'Technology',
      location: {
        'TechSolutions Inc.': 'Cape Town, SA', 
        'GreenEnergy Startup': 'Johannesburg, SA',
        'HealthTech Innovations': 'Durban, SA',
        'EdTech Solutions': 'Cape Town, SA',
        'FinTech Revolution': 'Pretoria, SA'
      }[participant.name] || 'South Africa',
      description: {
        'TechSolutions Inc.': 'Cloud-based software solutions for small businesses with focus on automation and efficiency',
        'GreenEnergy Startup': 'Affordable solar solutions for residential and commercial properties with innovative financing models',
        'HealthTech Innovations': 'AI-powered diagnostic tools for rural healthcare facilities with limited access to specialists',
        'EdTech Solutions': 'Digital platform connecting students with tutors and educational resources tailored for African curriculum',
        'FinTech Revolution': 'Mobile banking solutions for underserved communities across Africa with focus on microloans'
      }[participant.name] || 'Innovative startup in the technology sector',
      status: participant.status.toLowerCase(),
      stage: participant.stage,
      team: {
        'TechSolutions Inc.': 8,
        'GreenEnergy Startup': 12,
        'HealthTech Innovations': 15,
        'EdTech Solutions': 6,
        'FinTech Revolution': 10
      }[participant.name] || 5
    }));
    
    setParticipants(transformedParticipants);
    setLoading(false);
  }, []);
  
  return <PlatformLandingContent data={participants} isLoading={loading} error={error} />;
};

// Main exported component with all error handling in place
export const FunderLanding: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <DataFetcher />
      </Suspense>
    </ErrorBoundary>
  );
}; 