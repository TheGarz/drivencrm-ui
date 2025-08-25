import React, { useState } from 'react';
import UsersTab from '../components/OrganizationManager/tabs/UsersTab';
import AddNewUser from '../components/AddNewUser';
import type { Organization } from '../components/OrganizationManager/types';

const UsersPage: React.FC = () => {
  // Organization state - exact same as OrganizationDashboard
  const [organization, setOrganization] = useState<Organization>({
    id: 1,
    name: 'Cross Pest Control',
    active: true,
    sync_limit: 100,
    pay_period: 'monthly',
    pay_start: '2024-01-01',
    created_at: '2024-01-01',
    last_sync: '2024-01-01',
    total_users: 8,
    total_branches: 1,
    monthly_revenue: 85420,
    integration_count: 0,
    services: [],
    users: [
      { id: 1, name: 'John Smith', email: 'john@crosspest.com', role: 'Owner', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'John Smith', memberSince: '2024-01-01' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'Sarah Johnson', memberSince: '2024-07-20' },
      { id: 3, name: 'Mike Wilson', email: 'mike@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-09-10' },
      { id: 4, name: 'Lisa Brown', email: 'lisa@crosspest.com', role: 'CSR', status: 'Inactive', lastLogin: '2024-01-10', connectedCrmUser: null, closedOn: '2024-12-15' },
      { id: 5, name: 'David Garcia', email: 'david@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'David Garcia', memberSince: '2024-06-15' },
      { id: 6, name: 'Emily Chen', email: 'emily@crosspest.com', role: 'CSR', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Emily Chen', memberSince: '2024-05-20' },
      { id: 7, name: 'Robert Martinez', email: 'robert@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-13', connectedCrmUser: 'Robert Martinez', memberSince: '2024-04-10' },
      { id: 8, name: 'Jennifer White', email: 'jennifer@crosspest.com', role: 'Sales', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-08-01' }
    ],
    app_config: {
      version: 1,
      metrics: {}
    }
  });

  // Modal state - exact same as OrganizationDashboard
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

  // Event handlers - exact same as OrganizationDashboard
  const handleShowAddUser = (): void => {
    setShowAddUserModal(true);
  };

  const handleAddUserBack = (): void => {
    setShowAddUserModal(false);
  };

  const handleAddUserSave = (userData: any): void => {
    // Add the new user to the organization
    const updatedOrganization = {
      ...organization,
      users: [...(organization.users || []), userData],
      total_users: (organization.users?.length || 0) + 1
    };
    setOrganization(updatedOrganization);
    setShowAddUserModal(false);
    
    // Show success message
    alert(`User ${userData.name} has been created successfully!`);
  };

  return (
    <>
      {/* User Management */}
      {!showAddUserModal && (
        <UsersTab
          organization={organization}
          onUpdate={(updatedOrg) => setOrganization(updatedOrg)}
          onShowAddUser={handleShowAddUser}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddNewUser
          onBack={handleAddUserBack}
          onSave={handleAddUserSave}
        />
      )}
    </>
  );
};

export default UsersPage;