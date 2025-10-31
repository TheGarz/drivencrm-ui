// Wrapper components that bridge old callback-based navigation with React Router
// These provide the necessary props to existing page components during the transition

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useOrganizationManagement } from '../../hooks/useOrganizationManagement';

// Import the actual page components
import OrganizationsPage from '../../pages/OrganizationsPage';
import DrivenUsersPage from '../../pages/DrivenUsersPage';
import EditUserPage from '../../pages/EditUserPage';
import EditUserManagementPage from '../../pages/EditUserManagementPage';
import AddNewOrganization from '../AddNewOrganization';
import AddDrivenUser from '../AddDrivenUser';
import UserProfileEdit from '../UserProfileEdit';
import OrganizationManager from '../OrganizationManager';

// OrganizationsPage wrapper - now simplified since component handles its own navigation
export const OrganizationsPageWrapper: React.FC = () => {
  return <OrganizationsPage />;
};

// DrivenUsersPage wrapper - now simplified since component handles its own navigation  
export const DrivenUsersPageWrapper: React.FC = () => {
  return <DrivenUsersPage />;
};

// EditUserPage wrapper
export const EditUserPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  
  const {
    selectedUserId,
    userAccountActive,
    userTwoFactorEnabled,
    mockDrivenUsers,
    handleSaveEditedUser,
    handleAccountStatusToggle,
    handleTwoFactorToggle,
    handleResetPassword,
    handleEditUser
  } = useUserManagement();

  const handleBack = () => {
    navigate('/driven-users');
  };

  // Find the user to edit
  const userToEdit = mockDrivenUsers.find(user => user.id === Number(userId));
  
  // Initialize the user state when the component loads
  React.useEffect(() => {
    if (userToEdit && selectedUserId !== userToEdit.id) {
      handleEditUser(userToEdit);
    }
  }, [userToEdit, selectedUserId, handleEditUser]);

  if (!userToEdit) {
    navigate('/driven-users');
    return null;
  }

  return (
    <EditUserPage
      userToEdit={userToEdit}
      userAccountActive={userAccountActive}
      userTwoFactorEnabled={userTwoFactorEnabled}
      onBack={handleBack}
      onSave={handleSaveEditedUser}
      onAccountStatusToggle={handleAccountStatusToggle}
      onTwoFactorToggle={handleTwoFactorToggle}
      onResetPassword={handleResetPassword}
    />
  );
};

// AddNewOrganization wrapper
export const AddNewOrganizationWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { handleSaveNewOrganization } = useOrganizationManagement();

  const handleBack = () => {
    navigate('/organizations');
  };

  return (
    <AddNewOrganization
      onBack={handleBack}
      onSave={handleSaveNewOrganization}
    />
  );
};

// AddDrivenUser wrapper
export const AddDrivenUserWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { handleSaveDrivenUser } = useUserManagement();

  const handleBack = () => {
    navigate('/driven-users');
  };

  return (
    <AddDrivenUser
      onBack={handleBack}
      onSave={handleSaveDrivenUser}
    />
  );
};

// UserProfileEdit wrapper
export const UserProfileEditWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { handleSaveUserProfile } = useUserManagement();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <UserProfileEdit
      onBack={handleBack}
      onSave={handleSaveUserProfile}
    />
  );
};

// OrganizationManager wrapper
export const OrganizationManagerWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();

  const handleBack = () => {
    navigate('/organizations');
  };

  return (
    <OrganizationManager
      onBack={handleBack}
      organizationId={Number(organizationId)}
    />
  );
};

// EditUserManagementPage wrapper - for editing Driven Users from User Management
export const EditUserManagementPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  // Mock Driven Users data - matching what's in UserManagementPage
  // In a real app, this would come from an API
  const mockDrivenUsers = [
    { 
      id: 1, 
      name: 'Jordan Murad', 
      role: 'OWNER',
      firstName: 'Jordan',
      lastName: 'Murad',
      email: 'jordan.murad@driven.com',
      phone: '+1 (555) 123-4567',
      username: 'jordan.murad',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '2 hours ago',
      joinDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Jared Murad', 
      role: 'TEAM_CAPTAIN',
      firstName: 'Jared',
      lastName: 'Murad',
      email: 'jared.murad@driven.com',
      phone: '+1 (555) 234-5678',
      username: 'jared.murad',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '1 day ago',
      joinDate: '2023-03-20'
    },
    { 
      id: 3, 
      name: 'Tanner Raburn', 
      role: 'THIRD_PARTY',
      firstName: 'Tanner',
      lastName: 'Raburn',
      email: 'tanner.raburn@driven.com',
      phone: '+1 (555) 345-6789',
      username: 'tanner.raburn',
      active: true,
      twoFactorEnabled: false,
      lastLogin: '3 hours ago',
      joinDate: '2023-05-10'
    },
    { 
      id: 4, 
      name: 'Linda Hall', 
      role: 'OWNER',
      firstName: 'Linda',
      lastName: 'Hall',
      email: 'linda.hall@driven.com',
      phone: '+1 (555) 456-7890',
      username: 'linda.hall',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '5 hours ago',
      joinDate: '2023-02-14'
    },
    { 
      id: 5, 
      name: 'Daniel Moran', 
      role: 'OWNER',
      firstName: 'Daniel',
      lastName: 'Moran',
      email: 'daniel.moran@driven.com',
      phone: '+1 (555) 567-8901',
      username: 'daniel.moran',
      active: true,
      twoFactorEnabled: false,
      lastLogin: '1 day ago',
      joinDate: '2023-04-05'
    },
  ];

  const handleBack = () => {
    navigate('/user-management');
  };

  const handleSave = (userData: any) => {
    // In a real app, this would call an API
    console.log('Saving user:', userData);
    navigate('/user-management');
  };

  // Find the Driven User
  const drivenUser = mockDrivenUsers.find(user => user.id === Number(userId));

  if (!drivenUser) {
    navigate('/user-management');
    return null;
  }

  // Convert Driven User data to the format expected by EditUserManagementPage
  // Note: For Driven Users, we'll use a default organization since they're not tied to one
  const userToEdit = {
    id: drivenUser.id,
    name: drivenUser.name,
    organization: 'Driven Software', // Default since Driven Users aren't tied to a specific organization
    organizationId: 0, // 0 indicates a Driven User
    email: drivenUser.email || '',
    phone: drivenUser.phone || '',
    role: drivenUser.role,
    status: (drivenUser.active ? 'Active' : 'Inactive') as 'Active' | 'Inactive'
  };

  return (
    <EditUserManagementPage
      userToEdit={userToEdit}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
};