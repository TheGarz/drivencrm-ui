import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { 
  ArrowLeft,
  Building2,
  User,
  Users,
  Link,
  Save,
  X,
  Search,
  Plus,
  FileText
} from 'lucide-react';
import { ScriptEditor } from './features/script-editor';
import { rulesAPI } from './OrganizationManager/api/userRules';

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

  const [attachedCrmUser, setAttachedCrmUser] = useState(null);
  const [assignedBranch, setAssignedBranch] = useState(null);
  const [searchCrmUser, setSearchCrmUser] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [displayedCrmUsers, setDisplayedCrmUsers] = useState(10);
  const [displayedBranches, setDisplayedBranches] = useState(8);
  
  // User rules state
  const [script, setScript] = useState<string>('-- Loading user rules...');
  const [rulesLoading, setRulesLoading] = useState(true);
  const [rulesError, setRulesError] = useState<string | null>(null);

  // Fetch user rules when component mounts
  useEffect(() => {
    const fetchUserRules = async () => {
      if (!user.connectedCrmUser) return; // Only fetch for connected users
      
      setRulesLoading(true);
      setRulesError(null);

      try {
        const userScript = await rulesAPI.getRulesForUser({ id: user.id });
        setScript(userScript);
      } catch (err) {
        console.error('Failed to fetch user rules:', err);
        setRulesError('Failed to load user rules. Please try again.');
      } finally {
        setRulesLoading(false);
      }
    };

    fetchUserRules();
  }, [user.id, user.connectedCrmUser]);

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

  // Script editor handlers
  const handleScriptSave = async (script: string) => {
    try {
      await rulesAPI.updateRulesForUser({ id: user.id, script });
      // Log for debugging - replace with proper notification
      // eslint-disable-next-line no-console
      console.log('User rules saved successfully for user:', user.id);
    } catch (err) { 
      console.error('Failed to save user rules:', err);
      throw err;
    }
  };

  const handleScriptCompile = async (script: string) => {
    try {
      await rulesAPI.testCompileRules(script);
      // Log for debugging - replace with proper notification
      // eslint-disable-next-line no-console
      console.log('User script compiled successfully');
    } catch (err) {
      console.error('Failed to compile user script:', err);
      throw err;
    }
  };

  // Determine available sections based on user's connected CRM user status
  const sections = [
    { id: 'details', label: 'User Details', icon: User },
    { id: 'crm-user', label: 'CRM User', icon: Link },
    { id: 'branch', label: 'Company Branch', icon: Building2 },
    { id: 'relationships', label: 'Relationships', icon: Users },
    // Only show Rules section if user has a connected CRM user
    ...(user.connectedCrmUser ? [{ id: 'rules', label: 'Rules', icon: FileText }] : [])
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
                {attachedCrmUser.firstName} {attachedCrmUser.lastName}
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

  const renderUserRules = () => (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      padding: '24px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          User-Specific Rules
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          The metric rules section allows you to define and edit rules
          that apply to this specific user ({user.name}).
          <br /><br />
          User rules override organization and branch rules for this user.
          To create organization-wide rules, navigate to the Organization Rules section.
        </p>
      </div>
      
      {rulesError && (
        <div style={{
          color: currentTheme.danger,
          backgroundColor: currentTheme.danger + '10',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {rulesError}
        </div>
      )}
      
      {rulesLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: currentTheme.textSecondary
        }}>
          Loading user rules...
        </div>
      ) : (
        <ScriptEditor
          script={script}
          onSave={handleScriptSave}
          onCompile={handleScriptCompile}
        />
      )}
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
      case 'rules':
        return renderUserRules();
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
