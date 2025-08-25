// Driven Users Page Component
// Updated to use React Router navigation directly

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { Search, Plus, Shield, Filter, Edit3, Mail, Phone } from 'lucide-react';
import { useUserManagement } from '../hooks/useUserManagement';

const DrivenUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const {
    userSearchQuery,
    setUserSearchQuery,
    userStatusFilter,
    setUserStatusFilter,
    mockDrivenUsers,
    filteredUsers,
    visibleUsers,
    handleLoadMoreUsers,
    handleEditUser
  } = useUserManagement();

  const handleAddUser = () => {
    navigate('/driven-users/add');
  };

  const handleEditClick = (user: any) => {
    handleEditUser(user);
    navigate(`/driven-users/${user.id}/edit`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <h1 style={{ color: currentTheme.textPrimary, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Driven Users Management
            </h1>
            <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
              Platform user access and permissions
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

      {/* Driven Users Management - exact same styling */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${currentTheme.border}`,
        overflow: 'auto'
      }}>
        {/* Header - exact same styling */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              backgroundColor: currentTheme.primary + '20',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
            </div>
            <div>
              <h2 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '20px', fontWeight: '600' }}>
                Driven Employee Access ({filteredUsers.length})
              </h2>
              <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
                Manage platform administrators and support staff
              </p>
            </div>
          </div>
          <button
            onClick={handleAddUser}
            style={{
              backgroundColor: currentTheme.primary,
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Plus size={16} />
            Add Driven User
          </button>
        </div>

        {/* Quick Stats - exact same styling */}
        <div style={{
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: currentTheme.background,
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold' }}>
              {mockDrivenUsers.filter(u => u.active).length}
            </div>
            <div style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Active Users</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold' }}>
              {mockDrivenUsers.length}
            </div>
            <div style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Total Employees</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: currentTheme.success, fontSize: '24px', fontWeight: 'bold' }}>
              {mockDrivenUsers.filter(u => u.twoFactorEnabled).length}
            </div>
            <div style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>2FA Enabled</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold' }}>
              {mockDrivenUsers.filter(u => u.lastLogin.includes('01/20/2024') || u.lastLogin.includes('01/19/2024')).length}
            </div>
            <div style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Recent Logins (48hrs)</div>
          </div>
        </div>

        {/* Search and Filters - exact same styling */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentTheme.textSecondary
            }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '10px',
                backgroundColor: currentTheme.background,
                color: currentTheme.textPrimary,
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            />
          </div>
          
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} style={{ color: currentTheme.textSecondary }} />
            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                fontSize: '14px',
                minWidth: '120px'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        {/* Enhanced Table Container - exact same styling */}
        <div style={{ minWidth: '900px' }}>
          {/* Users Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 2fr 2fr 1.8fr 1fr 1fr 120px',
            gap: '16px',
            padding: '16px 0',
            borderBottom: `2px solid ${currentTheme.border}`,
            fontWeight: '600',
            fontSize: '14px',
            color: currentTheme.textSecondary
          }}>
            <div></div>
            <div>User</div>
            <div>Contact</div>
            <div>Last Login</div>
            <div style={{ textAlign: 'center' }}>2FA</div>
            <div>Status</div>
            <div style={{ textAlign: 'center' }}>Actions</div>
          </div>

          {/* Enhanced Users Data */}
          {visibleUsers.map((user) => (
            <div key={user.id} style={{
              display: 'grid',
              gridTemplateColumns: '50px 2fr 2fr 1.8fr 1fr 1fr 120px',
              gap: '16px',
              padding: '20px 0',
              borderBottom: `1px solid ${currentTheme.border}`,
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }}>
              {/* Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {user.firstName[0] + user.lastName[0]}
              </div>
              
              {/* User Info */}
              <div>
                <div style={{ 
                  color: currentTheme.textPrimary, 
                  fontWeight: '600', 
                  marginBottom: '4px',
                  fontSize: '15px'
                }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    backgroundColor: currentTheme.primary + '20',
                    color: currentTheme.primary,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    @{user.username}
                  </span>
                  Joined {user.joinDate}
                </div>
              </div>
              
              {/* Contact Info */}
              <div>
                <div style={{ 
                  color: currentTheme.textPrimary, 
                  fontSize: '14px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Mail size={14} style={{ color: currentTheme.textSecondary }} />
                  {user.email}
                </div>
                <div style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Phone size={14} />
                  {user.phone}
                </div>
              </div>
              
              {/* Last Login */}
              <div style={{
                color: currentTheme.textPrimary,
                fontSize: '14px'
              }}>
                {user.lastLogin}
              </div>
              
              {/* 2FA Status */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  padding: '6px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: user.twoFactorEnabled ? currentTheme.success + '20' : currentTheme.warning + '20',
                  color: user.twoFactorEnabled ? currentTheme.success : currentTheme.warning
                }}>
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              {/* Status */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: user.active ? currentTheme.success + '20' : currentTheme.danger + '20',
                  color: user.active ? currentTheme.success : currentTheme.danger,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: user.active ? currentTheme.success : currentTheme.danger
                  }} />
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => handleEditClick(user)}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.textPrimary,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primary;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = currentTheme.primary;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = currentTheme.textPrimary;
                    e.currentTarget.style.borderColor = currentTheme.border;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Edit3 size={14} />
                  Edit
                </button>
              </div>
            </div>
          ))}

          {/* Load More Button - exact same styling */}
          {filteredUsers.length > visibleUsers.length && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '24px',
              borderTop: `1px solid ${currentTheme.border}`
            }}>
              <button
                onClick={handleLoadMoreUsers}
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentTheme.primary + '10',
                  border: `2px solid ${currentTheme.primary}`,
                  borderRadius: '12px',
                  color: currentTheme.primary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.primary}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                  e.currentTarget.style.color = currentTheme.primary;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Plus size={16} />
                Load More Users ({filteredUsers.length - visibleUsers.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrivenUsersPage;
