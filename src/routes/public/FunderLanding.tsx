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
  DollarOutlined,
  UserOutlined,
  BuildOutlined,
  ArrowRightOutlined,
  WarningOutlined
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
                <p>We encountered an issue loading the investment opportunities.</p>
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

// Define an opportunity interface for type safety
interface Opportunity {
  id: string;
  name: string;
  logo?: string;
  category?: string;
  industry?: string;
  location?: string;
  description?: string;
  fundingGoal?: number;
  fundingRaised?: number;
  progress?: number;
  daysLeft?: number;
  status?: string;
  founderInfo?: string;
  registrationType?: string;
  stage?: string;
  team?: number;
  [key: string]: any; // For any additional fields from Firebase
}

// Platform statistics
const platformStats = [
  {
    title: "Companies Funded",
    value: 125,
    icon: <BuildOutlined />
  },
  {
    title: "Funder Community",
    value: "1.5M+",
    icon: <UserOutlined />
  },
  {
    title: "Capital Raised",
    value: "R75M+",
    icon: <DollarOutlined />
  },
  {
    title: "Success Rate",
    value: "72%",
    icon: <RocketOutlined />
  }
];

// Function to format currency
const formatCurrency = (amount: number | undefined | null) => {
  // Safety check for undefined or null values
  if (amount === undefined || amount === null) {
    return 'R0';
  }
  
  // Make sure amount is a number
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount));
  
  // Handle NaN case
  if (isNaN(numericAmount)) {
    return 'R0';
  }
  
  try {
    return `R${numericAmount.toLocaleString('en-ZA')}`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `R${numericAmount}`;
  }
};

// Props interface for the content component
interface FunderLandingContentProps {
  data: Opportunity[];
  isLoading: boolean;
  error: string | null;
}

// This is the main content separated from data fetching logic
const FunderLandingContent: React.FC<FunderLandingContentProps> = ({ data, isLoading, error }) => {
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
        return <Badge.Ribbon text={<><FireOutlined /> ACTIVE</>} color="red" />;
      case 'featured':
      case 'warning':
        return <Badge.Ribbon text="AT RISK" />;
      case 'closed':
      case 'inactive':
        return <Badge.Ribbon text={<><CheckCircleOutlined /> INACTIVE</>} color="green" />;
      default:
        return null;
    }
  };

  return (
    <Layout className="funder-landing-layout">
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
          <Title level={1}>Invest in South Africa's Future</Title>
          <Paragraph style={{ fontSize: 18, maxWidth: 800, margin: '0 auto 20px' }}>
            Connect with innovative businesses, support economic growth, and build your investment portfolio with carefully vetted opportunities.
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              onClick={handleRegisterClick}
              style={{ height: 48, fontSize: 16, padding: '0 30px' }}
            >
              Start Investing
            </Button>
            <Button 
              size="large" 
              style={{ height: 48, fontSize: 16 }}
              onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Opportunities
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

        {/* How it Works */}
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <Title level={2}>How It Works</Title>
          <Row gutter={[24, 24]} style={{ marginTop: 30 }}>
            <Col xs={24} sm={8}>
              <Card style={{ height: 260 }}>
                <div style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }}>1</div>
                <Title level={4}>Register & Verify</Title>
                <Paragraph>
                  Create an account and verify your status as an accredited investor according to South African financial regulations.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ height: 260 }}>
                <div style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }}>2</div>
                <Title level={4}>Browse & Select</Title>
                <Paragraph>
                  Explore vetted opportunities across various sectors and review company information, financials, and founder backgrounds.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ height: 260 }}>
                <div style={{ fontSize: 36, color: '#1890ff', marginBottom: 20 }}>3</div>
                <Title level={4}>Invest & Track</Title>
                <Paragraph>
                  Make investments in companies you believe in and track their progress through regular updates and reporting.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Investment Opportunities */}
        <div id="opportunities" style={{ marginTop: 60, marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title level={2}>Live Investment Opportunities</Title>
            <Tabs defaultActiveKey="all" style={{ marginBottom: 0 }}>
              <TabPane tab="All Opportunities" key="all" />
              <TabPane tab="Trending" key="trending" />
              <TabPane tab="Closing Soon" key="closing" />
              <TabPane tab="Recently Added" key="recent" />
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
              {data.map((opportunity) => (
                <Col key={opportunity.id} xs={24} sm={12} lg={8} style={{ marginBottom: 20 }}>
                  <Card
                    hoverable
                    style={{ height: '100%', borderRadius: 8, overflow: 'hidden' }}
                    cover={
                      <div style={{ position: 'relative', height: 200, background: '#f0f2f5', overflow: 'hidden' }}>
                        {renderStatusTag(opportunity.status || 'active')}
                        {/* Use placeholder image if logo doesn't load */}
                        <img 
                          alt={opportunity.name || 'Investment Opportunity'}
                          src={opportunity.logo || `https://via.placeholder.com/300x200?text=${encodeURIComponent(opportunity.name || 'Opportunity')}`}
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            target.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(opportunity.name || 'Opportunity')}`;
                          }}
                        />
                      </div>
                    }
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Tag color="blue">{opportunity.industry || opportunity.category || 'Other'}</Tag>
                          <Tag>{opportunity.location || 'South Africa'}</Tag>
                        </div>
                        <Avatar 
                          size="large" 
                          style={{ backgroundColor: '#1890ff' }}
                          icon={<UserOutlined />}
                        />
                      </div>
                      
                      <Title level={4} style={{ marginTop: 10, marginBottom: 5 }}>{opportunity.name || 'Unnamed Opportunity'}</Title>
                      
                      <Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                        {opportunity.description || 'No description available'}
                      </Paragraph>
                      
                      <div style={{ marginTop: 10, marginBottom: 5 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{opportunity.registrationType || opportunity.stage || 'Standard Registration'}</Text>
                      </div>
                      
                      <Progress 
                        percent={opportunity.progress || 0} 
                        status={
                          opportunity.status === 'closed' || opportunity.status === 'inactive' ? 'success' : 
                          (opportunity.progress || 0) < 30 ? 'exception' : 
                          'active'
                        }
                      />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                        <Statistic 
                          title="Raised" 
                          value={formatCurrency(opportunity.fundingRaised || ((opportunity.progress || 0) * 10000))} 
                          valueStyle={{ fontSize: 16 }}
                        />
                        <Statistic 
                          title="Goal" 
                          value={formatCurrency(opportunity.fundingGoal || 1000000)} 
                          valueStyle={{ fontSize: 16 }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        {opportunity.status !== 'closed' && opportunity.status !== 'inactive' ? (
                          <Tag icon={<ClockCircleOutlined />} color="orange">
                            {(opportunity.daysLeft || 30) > 0 ? `${opportunity.daysLeft || 30} days left` : 'Closing soon'}
                          </Tag>
                        ) : (
                          <Tag icon={<CheckCircleOutlined />} color="green">
                            Not Available
                          </Tag>
                        )}
                        
                        <Button 
                          type={opportunity.status === 'closed' || opportunity.status === 'inactive' ? 'default' : 'primary'} 
                          disabled={opportunity.status === 'closed' || opportunity.status === 'inactive'}
                          onClick={handleRegisterClick}
                        >
                          {opportunity.status === 'closed' || opportunity.status === 'inactive' ? 'Not Available' : 'Invest Now'}
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
              View All Opportunities <ArrowRightOutlined />
            </Button>
          </div>
        </div>
        
        {/* Why Invest Section */}
        <div style={{ background: '#f0f5ff', padding: '50px', borderRadius: 10, marginBottom: 40 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>Why Invest Through Our Platform</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card style={{ height: 220 }}>
                <Title level={4}>Trusted Vetting Process</Title>
                <Paragraph>
                  All companies undergo a rigorous selection process to ensure quality investment opportunities.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ height: 220 }}>
                <Title level={4}>Support South African Innovation</Title>
                <Paragraph>
                  Direct impact on local economy by supporting entrepreneurs solving real problems.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ height: 220 }}>
                <Title level={4}>Transparent Reporting</Title>
                <Paragraph>
                  Regular updates and performance metrics to track the progress of your investments.
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
              Connecting accredited investors with promising South African startups and small businesses.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white' }}>Legal</Title>
            <div>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Terms of Service</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Privacy Policy</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 8 }}>Investment Risks</a>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4} style={{ color: 'white' }}>Get Started</Title>
            <Space direction="vertical">
              <Button type="primary" ghost onClick={handleRegisterClick}>Register as Investor</Button>
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
  const [participants, setParticipants] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the same participants data as OperationsDashboard.tsx
  useEffect(() => {
    // Set document title
    document.title = "Investment Opportunities • Incubation Platform";
    
    // Use the static participants data directly instead of Firebase fetching
    // This matches the approach used in OperationsDashboard.tsx
    const dashboardParticipants = [
      { id: '1', name: 'TechSolutions Inc.', stage: 'Early', mentorAssigned: 'Yes', nextReview: '2023-11-15', status: 'Active' },
      { id: '2', name: 'GreenEnergy Startup', stage: 'Growth', mentorAssigned: 'Yes', nextReview: '2023-11-10', status: 'Active' },
      { id: '3', name: 'HealthTech Innovations', stage: 'Scaling', mentorAssigned: 'No', nextReview: '2023-11-20', status: 'Warning' },
      { id: '4', name: 'EdTech Solutions', stage: 'Early', mentorAssigned: 'Yes', nextReview: '2023-12-05', status: 'Active' },
      { id: '5', name: 'FinTech Revolution', stage: 'Growth', mentorAssigned: 'No', nextReview: '2023-11-25', status: 'Warning' },
    ];
    
    // Transform the dashboard participants into investment opportunities
    const transformedParticipants: Opportunity[] = dashboardParticipants.map(participant => ({
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
      progress: {
        'TechSolutions Inc.': 32,
        'GreenEnergy Startup': 68,
        'HealthTech Innovations': 75,
        'EdTech Solutions': 15,
        'FinTech Revolution': 52
      }[participant.name] || 50,
      fundingGoal: {
        'TechSolutions Inc.': 750000,
        'GreenEnergy Startup': 1200000,
        'HealthTech Innovations': 500000,
        'EdTech Solutions': 300000,
        'FinTech Revolution': 600000
      }[participant.name] || 1000000,
      fundingRaised: {
        'TechSolutions Inc.': 240000,
        'GreenEnergy Startup': 816000,
        'HealthTech Innovations': 375000,
        'EdTech Solutions': 45000,
        'FinTech Revolution': 312000
      }[participant.name] || 500000,
      daysLeft: {
        'TechSolutions Inc.': 45,
        'GreenEnergy Startup': 30,
        'HealthTech Innovations': 15,
        'EdTech Solutions': 60,
        'FinTech Revolution': 25
      }[participant.name] || 30,
      registrationType: participant.stage === 'Early' ? 'Capital R • Reg S' : 
                          participant.stage === 'Growth' ? 'Republic Funding Portal • Reg CF' : 
                          'Capital R • 1940 Act Registered Fund'
    }));
    
    setParticipants(transformedParticipants);
    setLoading(false);
  }, []);
  
  return <FunderLandingContent data={participants} isLoading={loading} error={error} />;
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