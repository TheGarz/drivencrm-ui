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
    handleResetPassword
  } = useUserManagement();

  const handleBack = () => {
    navigate('/driven-users');
  };

  // Find the user to edit
  const userToEdit = mockDrivenUsers.find(user => user.id === Number(userId));
  
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