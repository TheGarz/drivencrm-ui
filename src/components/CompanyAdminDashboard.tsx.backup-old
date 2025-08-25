// Refactored Company Admin Dashboard
// Uses new layout, hooks, and page components while maintaining exact functionality

import React from 'react';
import { useTheme } from '../theme';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/DashboardPage';
import OrganizationsPage from '../pages/OrganizationsPage';
import DrivenUsersPage from '../pages/DrivenUsersPage';
import OrganizationManager from './OrganizationManager';
import AddNewOrganization from './AddNewOrganization';
import AddDrivenUser from './AddDrivenUser';
import UserProfileEdit from './UserProfileEdit';
import { useAdminNavigation, type ViewType } from '../hooks/useAdminNavigation';
import { useUserManagement } from '../hooks/useUserManagement';
import { useOrganizationManagement } from '../hooks/useOrganizationManagement';
import EditUserPage from '../pages/EditUserPage';
import { AlertTriangle } from 'lucide-react';

const CompanyAdminDashboard: React.FC = () => {
  const { currentTheme } = useTheme();
  
  // Use our custom hooks
  const {
    isTransitioning,
    activeNavItem,
    currentView,
    isProfileOpen,
    isThemeSelectorOpen,
    handleNavClick,
    navigateToView,
    navigateBack,
    toggleProfileDropdown,
    closeProfileDropdown,
    openThemeSelector,
    closeThemeSelector
  } = useAdminNavigation();

  const {
    selectedUserId,
    showInactiveWarning,
    userAccountActive,
    userTwoFactorEnabled,
    mockDrivenUsers,
    handleEditUser: handleEditUserFromHook,
    handleSaveEditedUser,
    handleAccountStatusToggle,
    handleTwoFactorToggle,
    confirmAccountDeactivation,
    cancelAccountDeactivation,
    handleSaveDrivenUser,
    handleSaveUserProfile,
    handleResetPassword
  } = useUserManagement();

  const {
    selectedOrganizationId,
    handleSaveNewOrganization
  } = useOrganizationManagement();

  // Navigation handlers that maintain exact same behavior
  const handleNavigateToProfile = () => {
    navigateToView('profile');
  };

  const handleEditUser = (userId: number) => {
    // First, find the user and call the hook's handleEditUser to set state
    const user = mockDrivenUsers.find(u => u.id === userId);
    if (user) {
      handleEditUserFromHook(user);
    }
    // Then navigate to the edit view
    navigateToView('edit-user');
  };

  const handleAddUser = () => {
    navigateToView('add-driven-user');
  };

  const handleAddOrganization = () => {
    navigateToView('add-organization');
  };

  const handleManageOrganization = (orgId: number) => {
    navigateToView('manage-organization');
  };

  // Render content based on current view - exact same logic as original
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      
      case 'organizations':
        return (
          <OrganizationsPage 
            onAddOrganization={handleAddOrganization}
            onManageOrganization={handleManageOrganization}
          />
        );
      
      case 'driven-users':
        return (
          <DrivenUsersPage 
            onEditUser={handleEditUser}
            onAddUser={handleAddUser}
          />
        );

      case 'manage-organization':
        return (
          <OrganizationManager 
            onBack={() => navigateBack('organizations')} 
          organizationId={selectedOrganizationId}
          />
        );

      case 'add-organization':
        return (
          <AddNewOrganization 
            onBack={() => navigateBack('organizations')}
            onSave={handleSaveNewOrganization}
          />
        );

      case 'edit-user':
        // Find the user to edit - same logic as original
        const userToEdit = mockDrivenUsers.find(user => user.id === selectedUserId);
        if (!userToEdit) {
          // If user not found, go back to users list
          navigateBack('driven-users');
          return null;
        }
        
        return (
          <EditUserPage
            userToEdit={userToEdit}
            userAccountActive={userAccountActive}
            userTwoFactorEnabled={userTwoFactorEnabled}
            onBack={() => navigateBack('driven-users')}
            onSave={handleSaveEditedUser}
            onAccountStatusToggle={handleAccountStatusToggle}
            onTwoFactorToggle={handleTwoFactorToggle}
            onResetPassword={handleResetPassword}
          />
        );


      
      case 'add-driven-user':
        return (
          <AddDrivenUser 
            onBack={() => navigateBack('driven-users')}
            onSave={handleSaveDrivenUser}
          />
        );
      
      case 'profile':
        return (
          <UserProfileEdit 
            onBack={() => navigateBack('dashboard')}
            onSave={handleSaveUserProfile}
          />
        );

      default:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '48px',
              border: `1px solid ${currentTheme.border}`,
              textAlign: 'center'
            }}>
              <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 16px 0' }}>
                {currentView}
              </h2>
              <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
                This section is under development. Coming soon!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <AdminLayout
        currentView={currentView}
        activeNavItem={activeNavItem}
        isTransitioning={isTransitioning}
        isProfileOpen={isProfileOpen}
        isThemeSelectorOpen={isThemeSelectorOpen}
        onNavClick={handleNavClick}
        onToggleProfileDropdown={toggleProfileDropdown}
        onCloseProfileDropdown={closeProfileDropdown}
        onOpenThemeSelector={openThemeSelector}
        onCloseThemeSelector={closeThemeSelector}
        onNavigateToProfile={handleNavigateToProfile}
      >
        {renderContent()}
      </AdminLayout>

      {/* Inactive Warning Modal */}
      {showInactiveWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }} onClick={cancelAccountDeactivation}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
              padding: '32px',
            maxWidth: '450px',
              width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            border: `1px solid ${currentTheme.border}`
          }} onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={48} style={{ color: currentTheme.warning, marginBottom: '20px' }} />
            <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 12px 0', fontSize: '22px' }}>
              Confirm Deactivation
                </h3>
            <p style={{ color: currentTheme.textSecondary, margin: '0 0 24px 0', fontSize: '15px', lineHeight: '1.5' }}>
              Are you sure you want to deactivate this user account? They will lose all access to the platform.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={cancelAccountDeactivation}
                style={{
                  padding: '12px 24px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: currentTheme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAccountDeactivation}
                style={{
                  padding: '12px 24px',
                  border: `1px solid ${currentTheme.warning}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.warning,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.danger;
                  e.currentTarget.style.borderColor = currentTheme.danger;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.warning;
                  e.currentTarget.style.borderColor = currentTheme.warning;
                }}
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyAdminDashboard;
