// pages/funder/FunderDashboard.tsx
import { Card, Statistic, Button } from 'antd';
import { Link } from 'react-router-dom';

export const FunderDashboard = () => (
  <Card title="Funder Overview">
    <Statistic title="Pending Approvals" value={5} />
    <Link to="/funder/approvals">
      <Button type="primary">Manage Approvals</Button>
    </Link>
  </Card>
);
