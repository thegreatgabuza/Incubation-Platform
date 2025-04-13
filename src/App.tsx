import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

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
import { DashboardPage, LoginPage, RegisterPage, AdminDashboardPage } from "@/routes";

import "@refinedev/antd/dist/reset.css";

import FormManagement from "./routes/admin/forms/index";
import FormSubmission from "./components/form-submission/FormSubmission";
import { FormOutlined } from "@ant-design/icons";
import { AdminRouteGuard, DirectorRouteGuard, OperationsRouteGuard } from "./components/guards";
import { DirectorDashboardPage } from "./routes/director-dashboard";
import { OperationsDashboardPage } from "./routes/operations-dashboard";
import OperationsFormsManagement from "./routes/operations/forms";
import OperationsResourceManagement from "./routes/operations/resources";
import OperationsParticipantsManagement from "./routes/operations/participants";

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
                  <Route index element={<DashboardPage />} />
                  
                  {/* Admin routes with AdminRouteGuard */}
                  <Route element={<AdminRouteGuard />}>
                    <Route path='/admin' element={<AdminDashboardPage />} />
                    <Route path="/admin/forms" element={<FormManagement />} />
                  </Route>
                  
                  {/* Director routes with DirectorRouteGuard */}
                  <Route element={<DirectorRouteGuard />}>
                    <Route path='/director' element={<DirectorDashboardPage />} />
                  </Route>
                  
                  {/* Operations routes with OperationsRouteGuard */}
                  <Route element={<OperationsRouteGuard />}>
                    <Route path='/operations' element={<OperationsDashboardPage />} />
                    <Route path='/operations/forms' element={<OperationsFormsManagement />} />
                    <Route path='/operations/forms/edit/:id' element={<OperationsFormsManagement />} />
                    <Route path='/operations/forms/preview/:id' element={<OperationsFormsManagement />} />
                    <Route path='/operations/form-responses/:id' element={<FormSubmission />} />
                    <Route path='/operations/resources' element={<OperationsResourceManagement />} />
                    <Route path='/operations/participants' element={<OperationsParticipantsManagement />} />
                  </Route>
                  
                  <Route path="/forms/:formId" element={<FormSubmission />} />
                  <Route path='*' element={<ErrorComponent />} />
                </Route>

                <Route
                  element={
                    <Authenticated
                      key='authenticated-auth'
                      fallback={<Outlet />}
                    >
                      <NavigateToResource resource='dashboard' />
                    </Authenticated>
                  }
                >
                  <Route path='/login' element={<LoginPage />} />
                </Route>
                <Route path='/register' element={<RegisterPage />} />
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
