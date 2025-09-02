import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import OrganizationDashboard from './OrganizationDashboard';
import AdminRouter from './AdminRouter';
import CustomerLayout from './layouts/CustomerLayout';
import DashboardPage from '../pages/DashboardPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import MetricsPage from '../pages/MetricsPage';
import IntegrationsPage from '../pages/IntegrationsPage';
import UsersPage from '../pages/UsersPage';
import ReviewsPage from '../pages/ReviewsPage';
import RewardsPage from '../pages/RewardsPage';
import BillingPage from '../pages/BillingPage';
import ProfilePage from '../pages/ProfilePage';

// Role-based dashboard router that determines which dashboard to show
export const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // This shouldn't happen as auth is checked in App.tsx
  }

  // Driven employees and admins get the admin router with URL-based routing
  if (user.role === 'DRIVEN_EMPLOYEE' || user.role === 'ADMIN') {
    return <AdminRouter />;
  }

  // All other roles get the new routing-based customer layout
  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};

export default RoleBasedDashboard;
