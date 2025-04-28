// App.tsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { RoleLayout } from './layout/RoleLayout';
import { Login } from './pages/public/Login';
import { useAuth } from './hooks/useAuth';
import FunderDashboard from './funder/funderDashboard';
import { FunderOpportunities } from './funder/opportunities';
import { FunderPortfolio } from './funder/portfolio';
import { FunderAnalytics } from './funder/analytics';
import { FunderDocuments } from './funder/documents';

const App = () => {
  const { role } = useAuth(); // Custom auth hook (e.g., Redux/Context)

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Funder Routes */}
        <Route
          path="/funder/*"
          element={role === 'funder' ? <RoleLayout role="funder" /> : <Navigate to="/login" />}
        >
          <Route index element={<FunderDashboard />} />
          <Route path="opportunities" element={<FunderOpportunities />} />
          <Route path="portfolio" element={<FunderPortfolio />} />
          <Route path="analytics" element={<FunderAnalytics />} />
          <Route path="documents" element={<FunderDocuments />} />
        </Route>
        

        {/* Incubatee Routes */}
        <Route
          path="/incubatee/*"
          element={role === 'incubatee' ? <RoleLayout role="incubatee" /> : <Navigate to="/login" />}
        >
          <Route index element={<IncubateeDashboard />} />
          <Route path="submit" element={<SubmitProject />} />
          <Route path="documents" element={<Documents />} />
        </Route>

        {/* Consultant Routes */}
        <Route
          path="/consultant/*"
          element={role === 'consultant' ? <RoleLayout role="consultant" /> : <Navigate to="/login" />}
        >
          <Route index element={<ConsultantDashboard />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Operations Routes */}
        <Route
          path="/operations/*"
          element={role === 'operations' ? <RoleLayout role="operations" /> : <Navigate to="/login" />}
        >
          <Route index element={<OperationsDashboard />} />
          <Route path="participants" element={<OperationsParticipantsManagement />} />
          <Route path="approvals" element={<OperationsApprovals />} />
          <Route path="reports" element={<OperationsReports />} />
          <Route path="resources" element={<OperationsResources />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};
