// User Management Page Component
// For managing Driven user access to organizations, branches, and users

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { Search, X, Building2, ChevronDown, Link as LinkIcon, Users as UsersIcon, Edit3, Mail, Phone, Shield, ShieldCheck, CheckCircle, XCircle, AlertTriangle, Check } from 'lucide-react';

interface DrivenUser {
  id: number;
  name: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  username?: string;
  active?: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  joinDate?: string;
}

interface Organization {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
  organization: string;
  organizationId: number;
}

interface User {
  id: number;
  name: string;
  organization: string;
  organizationId: number;
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [selectedDrivenUser, setSelectedDrivenUser] = useState<DrivenUser | null>(null);
  const [activeTab, setActiveTab] = useState<'organization' | 'branch' | 'user'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedOrgOnly, setShowSelectedOrgOnly] = useState(true);
  
  // Searchable dropdown state
  const [userSearchInput, setUserSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Attached items
  const [attachedOrganizations, setAttachedOrganizations] = useState<Organization[]>([]);
  const [attachedBranches, setAttachedBranches] = useState<Branch[]>([]);
  const [attachedUsers, setAttachedUsers] = useState<User[]>([]);

  // Primary selections for display in cards
  const primaryOrganization = attachedOrganizations.length > 0 ? attachedOrganizations[0] : null;
  const primaryBranch = attachedBranches.length > 0 ? attachedBranches[0] : null;
  const primaryUser = attachedUsers.length > 0 ? attachedUsers[0] : null;

  // Mock Driven Users data
  const mockDrivenUsers: DrivenUser[] = [
    { 
      id: 1, 
      name: 'Jordan Murad', 
      role: 'OWNER',
      firstName: 'Jordan',
      lastName: 'Murad',
      email: 'jordan.murad@driven.com',
      phone: '+1 (555) 123-4567',
      username: 'jordan.murad',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '2 hours ago',
      joinDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Jared Murad', 
      role: 'TEAM CAPTAIN',
      firstName: 'Jared',
      lastName: 'Murad',
      email: 'jared.murad@driven.com',
      phone: '+1 (555) 234-5678',
      username: 'jared.murad',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '1 day ago',
      joinDate: '2023-03-20'
    },
    { 
      id: 3, 
      name: 'Tanner Raburn', 
      role: 'ADMIN',
      firstName: 'Tanner',
      lastName: 'Raburn',
      email: 'tanner.raburn@driven.com',
      phone: '+1 (555) 345-6789',
      username: 'tanner.raburn',
      active: true,
      twoFactorEnabled: false,
      lastLogin: '3 hours ago',
      joinDate: '2023-05-10'
    },
    { 
      id: 4, 
      name: 'Linda Hall', 
      role: 'EXECUTIVE BRANCH MANAGER',
      firstName: 'Linda',
      lastName: 'Hall',
      email: 'linda.hall@driven.com',
      phone: '+1 (555) 456-7890',
      username: 'linda.hall',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '5 minutes ago',
      joinDate: '2022-11-01'
    },
    { 
      id: 5, 
      name: 'Daniel Moran', 
      role: 'BRANCH MANAGER',
      firstName: 'Daniel',
      lastName: 'Moran',
      email: 'daniel.moran@driven.com',
      phone: '+1 (555) 567-8901',
      username: 'daniel.moran',
      active: false,
      twoFactorEnabled: true,
      lastLogin: '2 weeks ago',
      joinDate: '2022-12-15'
    },
    { 
      id: 6, 
      name: 'Sarah Johnson', 
      role: 'CSR UNIT LEADER',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@driven.com',
      phone: '+1 (555) 678-9012',
      username: 'sarah.johnson',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '1 hour ago',
      joinDate: '2023-06-01'
    },
    { 
      id: 7, 
      name: 'Michael Chen', 
      role: 'CSR MEMBER',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@driven.com',
      phone: '+1 (555) 789-0123',
      username: 'michael.chen',
      active: true,
      twoFactorEnabled: false,
      lastLogin: '30 minutes ago',
      joinDate: '2023-07-15'
    },
    { 
      id: 8, 
      name: 'Emily Rodriguez', 
      role: 'SALES UNIT LEADER',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@driven.com',
      phone: '+1 (555) 890-1234',
      username: 'emily.rodriguez',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '4 hours ago',
      joinDate: '2023-04-20'
    },
    { 
      id: 9, 
      name: 'David Kim', 
      role: 'SALES MEMBER',
      firstName: 'David',
      lastName: 'Kim',
      email: 'david.kim@driven.com',
      phone: '+1 (555) 901-2345',
      username: 'david.kim',
      active: true,
      twoFactorEnabled: false,
      lastLogin: '6 hours ago',
      joinDate: '2023-08-10'
    },
    { 
      id: 10, 
      name: 'Jessica Williams', 
      role: 'TECH UNIT LEADER',
      firstName: 'Jessica',
      lastName: 'Williams',
      email: 'jessica.williams@driven.com',
      phone: '+1 (555) 012-3456',
      username: 'jessica.williams',
      active: true,
      twoFactorEnabled: true,
      lastLogin: '2 hours ago',
      joinDate: '2023-02-28'
    },
    { 
      id: 11, 
      name: 'Robert Taylor', 
      role: 'TECH MEMBER',
      firstName: 'Robert',
      lastName: 'Taylor',
      email: 'robert.taylor@driven.com',
      phone: '+1 (555) 123-4567',
      username: 'robert.taylor',
      active: true,
      twoFactorEnabled: false,
      lastLogin: '1 day ago',
      joinDate: '2023-09-05'
    },
  ];

  // Filter users based on search input
  const filteredDrivenUsers = mockDrivenUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchInput.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearchInput.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchInput.toLowerCase()) ||
    user.username?.toLowerCase().includes(userSearchInput.toLowerCase())
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update search input when selected user changes
  useEffect(() => {
    if (selectedDrivenUser) {
      setUserSearchInput(selectedDrivenUser.name);
    } else {
      setUserSearchInput('');
    }
  }, [selectedDrivenUser]);

  // Determine which tabs a role can access
  const getAvailableTabsForRole = (role: string): Array<'user' | 'branch' | 'organization'> => {
    const normalizedRole = role.toUpperCase();
    
    // Tech, Sales, and CSR members only see User Access
    if (normalizedRole.includes('TECH MEMBER') || 
        normalizedRole.includes('SALES MEMBER') || 
        normalizedRole.includes('CSR MEMBER')) {
      return ['user'];
    }
    
    // Team Captain and Unit Leaders (CSR, Sales, Tech) only see User Access
    // They manage teams of members, so they have the same permissions as members
    if (normalizedRole === 'TEAM CAPTAIN' ||
        normalizedRole.includes('CSR UNIT LEADER') ||
        normalizedRole.includes('SALES UNIT LEADER') ||
        normalizedRole.includes('TECH UNIT LEADER')) {
      return ['user'];
    }
    
    // Branch Managers see Branch Access and User Access
    if (normalizedRole.includes('BRANCH MANAGER')) {
      return ['branch', 'user'];
    }
    
    // Owners and Admins see all three
    if (normalizedRole === 'OWNER' || normalizedRole === 'ADMIN') {
      return ['user', 'branch', 'organization'];
    }
    
    // Default: show all tabs (for other roles)
    return ['user', 'branch', 'organization'];
  };

  // Get available tabs for the selected user
  const availableTabs = selectedDrivenUser 
    ? getAvailableTabsForRole(selectedDrivenUser.role)
    : ['user', 'branch', 'organization'];

  // Ensure activeTab is valid for the selected user's role
  useEffect(() => {
    if (selectedDrivenUser && !availableTabs.includes(activeTab)) {
      // Set to the first available tab (which will be 'user' for restricted roles)
      setActiveTab(availableTabs[0] as 'organization' | 'branch' | 'user');
    }
  }, [selectedDrivenUser, availableTabs, activeTab]);

  // Handle user selection
  const handleUserSelect = (user: DrivenUser) => {
    setSelectedDrivenUser(user);
    setUserSearchInput(user.name);
    setIsDropdownOpen(false);
    // Reset when changing user
    setAttachedOrganizations([]);
    setAttachedBranches([]);
    setAttachedUsers([]);
    setSearchQuery('');
    
    // Set default tab based on role permissions
    const tabsForRole = getAvailableTabsForRole(user.role);
    setActiveTab(tabsForRole[0] as 'organization' | 'branch' | 'user');
  };

  // Mock Organizations data
  const mockOrganizations: Organization[] = [
    { id: 1, name: 'Cross Pest Control' },
    { id: 2, name: 'Green Lawn Services' },
    { id: 3, name: 'Metro Pest Solutions' },
  ];

  // Mock Branches data
  const mockBranches: Branch[] = [
    { id: 102, name: 'Main Branch', organization: 'Cross Pest Control', organizationId: 1 },
    { id: 103, name: 'Downtown Branch', organization: 'Cross Pest Control', organizationId: 1 },
    { id: 201, name: 'North Branch', organization: 'Green Lawn Services', organizationId: 2 },
  ];

  // Mock Users data
  const mockUsers: User[] = [
    { id: 26744, name: 'Jordan Murad', organization: 'Cross Pest Control', organizationId: 1 },
    { id: 26745, name: 'Tanner Raburn', organization: 'Cross Pest Control', organizationId: 1 },
    { id: 26746, name: 'Mary Fox', organization: 'Cross Pest Control', organizationId: 1 },
    { id: 26747, name: 'Jared M.', organization: 'Cross Pest Control', organizationId: 1 },
  ];

  // Primary Organization for filtering (access.org) - auto-set from attached access
  // This can come from Organization Access, Branch Access (via branch's org), or User Access (via user's org)
  const primaryOrganizationForFiltering = primaryOrganization || 
    (primaryBranch ? mockOrganizations.find(org => org.id === primaryBranch.organizationId) : null) ||
    (primaryUser ? mockOrganizations.find(org => org.id === primaryUser.organizationId) : null);

  // Filter organizations
  const filteredOrganizations = mockOrganizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter branches
  const filteredBranches = mockBranches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = !showSelectedOrgOnly || 
      (attachedOrganizations.length > 0 && 
       attachedOrganizations.some(org => org.id === branch.organizationId));
    return matchesSearch && matchesOrg;
  });

  // Filter users
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = !showSelectedOrgOnly || 
      (attachedOrganizations.length > 0 && 
       attachedOrganizations.some(org => org.id === user.organizationId));
    return matchesSearch && matchesOrg;
  });

  const handleAttachOrganization = (org: Organization) => {
    if (!attachedOrganizations.find(o => o.id === org.id)) {
      setAttachedOrganizations([...attachedOrganizations, org]);
    }
  };

  const handleAttachBranch = (branch: Branch) => {
    if (!attachedBranches.find(b => b.id === branch.id)) {
      setAttachedBranches([...attachedBranches, branch]);
    }
  };

  const handleAttachUser = (user: User) => {
    if (!attachedUsers.find(u => u.id === user.id)) {
      setAttachedUsers([...attachedUsers, user]);
    }
  };

  const handleRemoveOrganization = (orgId: number) => {
    setAttachedOrganizations(attachedOrganizations.filter(o => o.id !== orgId));
    // Also remove branches and users from this organization
    setAttachedBranches(attachedBranches.filter(b => b.organizationId !== orgId));
    setAttachedUsers(attachedUsers.filter(u => u.organizationId !== orgId));
  };

  const handleRemoveBranch = (branchId: number) => {
    setAttachedBranches(attachedBranches.filter(b => b.id !== branchId));
  };

  const handleRemoveUser = (userId: number) => {
    setAttachedUsers(attachedUsers.filter(u => u.id !== userId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Driven User Name Searchable Dropdown */}
      <div style={{ marginBottom: '0' }}>
        <label style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '6px',
          display: 'block'
        }}>
          Driven User Name
        </label>
        <div ref={dropdownRef} style={{ position: 'relative', maxWidth: '400px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: currentTheme.textSecondary,
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              value={userSearchInput}
              onChange={(e) => {
                setUserSearchInput(e.target.value);
                setIsDropdownOpen(true);
                if (!e.target.value) {
                  setSelectedDrivenUser(null);
                  setAttachedOrganizations([]);
                  setAttachedBranches([]);
                  setAttachedUsers([]);
                  setSearchQuery('');
                }
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search or select a user..."
              style={{
                width: '100%',
                padding: '12px 40px 12px 40px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.background,
                color: currentTheme.textPrimary,
                fontSize: '14px',
                outline: 'none',
                cursor: 'text'
              }}
            />
            {userSearchInput && (
              <button
                onClick={() => {
                  setUserSearchInput('');
                  setSelectedDrivenUser(null);
                  setIsDropdownOpen(false);
                  setAttachedOrganizations([]);
                  setAttachedBranches([]);
                  setAttachedUsers([]);
                  setSearchQuery('');
                }}
                style={{
                  position: 'absolute',
                  right: '32px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentTheme.textSecondary
                }}
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown 
              size={16} 
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: `translateY(-50%) rotate(${isDropdownOpen ? '180deg' : '0deg'})`,
                color: currentTheme.textSecondary,
                pointerEvents: 'none',
                transition: 'transform 0.2s ease'
              }}
            />
          </div>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              boxShadow: `0 4px 12px ${currentTheme.border}40`,
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {filteredDrivenUsers.length > 0 ? (
                filteredDrivenUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${currentTheme.border}`,
                      backgroundColor: selectedDrivenUser?.id === user.id 
                        ? currentTheme.primary + '10' 
                        : 'transparent',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDrivenUser?.id !== user.id) {
                        e.currentTarget.style.backgroundColor = currentTheme.background;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDrivenUser?.id !== user.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      fontWeight: selectedDrivenUser?.id === user.id ? '600' : '500',
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      marginBottom: '4px'
                    }}>
                      {user.name}
                    </div>
                    <div style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px'
                    }}>
                      {user.role} {user.email && `• ${user.email}`}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: currentTheme.textSecondary,
                  fontSize: '14px'
                }}>
                  No users found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Information Box - shown when user is selected */}
      {selectedDrivenUser && (
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          padding: '20px',
          border: `1px solid ${currentTheme.border}`,
          marginBottom: '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
            {/* User Avatar and Info */}
            <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
              {/* Avatar */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                backgroundColor: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px',
                flexShrink: 0
              }}>
                {selectedDrivenUser.firstName?.[0] || selectedDrivenUser.name[0]}
                {selectedDrivenUser.lastName?.[0] || selectedDrivenUser.name.split(' ')[1]?.[0] || ''}
              </div>

              {/* User Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <h3 style={{ 
                      color: currentTheme.textPrimary, 
                      fontSize: '20px', 
                      fontWeight: '600',
                    margin: 0
                  }}>
                    {selectedDrivenUser.name}
                  </h3>
                  {selectedDrivenUser.active !== undefined && (
                    selectedDrivenUser.active ? (
                      <CheckCircle style={{ color: currentTheme.success, width: '18px', height: '18px' }} />
                    ) : (
                      <XCircle style={{ color: currentTheme.danger, width: '18px', height: '18px' }} />
                    )
                  )}
                  {selectedDrivenUser.active !== undefined && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: selectedDrivenUser.active 
                        ? currentTheme.success + '20' 
                        : currentTheme.danger + '20',
                      color: selectedDrivenUser.active 
                        ? currentTheme.success 
                        : currentTheme.danger
                    }}>
                      {selectedDrivenUser.active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                  {selectedDrivenUser.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} style={{ color: currentTheme.textSecondary }} />
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        {selectedDrivenUser.email}
                      </span>
                    </div>
                  )}
                  {selectedDrivenUser.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} style={{ color: currentTheme.textSecondary }} />
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        {selectedDrivenUser.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px', alignItems: 'center' }}>
                  {selectedDrivenUser.username && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Username:</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '12px', fontWeight: '500' }}>
                        @{selectedDrivenUser.username}
                      </span>
                    </div>
                  )}
                  {/* Role - Prominent Display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Role:</span>
                    <span style={{ 
                      color: currentTheme.primary, 
                      fontSize: '18px', 
                      fontWeight: '700',
                      letterSpacing: '0.5px'
                    }}>
                      {selectedDrivenUser.role}
                    </span>
                  </div>
                  {selectedDrivenUser.lastLogin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Last Login:</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '12px', fontWeight: '500' }}>
                        {selectedDrivenUser.lastLogin}
                      </span>
                    </div>
                  )}
                  {selectedDrivenUser.joinDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '12px' }}>Joined:</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '12px', fontWeight: '500' }}>
                        {selectedDrivenUser.joinDate}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2FA Status */}
                {selectedDrivenUser.twoFactorEnabled !== undefined && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedDrivenUser.twoFactorEnabled ? (
                      <ShieldCheck size={16} style={{ color: currentTheme.success }} />
                    ) : (
                      <Shield size={16} style={{ color: currentTheme.warning }} />
                    )}
                    <span style={{
                      fontSize: '12px',
                      color: selectedDrivenUser.twoFactorEnabled 
                        ? currentTheme.success 
                        : currentTheme.warning,
                      fontWeight: '500'
                    }}>
                      Two-Factor Authentication: {selectedDrivenUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate(`/user-management/${selectedDrivenUser.id}/edit`)}
              style={{
                backgroundColor: currentTheme.primary,
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                height: 'fit-content',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Edit3 size={16} />
              Edit User
            </button>
            </div>
          </div>
        )}

        {/* Instructions when no user selected */}
        {!selectedDrivenUser && (
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '32px',
            border: `1px solid ${currentTheme.border}`,
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: currentTheme.textPrimary, 
              fontSize: '20px', 
              fontWeight: '600',
              margin: '0 0 12px 0'
            }}>
              Select a User to Manage Access
            </h3>
            <p style={{ 
              color: currentTheme.textSecondary, 
              fontSize: '14px',
              margin: '0 0 24px 0',
              lineHeight: '1.6'
            }}>
              Please select a user from the dropdown above to configure their access permissions. 
              You can set user access, branch access, and organization access once a user is selected.
            </p>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: currentTheme.primary,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  1
                </div>
                <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
                  Choose a user from the "Driven User Name" dropdown
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: currentTheme.primary,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  2
                </div>
                <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
                  Configure their access permissions using the tabs below
                </p>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: currentTheme.primary,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  3
                </div>
                <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
                  Click On Attach to Configure User Access, Branch Access, and Organization Access. 
                  Click on Cross sign to remove Access
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Primary Organization Component */}
      {selectedDrivenUser && (
        <div style={{
          backgroundColor: primaryOrganizationForFiltering 
            ? (currentTheme.success + '15') 
            : (currentTheme.danger + '10'),
          border: `1px solid ${primaryOrganizationForFiltering 
            ? (currentTheme.success + '40') 
            : (currentTheme.danger + '40')}`,
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: '600', 
                color: currentTheme.textPrimary, 
                fontSize: '14px',
                marginBottom: '6px'
              }}>
                Primary Organization (access.org):
              </div>
              
              {primaryOrganizationForFiltering ? (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <Check size={14} style={{ color: currentTheme.success }} />
                    <span style={{ 
                      fontSize: '13px', 
                      color: currentTheme.success,
                      fontStyle: 'italic',
                      fontWeight: '500'
                    }}>
                      Auto-set from User/Branch/Organization Access
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: currentTheme.textSecondary,
                    marginTop: '4px'
                  }}>
                    This field is automatically set when you assign access below. It's used for filtering and queries.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <AlertTriangle size={14} style={{ color: currentTheme.danger }} />
                    <span style={{ 
                      fontSize: '13px', 
                      color: currentTheme.danger,
                      fontStyle: 'italic'
                    }}>
                      Not set - will cause issues on organization lists
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: currentTheme.textSecondary,
                    marginTop: '4px'
                  }}>
                    This field is automatically set when you assign access below. It's used for filtering and queries.
                  </div>
                </>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {primaryOrganizationForFiltering ? (
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: currentTheme.success
                }}>
                  {primaryOrganizationForFiltering.name} (#{primaryOrganizationForFiltering.id})
                </div>
              ) : (
                <>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: currentTheme.danger,
                    textTransform: 'uppercase'
                  }}>
                    NOT SET
                  </div>
                  <button
                    onClick={() => {
                      // Navigate to the first available tab based on role
                      const tabsForRole = selectedDrivenUser 
                        ? getAvailableTabsForRole(selectedDrivenUser.role)
                        : ['user', 'branch', 'organization'];
                      setActiveTab(tabsForRole[0] as 'organization' | 'branch' | 'user');
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      backgroundColor: currentTheme.warning,
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Fix Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Content */}
      {selectedDrivenUser && (
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          border: `1px solid ${currentTheme.border}`,
          overflow: 'hidden'
        }}>
          {/* Access Cards Section */}
          <div style={{
            display: 'flex',
            gap: '16px',
            padding: '20px',
            backgroundColor: currentTheme.background,
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            {/* User Access Card - Always visible */}
            {availableTabs.includes('user') && (
              <div style={{
                flex: 1,
                backgroundColor: currentTheme.cardBg,
                borderRadius: '8px',
                padding: '16px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 12px 0'
                }}>
                  User Access
                </h4>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: currentTheme.background,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {primaryUser ? `${primaryUser.name} – ${primaryUser.organization} (#${primaryUser.id})` : '—'}
                </div>
              </div>
            )}

            {/* Branch Access Card - Only for Branch Managers and above */}
            {availableTabs.includes('branch') && (
              <div style={{
                flex: 1,
                backgroundColor: currentTheme.cardBg,
                borderRadius: '8px',
                padding: '16px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 12px 0'
                }}>
                  Branch Access
                </h4>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: currentTheme.background,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {primaryBranch ? `${primaryBranch.name} – ${primaryBranch.organization} (#${primaryBranch.id})` : '—'}
                </div>
              </div>
            )}

            {/* Organization Access Card - Only for Owners/Admins */}
            {availableTabs.includes('organization') && (
              <div style={{
                flex: 1,
                backgroundColor: currentTheme.cardBg,
                borderRadius: '8px',
                padding: '16px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 12px 0'
                }}>
                  Organization Access
                </h4>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: currentTheme.background,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '6px',
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {primaryOrganization ? `${primaryOrganization.name} (#${primaryOrganization.id})` : '—'}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${currentTheme.border}`,
            backgroundColor: currentTheme.background
          }}>
            {[
              { id: 'user', label: 'User Access', icon: UsersIcon },
              { id: 'branch', label: 'Branch Access', icon: LinkIcon },
              { id: 'organization', label: 'Organization Access', icon: Building2 },
            ]
            .filter(tab => availableTabs.includes(tab.id as 'user' | 'branch' | 'organization'))
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as 'organization' | 'branch' | 'user');
                    setSearchQuery('');
                  }}
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isActive ? currentTheme.primary : currentTheme.textSecondary,
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderBottom: isActive ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {/* Available Items Section */}
            <div>
              {/* Search and Filter */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '16px',
                alignItems: 'center'
              }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search 
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: currentTheme.textSecondary
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Checkbox for Branch/User tabs */}
                {(activeTab === 'branch' || activeTab === 'user') && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}>
                    <input
                      type="checkbox"
                      checked={showSelectedOrgOnly}
                      onChange={(e) => setShowSelectedOrgOnly(e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    {activeTab === 'branch' ? "Show Selected Org's Branch Only" : "Show Selected Org's User Only"}
                  </label>
                )}
              </div>

              {/* Table */}
              <div style={{
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: currentTheme.background,
                      borderBottom: `2px solid ${currentTheme.border}`
                    }}>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: currentTheme.textSecondary,
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        ID
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: currentTheme.textSecondary,
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {activeTab === 'organization' ? 'ORGANIZATION NAME' : activeTab === 'branch' ? 'NAME' : 'USER NAME'}
                      </th>
                      {(activeTab === 'branch' || activeTab === 'user') && (
                        <th style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          color: currentTheme.textSecondary,
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          ORGANIZATION
                        </th>
                      )}
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: currentTheme.textSecondary,
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === 'organization' && (
                      filteredOrganizations.length > 0 ? (
                        filteredOrganizations.map((org) => (
                          <tr 
                            key={org.id}
                            style={{
                              borderBottom: `1px solid ${currentTheme.border}`,
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {org.id}
                            </td>
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {org.name}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <button
                                onClick={() => handleAttachOrganization(org)}
                                disabled={attachedOrganizations.some(o => o.id === org.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: attachedOrganizations.some(o => o.id === org.id) 
                                    ? currentTheme.textSecondary 
                                    : currentTheme.primary,
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: attachedOrganizations.some(o => o.id === org.id) ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  opacity: attachedOrganizations.some(o => o.id === org.id) ? 0.5 : 1
                                }}
                              >
                                Attach
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ color: currentTheme.textSecondary }}>
                              <Building2 size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>No data available</h3>
                              <p style={{ margin: 0, fontSize: '14px' }}>
                                There is currently no data to display in this table.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )
                    )}

                    {activeTab === 'branch' && (
                      filteredBranches.length > 0 ? (
                        filteredBranches.map((branch) => (
                          <tr 
                            key={branch.id}
                            style={{
                              borderBottom: `1px solid ${currentTheme.border}`,
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {branch.id}
                            </td>
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {branch.name}
                            </td>
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {branch.organizationId} - {branch.organization}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <button
                                onClick={() => handleAttachBranch(branch)}
                                disabled={attachedBranches.some(b => b.id === branch.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: attachedBranches.some(b => b.id === branch.id) 
                                    ? currentTheme.textSecondary 
                                    : currentTheme.primary,
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: attachedBranches.some(b => b.id === branch.id) ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  opacity: attachedBranches.some(b => b.id === branch.id) ? 0.5 : 1
                                }}
                              >
                                Attach
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ color: currentTheme.textSecondary }}>
                              <LinkIcon size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>No data available</h3>
                              <p style={{ margin: 0, fontSize: '14px' }}>
                                There is currently no data to display in this table.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )
                    )}

                    {activeTab === 'user' && (
                      filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr 
                            key={user.id}
                            style={{
                              borderBottom: `1px solid ${currentTheme.border}`,
                              transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {user.id}
                            </td>
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {user.name}
                            </td>
                            <td style={{ padding: '12px 16px', color: currentTheme.textPrimary }}>
                              {user.organizationId} - {user.organization}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <button
                                onClick={() => handleAttachUser(user)}
                                disabled={attachedUsers.some(u => u.id === user.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: attachedUsers.some(u => u.id === user.id) 
                                    ? currentTheme.textSecondary 
                                    : currentTheme.primary,
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: attachedUsers.some(u => u.id === user.id) ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  opacity: attachedUsers.some(u => u.id === user.id) ? 0.5 : 1
                                }}
                              >
                                Attach
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '48px', textAlign: 'center' }}>
                            <div style={{ color: currentTheme.textSecondary }}>
                              <UsersIcon size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>No data available</h3>
                              <p style={{ margin: 0, fontSize: '14px' }}>
                                There is currently no data to display in this table.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
