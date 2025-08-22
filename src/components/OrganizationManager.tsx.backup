import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import UserManagement from './UserManagement';
import AddNewUser from './AddNewUser';
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
  ArrowLeft,
  GripVertical,
  Target,
  TrendingUp,
  Users2,
  MapPin
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

 
interface Organization {
  id: number;
  name: string;
  active: boolean;
   
  sync_limit: number;
   
  pay_period: string;
   
  pay_start: string;
   
  created_at: string;
   
  last_sync: string;
   
  total_users: number;
   
  total_branches: number;
   
  monthly_revenue: number;
   
  integration_count: number;
   
  app_config?: AppConfig;
  services?: ServiceResource[];
  users?: User[];
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
  displayName?: string;
  customRule?: string;
}

interface MetricDescription {
  key: string;
  name: string;
  shortLabel: string;
  icon: string;
  category: 'branch' | 'csr' | 'sales' | 'tech' | 'custom';
}

interface MetricGroup {
  id: string;
  name: string;
  displayName: string;
  isDefault: boolean;
  isActive: boolean;
  metrics: MetricConfig[];
  users?: number[]; // Array of user IDs assigned to this group
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
  ],
  users: [
    { id: 1, name: 'John Smith', email: 'john@crosspest.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'john.smith' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@crosspest.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'sarah.johnson' },
    { id: 3, name: 'Mike Davis', email: 'mike@crosspest.com', role: 'Technician', status: 'Active', lastLogin: '2024-01-13', connectedCrmUser: 'mike.davis' },
    { id: 4, name: 'Lisa Wilson', email: 'lisa@crosspest.com', role: 'Sales Rep', status: 'Active', lastLogin: '2024-01-12', connectedCrmUser: 'lisa.wilson' },
    { id: 5, name: 'David Brown', email: 'david@crosspest.com', role: 'CSR', status: 'Active', lastLogin: '2024-01-11', connectedCrmUser: 'david.brown' },
    { id: 6, name: 'Emily Taylor', email: 'emily@crosspest.com', role: 'Technician', status: 'Active', lastLogin: '2024-01-10', connectedCrmUser: 'emily.taylor' },
    { id: 7, name: 'James Anderson', email: 'james@crosspest.com', role: 'Manager', status: 'Inactive', lastLogin: '2024-01-05', connectedCrmUser: null },
    { id: 8, name: 'Jennifer Martinez', email: 'jennifer@crosspest.com', role: 'Sales Rep', status: 'Active', lastLogin: '2024-01-09', connectedCrmUser: 'jennifer.martinez' }
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

  // Filter users based on search and role
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  // Get visible users based on display count
  const visibleUsers = filteredUsers.slice(0, displayedUsers);

  // Load more handler
  const handleLoadMoreUsers = () => {
    setDisplayedUsers(prev => prev + 10);
  };

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
const MetricsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();

  // Available metrics by category
  const availableMetrics: MetricDescription[] = [
    // Branch Metrics
    { key: 'revenue', name: 'Revenue', shortLabel: 'Revenue', icon: '💰', category: 'branch' },
    { key: 'cancels', name: 'Cancellations', shortLabel: 'Cancels', icon: '❌', category: 'branch' },
    { key: 'leads', name: 'Leads Generated', shortLabel: 'Leads', icon: '🎯', category: 'branch' },
    { key: 'sales', name: 'Sales Closed', shortLabel: 'Sales', icon: '💼', category: 'branch' },
    { key: 'arc', name: 'AR Collected', shortLabel: 'AR', icon: '💵', category: 'branch' },
    { key: 'closeratio', name: 'Close Ratio', shortLabel: 'Close %', icon: '📊', category: 'branch' },
    { key: 'activesubs', name: 'Active Subscriptions', shortLabel: 'Active Subs', icon: '✅', category: 'branch' },
    { key: 'cancelrate', name: 'Cancel Rate', shortLabel: 'Cancel %', icon: '📉', category: 'branch' },
    
    // CSR Metrics
    { key: 'answering', name: 'Call Answering', shortLabel: 'Answering', icon: '📞', category: 'csr' },
    { key: 'reviews', name: 'Customer Reviews', shortLabel: 'Reviews', icon: '⭐', category: 'csr' },
    { key: 'csr_cancels', name: 'CSR Cancellations', shortLabel: 'Cancels', icon: '❌', category: 'csr' },
    { key: 'csr_arc', name: 'CSR AR Collected', shortLabel: 'AR', icon: '💵', category: 'csr' },
    { key: 'arcpercent', name: 'AR Collection %', shortLabel: 'AR %', icon: '📊', category: 'csr' },
    
    // Sales Metrics
    { key: 'commission', name: 'Commission Earned', shortLabel: 'Commission', icon: '💰', category: 'sales' },
    { key: 'sales_sales', name: 'Sales Volume', shortLabel: 'Sales', icon: '💼', category: 'sales' },
    { key: 'closing', name: 'Closing Rate', shortLabel: 'Close %', icon: '🎯', category: 'sales' },
    { key: 'treatment', name: 'Treatment Sales', shortLabel: 'Treatment', icon: '🛡️', category: 'sales' },
    { key: 'sales_cancels', name: 'Sales Cancellations', shortLabel: 'Cancels', icon: '❌', category: 'sales' },
    
    // Tech Metrics
    { key: 'completion', name: 'Service Completion', shortLabel: 'Completion', icon: '✅', category: 'tech' },
    { key: 'prodperhour', name: 'Production per Hour', shortLabel: 'Prod/Hr', icon: '⏱️', category: 'tech' },
    { key: 'tech_reviews', name: 'Tech Reviews', shortLabel: 'Reviews', icon: '⭐', category: 'tech' },
    { key: 'attendance', name: 'Attendance Rate', shortLabel: 'Attendance', icon: '👥', category: 'tech' },
    { key: 'driving', name: 'Driving Time', shortLabel: 'Drive Time', icon: '🚗', category: 'tech' },
    { key: 'quality', name: 'Service Quality', shortLabel: 'Quality', icon: '🏆', category: 'tech' },
    { key: 'nps', name: 'Net Promoter Score', shortLabel: 'NPS', icon: '📈', category: 'tech' },
    { key: 'reservice', name: 'Re-service Rate', shortLabel: 'Re-service', icon: '🔄', category: 'tech' }
  ];

  // Default metric groups
  const defaultGroups = [
    { id: 'branch', name: 'branch', displayName: 'Branch', icon: MapPin, isDefault: true },
    { id: 'csr', name: 'csr', displayName: 'CSR', icon: Users2, isDefault: true },
    { id: 'sales', name: 'sales', displayName: 'Sales', icon: Target, isDefault: true },
    { id: 'tech', name: 'tech', displayName: 'Tech', icon: Users, isDefault: true }
  ];

  // State management
  const [activeTab, setActiveTab] = useState('branch');
  const [metricGroups, setMetricGroups] = useState<MetricGroup[]>(() => {
    // Initialize with default groups and current organization config
    return defaultGroups.map(group => ({
      ...group,
      isActive: !!organization.app_config?.metrics[group.name],
      metrics: organization.app_config?.metrics[group.name] || []
    }));
  });
  
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MetricGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState<{groupName?: string}>({});
  const [usersToTransfer, setUsersToTransfer] = useState<number[]>([]); // Users being moved from other groups
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [groupToDeactivate, setGroupToDeactivate] = useState<string | null>(null);
  const [showDefaultGroupModal, setShowDefaultGroupModal] = useState(false);
  const [viewingDefaultGroup, setViewingDefaultGroup] = useState<MetricGroup | null>(null);
  const [showEditMetricModal, setShowEditMetricModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<{groupId: string, metricIndex: number, metric: MetricConfig} | null>(null);
  const [editForm, setEditForm] = useState({
    displayName: '',
    customRule: ''
  });

  // Generate UID from display name
  const generateUID = (displayName: string): string => {
    return displayName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
  };

  // Get current active group
  const currentGroup = metricGroups.find(g => g.id === activeTab);

  // Handle adding a metric to current group
  const handleAddMetric = () => {
    if (!selectedMetric || !currentGroup || currentGroup.metrics.length >= 5) return;

    const updatedGroups = metricGroups.map(group => {
      if (group.id === activeTab) {
        return {
          ...group,
          metrics: [...group.metrics, { type: selectedMetric }]
        };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    setSelectedMetric('');
  };

  // Handle removing a metric
  const handleRemoveMetric = (metricType: string) => {
    const updatedGroups = metricGroups.map(group => {
      if (group.id === activeTab) {
        return {
          ...group,
          metrics: group.metrics.filter(m => m.type !== metricType)
        };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
  };

  // Handle toggling group active state
  const handleToggleGroup = (groupId: string) => {
    const group = metricGroups.find(g => g.id === groupId);
    
    // If group is currently active and has metrics, show confirmation modal
    if (group?.isActive && group.metrics.length > 0) {
      setGroupToDeactivate(groupId);
      setShowDeactivateModal(true);
      return;
    }

    // For inactive groups or groups without metrics, toggle immediately
    const updatedGroups = metricGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, isActive: !group.isActive };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
  };

  // Handle confirmed deactivation
  const handleConfirmDeactivate = () => {
    if (!groupToDeactivate) return;

    const updatedGroups = metricGroups.map(group => {
      if (group.id === groupToDeactivate) {
        return { ...group, isActive: false };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    
    // Switch to first remaining active group if deactivating current tab
    if (activeTab === groupToDeactivate) {
      const firstActive = updatedGroups.find(g => g.isActive);
      if (firstActive) {
        setActiveTab(firstActive.id);
      }
    }

    setShowDeactivateModal(false);
    setGroupToDeactivate(null);
  };

  // Handle cancel deactivation
  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
    setGroupToDeactivate(null);
  };

  // Handle edit metric
  const handleEditMetric = (groupId: string, metricIndex: number, metric: MetricConfig) => {
    setEditingMetric({ groupId, metricIndex, metric });
    setEditForm({
      displayName: metric.displayName || '',
      customRule: metric.customRule || ''
    });
    setShowEditMetricModal(true);
  };

  // Handle save metric edit
  const handleSaveMetricEdit = () => {
    if (!editingMetric) return;

    const displayName = editForm.displayName.trim();
    const uid = displayName ? generateUID(displayName) : undefined;

    const updatedGroups = metricGroups.map(group => {
      if (group.id === editingMetric.groupId) {
        const updatedMetrics = group.metrics.map((metric, index) => {
          if (index === editingMetric.metricIndex) {
            return {
              ...metric,
              displayName: displayName || undefined,
              uid: uid,
              customRule: editForm.customRule.trim() || undefined
            };
          }
          return metric;
        });
        return { ...group, metrics: updatedMetrics };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    setShowEditMetricModal(false);
    setEditingMetric(null);
    setEditForm({ displayName: '', customRule: '' });
  };

  // Handle cancel metric edit
  const handleCancelMetricEdit = () => {
    setShowEditMetricModal(false);
    setEditingMetric(null);
    setEditForm({ displayName: '', customRule: '' });
  };

  // Handle adding custom group
  const handleAddCustomGroup = async () => {
    // Clear previous errors
    setFormErrors({});
    setIsLoading(true);
    
    try {
      if (!newGroupName.trim()) {
        setFormErrors({ groupName: 'Group name is required' });
        return;
      }
      
      // Check if group name already exists
      const existingGroup = metricGroups.find(g => 
        g.displayName.toLowerCase() === newGroupName.trim().toLowerCase()
      );
      if (existingGroup) {
        setFormErrors({ groupName: 'A group with this name already exists' });
        return;
      }

      const groupId = newGroupName.toLowerCase().replace(/\s+/g, '-');
      const newGroup: MetricGroup = {
        id: groupId,
        name: groupId,
        displayName: newGroupName,
        isDefault: false,
        isActive: true,
        metrics: [],
        users: selectedUsers.length > 0 ? [...selectedUsers] : undefined
      };

      // Simulate API delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove users from their current groups if they're being transferred
      let updatedGroups = [...metricGroups];
      for (const userIdToTransfer of usersToTransfer) {
        updatedGroups = updatedGroups.map(group => ({
          ...group,
          users: group.users ? group.users.filter(id => id !== userIdToTransfer) : group.users
        }));
      }

      // Add the new group
      updatedGroups.push(newGroup);
      
      setMetricGroups(updatedGroups);
      updateOrganizationConfig(updatedGroups);
      resetModalState();
      setShowAddGroupModal(false);
      setActiveTab(groupId);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing custom group
  const handleEditCustomGroup = (group: MetricGroup) => {
    setEditingGroup(group);
    setNewGroupName(group.displayName);
    setSelectedUsers(group.users || []);
    setUsersToTransfer([]); // Reset transfer list for editing
    setShowEditGroupModal(true);
  };

  // Handle saving group edit
  const handleSaveGroupEdit = () => {
    if (!editingGroup || !newGroupName.trim()) return;

    // Remove users from their current groups if they're being transferred
    let updatedGroups = metricGroups.map(group => {
      // Remove transferred users from other groups
      if (group.id !== editingGroup.id) {
        return {
          ...group,
          users: group.users ? group.users.filter(id => !usersToTransfer.includes(id)) : group.users
        };
      }
      return group;
    });

    // Update the current group with new users and name
    updatedGroups = updatedGroups.map(group => {
      if (group.id === editingGroup.id) {
        return {
          ...group,
          displayName: newGroupName,
          users: selectedUsers.length > 0 ? [...selectedUsers] : undefined
        };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    resetModalState();
    setShowEditGroupModal(false);
  };

  // Reset modal state
  const resetModalState = () => {
    setNewGroupName('');
    setSelectedUsers([]);
    setUsersToTransfer([]);
    setUserRoleFilter('all');
    setUserSearchTerm('');
    setEditingGroup(null);
    setFormErrors({});
  };

  // Handle user selection with transfer logic
  const handleUserSelection = (userId: number, isSelected: boolean) => {
    const currentGroup = getUserCurrentGroup(userId);
    
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
      // If user is in another group, mark for transfer
      if (currentGroup && currentGroup.id !== 'unassigned') {
        setUsersToTransfer(prev => [...prev, userId]);
      }
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setUsersToTransfer(prev => prev.filter(id => id !== userId));
    }
  };

  // Get filtered and sorted users
  const getFilteredUsers = () => {
    const users = organization.users || [];
    
    // Filter by role
    let filteredUsers = userRoleFilter === 'all' 
      ? users 
      : users.filter(user => user.role.toLowerCase() === userRoleFilter.toLowerCase());
    
    // Filter by search term
    if (userSearchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }

    // Sort by role first, then by name
    return filteredUsers.sort((a, b) => {
      if (a.role !== b.role) {
        return a.role.localeCompare(b.role);
      }
      return a.name.localeCompare(b.name);
    });
  };

  // Get unique roles for filter dropdown
  const getUniqueRoles = () => {
    const roles = (organization.users || []).map(user => user.role);
    return [...new Set(roles)].sort();
  };

  // Get which group a user is currently assigned to
  const getUserCurrentGroup = (userId: number) => {
    // First check custom groups
    for (const group of metricGroups) {
      if (group.users && group.users.includes(userId)) {
        return group;
      }
    }
    
    // Then check default group assignment based on role
    const user = organization.users?.find(u => u.id === userId);
    if (!user) return null;
    
    const roleToGroupMap: Record<string, string> = {
      'tech': 'tech',
      'technician': 'tech',
      'csr': 'csr',
      'sales': 'sales',
      'sales rep': 'sales',
      'branch manager': 'branch',
      'manager': 'branch',
      'admin': 'branch',
      'owner': 'branch'
    };
    
    const groupId = roleToGroupMap[user.role.toLowerCase()];
    if (groupId) {
      const defaultGroup = metricGroups.find(g => g.id === groupId && g.isDefault && g.isActive);
      if (defaultGroup) {
        return defaultGroup;
      }
    }
    
    return null;
  };

  // Check if user can be moved to a new group
  const canMoveUser = (userId: number) => {
    const currentGroup = getUserCurrentGroup(userId);
    return currentGroup !== null; // User can be moved if they're in any group
  };

  // Get users that belong to a default group based on role
  const getDefaultGroupUsers = (groupId: string) => {
    const users = organization.users || [];
    
    const roleToGroupMap: Record<string, string[]> = {
      'tech': ['tech', 'technician'],
      'csr': ['csr', 'customer service rep', 'customer service'],
      'sales': ['sales', 'sales rep', 'sales representative'],
      'branch': ['branch manager', 'manager', 'admin', 'administrator', 'owner', 'executive']
    };

    const allowedRoles = roleToGroupMap[groupId] || [];
    
    return users.filter(user => 
      allowedRoles.some(role => 
        user.role.toLowerCase().includes(role.toLowerCase())
      ) && user.status === 'Active'
    ).filter(user => {
      // Exclude users who are explicitly assigned to custom groups
      const assignedToCustomGroup = metricGroups.some(group => 
        !group.isDefault && group.users && group.users.includes(user.id)
      );
      return !assignedToCustomGroup;
    });
  };

  // Handle viewing default group users
  const handleViewDefaultGroup = (group: MetricGroup) => {
    setViewingDefaultGroup(group);
    setShowDefaultGroupModal(true);
  };

  // Handle removing custom group (show confirmation)
  const handleRemoveGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (groupToDelete) {
      const updatedGroups = metricGroups.filter(g => g.id !== groupToDelete);
      setMetricGroups(updatedGroups);
      updateOrganizationConfig(updatedGroups);
      
      // Switch to first active group
      const firstActive = updatedGroups.find(g => g.isActive);
      if (firstActive) {
        setActiveTab(firstActive.id);
      }
    }
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

  // Handle drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const updatedGroups = metricGroups.map(group => {
      if (group.id === activeTab) {
        const newMetrics = [...group.metrics];
        const draggedMetric = newMetrics[draggedItem];
        newMetrics.splice(draggedItem, 1);
        newMetrics.splice(index, 0, draggedMetric);
        return { ...group, metrics: newMetrics };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    updateOrganizationConfig(metricGroups);
  };

  // Update organization config
  const updateOrganizationConfig = (groups: MetricGroup[]) => {
    const metricsConfig: { [key: string]: MetricConfig[] } = {};
    
    groups.forEach(group => {
      if (group.isActive && group.metrics.length > 0) {
        metricsConfig[group.name] = group.metrics;
      }
    });

    const updatedOrg = {
      ...organization,
      app_config: {
        ...organization.app_config,
        metrics: metricsConfig
      }
    };

    onUpdate(updatedOrg);
  };

  // Get available metrics for current group
  const getAvailableMetrics = () => {
    if (!currentGroup) return [];
    
    const category = currentGroup.isDefault ? currentGroup.name as 'branch' | 'csr' | 'sales' | 'tech' : 'custom';
    return availableMetrics.filter(metric => 
      category === 'custom' || metric.category === category
    );
  };

  return (
    <div>
      {/* Metric Groups Management */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{
                color: currentTheme.textPrimary,
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Metric Groups Configuration
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                Configure up to 5 metrics per group. Enable/disable groups as needed.
              </p>
            </div>
            <button
              onClick={() => setShowAddGroupModal(true)}
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
              Add Custom Group
            </button>
          </div>

          {/* Group Toggle Switches */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {metricGroups.map(group => {
              const IconComponent = group.isDefault ? 
                defaultGroups.find(d => d.id === group.id)?.icon || TrendingUp : 
                TrendingUp;
              
              return (
                <div key={group.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  backgroundColor: group.isActive ? currentTheme.primary + '10' : currentTheme.background,
                  border: `1px solid ${group.isActive ? currentTheme.primary + '30' : currentTheme.border}`,
                  borderRadius: '8px'
                }}>
                  {/* Header Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <IconComponent size={20} style={{ color: currentTheme.primary }} />
                      <div>
                        <div style={{
                          color: currentTheme.textPrimary,
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {group.displayName}
                        </div>
                        {group.isDefault && (
                          <div style={{
                            color: currentTheme.textSecondary,
                            fontSize: '11px',
                            marginTop: '2px'
                          }}>
                            Default Group
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleGroup(group.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: group.isActive ? currentTheme.success : currentTheme.textSecondary,
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {group.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Stats Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px'
                    }}>
                      {/* Metrics Count */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        backgroundColor: currentTheme.cardBg,
                        borderRadius: '6px',
                        border: `1px solid ${currentTheme.border}`
                      }}>
                        <TrendingUp size={14} style={{ color: currentTheme.secondary }} />
                        <span style={{
                          color: currentTheme.textPrimary,
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {group.metrics.length}/5 metrics
                        </span>
                      </div>

                      {/* User Count */}
                      {group.isDefault ? (
                        <div 
                          onClick={() => handleViewDefaultGroup(group)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '6px 8px',
                            backgroundColor: currentTheme.cardBg,
                            borderRadius: '6px',
                            border: `1px solid ${currentTheme.border}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '80px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                            e.currentTarget.style.borderColor = currentTheme.primary + '50';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                            e.currentTarget.style.borderColor = currentTheme.border;
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '2px'
                          }}>
                            <Users2 size={14} style={{ color: currentTheme.primary }} />
                            <span style={{
                              color: currentTheme.textPrimary,
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {getDefaultGroupUsers(group.id).length} user{getDefaultGroupUsers(group.id).length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <span style={{
                            color: currentTheme.textSecondary,
                            fontSize: '9px',
                            fontStyle: 'italic',
                            textAlign: 'center'
                          }}>
                            click to view
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          backgroundColor: currentTheme.cardBg,
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.border}`
                        }}>
                          <Users2 size={14} style={{ color: currentTheme.primary }} />
                          <span style={{
                            color: currentTheme.textPrimary,
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {group.users?.length || 0} user{(group.users?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  {!group.isDefault && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleEditCustomGroup(group)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: currentTheme.secondary,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveGroup(group.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: currentTheme.danger,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>


        {/* Group Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          {metricGroups.filter(g => g.isActive).map(group => {
            const IconComponent = group.isDefault ? 
              defaultGroups.find(d => d.id === group.id)?.icon || TrendingUp : 
              TrendingUp;
              
            return (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  backgroundColor: activeTab === group.id ? currentTheme.primary + '10' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === group.id ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                  color: activeTab === group.id ? currentTheme.primary : currentTheme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComponent size={16} />
                {group.displayName} ({group.metrics.length}/5)
              </button>
            );
          })}
        </div>

        {/* Current Group Configuration */}
        {currentGroup && currentGroup.isActive && (
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                color: currentTheme.textPrimary,
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {currentGroup.displayName} Metrics ({currentGroup.metrics.length}/5)
              </h4>

              {/* Current Metrics */}
              <div style={{ marginBottom: '24px' }}>
                {currentGroup.metrics.length === 0 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: currentTheme.textSecondary,
                    border: `2px dashed ${currentTheme.border}`,
                    borderRadius: '8px'
                  }}>
                    No metrics configured for this group
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentGroup.metrics.map((metric, index) => {
                      const metricDesc = availableMetrics.find(m => m.key === metric.type);
                      return (
                        <div
                          key={metric.type}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: currentTheme.primary + '10',
                            border: `1px solid ${currentTheme.primary}30`,
                            borderRadius: '8px',
                            cursor: 'grab'
                          }}
                        >
                          <GripVertical size={16} style={{ color: currentTheme.textSecondary, marginRight: '12px' }} />
                          <div style={{ marginRight: '12px', fontSize: '18px' }}>
                            {metricDesc?.icon || '📊'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: currentTheme.textPrimary,
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              {metric.displayName || metricDesc?.name || metric.type}
                              {metric.displayName && (
                                <span style={{
                                  color: currentTheme.textSecondary,
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  marginLeft: '8px'
                                }}>
                                  (was: {metricDesc?.name || metric.type})
                                </span>
                              )}
                            </div>
                            <div style={{
                              color: currentTheme.textSecondary,
                              fontSize: '12px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px'
                            }}>
                              <span>Type: {metric.type}</span>
                              {metric.uid && <span>• UID: {metric.uid}</span>}
                              {metric.customRule && <span>• Custom Rule: Yes</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMetric(currentGroup.id, index, metric);
                              }}
                              style={{
                                padding: '4px',
                                backgroundColor: currentTheme.primary,
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMetric(metric.type);
                              }}
                              style={{
                                padding: '4px',
                                backgroundColor: currentTheme.danger,
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Metric */}
              {currentGroup.metrics.length < 5 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: currentTheme.background,
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.border}`
                }}>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentTheme.cardBg,
                      color: currentTheme.textPrimary,
                      fontSize: '14px'
                    }}
                  >
                    <option value="" disabled>Select a metric to add</option>
                    {getAvailableMetrics().map(metric => (
                      <option key={metric.key} value={metric.key}>
                        {metric.icon} {metric.name} ({metric.key})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddMetric}
                    disabled={!selectedMetric}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedMetric ? currentTheme.primary : currentTheme.textSecondary,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: selectedMetric ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} />
                    Add Metric
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && groupToDeactivate && (
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
            maxWidth: '450px',
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
                backgroundColor: currentTheme.warning + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={24} style={{ color: currentTheme.warning }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Deactivate Metric Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  This will remove configured metrics
                </p>
              </div>
            </div>

            <div style={{
              marginBottom: '24px'
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 16px 0',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                Are you sure you want to deactivate the <strong>
                  {metricGroups.find(g => g.id === groupToDeactivate)?.displayName}
                </strong> metric group?
              </p>
              
              <div style={{
                padding: '16px',
                backgroundColor: currentTheme.warning + '10',
                border: `1px solid ${currentTheme.warning}30`,
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} style={{ color: currentTheme.warning, marginTop: '2px' }} />
                  <div>
                    <div style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      This will:
                    </div>
                    <ul style={{
                      color: currentTheme.textSecondary,
                      fontSize: '13px',
                      margin: 0,
                      paddingLeft: '16px'
                    }}>
                      <li>Remove all {metricGroups.find(g => g.id === groupToDeactivate)?.metrics.length || 0} configured metrics</li>
                      <li>Hide this group from the dashboard</li>
                      <li>Stop tracking these metrics for this organization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p style={{
                color: currentTheme.textSecondary,
                margin: 0,
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                You can reactivate this group later, but you'll need to reconfigure the metrics.
              </p>
            </div>

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
                  backgroundColor: currentTheme.warning,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Deactivate Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metric Modal */}
      {showEditMetricModal && editingMetric && (
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
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Edit3 size={24} style={{ color: currentTheme.primary }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Edit Metric Configuration
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Customize display name and business rules
                </p>
              </div>
            </div>

            {/* Current Metric Info */}
            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.background,
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '20px' }}>
                  {availableMetrics.find(m => m.key === editingMetric.metric.type)?.icon || '📊'}
                </div>
                <div>
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {availableMetrics.find(m => m.key === editingMetric.metric.type)?.name || editingMetric.metric.type}
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    Type: {editingMetric.metric.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Custom Display Name (UID)
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  placeholder="Enter custom name for this metric"
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
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  Leave empty to use default name: "{availableMetrics.find(m => m.key === editingMetric.metric.type)?.name || editingMetric.metric.type}"
                </div>
              </div>

              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Custom Rule Logic
                </label>
                <textarea
                  value={editForm.customRule}
                  onChange={(e) => setEditForm({ ...editForm, customRule: e.target.value })}
                  placeholder="Enter custom rule logic (optional)&#10;&#10;Example:&#10;MODULE [Metric: Sales]:&#10;    RULESET [Label]:&#10;        RULE [Default]: SWITCH(&#10;            UPPER(uid),&#10;            &quot;RPC_SALES&quot;, &quot;RPC Sales&quot;,&#10;            UPPER(uid)&#10;        )&#10;    END&#10;END"
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '12px',
                    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  marginTop: '8px',
                  lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Advanced filtering logic for this metric. When provided:
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '16px' }}>
                    <li>Creates custom label and short-label rules</li>
                    <li>Defines include/exclude criteria</li>
                    <li>Uses service categories and business rules</li>
                    <li>Auto-generates UID: <strong>{editForm.displayName ? generateUID(editForm.displayName) : 'DISPLAY_NAME'}</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelMetricEdit}
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
                onClick={handleSaveMetricEdit}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Add Custom Group Modal */}
      {showAddGroupModal && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddGroupModal(false);
              resetModalState();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowAddGroupModal(false);
              resetModalState();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '85vh',
            overflowY: 'auto',
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
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={24} style={{ color: currentTheme.primary }} />
              </div>
              <div>
                <h3 
                  id="add-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Add Custom Metric Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Create a new group and assign users from their current groups
                </p>
              </div>
            </div>

            {/* Group Name Input */}
            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="add-group-name-input"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}
              >
                Group Name
              </label>
              <input
                id="add-group-name-input"
                type="text"
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                  // Clear error when user starts typing
                  if (formErrors.groupName) {
                    setFormErrors({ ...formErrors, groupName: undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newGroupName.trim()) {
                    handleAddCustomGroup();
                  }
                }}
                placeholder="e.g., Management, Quality, Custom"
                aria-label="Group name"
                aria-required="true"
                aria-invalid={formErrors.groupName ? 'true' : 'false'}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${formErrors.groupName ? '#ef4444' : currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
              {formErrors.groupName && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {formErrors.groupName}
                </div>
              )}
            </div>

            {/* User Assignment Section */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '12px'
              }}>
                Assign Users to This Group
              </label>
              
              {/* Search and Filter */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    aria-label="Search users"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      fontSize: '13px'
                    }}
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '6px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '13px',
                    minWidth: '120px'
                  }}
                >
                  <option value="all">All Roles</option>
                  {getUniqueRoles().map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* User Assignment Table */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.background
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                  padding: '12px 16px',
                  backgroundColor: currentTheme.cardBg,
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentTheme.textSecondary,
                  textTransform: 'uppercase'
                }}>
                  <div>Select</div>
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Current Assignment</div>
                  <div>Action</div>
                </div>

                {/* Table Rows */}
                {getFilteredUsers().map((user, index) => {
                  const currentGroup = getUserCurrentGroup(user.id);
                  const isSelected = selectedUsers.includes(user.id);
                  const willTransfer = usersToTransfer.includes(user.id);
                  const isAvailable = !currentGroup;

                  return (
                    <div
                      key={user.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                        padding: '12px 16px',
                        borderBottom: index < getFilteredUsers().length - 1 ? `1px solid ${currentTheme.border}` : 'none',
                        fontSize: '13px',
                        color: currentTheme.textPrimary,
                        backgroundColor: isSelected ? (willTransfer ? currentTheme.danger + '15' : currentTheme.success + '15') : 'transparent',
                        transition: 'all 0.2s ease',
                        alignItems: 'center'
                      }}
                    >
                      {/* Select Checkbox */}
                      <div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          style={{
                            accentColor: willTransfer ? currentTheme.danger : currentTheme.primary,
                            width: '16px',
                            height: '16px'
                          }}
                        />
                      </div>

                      {/* User Info */}
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '11px', color: currentTheme.textSecondary }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: currentTheme.secondary + '20',
                          color: currentTheme.secondary,
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          {user.role}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: user.status === 'Active' ? '#10b981' : currentTheme.border,
                          color: user.status === 'Active' ? 'white' : currentTheme.textSecondary
                        }}>
                          {user.status}
                        </span>
                      </div>

                      {/* Current Assignment */}
                      <div>
                        {currentGroup ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: currentGroup.isDefault ? currentTheme.primary + '20' : currentTheme.warning + '20',
                              color: currentGroup.isDefault ? currentTheme.primary : currentTheme.warning,
                              fontSize: '9px',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {currentGroup.displayName}
                            </span>
                            <span style={{
                              fontSize: '8px',
                              color: currentTheme.textSecondary,
                              textAlign: 'center'
                            }}>
                              {currentGroup.isDefault ? 'Default' : 'Custom'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ 
                            color: currentTheme.textSecondary, 
                            fontSize: '11px',
                            fontStyle: 'italic'
                          }}>
                            Unassigned
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div>
                        {isSelected && willTransfer ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.danger,
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <span style={{ fontSize: '8px' }}>⚠️</span>
                            Will Move
                          </span>
                        ) : isSelected && isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '500'
                          }}>
                            Will Add
                          </span>
                        ) : isSelected ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.primary,
                            fontWeight: '500'
                          }}>
                            Selected
                          </span>
                        ) : currentGroup && !isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.textSecondary,
                            cursor: 'help'
                          }}>
                            Can Move
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '400'
                          }}>
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {getFilteredUsers().length === 0 && (
                  <div style={{
                    padding: '40px 24px',
                    textAlign: 'center',
                    color: currentTheme.textSecondary,
                    fontSize: '14px'
                  }}>
                    No users found matching the current filters
                  </div>
                )}
              </div>
              
              {/* Selection Summary */}
              {selectedUsers.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: currentTheme.primary + '10',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: currentTheme.primary,
                  fontWeight: '500'
                }}>
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected for this group
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowAddGroupModal(false);
                  resetModalState();
                }}
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
                onClick={handleAddCustomGroup}
                disabled={!newGroupName.trim() || isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newGroupName.trim() && !isLoading) {
                    handleAddCustomGroup();
                  }
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (newGroupName.trim() && !isLoading) ? currentTheme.primary : currentTheme.border,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: (newGroupName.trim() && !isLoading) ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: (newGroupName.trim() && !isLoading) ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Custom Group Modal */}
      {showEditGroupModal && editingGroup && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditGroupModal(false);
              resetModalState();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowEditGroupModal(false);
              resetModalState();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '85vh',
            overflowY: 'auto',
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
                backgroundColor: currentTheme.secondary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Edit3 size={24} style={{ color: currentTheme.secondary }} />
              </div>
              <div>
                <h3 
                  id="edit-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Edit Metric Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Modify group settings and user assignments
                </p>
              </div>
            </div>

            {/* Group Name Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Group Name
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g., Management, Quality, Custom"
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

            {/* Current Metrics Info */}
            {editingGroup.metrics.length > 0 && (
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: currentTheme.background,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}>
                  Current Metrics ({editingGroup.metrics.length}/5)
                </div>
                <div style={{
                  fontSize: '12px',
                  color: currentTheme.textSecondary
                }}>
                  {editingGroup.metrics.map(metric => {
                    const metricInfo = availableMetrics.find(m => m.key === metric.type);
                    return metricInfo ? metricInfo.name : metric.type;
                  }).join(', ')}
                </div>
              </div>
            )}

            {/* User Assignment Section - Same as Add Modal */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '12px'
              }}>
                Assign Users to This Group
              </label>
              
              {/* Search and Filter */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    aria-label="Search users"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      fontSize: '13px'
                    }}
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '6px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '13px',
                    minWidth: '120px'
                  }}
                >
                  <option value="all">All Roles</option>
                  {getUniqueRoles().map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* User Assignment Table */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.background
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                  padding: '12px 16px',
                  backgroundColor: currentTheme.cardBg,
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentTheme.textSecondary,
                  textTransform: 'uppercase'
                }}>
                  <div>Select</div>
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Current Assignment</div>
                  <div>Action</div>
                </div>

                {/* Table Rows */}
                {getFilteredUsers().map((user, index) => {
                  const currentGroup = getUserCurrentGroup(user.id);
                  const isSelected = selectedUsers.includes(user.id);
                  const willTransfer = usersToTransfer.includes(user.id);
                  const isAvailable = !currentGroup;

                  return (
                    <div
                      key={user.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                        padding: '12px 16px',
                        borderBottom: index < getFilteredUsers().length - 1 ? `1px solid ${currentTheme.border}` : 'none',
                        fontSize: '13px',
                        color: currentTheme.textPrimary,
                        backgroundColor: isSelected ? (willTransfer ? currentTheme.danger + '15' : currentTheme.success + '15') : 'transparent',
                        transition: 'all 0.2s ease',
                        alignItems: 'center'
                      }}
                    >
                      {/* Select Checkbox */}
                      <div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          style={{
                            accentColor: willTransfer ? currentTheme.danger : currentTheme.primary,
                            width: '16px',
                            height: '16px'
                          }}
                        />
                      </div>

                      {/* User Info */}
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '11px', color: currentTheme.textSecondary }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: currentTheme.secondary + '20',
                          color: currentTheme.secondary,
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          {user.role}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: user.status === 'Active' ? '#10b981' : currentTheme.border,
                          color: user.status === 'Active' ? 'white' : currentTheme.textSecondary
                        }}>
                          {user.status}
                        </span>
                      </div>

                      {/* Current Assignment */}
                      <div>
                        {currentGroup ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: currentGroup.isDefault ? currentTheme.primary + '20' : currentTheme.warning + '20',
                              color: currentGroup.isDefault ? currentTheme.primary : currentTheme.warning,
                              fontSize: '9px',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {currentGroup.displayName}
                            </span>
                            <span style={{
                              fontSize: '8px',
                              color: currentTheme.textSecondary,
                              textAlign: 'center'
                            }}>
                              {currentGroup.isDefault ? 'Default' : 'Custom'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ 
                            color: currentTheme.textSecondary, 
                            fontSize: '11px',
                            fontStyle: 'italic'
                          }}>
                            Unassigned
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div>
                        {isSelected && willTransfer ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.danger,
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <span style={{ fontSize: '8px' }}>⚠️</span>
                            Will Move
                          </span>
                        ) : isSelected && isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '500'
                          }}>
                            Will Add
                          </span>
                        ) : isSelected ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.primary,
                            fontWeight: '500'
                          }}>
                            Selected
                          </span>
                        ) : currentGroup && !isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.textSecondary,
                            cursor: 'help'
                          }}>
                            Can Move
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '400'
                          }}>
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {getFilteredUsers().length === 0 && (
                  <div style={{
                    padding: '40px 24px',
                    textAlign: 'center',
                    color: currentTheme.textSecondary,
                    fontSize: '14px'
                  }}>
                    No users found matching the current filters
                  </div>
                )}
              </div>
              
              {/* Selection Summary */}
              {selectedUsers.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: currentTheme.primary + '10',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: currentTheme.primary,
                  fontWeight: '500'
                }}>
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected for this group
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowEditGroupModal(false);
                  resetModalState();
                }}
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
                onClick={handleSaveGroupEdit}
                disabled={!newGroupName.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: newGroupName.trim() ? currentTheme.secondary : currentTheme.border,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: newGroupName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: newGroupName.trim() ? 1 : 0.6
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Custom Group Confirmation Modal */}
      {showDeleteModal && groupToDelete && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelDelete();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleCancelDelete();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '500px',
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
                <Trash2 size={24} style={{ color: currentTheme.danger }} />
              </div>
              <div>
                <h3 
                  id="delete-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Delete Custom Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.danger + '10',
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.danger}20`
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Are you sure you want to delete "{metricGroups.find(g => g.id === groupToDelete)?.displayName}"?
              </p>
              <p style={{
                color: currentTheme.textSecondary,
                margin: 0,
                fontSize: '13px'
              }}>
                This will permanently remove the group and all its configured metrics. 
                Users will no longer have access to metrics from this group.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelDelete}
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
                onClick={handleConfirmDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.danger,
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
                <Trash2 size={16} />
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Group Users Modal */}
      {showDefaultGroupModal && viewingDefaultGroup && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDefaultGroupModal(false);
              setViewingDefaultGroup(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowDefaultGroupModal(false);
              setViewingDefaultGroup(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="default-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
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
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users2 size={24} style={{ color: currentTheme.primary }} />
              </div>
              <div>
                <h3 
                  id="default-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  {viewingDefaultGroup.displayName} Group Users
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Users automatically assigned based on their roles
                </p>
              </div>
            </div>

            {/* Group Description */}
            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.primary + '10',
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.primary}20`
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Default Group Assignment Rules:
              </p>
              <p style={{
                color: currentTheme.textSecondary,
                margin: 0,
                fontSize: '13px'
              }}>
                {viewingDefaultGroup.id === 'tech' && 'Users with Tech or Technician roles are automatically assigned to this group.'}
                {viewingDefaultGroup.id === 'csr' && 'Users with CSR or Customer Service roles are automatically assigned to this group.'}
                {viewingDefaultGroup.id === 'sales' && 'Users with Sales or Sales Rep roles are automatically assigned to this group.'}
                {viewingDefaultGroup.id === 'branch' && 'Users with Branch Manager, Manager, Admin, or Owner roles are automatically assigned to this group.'}
              </p>
            </div>

            {/* Users Table */}
            <div style={{
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.background,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 80px 120px',
                padding: '12px 16px',
                backgroundColor: currentTheme.cardBg,
                borderBottom: `1px solid ${currentTheme.border}`,
                fontSize: '12px',
                fontWeight: '600',
                color: currentTheme.textSecondary,
                textTransform: 'uppercase'
              }}>
                <div>User</div>
                <div>Role</div>
                <div>Status</div>
                <div>Assignment</div>
              </div>

              {/* Table Rows */}
              {getDefaultGroupUsers(viewingDefaultGroup.id).map((user, index) => (
                <div
                  key={user.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 80px 120px',
                    padding: '12px 16px',
                    borderBottom: index < getDefaultGroupUsers(viewingDefaultGroup.id).length - 1 ? `1px solid ${currentTheme.border}` : 'none',
                    fontSize: '13px',
                    color: currentTheme.textPrimary,
                    alignItems: 'center'
                  }}
                >
                  {/* User Info */}
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '11px', color: currentTheme.textSecondary }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: currentTheme.secondary + '20',
                      color: currentTheme.secondary,
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '500',
                      backgroundColor: user.status === 'Active' ? '#10b981' : currentTheme.border,
                      color: user.status === 'Active' ? 'white' : currentTheme.textSecondary
                    }}>
                      {user.status}
                    </span>
                  </div>

                  {/* Assignment */}
                  <div>
                    <span style={{
                      fontSize: '10px',
                      color: currentTheme.success,
                      fontWeight: '500'
                    }}>
                      Auto-assigned
                    </span>
                  </div>
                </div>
              ))}

              {getDefaultGroupUsers(viewingDefaultGroup.id).length === 0 && (
                <div style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: currentTheme.textSecondary,
                  fontSize: '14px'
                }}>
                  <Users2 size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <div>No users found for this group</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Users with matching roles will appear here automatically
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            {getDefaultGroupUsers(viewingDefaultGroup.id).length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: currentTheme.success + '10',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.success}30`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: currentTheme.success,
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Total Users: {getDefaultGroupUsers(viewingDefaultGroup.id).length}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: currentTheme.textSecondary
                }}>
                  These users have access to {viewingDefaultGroup.displayName} group metrics and will see them in their dashboard.
                </div>
              </div>
            )}

            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              <button
                onClick={() => {
                  setShowDefaultGroupModal(false);
                  setViewingDefaultGroup(null);
                }}
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
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Integration interfaces
interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  crmSystem?: boolean;
}

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
  onConnect: (integration: Integration) => void;
  hasCrmIntegration: boolean;
}

// Integration Modal Component
const IntegrationModal: React.FC<IntegrationModalProps> = ({ 
  isOpen, 
  onClose, 
  integration, 
  onConnect, 
  hasCrmIntegration 
}) => {
  const { currentTheme } = useTheme();

  if (!isOpen || !integration) return null;

  const canConnect = integration.crmSystem || hasCrmIntegration;

  return (
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
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            color: currentTheme.textPrimary, 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '600' 
          }}>
            Connect {integration.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: currentTheme.textSecondary,
              cursor: 'pointer',
              padding: '4px'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: currentTheme.primary + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            {integration.icon}
          </div>
          <div>
            <h3 style={{
              color: currentTheme.textPrimary,
              margin: '0 0 4px 0',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {integration.name}
            </h3>
            <div style={{
              display: 'inline-block',
              padding: '4px 8px',
              backgroundColor: currentTheme.primary + '20',
              color: currentTheme.primary,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {integration.category}
            </div>
          </div>
        </div>

        <p style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '24px'
        }}>
          {integration.description}
        </p>

        {!canConnect && !integration.crmSystem && (
          <div style={{
            backgroundColor: currentTheme.warning + '20',
            border: `1px solid ${currentTheme.warning}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} color={currentTheme.warning} />
            <div>
              <div style={{
                color: currentTheme.warning,
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                CRM Integration Required
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '13px'
              }}>
                You must connect a CRM system (PestPac, FieldRoutes, FieldWork, or BrioStack) before adding other integrations.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
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
            onClick={() => {
              if (canConnect) {
                onConnect(integration);
                onClose();
              }
            }}
            disabled={!canConnect}
            style={{
              padding: '10px 20px',
              backgroundColor: canConnect ? currentTheme.primary : currentTheme.border,
              border: 'none',
              borderRadius: '8px',
              color: canConnect ? 'white' : currentTheme.textSecondary,
              cursor: canConnect ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Connect Integration
          </button>
        </div>
      </div>
    </div>
  );
};

// Integrations Tab Component
const IntegrationsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Complete list of 27 integrations from AppServer/src/lib
  const allIntegrations: Integration[] = [
    // CRM Systems
    { id: 'PESTPAC', name: 'PestPac', category: 'CRM', icon: '🏢', description: 'Complete pest control management system with customer, scheduling, and billing features.', crmSystem: true },
    { id: 'FIELDROUTES', name: 'FieldRoutes', category: 'CRM', icon: '🗺️', description: 'Field service management platform for route optimization and customer management.', crmSystem: true },
    { id: 'FIELDWORK', name: 'FieldWork', category: 'CRM', icon: '📋', description: 'Mobile-first field service management for pest control and lawn care businesses.', crmSystem: true },
    { id: 'BRIOSTACK', name: 'BrioStack', category: 'CRM', icon: '📊', description: 'Comprehensive business management software for service companies.', crmSystem: true },
    
    // Communication & Marketing
    { id: 'HUBSPOT', name: 'HubSpot', category: 'Communication', icon: '🎯', description: 'Inbound marketing, sales, and customer service platform.' },
    { id: 'GOHIGHLEVEL', name: 'GoHighLevel', category: 'Communication', icon: '📈', description: 'All-in-one marketing automation and CRM platform.' },
    { id: 'RINGCENTRAL', name: 'RingCentral', category: 'Communication', icon: '📞', description: 'Cloud-based business communications and collaboration platform.' },
    { id: 'CALLRAIL', name: 'CallRail', category: 'Communication', icon: '📱', description: 'Call tracking and analytics for marketing attribution.' },
    { id: 'AIRCALL', name: 'Aircall', category: 'Communication', icon: '☎️', description: 'Cloud-based phone system for sales and support teams.' },
    { id: 'DIALPAD', name: 'Dialpad', category: 'Communication', icon: '🔊', description: 'AI-powered business communications platform.' },
    { id: 'NETSAPIENS', name: 'NetSapiens', category: 'Communication', icon: '📡', description: 'Cloud communications platform for service providers.' },
    { id: 'POSTCALL', name: 'PostCall', category: 'Communication', icon: '📧', description: 'Automated follow-up and communication system.' },
    { id: 'VOICEFORPEST', name: 'Voice for Pest', category: 'Communication', icon: '🎙️', description: 'Specialized voice services for pest control industry.' },
    { id: 'CTM', name: 'CTM', category: 'Communication', icon: '📞', description: 'Call tracking and marketing attribution platform.' },
    
    // Fleet Management
    { id: 'SAMSARA', name: 'Samsara', category: 'Fleet', icon: '🚚', description: 'Connected fleet management with GPS tracking and driver safety.' },
    { id: 'VERIZONCONNECT', name: 'Verizon Connect', category: 'Fleet', icon: '🛰️', description: 'Fleet management and mobile workforce solutions.' },
    { id: 'LINXUP', name: 'Linxup', category: 'Fleet', icon: '📍', description: 'GPS fleet tracking and management platform.' },
    { id: 'ZUBIE', name: 'Zubie', category: 'Fleet', icon: '🚗', description: 'Connected car platform for fleet management.' },
    { id: 'AZUGA', name: 'Azuga', category: 'Fleet', icon: '🛣️', description: 'Fleet management and driver behavior monitoring.' },
    { id: 'BOUNCIE', name: 'Bouncie', category: 'Fleet', icon: '🔍', description: 'Vehicle tracking and diagnostics platform.' },
    { id: 'SPIREON', name: 'Spireon', category: 'Fleet', icon: '📡', description: 'Fleet intelligence and asset tracking solutions.' },
    { id: 'TELETRONICS', name: 'Teletronics', category: 'Fleet', icon: '📻', description: 'Vehicle tracking and fleet management systems.' },
    { id: 'FLEETPRO', name: 'FleetPro', category: 'Fleet', icon: '🚛', description: 'Professional fleet management and optimization.' },
    
    // Reviews & Feedback
    { id: 'LISTEN360', name: 'Listen360', category: 'Reviews', icon: '⭐', description: 'Customer feedback and review management platform.' },
    { id: 'APPLAUSE', name: 'Applause', category: 'Reviews', icon: '👏', description: 'Customer experience and feedback collection.' },
    
    // Other Services
    { id: 'DIGITALSOUTH', name: 'Digital South', category: 'Other', icon: '🌐', description: 'Digital marketing and web services.' },
    { id: 'ONESTEP', name: 'OneStep', category: 'Other', icon: '👣', description: 'Specialized service integration platform.' }
  ];

  const categories = ['All', 'CRM', 'Communication', 'Fleet', 'Reviews', 'Other'];

  const hasCrmIntegration = organization.services?.some(service => 
    allIntegrations.find(integration => integration.id === service.type)?.crmSystem
  ) || false;

  const connectedIntegrations = organization.services?.map(service => service.type) || [];

  const filteredIntegrations = allIntegrations.filter(integration => {
    const categoryMatch = selectedCategory === 'All' || integration.category === selectedCategory;
    const notConnected = !connectedIntegrations.includes(integration.id);
    return categoryMatch && notConnected;
  });

  const handleConnectIntegration = (integration: Integration) => {
    // Here you would typically make an API call to connect the integration
    console.log('Connecting integration:', integration);
    // For demo purposes, we'll just show a success message
  };

  const handleRemoveIntegration = (serviceUid: string) => {
    // Here you would typically make an API call to remove the integration
    console.log('Removing integration:', serviceUid);
  };

  return (
    <div>
      {/* CRM Warning Banner */}
      {!hasCrmIntegration && (
        <div style={{
          backgroundColor: currentTheme.warning + '20',
          border: `1px solid ${currentTheme.warning}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <AlertCircle size={24} color={currentTheme.warning} />
          <div>
            <div style={{
              color: currentTheme.warning,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              CRM Integration Required
            </div>
            <div style={{
              color: currentTheme.textSecondary,
              fontSize: '14px'
            }}>
              To ensure proper data synchronization, you must first connect a CRM system (PestPac, FieldRoutes, FieldWork, or BrioStack) before adding other integrations.
            </div>
          </div>
        </div>
      )}

      {/* Active Integrations */}
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
                Active Integrations
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                {organization.services?.length || 0} integrations connected
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {organization.services && organization.services.length > 0 ? (
            organization.services.map((service) => {
              const integration = allIntegrations.find(i => i.id === service.type);
              return (
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
                      {integration?.icon || '🔧'}
                    </div>
                    <div>
                      <div style={{
                        color: currentTheme.textPrimary,
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}>
                        {integration?.name || service.name || service.type}
                      </div>
                      <div style={{
                        color: currentTheme.textSecondary,
                        fontSize: '14px'
                      }}>
                        {integration?.category} • Last sync: {new Date(service.last_sync || Date.now()).toLocaleDateString()}
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
                        {service.status || 'Active'}
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
                    <button 
                      onClick={() => handleRemoveIntegration(service.uid)}
                      style={{
                        padding: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: currentTheme.danger,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              padding: '40px 24px',
              textAlign: 'center',
              color: currentTheme.textSecondary
            }}>
              <Globe size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '16px' }}>
                No integrations connected yet
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                Start by connecting a CRM system to sync your data
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Integrations */}
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
            <div>
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
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                {filteredIntegrations.length} integrations available • Connect services to enhance your data sync
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedCategory === category ? currentTheme.primary : 'transparent',
                  border: `1px solid ${selectedCategory === category ? currentTheme.primary : currentTheme.border}`,
                  borderRadius: '20px',
                  color: selectedCategory === category ? 'white' : currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
          padding: '24px'
        }}>
          {filteredIntegrations.length > 0 ? (
            filteredIntegrations.map((integration) => {
              const canConnect = integration.crmSystem || hasCrmIntegration;
              return (
                <div 
                  key={integration.id} 
                  style={{
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    backgroundColor: currentTheme.background,
                    opacity: canConnect ? 1 : 0.6,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onClick={() => {
                    setSelectedIntegration(integration);
                    setShowModal(true);
                  }}
                >
                  {integration.crmSystem && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: currentTheme.primary,
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      CRM
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
                      {integration.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: currentTheme.textPrimary,
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}>
                        {integration.name}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        backgroundColor: currentTheme.primary + '20',
                        color: currentTheme.primary,
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {integration.category}
                      </div>
                    </div>
                  </div>
                  <p style={{
                    color: currentTheme.textSecondary,
                    fontSize: '13px',
                    lineHeight: '1.4',
                    margin: '0 0 16px 0'
                  }}>
                    {integration.description}
                  </p>
                  <button 
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: canConnect ? currentTheme.primary : currentTheme.border,
                      border: 'none',
                      borderRadius: '8px',
                      color: canConnect ? 'white' : currentTheme.textSecondary,
                      cursor: canConnect ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    disabled={!canConnect}
                  >
                    {!canConnect && !integration.crmSystem && <AlertCircle size={16} />}
                    Connect
                  </button>
                </div>
              );
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              color: currentTheme.textSecondary
            }}>
              <Filter size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '16px' }}>
                No integrations found for "{selectedCategory}"
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Integration Modal */}
      <IntegrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        integration={selectedIntegration}
        onConnect={handleConnectIntegration}
        hasCrmIntegration={hasCrmIntegration}
      />
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
  const [currentView, setCurrentView] = useState<'organization' | 'add-user'>('organization');

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

  const handleShowAddUser = () => {
    setCurrentView('add-user');
  };

  const handleBackToOrganization = () => {
    setCurrentView('organization');
  };

  const handleSaveNewUser = (userData: any) => {
    // Here you would typically make an API call to save the new user
    // For now, just go back to the organization view
    // Saving new user with data: userData
    setCurrentView('organization');
    setActiveTab('users'); // Switch back to users tab
    // In a real app, you'd also refresh the user list or add the new user to the state
  };

  const renderTabContent = () => {
    if (activeTab === 'users') {
      return <UsersTab organization={organization} onUpdate={handleUpdateOrganization} onShowAddUser={handleShowAddUser} />;
    }
    
    const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralTab;
    return <ActiveTabComponent organization={organization} onUpdate={handleUpdateOrganization} />;
  };

  // If showing add user view, render that instead
  if (currentView === 'add-user') {
    return (
      <AddNewUser 
        onBack={handleBackToOrganization} 
        onSave={handleSaveNewUser} 
      />
    );
  }

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
            {renderTabContent()}
          </div>
        </div>
    </>
  );
};

export default OrganizationManager;
