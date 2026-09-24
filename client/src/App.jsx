import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Admin Governance & Analytics Pages
import { DepartmentsPage } from './pages/admin/DepartmentsPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { SLAPoliciesPage } from './pages/admin/SLAPoliciesPage';
import { UserDirectoryPage } from './pages/admin/UserDirectoryPage';
import { SlaPerformanceDashboard } from './pages/admin/SlaPerformanceDashboard';
import { TechnicianWorkloadPage } from './pages/admin/TechnicianWorkloadPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';

// Ticket Lifecycle Pages
import { TicketsListPage } from './pages/tickets/TicketsListPage';
import { CreateTicketPage } from './pages/tickets/CreateTicketPage';
import { TicketDetailPage } from './pages/tickets/TicketDetailPage';

// Asset Management Pages
import { AssetsListPage } from './pages/assets/AssetsListPage';
import { AssetDetailPage } from './pages/assets/AssetDetailPage';
import { VendorsPage } from './pages/assets/VendorsPage';

// Knowledge Base Pages
import { KnowledgeBasePage } from './pages/kb/KnowledgeBasePage';
import { ArticleDetailPage } from './pages/kb/ArticleDetailPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Helper component for Landing Page vs App Dashboard routing
function PublicRootOrApp() {
  const { isAuthenticated } = useAuth();
  return <LandingPage />;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<PublicRootOrApp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected App Layout Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/app" element={<DashboardOverview />} />

              {/* Ticket Lifecycle Routes */}
              <Route path="/tickets" element={<TicketsListPage />} />
              <Route path="/tickets/queue" element={<TicketsListPage />} />
              <Route path="/tickets/new" element={<CreateTicketPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />

              {/* Asset Management Routes */}
              <Route path="/assets" element={<AssetsListPage />} />
              <Route path="/inventory/assets" element={<AssetsListPage />} />
              <Route path="/inventory/assets/:id" element={<AssetDetailPage />} />
              <Route path="/inventory/vendors" element={<VendorsPage />} />

              {/* Knowledge Base Routes */}
              <Route path="/kb" element={<KnowledgeBasePage />} />
              <Route path="/kb/:id" element={<ArticleDetailPage />} />

              {/* Admin & IT Manager Governance Routes */}
              <Route
                path="/admin/sla"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <SlaPerformanceDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/workload"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <TechnicianWorkloadPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <AuditLogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <DepartmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <CategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sla-policies"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <SLAPoliciesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'it_manager']}>
                    <UserDirectoryPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback inside layout */}
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
