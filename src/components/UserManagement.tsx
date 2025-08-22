import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { 
  ArrowLeft,
  Building2,
  User,
  Users,
  Link,
  Save,
  Edit3,
  X,
  Check,
  AlertCircle,
  Search,
  Plus
} from 'lucide-react';

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

interface CrmUser {
  id: number;
  name: string;
  email: string;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  active: boolean;
}

interface UserManagementProps {
  user: User;
  onBack: () => void;
  onUpdate: (userData: Partial<User>) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ user, onBack, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('details');
  const [editUserData, setEditUserData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    middleName: '',
    username: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    phone: '',
    role: user?.role?.toUpperCase().replace(' ', '_') || 'OWNER',
    status: user?.status || 'Active'
  });

  // Mock data for CRM users, branches, and organizations
  const [crmUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@driven.com', role: 'System Admin' },
    { id: 2, name: 'Support Lead', email: 'support@driven.com', role: 'Support Manager' },
    { id: 3, name: 'Tech Lead', email: 'tech@driven.com', role: 'Technical Lead' }
  ]);

  const [companyBranches] = useState([
    { id: 1, name: 'Main Office', address: '123 Main St, City, ST', active: true },
    { id: 2, name: 'North Branch', address: '456 North Ave, City, ST', active: true },
    { id: 3, name: 'South Branch', address: '789 South Blvd, City, ST', active: false }
  ]);

  const [attachedCrmUser, setAttachedCrmUser] = useState(null);
  const [assignedBranch, setAssignedBranch] = useState(null);
  const [searchCrmUser, setSearchCrmUser] = useState('');
  const [searchBranch, setSearchBranch] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setEditUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveUser = () => {
    onUpdate(editUserData);
    // Saving user
  };

  const handleAttachCrmUser = (crmUser: CrmUser) => {
    setAttachedCrmUser(crmUser);
    // Attaching CRM user
  };

  const handleAssignBranch = (branch: Branch) => {
    setAssignedBranch(branch);
    // Assigning branch
  };

  const sections = [
    { id: 'details', label: 'User Details', icon: User },
    { id: 'crm-user', label: 'CRM User', icon: Link },
    { id: 'branch', label: 'Company Branch', icon: Building2 },
    { id: 'relationships', label: 'Relationships', icon: Users }
  ];

  const filteredCrmUsers = crmUsers.filter(user =>
    user.name.toLowerCase().includes(searchCrmUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchCrmUser.toLowerCase())
  );

  const filteredBranches = companyBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchBranch.toLowerCase())
  );

  const renderUserDetails = () => (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      padding: '24px'
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
          fontSize: '18px',
          fontWeight: '600'
        }}>
          User Information
        </h3>
        <button
          onClick={handleSaveUser}
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
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
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
            value={editUserData.firstName}
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
            value={editUserData.lastName}
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
            value={editUserData.middleName}
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
            value={editUserData.username}
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
            value={editUserData.email}
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
            value={editUserData.phone}
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
            value={editUserData.role}
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

        {/* Status */}
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
                border: `1px solid ${editUserData.status === 'Active' ? currentTheme.success : currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: editUserData.status === 'Active' ? currentTheme.success : 'transparent',
                color: editUserData.status === 'Active' ? 'white' : currentTheme.textPrimary,
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
                border: `1px solid ${editUserData.status === 'Inactive' ? currentTheme.danger : currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: editUserData.status === 'Inactive' ? currentTheme.danger : 'transparent',
                color: editUserData.status === 'Inactive' ? 'white' : currentTheme.textPrimary,
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
    </div>
  );

  const renderCrmUserSection = () => (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      padding: '24px'
    }}>
      <h3 style={{
        color: currentTheme.textPrimary,
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Attach CRM User
      </h3>

      {attachedCrmUser ? (
        <div style={{
          padding: '16px',
          backgroundColor: currentTheme.success + '15',
          border: `1px solid ${currentTheme.success}30`,
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                color: currentTheme.textPrimary,
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {attachedCrmUser.name}
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '14px'
              }}>
                {attachedCrmUser.email} • {attachedCrmUser.role}
              </div>
            </div>
            <button
              onClick={() => setAttachedCrmUser(null)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                color: currentTheme.textSecondary,
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentTheme.textSecondary
            }} />
            <input
              type="text"
              placeholder="Search CRM users..."
              value={searchCrmUser}
              onChange={(e) => setSearchCrmUser(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {filteredCrmUsers.map((crmUser) => (
              <div key={crmUser.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg
              }}>
                <div>
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '2px'
                  }}>
                    {crmUser.name}
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    {crmUser.email} • {crmUser.role}
                  </div>
                </div>
                <button
                  onClick={() => handleAttachCrmUser(crmUser)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: currentTheme.primary,
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Attach
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderBranchSection = () => (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      padding: '24px'
    }}>
      <h3 style={{
        color: currentTheme.textPrimary,
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Assign Company Branch
      </h3>

      {assignedBranch ? (
        <div style={{
          padding: '16px',
          backgroundColor: currentTheme.success + '15',
          border: `1px solid ${currentTheme.success}30`,
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                color: currentTheme.textPrimary,
                fontSize: '16px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {assignedBranch.name}
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '14px'
              }}>
                {assignedBranch.address}
              </div>
            </div>
            <button
              onClick={() => setAssignedBranch(null)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                color: currentTheme.textSecondary,
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentTheme.textSecondary
            }} />
            <input
              type="text"
              placeholder="Search company branches..."
              value={searchBranch}
              onChange={(e) => setSearchBranch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {filteredBranches.map((branch) => (
              <div key={branch.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg,
                opacity: branch.active ? 1 : 0.6
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <div style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {branch.name}
                    </div>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: branch.active ? currentTheme.success : currentTheme.danger
                    }} />
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    {branch.address}
                  </div>
                </div>
                <button
                  onClick={() => handleAssignBranch(branch)}
                  disabled={!branch.active}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: branch.active ? currentTheme.primary : currentTheme.textSecondary,
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: branch.active ? 'pointer' : 'not-allowed',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderRelationshipsSection = () => (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      padding: '24px'
    }}>
      <h3 style={{
        color: currentTheme.textPrimary,
        margin: '0 0 16px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Organization Relationships
      </h3>

      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Current Attachments Summary */}
        <div style={{
          padding: '16px',
          backgroundColor: currentTheme.cardBg,
          border: `1px solid ${currentTheme.border}`,
          borderRadius: '8px'
        }}>
          <h4 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Current Attachments
          </h4>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>CRM User:</span>
              <span style={{ 
                color: attachedCrmUser ? currentTheme.success : currentTheme.textSecondary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {attachedCrmUser ? attachedCrmUser.name : 'Not attached'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Company Branch:</span>
              <span style={{ 
                color: assignedBranch ? currentTheme.success : currentTheme.textSecondary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {assignedBranch ? assignedBranch.name : 'Not assigned'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Organization:</span>
              <span style={{ 
                color: currentTheme.success, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Cross Pest Control
              </span>
            </div>
          </div>
        </div>

        {/* Relationship Actions */}
        <div style={{
          padding: '16px',
          backgroundColor: currentTheme.cardBg,
          border: `1px solid ${currentTheme.border}`,
          borderRadius: '8px'
        }}>
          <h4 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Relationship Management
          </h4>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
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
              <Save size={16} />
              Save All Relationships
            </button>

            <button
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Reset Relationships
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'details':
        return renderUserDetails();
      case 'crm-user':
        return renderCrmUserSection();
      case 'branch':
        return renderBranchSection();
      case 'relationships':
        return renderRelationshipsSection();
      default:
        return renderUserDetails();
    }
  };

  return (
    <div style={{
      backgroundColor: currentTheme.background,
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
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
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 4px 0'
          }}>
            Manage User - {user?.name || 'Unknown User'}
          </h1>
          <div style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{user?.email}</span>
            <span>•</span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: user?.status === 'Active' ? currentTheme.success : currentTheme.danger
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: user?.status === 'Active' ? currentTheme.success : currentTheme.danger
              }} />
              {user?.status}
            </span>
            <span>•</span>
            <span style={{
              color: currentTheme.textSecondary
            }}>
              {user?.status === 'Active' 
                ? `Member since ${new Date(user?.memberSince || '2025-08-18').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}`
                : `Closed on ${new Date(user?.closedOn || '2025-08-18').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: `1px solid ${currentTheme.border}`,
        paddingBottom: '0'
      }}>
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '12px 16px',
                backgroundColor: activeSection === section.id ? currentTheme.primary + '15' : 'transparent',
                border: 'none',
                borderBottom: activeSection === section.id ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                color: activeSection === section.id ? currentTheme.primary : currentTheme.textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <IconComponent size={16} />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default UserManagement;
