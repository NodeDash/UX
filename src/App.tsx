import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/ui/Layout";
import DevicesPage from "./pages/DevicesPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import FlowsPage from "./pages/FlowsPage";
import FlowDetailPage from "./pages/FlowDetailPage";
import FunctionsPage from "./pages/FunctionsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import LabelsPage from "./pages/LabelsPage";
import SettingsPage from "./pages/SettingsPage";
import DashboardPage from "./pages/DashboardPage";
import TeamsPage from "./pages/TeamsPage";
import ProvidersPage from "./pages/ProvidersPage"; // Add import for ProvidersPage
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MfaVerifyPage from "./pages/MfaVerifyPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { TeamProvider } from "./context/TeamContext";
import { TranslationDebugger } from "./components/dev";
import { DocumentTitle } from "@/components/ui";

function App() {
  return (
    <QueryProvider>
      <Router>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <TeamProvider>
                {process.env.NODE_ENV === "development" && (
                  <TranslationDebugger position="bottom-left" />
                )}
                <DocumentTitle />{" "}
                {/* This will set the base title with environment info */}
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                  />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="/mfa-verify" element={<MfaVerifyPage />} />
                  <Route path="/email-verify" element={<EmailVerifyPage />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    {/* Dashboard route */}
                    <Route
                      path="/"
                      element={
                        <Layout>
                          <DashboardPage />
                        </Layout>
                      }
                    />

                    <Route
                      path="/flows"
                      element={
                        <Layout>
                          <FlowsPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/flow/:flowId"
                      element={
                        <Layout>
                          <FlowDetailPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/devices"
                      element={
                        <Layout>
                          <DevicesPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/device/:deviceId"
                      element={
                        <Layout>
                          <DeviceDetailPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/labels"
                      element={
                        <Layout>
                          <LabelsPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/functions"
                      element={
                        <Layout>
                          <FunctionsPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/integrations"
                      element={
                        <Layout>
                          <IntegrationsPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/providers"
                      element={
                        <Layout>
                          <ProvidersPage />
                        </Layout>
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <Layout>
                          <SettingsPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/teams"
                      element={
                        <Layout>
                          <TeamsPage />
                        </Layout>
                      }
                    />
                  </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </TeamProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Router>
    </QueryProvider>
  );
}

export default App;
