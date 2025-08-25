import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import OrganizationsPage from '../pages/OrganizationsPage';
import DrivenUsersPage from '../pages/DrivenUsersPage';
import ProfilePage from '../pages/ProfilePage';
import {
  EditUserPageWrapper,
  AddNewOrganizationWrapper,
  AddDrivenUserWrapper,
  UserProfileEditWrapper,
  OrganizationManagerWrapper
} from './wrappers/AdminPageWrappers';

// Admin Router Component
// Provides React Router-based routing for admin dashboard
export const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<AdminLayout />}>
        {/* Main admin pages */}
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="driven-users" element={<DrivenUsersPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Organization management sub-routes */}
        <Route path="organizations/:organizationId" element={<OrganizationManagerWrapper />} />
        <Route path="organizations/add" element={<AddNewOrganizationWrapper />} />
        
        {/* User management sub-routes */}
        <Route path="driven-users/:userId/edit" element={<EditUserPageWrapper />} />
        <Route path="driven-users/add" element={<AddDrivenUserWrapper />} />
        
        {/* Profile management */}
        <Route path="profile/edit" element={<UserProfileEditWrapper />} />
        
        {/* Fallback for unknown admin routes */}
        <Route path="*" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;