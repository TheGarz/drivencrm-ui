import { useAuth } from '../auth/AuthContext';
import OrganizationDashboard from './OrganizationDashboard';
import CompanyAdminDashboard from './CompanyAdminDashboard';

// Role-based dashboard router that determines which dashboard to show
export const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // This shouldn't happen as auth is checked in App.tsx
  }

  // Driven employees get the company admin dashboard
  if (user.role === 'DRIVEN_EMPLOYEE') {
    return <CompanyAdminDashboard />;
  }

  // All other roles get the organization dashboard with role-based navigation
  return <OrganizationDashboard />;
};

export default RoleBasedDashboard;
