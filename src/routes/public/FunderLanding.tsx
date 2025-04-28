import React, { useState, useEffect } from 'react';
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
  Avatar
} from 'antd';
import { 
  FireOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  RocketOutlined,
  DollarOutlined,
  UserOutlined,
  BuildOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card;

// Mock data for investment opportunities
const investmentOpportunities = [
  {
    id: 1,
    name: 'TechFarm Innovations',
    logo: '/assets/images/company-logos/techfarm.png',
    category: 'AgriTech',
    location: 'Cape Town, SA',
    description: 'Revolutionizing farming with IoT sensors and data analytics for sustainable agriculture',
    fundingGoal: 750000,
    fundingRaised: 425000,
    progress: 56,
    daysLeft: 15,
    status: 'trending',
    founderInfo: 'Led by agricultural engineer John Mbeki with 15 years experience',
    registrationType: 'Capital R • Reg S'
  },
  {
    id: 2,
    name: 'HealthPlus Solutions',
    logo: '/assets/images/company-logos/healthplus.png',
    category: 'HealthTech',
    location: 'Johannesburg, SA',
    description: 'AI-powered diagnostic tools for rural healthcare facilities',
    fundingGoal: 500000,
    fundingRaised: 350000,
    progress: 70,
    daysLeft: 21,
    status: 'featured',
    founderInfo: 'Founded by Dr. Sarah Ngwenya, former Head of Telemedicine at Joburg General',
    registrationType: 'Republic Funding Portal • Reg CF'
  },
  {
    id: 3,
    name: 'EduConnect',
    logo: '/assets/images/company-logos/educonnect.png',
    category: 'EdTech',
    location: 'Durban, SA',
    description: 'Digital platform connecting students with tutors and educational resources',
    fundingGoal: 300000,
    fundingRaised: 300000,
    progress: 100,
    daysLeft: 0,
    status: 'closed',
    founderInfo: 'Created by former university professor and education advocate Thabo Molefi',
    registrationType: 'Capital R • 1940 Act Registered Fund'
  },
  {
    id: 4,
    name: 'Renewable Energy Solutions',
    logo: '/assets/images/company-logos/renewable.png',
    category: 'CleanTech',
    location: 'Pretoria, SA',
    description: 'Affordable solar solutions for residential and commercial properties',
    fundingGoal: 1200000,
    fundingRaised: 750000,
    progress: 62,
    daysLeft: 12,
    status: 'trending',
    founderInfo: 'Team of engineers with background in sustainable energy development',
    registrationType: 'Republic Funding Portal • Reg CF'
  },
  {
    id: 5,
    name: 'FinSmart Africa',
    logo: '/assets/images/company-logos/finsmart.png',
    category: 'FinTech',
    location: 'Cape Town, SA',
    description: 'Mobile banking solutions for underserved communities across Africa',
    fundingGoal: 600000,
    fundingRaised: 420000,
    progress: 70,
    daysLeft: 18,
    status: 'trending',
    founderInfo: 'Founded by banking veterans with 20+ years experience in financial inclusion',
    registrationType: 'Capital R • Reg S'
  },
  {
    id: 6,
    name: 'Urban Logistics',
    logo: '/assets/images/company-logos/urbanlogistics.png',
    category: 'Logistics',
    location: 'Johannesburg, SA',
    description: 'Last-mile delivery optimization for urban centers using electric vehicles',
    fundingGoal: 450000,
    fundingRaised: 225000,
    progress: 50,
    daysLeft: 30,
    status: 'featured',
    founderInfo: 'Team with background in logistics, sustainability, and urban planning',
    registrationType: 'Republic Funding Portal • Reg CF'
  }
];

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
const formatCurrency = (amount: number) => {
  return `R${amount.toLocaleString('en-ZA')}`;
};

export const FunderLanding: React.FC = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Investment Opportunities • Incubation Platform";
    
    // Fetch actual participants from Firestore if available
    const fetchParticipants = async () => {
      try {
        const snapshot = await getDocs(collection(db, "participants"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setParticipants(data);
        } else {
          // Use mock data if no participants found
          setParticipants(investmentOpportunities);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
        // Fallback to mock data
        setParticipants(investmentOpportunities);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'trending':
        return <Badge.Ribbon text={<><FireOutlined /> TRENDING</>} color="red" />;
      case 'featured':
        return <Badge.Ribbon text="SPOTLIGHT" />;
      case 'closed':
        return <Badge.Ribbon text={<><CheckCircleOutlined /> FUNDED</>} color="green" />;
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
          <img 
            src="/assets/images/QuantilytixO.png" 
            alt="Quantilytix Logo" 
            style={{ height: 32, marginRight: 8 }}
          />
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

          <Row gutter={[24, 24]}>
            {participants.map((opportunity) => (
              <Col key={opportunity.id} xs={24} sm={12} lg={8} style={{ marginBottom: 20 }}>
                <Card
                  hoverable
                  style={{ height: '100%', borderRadius: 8, overflow: 'hidden' }}
                  cover={
                    <div style={{ position: 'relative', height: 200, background: '#f0f2f5', overflow: 'hidden' }}>
                      {renderStatusTag(opportunity.status)}
                      <img 
                        alt={opportunity.name}
                        src={opportunity.logo || `https://via.placeholder.com/300x200?text=${opportunity.name}`}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  }
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Tag color="blue">{opportunity.category}</Tag>
                        <Tag>{opportunity.location}</Tag>
                      </div>
                      <Avatar 
                        size="large" 
                        src={opportunity.founderAvatar}
                        style={{ backgroundColor: '#1890ff' }}
                        icon={!opportunity.founderAvatar && <UserOutlined />}
                      />
                    </div>
                    
                    <Title level={4} style={{ marginTop: 10, marginBottom: 5 }}>{opportunity.name}</Title>
                    
                    <Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                      {opportunity.description}
                    </Paragraph>
                    
                    <div style={{ marginTop: 10, marginBottom: 5 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>{opportunity.registrationType}</Text>
                    </div>
                    
                    <Progress 
                      percent={opportunity.progress} 
                      status={
                        opportunity.status === 'closed' ? 'success' : 
                        opportunity.progress < 30 ? 'exception' : 
                        'active'
                      }
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <Statistic 
                        title="Raised" 
                        value={formatCurrency(opportunity.fundingRaised)} 
                        valueStyle={{ fontSize: 16 }}
                      />
                      <Statistic 
                        title="Goal" 
                        value={formatCurrency(opportunity.fundingGoal)} 
                        valueStyle={{ fontSize: 16 }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      {opportunity.status !== 'closed' ? (
                        <Tag icon={<ClockCircleOutlined />} color="orange">
                          {opportunity.daysLeft} days left
                        </Tag>
                      ) : (
                        <Tag icon={<CheckCircleOutlined />} color="green">
                          Funded
                        </Tag>
                      )}
                      
                      <Button 
                        type={opportunity.status === 'closed' ? 'default' : 'primary'} 
                        disabled={opportunity.status === 'closed'}
                        onClick={handleRegisterClick}
                      >
                        {opportunity.status === 'closed' ? 'Funded' : 'Invest Now'}
                      </Button>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
          
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