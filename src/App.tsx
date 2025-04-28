import { BrowserRouter, Outlet, Route, Routes, Navigate } from "react-router-dom";

import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import { App as AntdApp, ConfigProvider } from "antd";

import { Layout } from "@/components";
import { resources } from "@/config/resources";
import { authProvider, dataProvider, liveProvider, accessControlProvider } from "@/providers";
import { DashboardPage, LoginPage, RegisterPage, AdminDashboardPage, FunderLanding } from "@/routes";
import { RoleLayout } from './routes/layout/RoleLayout';
import FunderDashboard from './routes/funder/funderDashboard';
import { FunderOpportunities } from './routes/funder/opportunities';
import { FunderPortfolio } from './routes/funder/portfolio';
import { FunderAnalytics } from './routes/funder/analytics';
import { FunderDocuments } from './routes/funder/documents';
import { FunderDueDiligence } from './routes/funder/due-diligence';
import FunderCalendarPage from './routes/funder/calendar';

import "@refinedev/antd/dist/reset.css";

import FormManagement from "./routes/admin/forms/index";
import FormSubmission from "./components/form-submission/FormSubmission";
import { FormOutlined } from "@ant-design/icons";
import { AdminRouteGuard, ConsultantRouteGuard, DirectorRouteGuard, OperationsRouteGuard } from "./components/guards";
import { DirectorDashboardPage } from "./routes/director-dashboard";
import { ConsultantDashboardPage } from "./routes/consultant-dashboard";
import { OperationsDashboardPage } from "./routes/operations-dashboard";
import OperationsFormsManagement from "./routes/operations/forms";
import OperationsResourceManagement from "./routes/operations/resources";
import OperationsParticipantsManagement from "./routes/operations/participants";
import { ConsultantAssignment } from "./components/consultant-assignment";
import OperationsCompliance from "./routes/operations/compliance";
import OperationsReports from "./routes/operations/reports";

const App = () => {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              resources={resources}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                liveMode: "auto",
                useNewQueryKeys: true,
              }}
            >
              <Routes>
                {/* Public Routes - this will be accessible to all users without authentication */}
                <Route path="/" element={<FunderLanding />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/login' element={<LoginPage />} />
                
                {/* Authenticated Routes */}
                <Route
                  element={
                    <Authenticated
                      key='authenticated-layout'
                      fallback={<CatchAllNavigate to='/login' />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  {/* Remove the index route as we want the funder landing to be the main index */}
                  <Route path='/dashboard' element={<DashboardPage />} />
                  
                  {/* Admin routes with AdminRouteGuard */}
                  <Route element={<AdminRouteGuard />}>
                    <Route path='/admin' element={<AdminDashboardPage />} />
                    <Route path="/admin/forms" element={<FormManagement />} />
                  </Route>
                  
                  {/* Director routes with DirectorRouteGuard */}
                  <Route element={<DirectorRouteGuard />}>
                    <Route path='/director' element={<DirectorDashboardPage />} />
                  </Route>
                  
                  {/* Consultant routes with ConsultantRouteGuard */}
                  <Route element={<ConsultantRouteGuard />}>
                    <Route path='/consultant' element={<ConsultantDashboardPage />} />
                  </Route>
                  
                  {/* Operations routes with OperationsRouteGuard */}
                  <Route element={<OperationsRouteGuard />}>
                    {/* Main dashboard */}
                    <Route path='/operations' element={<OperationsDashboardPage />} />
                    
                    {/* Forms management */}
                    <Route path='/operations/forms' element={<OperationsFormsManagement />} />
                    <Route path='/operations/forms/edit/:id' element={<OperationsFormsManagement />} />
                    <Route path='/operations/forms/preview/:id' element={<OperationsFormsManagement />} />
                    <Route path='/operations/form-responses/:id' element={<FormSubmission />} />
                    
                    {/* Resource and participant management */}
                    <Route path='/operations/resources' element={<OperationsResourceManagement />} />
                    <Route path='/operations/participants' element={<OperationsParticipantsManagement />} />
                    
                    {/* Compliance management */}
                    <Route path='/operations/compliance' element={<OperationsCompliance />} />
                    
                    {/* Reports & Analytics */}
                    <Route path='/operations/reports' element={<OperationsReports />} />
                    
                    {/* Mentorship management */}
                    <Route path='/operations/mentorship-assignments' element={<ConsultantAssignment />} />
                  </Route>
                  
                  <Route path="/forms/:formId" element={<FormSubmission />} />
                  {/* Fallback for authenticated but invalid routes */}
                  <Route path='*' element={<ErrorComponent />} />
                </Route>

                {/* Funder Routes */}
                <Route
                  path="/funder/*"
                  element={<RoleLayout role="funder" />}
                >
                  <Route index element={<FunderDashboard />} />
                  <Route path="opportunities" element={<FunderOpportunities />} />
                  <Route path="portfolio" element={<FunderPortfolio />} />
                  <Route path="due-diligence" element={<FunderDueDiligence />} />
                  <Route path="analytics" element={<FunderAnalytics />} />
                  <Route path="documents" element={<FunderDocuments />} />
                  <Route path="calendar" element={<FunderCalendarPage />} />
                </Route>

                {/* Fallback for all other routes - direct to funder landing */}
                <Route path='*' element={<FunderLanding />} />
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </DevtoolsProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
