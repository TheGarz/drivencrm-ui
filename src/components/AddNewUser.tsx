import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { 
  ArrowLeft,
  Building2,
  User,
  Users,
  Link,
  Plus,
  AlertCircle,
  Search,
  X,
  Check
} from 'lucide-react';

interface CrmUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateAdded: string;
}

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  manager: string;
  employees: number;
  active: boolean;
  dateEstablished: string;
  type: 'Main Office' | 'Branch' | 'Service Center' | 'Warehouse';
}

interface NewUserData {
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  attachedCrmUser?: CrmUser | null;
  assignedBranch?: Branch | null;
  memberSince?: string;
  id?: number;
  name?: string;
  connectedCrmUser?: string | null;
  lastLogin?: string;
}

interface AddNewUserProps {
  onBack: () => void;
  onSave: (userData: NewUserData) => void;
}

const AddNewUser: React.FC<AddNewUserProps> = ({ onBack, onSave }) => {
  const { currentTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('details');
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

  // Mock data for CRM users, branches, and organizations
  const [crmUsers] = useState<CrmUser[]>([
    { id: 1001, firstName: 'John', lastName: 'Smith', email: 'john.smith@crosspest.com', role: 'System Admin', dateAdded: '2024-01-15' },
    { id: 1002, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@crosspest.com', role: 'Branch Manager', dateAdded: '2024-01-20' },
    { id: 1003, firstName: 'Mike', lastName: 'Wilson', email: 'mike.wilson@crosspest.com', role: 'Technical Lead', dateAdded: '2024-02-01' },
    { id: 1004, firstName: 'Lisa', lastName: 'Brown', email: 'lisa.brown@crosspest.com', role: 'Support Manager', dateAdded: '2024-02-05' },
    { id: 1005, firstName: 'David', lastName: 'Lee', email: 'david.lee@crosspest.com', role: 'Sales Manager', dateAdded: '2024-02-10' },
    { id: 1006, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@crosspest.com', role: 'Office Manager', dateAdded: '2024-02-15' },
    { id: 1007, firstName: 'Robert', lastName: 'Taylor', email: 'robert.taylor@crosspest.com', role: 'Team Lead', dateAdded: '2024-02-20' },
    { id: 1008, firstName: 'Jessica', lastName: 'Anderson', email: 'jessica.anderson@crosspest.com', role: 'Customer Service Rep', dateAdded: '2024-02-25' },
    { id: 1009, firstName: 'Christopher', lastName: 'Martinez', email: 'christopher.martinez@crosspest.com', role: 'Field Technician', dateAdded: '2024-03-01' },
    { id: 1010, firstName: 'Amanda', lastName: 'Garcia', email: 'amanda.garcia@crosspest.com', role: 'Sales Rep', dateAdded: '2024-03-05' },
    { id: 1011, firstName: 'Matthew', lastName: 'Rodriguez', email: 'matthew.rodriguez@crosspest.com', role: 'Quality Inspector', dateAdded: '2024-03-10' },
    { id: 1012, firstName: 'Ashley', lastName: 'White', email: 'ashley.white@crosspest.com', role: 'Scheduler', dateAdded: '2024-03-15' },
    { id: 1013, firstName: 'Joshua', lastName: 'Thompson', email: 'joshua.thompson@crosspest.com', role: 'Route Manager', dateAdded: '2024-03-20' },
    { id: 1014, firstName: 'Stephanie', lastName: 'Clark', email: 'stephanie.clark@crosspest.com', role: 'Billing Specialist', dateAdded: '2024-03-25' },
    { id: 1015, firstName: 'Daniel', lastName: 'Lewis', email: 'daniel.lewis@crosspest.com', role: 'Equipment Manager', dateAdded: '2024-04-01' },
    { id: 1016, firstName: 'Michelle', lastName: 'Walker', email: 'michelle.walker@crosspest.com', role: 'Training Coordinator', dateAdded: '2024-04-05' },
    { id: 1017, firstName: 'Ryan', lastName: 'Hall', email: 'ryan.hall@crosspest.com', role: 'Safety Officer', dateAdded: '2024-04-10' },
    { id: 1018, firstName: 'Nicole', lastName: 'Young', email: 'nicole.young@crosspest.com', role: 'Marketing Specialist', dateAdded: '2024-04-15' },
    { id: 1019, firstName: 'Kevin', lastName: 'King', email: 'kevin.king@crosspest.com', role: 'Warehouse Supervisor', dateAdded: '2024-04-20' },
    { id: 1020, firstName: 'Lauren', lastName: 'Wright', email: 'lauren.wright@crosspest.com', role: 'HR Coordinator', dateAdded: '2024-04-25' }
  ]);

  const [companyBranches] = useState<Branch[]>([
    { 
      id: 2001, 
      name: 'Headquarters', 
      address: '1250 Corporate Drive', 
      city: 'Austin', 
      state: 'TX', 
      zipCode: '78701', 
      phone: '(512) 555-0100', 
      manager: 'Sarah Johnson', 
      employees: 45, 
      active: true, 
      dateEstablished: '2015-03-15',
      type: 'Main Office'
    },
    { 
      id: 2002, 
      name: 'North Austin Branch', 
      address: '5678 Research Blvd', 
      city: 'Austin', 
      state: 'TX', 
      zipCode: '78758', 
      phone: '(512) 555-0102', 
      manager: 'Mike Wilson', 
      employees: 28, 
      active: true, 
      dateEstablished: '2017-08-22',
      type: 'Branch'
    },
    { 
      id: 2003, 
      name: 'South Austin Branch', 
      address: '9012 Slaughter Lane', 
      city: 'Austin', 
      state: 'TX', 
      zipCode: '78748', 
      phone: '(512) 555-0103', 
      manager: 'Lisa Brown', 
      employees: 22, 
      active: true, 
      dateEstablished: '2018-11-10',
      type: 'Branch'
    },
    { 
      id: 2004, 
      name: 'Round Rock Service Center', 
      address: '3456 Innovation Blvd', 
      city: 'Round Rock', 
      state: 'TX', 
      zipCode: '78664', 
      phone: '(512) 555-0104', 
      manager: 'David Lee', 
      employees: 15, 
      active: true, 
      dateEstablished: '2019-05-01',
      type: 'Service Center'
    },
    { 
      id: 2005, 
      name: 'Cedar Park Branch', 
      address: '7890 Whitestone Blvd', 
      city: 'Cedar Park', 
      state: 'TX', 
      zipCode: '78613', 
      phone: '(512) 555-0105', 
      manager: 'Emily Davis', 
      employees: 19, 
      active: true, 
      dateEstablished: '2020-02-14',
      type: 'Branch'
    },
    { 
      id: 2006, 
      name: 'Georgetown Branch', 
      address: '2345 Williams Drive', 
      city: 'Georgetown', 
      state: 'TX', 
      zipCode: '78628', 
      phone: '(512) 555-0106', 
      manager: 'Robert Taylor', 
      employees: 16, 
      active: true, 
      dateEstablished: '2020-09-30',
      type: 'Branch'
    },
    { 
      id: 2007, 
      name: 'Pflugerville Service Center', 
      address: '6789 FM 1825', 
      city: 'Pflugerville', 
      state: 'TX', 
      zipCode: '78660', 
      phone: '(512) 555-0107', 
      manager: 'Jessica Anderson', 
      employees: 12, 
      active: true, 
      dateEstablished: '2021-06-18',
      type: 'Service Center'
    },
    { 
      id: 2008, 
      name: 'Lakeway Branch', 
      address: '4567 Bee Creek Road', 
      city: 'Lakeway', 
      state: 'TX', 
      zipCode: '78734', 
      phone: '(512) 555-0108', 
      manager: 'Christopher Martinez', 
      employees: 14, 
      active: true, 
      dateEstablished: '2021-12-03',
      type: 'Branch'
    },
    { 
      id: 2009, 
      name: 'Central Warehouse', 
      address: '8901 Industrial Blvd', 
      city: 'Austin', 
      state: 'TX', 
      zipCode: '78745', 
      phone: '(512) 555-0109', 
      manager: 'Amanda Garcia', 
      employees: 8, 
      active: true, 
      dateEstablished: '2022-03-25',
      type: 'Warehouse'
    },
    { 
      id: 2010, 
      name: 'Leander Branch', 
      address: '1234 Crystal Falls Pkwy', 
      city: 'Leander', 
      state: 'TX', 
      zipCode: '78641', 
      phone: '(512) 555-0110', 
      manager: 'Matthew Rodriguez', 
      employees: 13, 
      active: true, 
      dateEstablished: '2022-08-12',
      type: 'Branch'
    },
    { 
      id: 2011, 
      name: 'Kyle Service Center', 
      address: '5678 Kyle Crossing', 
      city: 'Kyle', 
      state: 'TX', 
      zipCode: '78640', 
      phone: '(512) 555-0111', 
      manager: 'Ashley White', 
      employees: 11, 
      active: true, 
      dateEstablished: '2023-01-20',
      type: 'Service Center'
    },
    { 
      id: 2012, 
      name: 'Buda Branch', 
      address: '9012 Main Street', 
      city: 'Buda', 
      state: 'TX', 
      zipCode: '78610', 
      phone: '(512) 555-0112', 
      manager: 'Joshua Thompson', 
      employees: 9, 
      active: true, 
      dateEstablished: '2023-07-08',
      type: 'Branch'
    },
    { 
      id: 2013, 
      name: 'Dripping Springs Branch', 
      address: '3456 Ranch Road 12', 
      city: 'Dripping Springs', 
      state: 'TX', 
      zipCode: '78620', 
      phone: '(512) 555-0113', 
      manager: 'Stephanie Clark', 
      employees: 7, 
      active: false, 
      dateEstablished: '2023-11-15',
      type: 'Branch'
    }
  ]);

  const [attachedCrmUser, setAttachedCrmUser] = useState<CrmUser | null>(null);
  const [assignedBranch, setAssignedBranch] = useState<Branch | null>(null);
  const [searchCrmUser, setSearchCrmUser] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [displayedCrmUsers, setDisplayedCrmUsers] = useState(10);
  const [displayedBranches, setDisplayedBranches] = useState(8);

  const handleInputChange = (field: string, value: string) => {
    setNewUserData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!newUserData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!newUserData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!newUserData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!newUserData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
      errors.email = 'Email format is invalid';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = () => {
    if (validateForm()) {
      const completeUserData = {
        ...newUserData,
        attachedCrmUser,
        assignedBranch,
        memberSince: new Date().toISOString(),
        id: Date.now(), // Temporary ID for demo
        name: `${newUserData.firstName} ${newUserData.lastName}`.trim(),
        connectedCrmUser: attachedCrmUser ? `${attachedCrmUser.firstName} ${attachedCrmUser.lastName}`.trim() : null,
        lastLogin: new Date().toISOString()
      };
      
      onSave(completeUserData);
    }
  };

  const handleAttachCrmUser = (crmUser: CrmUser) => {
    setAttachedCrmUser(crmUser);
  };

  const handleAssignBranch = (branch: Branch) => {
    setAssignedBranch(branch);
  };

  const sections = [
    { id: 'details', label: 'User Details', icon: User },
    { id: 'crm-user', label: 'CRM User', icon: Link },
    { id: 'branch', label: 'Company Branch', icon: Building2 },
    { id: 'relationships', label: 'Summary', icon: Users }
  ];

  const filteredCrmUsers = crmUsers.filter(user =>
    user.firstName.toLowerCase().includes(searchCrmUser.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchCrmUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchCrmUser.toLowerCase()) ||
    user.role.toLowerCase().includes(searchCrmUser.toLowerCase()) ||
    user.id.toString().includes(searchCrmUser)
  );

  const filteredBranches = companyBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.state.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.type.toLowerCase().includes(searchBranch.toLowerCase()) ||
    branch.id.toString().includes(searchBranch)
  );

  const visibleCrmUsers = filteredCrmUsers.slice(0, displayedCrmUsers);
  const visibleBranches = filteredBranches.slice(0, displayedBranches);

  const handleLoadMoreCrmUsers = () => {
    setDisplayedCrmUsers(prev => prev + 10);
  };

  const handleLoadMoreBranches = () => {
    setDisplayedBranches(prev => prev + 8);
  };

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
        <div>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>
            New User Information
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '4px 0 0 0',
            fontSize: '14px'
          }}>
            Enter the basic information for the new user account
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: currentTheme.success + '15',
          border: `1px solid ${currentTheme.success}30`,
          borderRadius: '8px',
          padding: '8px 12px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentTheme.success
          }} />
          <span style={{
            color: currentTheme.success,
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Creating New User
          </span>
        </div>
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
            First Name *
          </label>
          <input
            type="text"
            value={newUserData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${validationErrors.firstName ? currentTheme.danger : currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          />
          {validationErrors.firstName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              color: currentTheme.danger,
              fontSize: '12px'
            }}>
              <AlertCircle size={12} />
              {validationErrors.firstName}
            </div>
          )}
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
            Last Name *
          </label>
          <input
            type="text"
            value={newUserData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${validationErrors.lastName ? currentTheme.danger : currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          />
          {validationErrors.lastName && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              color: currentTheme.danger,
              fontSize: '12px'
            }}>
              <AlertCircle size={12} />
              {validationErrors.lastName}
            </div>
          )}
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
            placeholder="Enter middle name (optional)"
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
            Username *
          </label>
          <input
            type="text"
            value={newUserData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Enter username"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${validationErrors.username ? currentTheme.danger : currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          />
          {validationErrors.username && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              color: currentTheme.danger,
              fontSize: '12px'
            }}>
              <AlertCircle size={12} />
              {validationErrors.username}
            </div>
          )}
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
            Email *
          </label>
          <input
            type="email"
            value={newUserData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${validationErrors.email ? currentTheme.danger : currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          />
          {validationErrors.email && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              color: currentTheme.danger,
              fontSize: '12px'
            }}>
              <AlertCircle size={12} />
              {validationErrors.email}
            </div>
          )}
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
            placeholder="Enter phone number (optional)"
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
            User Role *
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

        {/* Status */}
        <div>
          <label style={{
            display: 'block',
            color: currentTheme.textSecondary,
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px'
          }}>
            Initial Status
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
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {newUserData.status === 'Active' && <Check size={14} />}
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
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {newUserData.status === 'Inactive' && <Check size={14} />}
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Auto-generated fields info */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: currentTheme.background,
        borderRadius: '8px',
        border: `1px solid ${currentTheme.border}`
      }}>
        <h4 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 8px 0',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Auto-Generated Information
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px',
          fontSize: '12px'
        }}>
          <div>
            <span style={{ color: currentTheme.textSecondary }}>Member Since: </span>
            <span style={{ color: currentTheme.textPrimary }}>
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: '2-digit' 
              })}
            </span>
          </div>
          <div>
            <span style={{ color: currentTheme.textSecondary }}>User ID: </span>
            <span style={{ color: currentTheme.textPrimary }}>
              Auto-assigned on creation
            </span>
          </div>
          <div>
            <span style={{ color: currentTheme.textSecondary }}>Last Login: </span>
            <span style={{ color: currentTheme.textPrimary }}>
              Not yet logged in
            </span>
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
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 4px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Attach CRM User (Optional)
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px'
        }}>
          Connect this user to an existing CRM user account for data synchronization
        </p>
      </div>

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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <Check size={16} style={{ color: currentTheme.success }} />
                <span style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {attachedCrmUser.firstName} {attachedCrmUser.lastName}
                </span>
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
              placeholder="Search CRM users by name or email..."
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

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1fr 1fr 120px 80px',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: currentTheme.background,
            borderRadius: '8px',
            border: `1px solid ${currentTheme.border}`,
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '12px',
            color: currentTheme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>ID</div>
            <div>First Name</div>
            <div>Last Name</div>
            <div>Role</div>
            <div>Date Added</div>
            <div style={{ textAlign: 'center' }}>Action</div>
          </div>

          <div style={{ display: 'grid', gap: '4px' }}>
            {visibleCrmUsers.length > 0 ? (
              visibleCrmUsers.map((crmUser) => (
                <div key={crmUser.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 1fr 120px 80px',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary + '08';
                  e.currentTarget.style.borderColor = currentTheme.primary + '30';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                  e.currentTarget.style.borderColor = currentTheme.border;
                }}
                >
                  {/* ID */}
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: '500'
                  }}>
                    #{crmUser.id}
                  </div>
                  
                  {/* First Name */}
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {crmUser.firstName}
                  </div>
                  
                  {/* Last Name */}
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {crmUser.lastName}
                  </div>
                  
                  {/* Role */}
                  <div>
                    <div style={{
                      color: currentTheme.textPrimary,
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}>
                      {crmUser.role}
                    </div>
                    <div style={{
                      color: currentTheme.textSecondary,
                      fontSize: '11px'
                    }}>
                      {crmUser.email}
                    </div>
                  </div>
                  
                  {/* Date Added */}
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    {new Date(crmUser.dateAdded).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  
                  {/* Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleAttachCrmUser(crmUser)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: currentTheme.primary,
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.primary;
                      }}
                    >
                      Attach
                    </button>
                  </div>
                </div>
              ))
            ) : (
              searchCrmUser ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px'
                }}>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    No CRM users found matching your search.
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    Try searching by ID, name, email, or role.
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px'
                }}>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    No CRM users available.
                  </div>
                </div>
              )
            )}
          </div>

          {/* Load More Button for CRM Users */}
          {!searchCrmUser && visibleCrmUsers.length < filteredCrmUsers.length && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }}>
              <button
                onClick={handleLoadMoreCrmUsers}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  color: currentTheme.primary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Plus size={14} />
                Load More ({filteredCrmUsers.length - visibleCrmUsers.length} remaining)
              </button>
            </div>
          )}

          {searchCrmUser && visibleCrmUsers.length < filteredCrmUsers.length && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: currentTheme.background,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '12px',
                marginBottom: '8px'
              }}>
                Showing {visibleCrmUsers.length} of {filteredCrmUsers.length} matching results
              </div>
              <button
                onClick={handleLoadMoreCrmUsers}
                style={{
                  padding: '6px 12px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  margin: '0 auto'
                }}
              >
                <Plus size={12} />
                Show More
              </button>
            </div>
          )}
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
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 4px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Assign Company Branch (Optional)
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px'
        }}>
          Assign this user to a specific company branch for location-based access control
        </p>
      </div>

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
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <Check size={16} style={{ color: currentTheme.success }} />
                <span style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {assignedBranch.name}
                </span>
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

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr 1fr 100px 80px 120px 80px',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: currentTheme.background,
            borderRadius: '8px',
            border: `1px solid ${currentTheme.border}`,
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '12px',
            color: currentTheme.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>ID</div>
            <div>Branch Name</div>
            <div>Location</div>
            <div>Type</div>
            <div>Staff</div>
            <div>Manager</div>
            <div style={{ textAlign: 'center' }}>Action</div>
          </div>

          <div style={{ display: 'grid', gap: '4px' }}>
            {visibleBranches.length > 0 ? (
              visibleBranches.map((branch) => (
                <div key={branch.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 100px 80px 120px 80px',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  opacity: branch.active ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (branch.active) {
                    e.currentTarget.style.backgroundColor = currentTheme.primary + '08';
                    e.currentTarget.style.borderColor = currentTheme.primary + '30';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                  e.currentTarget.style.borderColor = currentTheme.border;
                }}
                >
                  {/* ID */}
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: '500'
                  }}>
                    #{branch.id}
                  </div>
                  
                  {/* Branch Name */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px'
                    }}>
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
                      fontSize: '11px'
                    }}>
                      Est. {new Date(branch.dateEstablished).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <div style={{
                      color: currentTheme.textPrimary,
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}>
                      {branch.city}, {branch.state}
                    </div>
                    <div style={{
                      color: currentTheme.textSecondary,
                      fontSize: '11px'
                    }}>
                      {branch.zipCode}
                    </div>
                  </div>
                  
                  {/* Type */}
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: 
                      branch.type === 'Main Office' ? currentTheme.primary + '20' :
                      branch.type === 'Branch' ? currentTheme.success + '20' :
                      branch.type === 'Service Center' ? currentTheme.warning + '20' :
                      currentTheme.accent + '20',
                    color: 
                      branch.type === 'Main Office' ? currentTheme.primary :
                      branch.type === 'Branch' ? currentTheme.success :
                      branch.type === 'Service Center' ? currentTheme.warning :
                      currentTheme.accent,
                    fontSize: '11px',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    {branch.type}
                  </div>
                  
                  {/* Staff Count */}
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    {branch.employees}
                  </div>
                  
                  {/* Manager */}
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {branch.manager}
                  </div>
                  
                  {/* Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                        fontSize: '11px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (branch.active) {
                          e.currentTarget.style.backgroundColor = currentTheme.secondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = branch.active ? currentTheme.primary : currentTheme.textSecondary;
                      }}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))
            ) : (
              searchBranch ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px'
                }}>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    No branches found matching your search.
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    Try searching by ID, name, location, manager, or branch type.
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px'
                }}>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    No company branches available.
                  </div>
                </div>
              )
            )}
          </div>

          {/* Load More Button for Branches */}
          {!searchBranch && visibleBranches.length < filteredBranches.length && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '16px'
            }}>
              <button
                onClick={handleLoadMoreBranches}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.primary}`,
                  borderRadius: '8px',
                  color: currentTheme.primary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Plus size={14} />
                Load More ({filteredBranches.length - visibleBranches.length} remaining)
              </button>
            </div>
          )}

          {searchBranch && visibleBranches.length < filteredBranches.length && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: currentTheme.background,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              marginTop: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '12px',
                marginBottom: '8px'
              }}>
                Showing {visibleBranches.length} of {filteredBranches.length} matching results
              </div>
              <button
                onClick={handleLoadMoreBranches}
                style={{
                  padding: '6px 12px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  margin: '0 auto'
                }}
              >
                <Plus size={12} />
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderSummarySection = () => (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      padding: '24px'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 4px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          User Creation Summary
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px'
        }}>
          Review the information before creating the new user account
        </p>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {/* User Information Summary */}
        <div style={{
          padding: '16px',
          backgroundColor: currentTheme.background,
          border: `1px solid ${currentTheme.border}`,
          borderRadius: '8px'
        }}>
          <h4 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            User Information
          </h4>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Full Name:</span>
              <span style={{ 
                color: currentTheme.textPrimary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {`${newUserData.firstName} ${newUserData.middleName ? newUserData.middleName + ' ' : ''}${newUserData.lastName}`.trim() || 'Not provided'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Email:</span>
              <span style={{ 
                color: currentTheme.textPrimary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {newUserData.email || 'Not provided'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Username:</span>
              <span style={{ 
                color: currentTheme.textPrimary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {newUserData.username || 'Not provided'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Role:</span>
              <span style={{ 
                color: currentTheme.textPrimary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {newUserData.role.replace(/_/g, ' ')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Status:</span>
              <span style={{ 
                color: newUserData.status === 'Active' ? currentTheme.success : currentTheme.danger, 
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: newUserData.status === 'Active' ? currentTheme.success : currentTheme.danger
                }} />
                {newUserData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Relationships Summary */}
        <div style={{
          padding: '16px',
          backgroundColor: currentTheme.background,
          border: `1px solid ${currentTheme.border}`,
          borderRadius: '8px'
        }}>
          <h4 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Relationships & Assignments
          </h4>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>CRM User:</span>
              <span style={{ 
                color: attachedCrmUser ? currentTheme.success : currentTheme.textSecondary, 
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {attachedCrmUser ? `${attachedCrmUser.firstName} ${attachedCrmUser.lastName}` : 'Not attached'}
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

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '8px'
        }}>
          <button
            onClick={onBack}
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
            disabled={Object.keys(validationErrors).length > 0}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTheme.primary,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: Object.keys(validationErrors).length > 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              opacity: Object.keys(validationErrors).length > 0 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            Create User
          </button>
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
        return renderSummarySection();
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
            justifyContent: 'center',
            transition: 'all 0.2s ease'
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

        <div>
          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 4px 0'
          }}>
            Add New User
          </h1>
          <div style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Create a new user account for Cross Pest Control</span>
            <span>•</span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: currentTheme.primary
            }}>
              <Plus size={14} />
              New Account Setup
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px',
        padding: '12px 16px',
        backgroundColor: currentTheme.cardBg,
        borderRadius: '8px',
        border: `1px solid ${currentTheme.border}`
      }}>
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isCompleted = index < sections.findIndex(s => s.id === activeSection);
          return (
            <div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? currentTheme.success : isActive ? currentTheme.primary : currentTheme.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompleted || isActive ? 'white' : currentTheme.textSecondary,
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {isCompleted ? <Check size={12} /> : index + 1}
              </div>
              <span style={{
                color: isActive ? currentTheme.primary : currentTheme.textSecondary,
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {section.label}
              </span>
              {index < sections.length - 1 && (
                <div style={{
                  width: '20px',
                  height: '1px',
                  backgroundColor: currentTheme.border,
                  margin: '0 8px'
                }} />
              )}
            </div>
          );
        })}
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
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '12px 16px',
                backgroundColor: isActive ? currentTheme.primary + '15' : 'transparent',
                border: 'none',
                borderBottom: isActive ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                color: isActive ? currentTheme.primary : currentTheme.textSecondary,
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

export default AddNewUser;