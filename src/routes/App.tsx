// App.tsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { RoleLayout } from './layouts/RoleLayout';
import { Login } from './pages/public/Login';
import { useAuth } from './hooks/useAuth';

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
          <Route path="approvals" element={<Approvals />} />
          <Route path="budget" element={<Budget />} />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};
