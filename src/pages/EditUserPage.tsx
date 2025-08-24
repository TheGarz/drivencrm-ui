// Edit User Page Component
// Extracted from CompanyAdminDashboard to maintain exact styling and functionality

import React from 'react';
import { useTheme } from '../theme';
import { Shield, ShieldCheck, Mail } from 'lucide-react';

interface EditUserPageProps {
  userToEdit: any;
  userAccountActive: boolean;
  userTwoFactorEnabled: boolean;
  onBack: () => void;
  onSave: (userData: any) => void;
  onAccountStatusToggle: () => void;
  onTwoFactorToggle: () => void;
  onResetPassword: (user: any) => void;
}

const EditUserPage: React.FC<EditUserPageProps> = ({
  userToEdit,
  userAccountActive,
  userTwoFactorEnabled,
  onBack,
  onSave,
  onAccountStatusToggle,
  onTwoFactorToggle,
  onResetPassword
}) => {
  const { currentTheme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <h1 style={{ color: currentTheme.textPrimary, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Edit Driven User
            </h1>
            <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
              Update user information and account settings
            </p>
          </div>
          
          {/* Spacer to maintain layout balance */}
          <div style={{ width: '120px' }}></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Spacer to maintain search bar space */}
          <div style={{ width: '256px' }}></div>
        </div>
      </div>

      {/* Edit User Form */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '32px',
        border: `1px solid ${currentTheme.border}`
      }}>
        {/* Header with Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.textPrimary,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.sidebarBg;
              e.currentTarget.style.color = currentTheme.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.textPrimary;
            }}
          >
            ← Back to Users
          </button>
          <div>
            <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '24px', fontWeight: '600' }}>
              {userToEdit.firstName} {userToEdit.lastName}
            </h2>
            <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '16px' }}>
              User ID: {userToEdit.id} • Joined: {userToEdit.joinDate}
            </p>
          </div>
        </div>

        {/* User Profile Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr', 
          gap: '24px', 
          marginBottom: '32px',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: currentTheme.background,
          borderRadius: '12px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            backgroundColor: currentTheme.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px'
          }}>
            {userToEdit.firstName[0] + userToEdit.lastName[0]}
          </div>
          
          {/* User Info */}
          <div>
            <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
              {userToEdit.firstName} {userToEdit.lastName}
            </h3>
            <p style={{ color: currentTheme.textSecondary, margin: '0 0 4px 0', fontSize: '16px' }}>
              {userToEdit.email}
            </p>
            <p style={{ color: currentTheme.textSecondary, margin: '0 0 8px 0', fontSize: '14px' }}>
              Username: {userToEdit.username} • Phone: {userToEdit.phone}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: userAccountActive ? currentTheme.success + '20' : currentTheme.danger + '20',
                color: userAccountActive ? currentTheme.success : currentTheme.danger
              }}>
                {userAccountActive ? 'Active' : 'Inactive'}
              </span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: userTwoFactorEnabled ? currentTheme.success + '20' : currentTheme.danger + '20',
                color: userTwoFactorEnabled ? currentTheme.success : currentTheme.danger
              }}>
                2FA {userTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
            Personal Information
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                First Name *
              </label>
              <input
                type="text"
                defaultValue={userToEdit.firstName}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Last Name *
              </label>
              <input
                type="text"
                defaultValue={userToEdit.lastName}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Email Address *
              </label>
              <input
                type="email"
                defaultValue={userToEdit.email}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={userToEdit.phone}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Account Status Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h4 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Account Status
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: userAccountActive ? `${currentTheme.success}15` : `${currentTheme.danger}15`,
              border: `1px solid ${userAccountActive ? currentTheme.success : currentTheme.danger}30`
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: userAccountActive ? currentTheme.success : currentTheme.danger
              }} />
              <span style={{
                color: userAccountActive ? currentTheme.success : currentTheme.danger,
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {userAccountActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            backgroundColor: userAccountActive ? `${currentTheme.success}08` : `${currentTheme.danger}08`,
            border: `1px solid ${userAccountActive ? currentTheme.success : currentTheme.danger}20`,
            borderRadius: '12px'
          }}>
            <div style={{ flex: 1 }}>
              <p style={{
                color: currentTheme.textPrimary,
                fontSize: '14px',
                fontWeight: '500',
                margin: '0 0 4px 0'
              }}>
                {userAccountActive ? 'Full Admin Access' : 'Access Restricted'}
              </p>
              <p style={{
                color: currentTheme.textSecondary,
                fontSize: '12px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {userAccountActive
                  ? 'This user can access all admin panel features and manage organizations'
                  : 'This user cannot log in or access any admin panel features'
                }
              </p>
            </div>
            <button
              onClick={onAccountStatusToggle}
              style={{
                padding: '12px 20px',
                backgroundColor: userAccountActive ? currentTheme.danger : currentTheme.success,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '160px',
                justifyContent: 'center',
                boxShadow: `0 2px 8px ${userAccountActive ? currentTheme.danger : currentTheme.success}30`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${userAccountActive ? currentTheme.danger : currentTheme.success}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 8px ${userAccountActive ? currentTheme.danger : currentTheme.success}30`;
              }}
            >
              {userAccountActive ? (
                <>
                  <ShieldCheck size={16} />
                  Deactivate
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Activate
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2FA Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h4 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Two-Factor Authentication
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: userTwoFactorEnabled ? `${currentTheme.success}15` : `${currentTheme.warning}15`,
              border: `1px solid ${userTwoFactorEnabled ? currentTheme.success : currentTheme.warning}30`
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: userTwoFactorEnabled ? currentTheme.success : currentTheme.warning
              }} />
              <span style={{
                color: userTwoFactorEnabled ? currentTheme.success : currentTheme.warning,
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {userTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            backgroundColor: userTwoFactorEnabled ? `${currentTheme.success}08` : `${currentTheme.warning}08`,
            border: `1px solid ${currentTheme.warning}20`,
            borderRadius: '12px'
          }}>
            <div style={{ flex: 1 }}>
              <p style={{
                color: currentTheme.textPrimary,
                fontSize: '14px',
                fontWeight: '500',
                margin: '0 0 4px 0'
              }}>
                {userTwoFactorEnabled ? 'Enhanced Security Active' : 'Basic Security Only'}
              </p>
              <p style={{
                color: currentTheme.textSecondary,
                fontSize: '12px',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {userTwoFactorEnabled
                  ? 'Account is protected with two-factor authentication for enhanced security'
                  : 'Enable 2FA to add an extra layer of security to this user account'
                }
              </p>
            </div>
            <button
              onClick={onTwoFactorToggle}
              style={{
                padding: '12px 20px',
                backgroundColor: userTwoFactorEnabled ? currentTheme.warning : currentTheme.success,
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '140px',
                justifyContent: 'center',
                boxShadow: `0 2px 8px ${userTwoFactorEnabled ? currentTheme.warning : currentTheme.success}30`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${userTwoFactorEnabled ? currentTheme.warning : currentTheme.success}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 8px ${userTwoFactorEnabled ? currentTheme.warning : currentTheme.success}30`;
              }}
            >
              {userTwoFactorEnabled ? (
                <>
                  <Shield size={16} />
                  Disable 2FA
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Enable 2FA
                </>
              )}
            </button>
          </div>
          
          {/* Reset Password Button */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${currentTheme.border}` }}>
            <button
              onClick={() => onResetPassword(userToEdit)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: currentTheme.primary,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Mail style={{ width: '14px', height: '14px' }} />
              Send Password Reset Email
            </button>
            <p style={{ color: currentTheme.textSecondary, fontSize: '11px', margin: '6px 0 0 0' }}>
              User will receive an email to reset their password
            </p>
          </div>
        </div>
        
        {/* Last Login Info - Full Width */}
        <div style={{
          padding: '20px',
          backgroundColor: currentTheme.background,
          borderRadius: '12px',
          border: `1px solid ${currentTheme.border}`,
          marginBottom: '16px'
        }}>
          <h4 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
            Last Login Activity
          </h4>
          <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
            {userToEdit.lastLogin}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: currentTheme.textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.sidebarBg;
              e.currentTarget.style.color = currentTheme.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.textSecondary;
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({
              ...userToEdit,
              active: userAccountActive,
              twoFactorEnabled: userTwoFactorEnabled
            })}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: currentTheme.primary,
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: `0 2px 8px ${currentTheme.primary}30`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${currentTheme.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${currentTheme.primary}30`;
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;
