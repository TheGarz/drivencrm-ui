import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import UserManagement from './UserManagement';
import { 
  Building2, 
  Settings, 
  Database, 
  Users, 
  BarChart3, 
  Link, 
  Shield, 
  Activity,
  Save,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  X,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Globe,
  ArrowLeft
} from 'lucide-react';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  connectedCrmUser: string | null;
  memberSince?: string;
  closedOn?: string;
}

// eslint-disable-next-line camelcase
interface Organization {
  id: number;
  name: string;
  active: boolean;
  // eslint-disable-next-line camelcase
  sync_limit: number;
  // eslint-disable-next-line camelcase
  pay_period: string;
  // eslint-disable-next-line camelcase
  pay_start: string;
  // eslint-disable-next-line camelcase
  created_at: string;
  // eslint-disable-next-line camelcase
  last_sync: string;
  // eslint-disable-next-line camelcase
  total_users: number;
  // eslint-disable-next-line camelcase
  total_branches: number;
  // eslint-disable-next-line camelcase
  monthly_revenue: number;
  // eslint-disable-next-line camelcase
  integration_count: number;
  // eslint-disable-next-line camelcase
  app_config?: AppConfig;
  services?: ServiceResource[];
}

interface AppConfig {
  version: number;
  metrics: {
    [group: string]: MetricConfig[];
  };
}

interface MetricConfig {
  type: string;
  uid?: string;
}

interface ServiceResource {
  uid: string;
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  last_sync?: string;
  config?: Record<string, any>;
}

interface TabProps {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<{ organization: Organization; onUpdate: (org: Organization) => void }>;
}

// Mock data
const mockOrganization: Organization = {
  id: 1,
  name: 'Cross Pest Control',
  active: true,
  sync_limit: 0,
  pay_period: 'PERIOD_WEEKLY',
  pay_start: '2023-01-01',
  created_at: '2023-01-01T00:00:00Z',
  last_sync: '2024-01-15T10:30:00Z',
  total_users: 47,
  total_branches: 3,
  monthly_revenue: 125000,
  integration_count: 5,
  app_config: {
    version: 2,
    metrics: {
      branch: [
        { type: 'revenue' },
        { type: 'cancels' },
        { type: 'leads' }
      ],
      tech: [
        { type: 'completion' },
        { type: 'prodperhour' },
        { type: 'reviews' }
      ]
    }
  },
  services: [
    {
      uid: 'fieldroutes-001',
      type: 'FIELDROUTES',
      name: 'FieldRoutes CRM',
      status: 'active',
      last_sync: '2024-01-15T10:30:00Z'
    },
    {
      uid: 'hubspot-001', 
      type: 'HUBSPOT',
      name: 'HubSpot Leads',
      status: 'active',
      last_sync: '2024-01-15T09:45:00Z'
    }
  ]
};

// General Information Tab
const GeneralTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState(organization);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = (field: string) => {
    onUpdate(formData);
    setEditingField(null);
  };

  const handleCancel = () => {
    setFormData(organization);
    setEditingField(null);
  };

  const handleStatusToggle = () => {
    if (organization.active) {
      // Show confirmation modal for deactivation
      setShowDeactivateModal(true);
    } else {
      // Directly activate without confirmation
      onUpdate({ ...organization, active: true });
    }
  };

  const handleConfirmDeactivate = () => {
    onUpdate({ ...organization, active: false });
    setShowDeactivateModal(false);
  };

  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
  };

  const renderEditableField = (field: string, label: string, value: string | number | boolean, type: string = 'text') => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderBottom: `1px solid ${currentTheme.border}`
    }}>
      <div style={{ flex: 1 }}>
        <label style={{
          display: 'block',
          color: currentTheme.textSecondary,
          fontSize: '14px',
          marginBottom: '4px',
          fontWeight: '500'
        }}>
          {label}
          {field === 'sync_limit' && (
            <span style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              fontWeight: '400',
              marginLeft: '8px',
              opacity: 0.7
            }}>
              (0-24)
            </span>
          )}
        </label>
        {editingField === field ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {type === 'select' ? (
              <select
                value={String(value)}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              >
                <option value="DAY">Day</option>
                <option value="MONTH">Month</option>
                <option value="QUARTER">Quarter</option>
                <option value="HALF">Half</option>
                <option value="YEAR">Year</option>
                <option value="PERIOD_DAILY">Period Daily</option>
                <option value="PERIOD_WEEKLY">Period Weekly</option>
                <option value="PERIOD_BIWEEKLY">Period Biweekly</option>
                <option value="PERIOD_SEMI_MONTHLY">Period Semi Monthly</option>
                <option value="PERIOD_MONTHLY">Period Monthly</option>
              </select>
            ) : (
              <input
                type={type}
                value={String(value)}
                min={field === 'sync_limit' ? 0 : undefined}
                max={field === 'sync_limit' ? 24 : undefined}
                onChange={(e) => {
                  let newValue = type === 'number' ? Number(e.target.value) : e.target.value;
                  
                  // Specific validation for sync_limit field
                  if (field === 'sync_limit' && type === 'number') {
                    newValue = Math.max(0, Math.min(24, Number(newValue)));
                  }
                  
                  setFormData({ ...formData, [field]: newValue });
                }}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              />
            )}
            <button
              onClick={() => handleSave(field)}
              style={{
                padding: '8px',
                backgroundColor: currentTheme.success,
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '8px',
                backgroundColor: currentTheme.danger,
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <div style={{
            color: currentTheme.textPrimary,
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {field === 'pay_period' ? 
              String(value).startsWith('PERIOD_') ? 
                String(value).replace('PERIOD_', '').replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) :
                String(value).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
              : field === 'pay_start' ? 
                new Date(String(value)).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                })
              : value}
          </div>
        )}
      </div>
      {editingField !== field && (
        <button
          onClick={() => handleEdit(field)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '6px',
            color: currentTheme.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Edit3 size={14} />
          Edit
        </button>
      )}
    </div>
  );

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
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Organization Details
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px'
        }}>
          Basic information and configuration for this organization
        </p>
      </div>

      {renderEditableField('name', 'Organization Name', formData.name)}
      {renderEditableField('sync_limit', 'Daily Sync Limit', formData.sync_limit, 'number')}
      {renderEditableField('pay_period', 'Pay Period', formData.pay_period, 'select')}
      {renderEditableField('pay_start', 'Pay Start Date', formData.pay_start, 'date')}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px'
      }}>
        <div>
          <label style={{
            display: 'block',
            color: currentTheme.textSecondary,
            fontSize: '14px',
            marginBottom: '4px',
            fontWeight: '500'
          }}>
            Status
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: organization.active ? currentTheme.success : currentTheme.danger
            }} />
            <span style={{
              color: currentTheme.textPrimary,
              fontSize: '16px',
              fontWeight: '500'
            }}>
              {organization.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <button
          onClick={handleStatusToggle}
          style={{
            padding: '8px 16px',
            backgroundColor: organization.active ? currentTheme.danger : currentTheme.success,
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {organization.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: currentTheme.danger + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={24} style={{ color: currentTheme.danger }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Deactivate Organization
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  This action cannot be undone easily
                </p>
              </div>
            </div>

            <p style={{
              color: currentTheme.textPrimary,
              margin: '0 0 24px 0',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to deactivate <strong>{organization.name}</strong>? 
              This will disable all services, integrations, and user access for this organization.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelDeactivate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.danger,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Users Tab Component
const UsersTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    phone: '',
    role: 'OWNER',
    status: 'Active'
  });


  const handleAddUser = () => {
    setShowAddUserModal(true);
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

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
    setNewUserData({
      firstName: '',
      lastName: '',
      middleName: '',
      username: '',
      email: '',
      phone: '',
      role: 'OWNER',
      status: 'Active'
    });
  };

  const handleSaveUser = () => {
    // Here you would typically make an API call to save the new user
    // Adding new user
    // For now, we'll just close the modal
    handleCloseAddUserModal();
  };

  const handleInputChange = (field: string, value: string) => {
    setNewUserData(prev => ({
      ...prev,
      [field]: value
    }));
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
    { id: 1, name: 'John Smith', email: 'john@crosspest.com', role: 'Owner', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Admin User', memberSince: '2024-08-18' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'Support Lead', memberSince: '2024-07-20' },
    { id: 3, name: 'Mike Wilson', email: 'mike@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-09-10' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@crosspest.com', role: 'CSR', status: 'Inactive', lastLogin: '2024-01-10', connectedCrmUser: null, closedOn: '2024-12-15' }
  ];

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
            Users ({mockUsers.length})
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
        {mockUsers.map((user) => (
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
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                color: currentTheme.textPrimary,
                margin: 0,
                fontSize: '20px',
                fontWeight: '600'
              }}>
                Add New User
              </h3>
              <button
                onClick={handleCloseAddUserModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: currentTheme.textSecondary,
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* First Name */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={newUserData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Last Name */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={newUserData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Middle Name */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  Middle Name
                </label>
                <input
                  type="text"
                  value={newUserData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  placeholder="Enter middle name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Username */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  value={newUserData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  eMail
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={newUserData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* User Role */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  User Role
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                >
                  <option value="OWNER">OWNER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="EXECUTIVE_BRANCH_MANAGER">EXECUTIVE BRANCH MANAGER</option>
                  <option value="BRANCH_MANAGER">BRANCH MANAGER</option>
                  <option value="TEAM_CAPTAIN">TEAM CAPTAIN</option>
                  <option value="CSR_UNIT_LEADER">CSR UNIT LEADER</option>
                  <option value="CSR_MEMBER">CSR MEMBER</option>
                  <option value="SALES_UNIT_LEADER">SALES UNIT LEADER</option>
                  <option value="SALES_MEMBER">SALES MEMBER</option>
                  <option value="TECH_UNIT_LEADER">TECH UNIT LEADER</option>
                  <option value="TECH_MEMBER">TECH MEMBER</option>
                </select>
              </div>

              {/* Member Since - Auto-generated display */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  Member Since
                </label>
                <div style={{
                  padding: '10px 12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}>
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: '2-digit' 
                  })}
                </div>
              </div>

              {/* Status Controls */}
              <div>
                <label style={{
                  display: 'block',
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                }}>
                  Status
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => handleInputChange('status', 'Active')}
                    style={{
                      padding: '8px 16px',
                      border: `1px solid ${newUserData.status === 'Active' ? currentTheme.success : currentTheme.border}`,
                      borderRadius: '8px',
                      backgroundColor: newUserData.status === 'Active' ? currentTheme.success : 'transparent',
                      color: newUserData.status === 'Active' ? 'white' : currentTheme.textPrimary,
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleInputChange('status', 'Inactive')}
                    style={{
                      padding: '8px 16px',
                      border: `1px solid ${newUserData.status === 'Inactive' ? currentTheme.danger : currentTheme.border}`,
                      borderRadius: '8px',
                      backgroundColor: newUserData.status === 'Inactive' ? currentTheme.danger : 'transparent',
                      color: newUserData.status === 'Inactive' ? 'white' : currentTheme.textPrimary,
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: `1px solid ${currentTheme.border}`
            }}>
              <button
                onClick={handleCloseAddUserModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

// Metrics Tab Component
const MetricsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();

  const performanceMetrics = [
    { label: 'Total Users', value: organization.total_users, change: '+3', positive: true, icon: Users },
    { label: 'Active Branches', value: organization.total_branches, change: '+1', positive: true, icon: Building2 },
    { label: 'Sync Success Rate', value: '98.5%', change: '+0.5%', positive: true, icon: Activity },
    { label: 'Avg Response Time', value: '2.3s', change: '-0.2s', positive: true, icon: Clock }
  ];

  const recentActivity = [
    { time: '2 hours ago', action: 'User John Smith logged in', type: 'info' },
    { time: '4 hours ago', action: 'Sync completed successfully', type: 'success' },
    { time: '6 hours ago', action: 'New integration added: HubSpot', type: 'info' },
    { time: '1 day ago', action: 'User Sarah Johnson updated profile', type: 'info' },
    { time: '2 days ago', action: 'Sync failed - connection timeout', type: 'error' }
  ];

  return (
    <div>
      {/* Performance Metrics */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Performance Metrics
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '4px 0 0 0',
            fontSize: '14px'
          }}>
            Real-time organization performance indicators
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          padding: '24px'
        }}>
          {performanceMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} style={{
                backgroundColor: currentTheme.background,
                borderRadius: '8px',
                padding: '16px',
                border: `1px solid ${currentTheme.border}`,
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}>
                  <IconComponent size={20} style={{ color: currentTheme.primary }} />
                </div>
                <div style={{
                  color: currentTheme.textPrimary,
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {metric.value}
                </div>
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  marginBottom: '4px'
                }}>
                  {metric.label}
                </div>
                <div style={{
                  color: metric.positive ? currentTheme.success : currentTheme.danger,
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {metric.change}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
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
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Recent Activity
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '4px 0 0 0',
            fontSize: '14px'
          }}>
            Latest organization events and updates
          </p>
        </div>

        <div style={{ padding: '16px 0' }}>
          {recentActivity.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 24px',
              borderBottom: index < recentActivity.length - 1 ? `1px solid ${currentTheme.border}` : 'none'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activity.type === 'success' ? currentTheme.success : 
                               activity.type === 'error' ? currentTheme.danger : 
                               currentTheme.primary,
                marginRight: '12px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  marginBottom: '2px'
                }}>
                  {activity.action}
                </div>
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px'
                }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Integrations Tab Component
const IntegrationsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();

  const serviceTypes = [
    { id: 'FIELDROUTES', name: 'FieldRoutes', category: 'CRM', icon: '🔗' },
    { id: 'HUBSPOT', name: 'HubSpot', category: 'Leads', icon: '🎯' },
    { id: 'SAMSARA', name: 'Samsara', category: 'Fleet', icon: '🚚' },
    { id: 'LISTEN360', name: 'Listen360', category: 'Reviews', icon: '⭐' },
    { id: 'RINGCENTRAL', name: 'RingCentral', category: 'Phone', icon: '📞' }
  ];

  return (
    <div>
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{
              color: currentTheme.textPrimary,
              margin: 0,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Active Integrations
            </h3>
            <button style={{
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
              Add Integration
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {organization.services?.map((service) => (
            <div key={service.uid} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: `1px solid ${currentTheme.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: currentTheme.primary + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {serviceTypes.find(s => s.id === service.type)?.icon || '🔧'}
                </div>
                <div>
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {service.name}
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px'
                  }}>
                    Last sync: {new Date(service.last_sync || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: service.status === 'active' ? currentTheme.success : currentTheme.danger
                  }} />
                  <span style={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px',
                    textTransform: 'capitalize'
                  }}>
                    {service.status}
                  </span>
                </div>
                <button style={{
                  padding: '6px 12px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Configure
                </button>
                <button style={{
                  padding: '6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: currentTheme.danger,
                  cursor: 'pointer'
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Available Integrations
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '8px 0 0 0',
            fontSize: '14px'
          }}>
            Connect additional services to enhance your organization's data sync
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          padding: '24px'
        }}>
          {serviceTypes.filter(service => 
            !organization.services?.some(s => s.type === service.id)
          ).map((service) => (
            <div key={service.id} style={{
              padding: '20px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '12px',
              backgroundColor: currentTheme.background,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: currentTheme.primary + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {service.icon}
                </div>
                <div>
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {service.name}
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    {service.category}
                  </div>
                </div>
              </div>
              <button style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: currentTheme.primary,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();

  const metrics = [
    { label: 'Total Revenue', value: '$125,000', change: '+12%', positive: true, icon: DollarSign },
    { label: 'Active Users', value: '47', change: '+3', positive: true, icon: Users },
    { label: 'Sync Success Rate', value: '98.5%', change: '+0.5%', positive: true, icon: Activity },
    { label: 'Avg Response Time', value: '2.3s', change: '-0.2s', positive: true, icon: Clock }
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentTheme.primary
              }}>
                <metric.icon size={20} />
              </div>
              <div>
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  {metric.label}
                </div>
                <div style={{
                  color: currentTheme.textPrimary,
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  {metric.value}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: metric.positive ? currentTheme.success : currentTheme.danger,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {metric.change}
              <span style={{ color: currentTheme.textSecondary }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

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
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Recent Activity
          </h3>
        </div>
        <div style={{ padding: '16px 0' }}>
          {[
            { time: '2 hours ago', action: 'Data sync completed successfully', type: 'success' },
            { time: '5 hours ago', action: 'New user Sarah Johnson added', type: 'info' },
            { time: '1 day ago', action: 'HubSpot integration configured', type: 'info' },
            { time: '2 days ago', action: 'Sync error resolved for FieldRoutes', type: 'warning' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 24px',
              borderBottom: index < 3 ? `1px solid ${currentTheme.border}` : 'none'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activity.type === 'success' ? currentTheme.success :
                               activity.type === 'warning' ? currentTheme.warning : currentTheme.primary
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  marginBottom: '2px'
                }}>
                  {activity.action}
                </div>
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px'
                }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Custom Rules Tab Component
const CustomRulesTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();
  
  const [rules, setRules] = useState([
    { 
      id: 1, 
      name: 'High Value Customer Alert', 
      description: 'Notify when customer value exceeds $5,000', 
      active: true, 
      trigger: 'customer_value > 5000',
      action: 'Send notification to managers'
    },
    { 
      id: 2, 
      name: 'Overdue Service Alert', 
      description: 'Alert when service is overdue by 30+ days', 
      active: true, 
      trigger: 'days_since_service > 30',
      action: 'Create follow-up task'
    },
    { 
      id: 3, 
      name: 'Low Tech Availability', 
      description: 'Alert when available technicians < 3', 
      active: false, 
      trigger: 'available_techs < 3',
      action: 'Notify operations team'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger: '',
    action: '',
    active: true
  });

  const handleCreateRule = () => {
    if (newRule.name && newRule.description && newRule.trigger && newRule.action) {
      setRules([...rules, { ...newRule, id: Date.now() }]);
      setNewRule({ name: '', description: '', trigger: '', action: '', active: true });
      setIsCreating(false);
    }
  };

  const handleToggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const handleDeleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div>
      {/* Rules List */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{
                color: currentTheme.textPrimary,
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Custom Business Rules ({rules.length})
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                Automated rules and triggers for organization management
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
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
              }}
            >
              <Plus size={16} />
              Add Rule
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {rules.map((rule) => (
            <div key={rule.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: `1px solid ${currentTheme.border}`
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: rule.active ? currentTheme.success : currentTheme.textSecondary
                  }} />
                  <h4 style={{
                    color: currentTheme.textPrimary,
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {rule.name}
                  </h4>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: rule.active ? currentTheme.success + '20' : currentTheme.textSecondary + '20',
                    color: rule.active ? currentTheme.success : currentTheme.textSecondary
                  }}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: '0 0 8px 20px',
                  fontSize: '14px'
                }}>
                  {rule.description}
                </p>
                <div style={{
                  margin: '0 0 0 20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: currentTheme.textSecondary, fontWeight: '500' }}>Trigger: </span>
                    <span style={{ color: currentTheme.textPrimary, fontFamily: 'monospace' }}>{rule.trigger}</span>
                  </div>
                  <div>
                    <span style={{ color: currentTheme.textSecondary, fontWeight: '500' }}>Action: </span>
                    <span style={{ color: currentTheme.textPrimary }}>{rule.action}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: rule.active ? currentTheme.warning : currentTheme.success,
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {rule.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  style={{
                    padding: '6px',
                    backgroundColor: currentTheme.danger,
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Rule Form */}
      {isCreating && (
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
            <h3 style={{
              color: currentTheme.textPrimary,
              margin: 0,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Create New Rule
            </h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Enter rule name"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Brief description of the rule"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Trigger Condition
                </label>
                <input
                  type="text"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                  placeholder="e.g., customer_value > 1000"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Action to Take
                </label>
                <input
                  type="text"
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  placeholder="What should happen when triggered"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsCreating(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Organization Manager Component
interface OrganizationManagerProps {
  onBack?: () => void;
}

const OrganizationManager: React.FC<OrganizationManagerProps> = ({ onBack }) => {
  const { currentTheme } = useTheme();
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const tabs: TabProps[] = [
    {
      id: 'general',
      label: 'General',
      icon: Building2,
      component: GeneralTab
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      component: UsersTab
    },
    {
      id: 'metrics',
      label: 'Metrics',
      icon: Activity,
      component: MetricsTab
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Link,
      component: IntegrationsTab
    },
    {
      id: 'custom-rules',
      label: 'Custom Rules',
      icon: Shield,
      component: CustomRulesTab
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: AnalyticsTab
    }
  ];

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    setOrganization(updatedOrg);
    // Here you would typically make an API call to save the changes
    // Updating organization
  };

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralTab;

  return (
    <>
      {/* Custom Header for Organization Management - Aligned with top header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '8px',
                backgroundColor: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                alignSelf: 'flex-start',
                marginTop: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                e.currentTarget.style.borderColor = currentTheme.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                e.currentTarget.style.borderColor = currentTheme.border;
              }}
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div>
            <h1 style={{
              color: currentTheme.textPrimary,
              fontSize: '36px',
              fontWeight: 'bold',
              margin: '0 0 8px 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: currentTheme.primary + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentTheme.primary,
                  border: `1px solid ${currentTheme.primary}30`
                }}>
                  <Building2 size={18} />
                </div>
                {organization.name}
              </div>
            </h1>
            <div style={{
              color: currentTheme.textSecondary,
              fontSize: '18px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                backgroundColor: organization.active ? currentTheme.success + '15' : currentTheme.danger + '15',
                padding: '2px 8px',
                borderRadius: '12px',
                border: `1px solid ${organization.active ? currentTheme.success + '30' : currentTheme.danger + '30'}`,
                fontSize: '14px'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: organization.active ? currentTheme.success : currentTheme.danger
                }} />
                <span style={{ 
                  color: organization.active ? currentTheme.success : currentTheme.danger,
                  fontWeight: '600'
                }}>
                  {organization.active ? 'Active' : 'Inactive'}
                </span>
              </span>
              <span style={{
                padding: '2px 6px',
                backgroundColor: currentTheme.cardBg,
                borderRadius: '4px',
                border: `1px solid ${currentTheme.border}`,
                fontFamily: 'monospace',
                fontSize: '14px'
              }}>
                ID: {organization.id}
              </span>
              <span style={{ fontSize: '14px' }}>
                Created {new Date(organization.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          
          {/* Spacer to maintain layout balance */}
          <div style={{ width: '120px' }}></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Spacer to maintain search bar space */}
          <div style={{ width: '256px' }}></div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div style={{
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              padding: '24px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${currentTheme.primary}15`;
              e.currentTarget.style.borderColor = currentTheme.primary + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = currentTheme.border;
            }}>
              <div style={{
                color: currentTheme.primary,
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '8px',
                lineHeight: '1'
              }}>
                {organization.total_users}
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Users
              </div>
            </div>
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              padding: '24px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${currentTheme.success}15`;
              e.currentTarget.style.borderColor = currentTheme.success + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = currentTheme.border;
            }}>
              <div style={{
                color: currentTheme.success,
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '8px',
                lineHeight: '1'
              }}>
                {organization.total_branches}
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Branches
              </div>
            </div>

            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              border: `1px solid ${currentTheme.border}`,
              padding: '24px',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px #8b5cf615';
              e.currentTarget.style.borderColor = '#8b5cf6' + '30';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = currentTheme.border;
            }}>
              <div style={{
                color: '#8b5cf6',
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '8px',
                lineHeight: '1'
              }}>
                {organization.integration_count}
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Integrations
              </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '12px',
          border: `1px solid ${currentTheme.border}`,
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  backgroundColor: activeTab === tab.id ? currentTheme.primary + '10' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                  color: activeTab === tab.id ? currentTheme.primary : currentTheme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            <ActiveTabComponent 
              organization={organization} 
              onUpdate={handleUpdateOrganization} 
            />
          </div>
        </div>
    </>
  );
};

export default OrganizationManager;
