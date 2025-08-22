import React, { useState } from 'react';
import { Users, Search, Plus, Download, Upload, UserMinus, Edit3, CheckCircle, XCircle, MapPin, Clock, Mail, Phone, Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization, User } from '../types';
import UserManagement from '../../UserManagement';

const UsersTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void; onShowAddUser: () => void }> = ({ organization, onShowAddUser }) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [displayedUsers, setDisplayedUsers] = useState(10);


  const handleAddUser = () => {
    onShowAddUser();
  };

  const handleDownloadTemplate = () => {
    // Create CSV template with headers
    const csvHeaders = [
      'First Name',
      'Last Name', 
      'Middle Name',
      'Username',
      'Email',
      'Phone',
      'User Role',
      'Status'
    ];
    
    // Add sample row for reference
    const sampleRow = [
      'John',
      'Smith',
      'Michael',
      'jsmith',
      'john.smith@example.com',
      '555-123-4567',
      'ADMIN',
      'Active'
    ];
    
    const csvContent = [
      csvHeaders.join(','),
      sampleRow.join(','),
      // Add empty rows for user data entry
      ',,,,,,,',
      ',,,,,,,',
      ',,,,,,'
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportUsers = () => {
    // Create hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csv = e.target?.result as string;
          // Parse CSV and process users
          // CSV content parsed
          // Here you would parse the CSV and add users to your system
          // For now, just show an alert
          alert('CSV file uploaded successfully! In production, this would import the users.');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };


  const handleManageUser = (user: User) => {
    setSelectedUser(user);
    setShowUserManagement(true);
  };

  const handleCloseUserManagement = () => {
    setShowUserManagement(false);
    setSelectedUser(null);
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    // Here you would typically make an API call to update the user
    // Updating user
    // For now, we'll just close the management view
    handleCloseUserManagement();
  };

  const mockUsers: User[] = [
    { id: 1, name: 'John Smith', email: 'john@crosspest.com', role: 'Owner', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'John Smith', memberSince: '2024-08-18' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'Sarah Johnson', memberSince: '2024-07-20' },
    { id: 3, name: 'Mike Wilson', email: 'mike@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-09-10' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@crosspest.com', role: 'CSR', status: 'Inactive', lastLogin: '2024-01-10', connectedCrmUser: null, closedOn: '2024-12-15' },
    { id: 5, name: 'David Garcia', email: 'david@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'David Garcia', memberSince: '2024-06-15' },
    { id: 6, name: 'Emily Chen', email: 'emily@crosspest.com', role: 'CSR', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Emily Chen', memberSince: '2024-05-20' },
    { id: 7, name: 'Robert Martinez', email: 'robert@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-13', connectedCrmUser: 'Robert Martinez', memberSince: '2024-04-10' },
    { id: 8, name: 'Jennifer White', email: 'jennifer@crosspest.com', role: 'Sales', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-08-01' },
    { id: 9, name: 'Michael Davis', email: 'michael@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-12', connectedCrmUser: 'Michael Davis', memberSince: '2024-07-08' },
    { id: 10, name: 'Amanda Taylor', email: 'amanda@crosspest.com', role: 'CSR', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Amanda Taylor', memberSince: '2024-03-25' },
    { id: 11, name: 'James Anderson', email: 'james@crosspest.com', role: 'Tech', status: 'Inactive', lastLogin: '2024-01-08', connectedCrmUser: null, closedOn: '2024-12-10' },
    { id: 12, name: 'Jessica Moore', email: 'jessica@crosspest.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'Jessica Moore', memberSince: '2024-02-15' },
    { id: 13, name: 'William Thompson', email: 'william@crosspest.com', role: 'Sales', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Bill Thompson', memberSince: '2024-09-05' },
    { id: 14, name: 'Ashley Jackson', email: 'ashley@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-13', connectedCrmUser: 'Ashley Jackson', memberSince: '2024-01-30' },
    { id: 15, name: 'Christopher Lee', email: 'chris@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Chris Lee', memberSince: '2024-11-12' }
  ];

  const handleLoadMoreUsers = () => {
    setDisplayedUsers(prev => prev + 10);
  };

  // Filter users based on search and role
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  // Get visible users based on display count
  const visibleUsers = filteredUsers.slice(0, displayedUsers);

  // Reset pagination when search or filter changes
  React.useEffect(() => {
    setDisplayedUsers(10);
  }, [searchQuery, filterRole]);

  if (showUserManagement && selectedUser) {
    return (
      <UserManagement
        user={selectedUser}
        onBack={handleCloseUserManagement}
        onUpdate={handleUpdateUser}
      />
    );
  }

  return (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '24px',
        borderBottom: `1px solid ${currentTheme.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Users ({filteredUsers.length})
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={handleDownloadTemplate}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              <Download size={16} />
              Template
            </button>
            <button 
              onClick={handleImportUsers}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              <Upload size={16} />
              Import
            </button>
            <button 
              onClick={handleAddUser}
              style={{
                padding: '8px 16px',
                backgroundColor: currentTheme.primary,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentTheme.textSecondary
            }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px 8px 40px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                fontSize: '14px'
              }}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: '8px 12px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          >
            <option value="all">All Roles</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
            <option value="EXECUTIVE_BRANCH_MANAGER">Executive Branch Manager</option>
            <option value="BRANCH_MANAGER">Branch Manager</option>
            <option value="TEAM_CAPTAIN">Team Captain</option>
            <option value="CSR_UNIT_LEADER">CSR Unit Leader</option>
            <option value="CSR_MEMBER">CSR Member</option>
            <option value="SALES_UNIT_LEADER">Sales Unit Leader</option>
            <option value="SALES_MEMBER">Sales Member</option>
            <option value="TECH_UNIT_LEADER">Tech Unit Leader</option>
            <option value="TECH_MEMBER">Tech Member</option>
          </select>
        </div>
      </div>

      {/* Table Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: currentTheme.cardBg,
        borderBottom: `2px solid ${currentTheme.border}`,
        fontWeight: '600',
        fontSize: '14px',
        color: currentTheme.textSecondary,
        width: '100%'
      }}>
        <div style={{ flex: '2', minWidth: '200px' }}>USER</div>
        <div style={{ flex: '1', minWidth: '120px', textAlign: 'left' }}>ROLE</div>
        <div style={{ flex: '1.2', minWidth: '140px', textAlign: 'left' }}>CONNECTED</div>
        <div style={{ flex: '1.2', minWidth: '140px', textAlign: 'left' }}>LAST LOGIN</div>
        <div style={{ flex: '0.8', minWidth: '80px', textAlign: 'center' }}>STATUS</div>
        <div style={{ flex: '0.6', minWidth: '77px', textAlign: 'center' }}>ACTION</div>
      </div>

      <div style={{ padding: '16px 0' }}>
        {visibleUsers.map((user) => (
          <div key={user.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: `1px solid ${currentTheme.border}`,
            width: '100%'
          }}>
            <div style={{ flex: '2', minWidth: '200px' }}>
              <div style={{
                color: currentTheme.textPrimary,
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {user.name}
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '14px'
              }}>
                {user.email}
              </div>
            </div>
            {/* Role Column */}
            <div style={{ 
              flex: '1',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                color: currentTheme.textPrimary,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {user.role}
              </span>
            </div>

            {/* Connected CRM User Column */}
            <div style={{ 
              flex: '1.2',
              minWidth: '140px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
                {user.connectedCrmUser ? (
                  <>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentTheme.success
                    }} />
                    <span style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {user.connectedCrmUser}
                    </span>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentTheme.textSecondary
                    }} />
                    <span style={{
                      color: currentTheme.textSecondary,
                      fontSize: '14px'
                    }}>
                      Not connected
                    </span>
                  </>
                )}
              </div>

            {/* Last Login Column */}
            <div style={{ 
              flex: '1.2',
              minWidth: '140px',
              display: 'flex',
              alignItems: 'center'
            }}>
                <span style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px'
                }}>
                  {new Date(user.lastLogin).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

            {/* Status Column */}
            <div style={{ 
              flex: '0.8',
              minWidth: '80px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px' 
            }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: user.status === 'Active' ? currentTheme.success : currentTheme.danger
                }} />
                <span style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px'
                }}>
                  {user.status}
                </span>
              </div>

            {/* Manage Button */}
            <div style={{ 
              flex: '0.6',
              minWidth: '77px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button 
                onClick={() => handleManageUser(user)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                Manage
              </button>
            </div>
          </div>
        ))}
        
        {/* Load More Button */}
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
                padding: searchQuery.trim() ? '8px 16px' : '12px 24px',
                backgroundColor: searchQuery.trim() ? 'transparent' : currentTheme.primary + '10',
                border: `2px solid ${currentTheme.primary}`,
                borderRadius: '12px',
                color: currentTheme.primary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                minWidth: searchQuery.trim() ? 'auto' : '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.primary;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.primary}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = searchQuery.trim() ? 'transparent' : currentTheme.primary + '10';
                e.currentTarget.style.color = currentTheme.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Plus size={16} />
              {searchQuery.trim() 
                ? `Show More (${filteredUsers.length - visibleUsers.length} remaining)`
                : `Load More Users (${filteredUsers.length - visibleUsers.length} remaining)`
              }
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

// Metrics Tab Component

export default UsersTab;
