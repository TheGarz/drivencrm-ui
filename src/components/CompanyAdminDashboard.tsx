import React, { useState } from 'react';
import { useTheme } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { ThemeSelector } from './ThemeSelector';
import { DrivenBrandLogo } from './DrivenBrandLogo';
import OrganizationManager from './OrganizationManager';
import AddNewOrganization from './AddNewOrganization';
import AddDrivenUser from './AddDrivenUser';
import UserProfileEdit from './UserProfileEdit';
import { 
  Moon, 
  Sun, 
  BarChart3, 
  Users, 
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  CreditCard,
  Palette,
  UserCheck,
  Search,
  Plus,
  Shield,
  Edit3,
  Mail,
  Phone,
  Filter,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// TypeScript Interfaces
interface NavigationItem {
  id: string;
  icon: LucideIcon;
  text: string;
  description: string;
  badge?: string;
}

type ViewType = 'dashboard' | 'organizations' | 'manage-organization' | 'add-organization' | 'driven-users' | 'edit-user' | 'add-driven-user' | 'profile' | 'settings';

const CompanyAdminDashboard: React.FC = () => {
  // Theme system
  const { theme, currentTheme, toggleTheme } = useTheme();
  
  // Auth system
  const { user, logout } = useAuth();
  
  // State
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeNavItem, setActiveNavItem] = useState<ViewType>('dashboard');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);
  
  // Organizations page state
  const [orgSearchQuery, setOrgSearchQuery] = useState<string>('');
  const [displayedOrgs, setDisplayedOrgs] = useState<number>(10);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
  
  // Driven Users page state
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [displayedUsers, setDisplayedUsers] = useState<number>(10);
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showInactiveWarning, setShowInactiveWarning] = useState<boolean>(false);
  const [userAccountActive, setUserAccountActive] = useState<boolean>(true);
  const [userTwoFactorEnabled, setUserTwoFactorEnabled] = useState<boolean>(true);

  // Company Admin Navigation
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', icon: BarChart3, text: 'Dashboard', description: 'Platform Overview' },
    { id: 'organizations', icon: Building2, text: 'Organizations', description: 'Manage Client Organizations' },
    { id: 'driven-users', icon: Users, text: 'Driven Users', description: 'Platform User Management' },
    { id: 'settings', icon: Settings, text: 'Settings', description: 'Platform Configuration' }
  ];

  // Driven Users mock data
  const mockDrivenUsers = [
    { 
      id: 1, 
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Smith',
      username: 'jsmith',
      email: 'john.smith@driven.com', 
      active: true, 
      lastLogin: '01/20/2024 2:45 PM',
      phone: '+1 (555) 123-4567',
      joinDate: '03/15/2023',
      twoFactorEnabled: true
    },
    { 
      id: 2, 
      firstName: 'Sarah',
      middleName: 'Anne',
      lastName: 'Johnson',
      username: 'sjohnson',
      email: 'sarah.johnson@driven.com', 
      active: true, 
      lastLogin: '01/19/2024 11:30 AM',
      phone: '+1 (555) 234-5678',
      joinDate: '01/22/2023',
      twoFactorEnabled: true
    },
    { 
      id: 3, 
      firstName: 'Mike',
      middleName: '',
      lastName: 'Wilson',
      username: 'mwilson',
      email: 'mike.wilson@driven.com', 
      active: false, 
      lastLogin: '01/10/2024 9:15 AM',
      phone: '+1 (555) 345-6789',
      joinDate: '08/03/2023',
      twoFactorEnabled: false
    },
    { 
      id: 4, 
      firstName: 'Lisa',
      middleName: 'Marie',
      lastName: 'Brown',
      username: 'lbrown',
      email: 'lisa.brown@driven.com', 
      active: true, 
      lastLogin: '01/20/2024 4:22 PM',
      phone: '+1 (555) 456-7890',
      joinDate: '05/12/2023',
      twoFactorEnabled: true
    },
    { 
      id: 5, 
      firstName: 'David',
      middleName: 'James',
      lastName: 'Lee',
      username: 'dlee',
      email: 'david.lee@driven.com', 
      active: true, 
      lastLogin: '01/19/2024 8:45 AM',
      phone: '+1 (555) 567-8901',
      joinDate: '06/28/2023',
      twoFactorEnabled: false
    },
    { 
      id: 6, 
      firstName: 'Emily',
      middleName: '',
      lastName: 'Chen',
      username: 'echen',
      email: 'emily.chen@driven.com', 
      active: true, 
      lastLogin: '01/20/2024 1:10 PM',
      phone: '+1 (555) 678-9012',
      joinDate: '04/07/2023',
      twoFactorEnabled: true
    },
    { 
      id: 7, 
      firstName: 'Robert',
      middleName: 'William',
      lastName: 'Taylor',
      username: 'rtaylor',
      email: 'robert.taylor@driven.com', 
      active: true, 
      lastLogin: '01/18/2024 10:33 AM',
      phone: '+1 (555) 789-0123',
      joinDate: '02/14/2023',
      twoFactorEnabled: false
    },
    { 
      id: 8, 
      firstName: 'Jennifer',
      middleName: 'Lynn',
      lastName: 'Davis',
      username: 'jdavis',
      email: 'jennifer.davis@driven.com', 
      active: false, 
      lastLogin: '01/05/2024 3:28 PM',
      phone: '+1 (555) 890-1234',
      joinDate: '07/19/2023',
      twoFactorEnabled: true
    }
  ];

  // Organizations mock data
  const mockOrganizations = [
    { id: 1, name: 'Cross Pest Control', active: true, userCount: 47, branchCount: 3, integrationCount: 5, reviewsEnabled: true, rewardsEnabled: true },
    { id: 2, name: 'White Knight', active: true, userCount: 23, branchCount: 2, integrationCount: 3, reviewsEnabled: false, rewardsEnabled: true },
    { id: 3, name: 'Pest-Stop', active: false, userCount: 8, branchCount: 1, integrationCount: 1, reviewsEnabled: false, rewardsEnabled: false },
    { id: 4, name: 'ACTION Termite & Pest Control', active: true, userCount: 156, branchCount: 8, integrationCount: 7, reviewsEnabled: true, rewardsEnabled: false },
    { id: 5, name: 'Thorn Pest Solutions', active: true, userCount: 34, branchCount: 2, integrationCount: 4, reviewsEnabled: true, rewardsEnabled: true },
    { id: 6, name: 'Pest Master', active: true, userCount: 67, branchCount: 4, integrationCount: 6, reviewsEnabled: false, rewardsEnabled: true },
    { id: 7, name: 'Trads Pest Control', active: false, userCount: 12, branchCount: 1, integrationCount: 2, reviewsEnabled: false, rewardsEnabled: false },
    { id: 8, name: 'Kanga Pest Control', active: true, userCount: 89, branchCount: 5, integrationCount: 5, reviewsEnabled: true, rewardsEnabled: false },
    { id: 9, name: 'Cape Pest Control', active: true, userCount: 45, branchCount: 3, integrationCount: 4, reviewsEnabled: false, rewardsEnabled: true },
    { id: 10, name: 'Elite Pest Solutions', active: true, userCount: 78, branchCount: 4, integrationCount: 6, reviewsEnabled: true, rewardsEnabled: true },
    { id: 11, name: 'Guardian Pest Control', active: false, userCount: 15, branchCount: 1, integrationCount: 1, reviewsEnabled: false, rewardsEnabled: false },
    { id: 12, name: 'ProShield Exterminating', active: true, userCount: 123, branchCount: 6, integrationCount: 8, reviewsEnabled: true, rewardsEnabled: true },
    { id: 13, name: 'Apex Pest Management', active: true, userCount: 56, branchCount: 3, integrationCount: 5, reviewsEnabled: false, rewardsEnabled: false },
    { id: 14, name: 'SafeGuard Pest Control', active: true, userCount: 91, branchCount: 5, integrationCount: 7, reviewsEnabled: true, rewardsEnabled: true },
    { id: 15, name: 'Premier Pest Services', active: false, userCount: 22, branchCount: 2, integrationCount: 2, reviewsEnabled: false, rewardsEnabled: false },
    { id: 16, name: 'BugBusters Inc', active: true, userCount: 38, branchCount: 2, integrationCount: 3, reviewsEnabled: true, rewardsEnabled: false },
    { id: 17, name: 'Termite Shield Solutions', active: true, userCount: 72, branchCount: 4, integrationCount: 6, reviewsEnabled: false, rewardsEnabled: true },
    { id: 18, name: 'EcoSafe Pest Control', active: true, userCount: 29, branchCount: 2, integrationCount: 4, reviewsEnabled: true, rewardsEnabled: true }
  ];

  // Filter organizations based on search query
  const filteredOrganizations = mockOrganizations.filter(org => 
    org.name.toLowerCase().includes(orgSearchQuery.toLowerCase())
  );

  // Get visible organizations based on display count
  const visibleOrganizations = filteredOrganizations.slice(0, displayedOrgs);

  // Load more handler
  const handleLoadMoreOrgs = () => {
    setDisplayedOrgs(prev => prev + 10);
  };

  // Filter driven users based on search and filters
  const filteredUsers = mockDrivenUsers.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesStatus = userStatusFilter === 'all' || 
                         (userStatusFilter === 'active' && user.active) ||
                         (userStatusFilter === 'inactive' && !user.active);
    
    return matchesSearch && matchesStatus;
  });

  // Get visible users based on display count
  const visibleUsers = filteredUsers.slice(0, displayedUsers);

  // Load more users handler
  const handleLoadMoreUsers = () => {
    setDisplayedUsers(prev => prev + 10);
  };

  // Reset pagination when search changes
  React.useEffect(() => {
    setDisplayedOrgs(10);
  }, [orgSearchQuery]);

  // Reset user pagination when filters change
  React.useEffect(() => {
    setDisplayedUsers(10);
  }, [userSearchQuery, userStatusFilter]);

  // Handle edit user
  const handleEditUser = (user: any) => {
    console.log('Edit user clicked:', user);
    setSelectedUserId(user.id);
    setUserAccountActive(user.active); // Initialize with user's current status
    setUserTwoFactorEnabled(user.twoFactorEnabled); // Initialize with user's current 2FA status
    setIsTransitioning(true);
    setActiveNavItem('edit-user');
    
    setTimeout(() => {
      setCurrentView('edit-user');
      setIsTransitioning(false);
    }, 300);
  };

  // Handle save edited user
  const handleSaveEditedUser = (updatedUser: any) => {
    // In a real app, this would make an API call
    console.log('Saving updated user:', updatedUser);
    
    // Navigate back to users list
    setSelectedUserId(null);
    setIsTransitioning(true);
    setActiveNavItem('driven-users');
    
    setTimeout(() => {
      setCurrentView('driven-users');
      setIsTransitioning(false);
    }, 300);
    
    // Show success message
    alert(`User "${updatedUser.firstName} ${updatedUser.lastName}" updated successfully!`);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setSelectedUserId(null);
    setIsTransitioning(true);
    setActiveNavItem('driven-users');
    
    setTimeout(() => {
      setCurrentView('driven-users');
      setIsTransitioning(false);
    }, 300);
  };
  
  // Handle reset password
  const handleResetPassword = (user: any) => {
    // In a real app, this would make an API call to send reset email
    console.log('Sending password reset email to:', user.email);
    
    // Show success message
    alert(`Password reset email sent to ${user.email}!\n\nThe user will receive instructions to reset their password.`);
  };

  // Handle account status toggle with warning
  const handleAccountStatusToggle = () => {
    if (userAccountActive) {
      // User is trying to deactivate account, show warning
      setShowInactiveWarning(true);
    } else {
      // User is activating account, no warning needed
      setUserAccountActive(true);
    }
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = () => {
    setUserTwoFactorEnabled(!userTwoFactorEnabled);
  };

  // Handle add driven user
  const handleAddDrivenUser = () => {
    setIsTransitioning(true);
    setActiveNavItem('add-driven-user');
    
    setTimeout(() => {
      setCurrentView('add-driven-user');
      setIsTransitioning(false);
    }, 300);
  };

  // Handle save driven user
  const handleSaveDrivenUser = async (userData: any) => {
    try {
      // In a real app, this would make an API call to create the user
      console.log('Creating new Driven user:', userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to driven users list
      setIsTransitioning(true);
      setActiveNavItem('driven-users');
      
      setTimeout(() => {
        setCurrentView('driven-users');
        setIsTransitioning(false);
      }, 300);
      
      // Show success message
      alert(`Driven employee "${userData.firstName} ${userData.lastName}" created successfully!\n\nA welcome email with login instructions will be sent to ${userData.email}`);
    } catch (error) {
      console.error('Error creating driven user:', error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  // Handle save user profile
  const handleSaveUserProfile = async (userData: any) => {
    try {
      // In a real app, this would make an API call to update the user profile
      console.log('Updating user profile:', userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to dashboard
      setIsTransitioning(true);
      setActiveNavItem('dashboard');
      
      setTimeout(() => {
        setCurrentView('dashboard');
        setIsTransitioning(false);
      }, 300);
      
      // Show success message (in real app, use proper notification system)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Confirm account deactivation
  const confirmAccountDeactivation = () => {
    setUserAccountActive(false);
    setShowInactiveWarning(false);
    console.log('Account deactivated for user:', selectedUserId);
  };

  // Cancel account deactivation
  const cancelAccountDeactivation = () => {
    setShowInactiveWarning(false);
    // Keep the checkbox checked since user cancelled
  };

  // Sample platform metrics
  const platformMetrics = {
    totalOrganizations: '847',
    totalUsers: '12,437',
    monthlyRevenue: '$2,847,250',
    activeIntegrations: '156',
    systemUptime: '99.9%',
    supportTickets: '23'
  };

  // Sample chart data
  const organizationGrowthData = [
    { month: 'Jan', organizations: 720, users: 9800 },
    { month: 'Feb', organizations: 745, users: 10200 },
    { month: 'Mar', organizations: 768, users: 10800 },
    { month: 'Apr', organizations: 792, users: 11400 },
    { month: 'May', organizations: 815, users: 11900 },
    { month: 'Jun', organizations: 847, users: 12437 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2420000 },
    { month: 'Feb', revenue: 2580000 },
    { month: 'Mar', revenue: 2650000 },
    { month: 'Apr', revenue: 2720000 },
    { month: 'May', revenue: 2780000 },
    { month: 'Jun', revenue: 2847250 }
  ];

  // Handle navigation
  const handleNavClick = (viewType: ViewType) => {
    if (viewType === currentView) {
return;
}
    
    setIsTransitioning(true);
    setActiveNavItem(viewType);
    
    setTimeout(() => {
      setCurrentView(viewType);
      setIsTransitioning(false);
    }, 300);
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  // Handle saving new organization
  const handleSaveNewOrganization = async (orgData: any) => {
    try {
      // Log the data for debugging
      console.log('Creating new organization:', orgData);

      // Here you would typically make API calls to create the organization
      // For now, we'll simulate the save process
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add to mock data (in a real app, this would be handled by the backend)
      const newOrg = {
        id: mockOrganizations.length + 1,
        name: orgData.name,
        active: orgData.active,
        userCount: 0,
        branchCount: 0,
        integrationCount: 0,
        reviewsEnabled: false,
        rewardsEnabled: false
      };

      // In a real app, you'd refresh the data from the server
      console.log('Organization created successfully:', newOrg);
      
      // Navigate to the new organization's management page
      setSelectedOrganizationId(newOrg.id);
      setCurrentView('manage-organization');
      
      // Show success message (in a real app, you might use a toast notification)
      alert(`Organization "${orgData.name}" created successfully! You are now viewing its management page.`);
      
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new Error('Failed to create organization. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleLoginAs = (organizationName: string, organizationId: number) => {
    // TODO: Implement organization impersonation logic
    // This would typically:
    // 1. Save current admin session
    // 2. Create new session as the organization
    // 3. Redirect to the organization's dashboard view
    // Logging in as organization
    
    // For now, show a confirmation
    if (window.confirm(`Login as "${organizationName}"?\n\nThis will switch your view to see the system as this organization.`)) {
      // Here you would implement the actual impersonation logic
      alert(`Successfully logged in as ${organizationName}!\n\n(This is a demo - actual impersonation logic would be implemented here)`);
    }
  };


  // Render main content based on current view
  const renderMainContent = () => {
    const contentStyle = {
      opacity: isTransitioning ? 0 : 1,
      transform: isTransitioning ? 'translateY(20px)' : 'translateY(0px)',
      transition: 'all 0.3s ease'
    };

    switch (currentView) {
      case 'dashboard':
        return (
          <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Platform Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Building2 style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
                  <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    Active Organizations
                  </h3>
                </div>
                <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {platformMetrics.totalOrganizations}
                </p>
                <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                  +12 this month
                </p>
              </div>

              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <Users style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
                  <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    Platform Users
                  </h3>
                </div>
                <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {platformMetrics.totalUsers}
                </p>
                <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                  +537 this month
                </p>
              </div>

              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <CreditCard style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
                  <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
                    Monthly Revenue
                  </h3>
                </div>
                <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {platformMetrics.monthlyRevenue}
                </p>
                <p style={{ color: currentTheme.success, fontSize: '14px', margin: 0 }}>
                  +15.3% vs last month
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px'
            }}>
              {/* Company Growth Chart */}
              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
                  Platform Growth
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={organizationGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
                    <XAxis dataKey="month" stroke={currentTheme.textSecondary} />
                    <YAxis stroke={currentTheme.textSecondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: currentTheme.cardBg,
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="organizations" 
                      stroke={currentTheme.primary} 
                      fill={currentTheme.primary + '20'} 
                      strokeWidth={2}
                      name="Organizations"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Chart */}
              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
                  Monthly Revenue
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
                    <XAxis dataKey="month" stroke={currentTheme.textSecondary} />
                    <YAxis stroke={currentTheme.textSecondary} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: currentTheme.cardBg,
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill={currentTheme.success}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* System Status */}
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
                System Status
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: currentTheme.success
                  }} />
                  <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
                    Uptime: {platformMetrics.systemUptime}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: currentTheme.warning
                  }} />
                  <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
                    Open Tickets: {platformMetrics.supportTickets}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: currentTheme.success
                  }} />
                  <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
                    Integrations: {platformMetrics.activeIntegrations} active
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'organizations':
        return (
          <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Organizations List */}
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${currentTheme.border}`,
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  Organizations ({filteredOrganizations.length})
                </h2>
                <button
                  onClick={() => setCurrentView('add-organization')}
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Plus size={16} />
                  Add Organization
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <Search size={16} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: currentTheme.textSecondary
                }} />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={orgSearchQuery}
                  onChange={(e) => setOrgSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
              
              {/* Table Container */}
              <div style={{ minWidth: '600px' }}>
                {/* Organizations Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 2fr 80px 80px 80px 80px 80px 100px 200px',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontWeight: '600',
                  fontSize: '14px',
                  color: currentTheme.textSecondary
                }}>
                <div>ID</div>
                <div>Name</div>
                <div style={{ textAlign: 'center' }}>Users</div>
                <div style={{ textAlign: 'center' }}>Branches</div>
                <div style={{ textAlign: 'center' }}>Integrations</div>
                <div style={{ textAlign: 'center' }}>Reviews</div>
                <div style={{ textAlign: 'center' }}>Rewards</div>
                <div style={{ textAlign: 'center' }}>Status</div>
                <div>Actions</div>
              </div>

              {/* Organizations Data */}
              {visibleOrganizations.map((org) => (
                <div key={org.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 2fr 80px 80px 80px 80px 80px 100px 200px',
                  gap: '16px',
                  padding: '20px 0',
                  borderBottom: `1px solid ${currentTheme.border}`,
                  alignItems: 'center'
                }}>
                  <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>
                    {org.id}
                  </div>
                  <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>
                    {org.name}
                  </div>
                  <div style={{ 
                    color: currentTheme.textPrimary, 
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}>
                    {org.userCount}
                  </div>
                  <div style={{ 
                    color: currentTheme.textPrimary, 
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}>
                    {org.branchCount}
                  </div>
                  <div style={{ 
                    color: currentTheme.textPrimary, 
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: '16px'
                  }}>
                    {org.integrationCount}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: org.reviewsEnabled ? currentTheme.success + '20' : currentTheme.danger + '20',
                      color: org.reviewsEnabled ? currentTheme.success : currentTheme.danger
                    }}>
                      {org.reviewsEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: org.rewardsEnabled ? currentTheme.success + '20' : currentTheme.danger + '20',
                      color: org.rewardsEnabled ? currentTheme.success : currentTheme.danger
                    }}>
                      {org.rewardsEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: org.active ? currentTheme.success + '20' : currentTheme.danger + '20',
                      color: org.active ? currentTheme.success : currentTheme.danger
                    }}>
                      {org.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setSelectedOrganizationId(org.id);
                        setCurrentView('manage-organization');
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${currentTheme.border}`,
                        color: currentTheme.textPrimary,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.primary;
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = currentTheme.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = currentTheme.textPrimary;
                        e.currentTarget.style.borderColor = currentTheme.border;
                      }}
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleLoginAs(org.name, org.id)}
                      style={{
                        backgroundColor: currentTheme.primary,
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.primary;
                      }}
                    >
                      Login As
                    </button>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {filteredOrganizations.length > visibleOrganizations.length && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '24px',
                  borderTop: `1px solid ${currentTheme.border}`
                }}>
                  <button
                    onClick={handleLoadMoreOrgs}
                    style={{
                      padding: orgSearchQuery.trim() ? '8px 16px' : '12px 24px',
                      backgroundColor: orgSearchQuery.trim() ? 'transparent' : currentTheme.primary + '10',
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
                      minWidth: orgSearchQuery.trim() ? 'auto' : '200px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentTheme.primary;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.primary}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = orgSearchQuery.trim() ? 'transparent' : currentTheme.primary + '10';
                      e.currentTarget.style.color = currentTheme.primary;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Plus size={16} />
                    {orgSearchQuery.trim() 
                      ? `Show More (${filteredOrganizations.length - visibleOrganizations.length} remaining)`
                      : `Load More Organizations (${filteredOrganizations.length - visibleOrganizations.length} remaining)`
                    }
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        );

      case 'manage-organization':
        return <OrganizationManager 
          onBack={() => setCurrentView('organizations')} 
          organizationId={selectedOrganizationId}
        />;

      case 'add-organization':
        return <AddNewOrganization 
          onBack={() => setCurrentView('organizations')}
          onSave={handleSaveNewOrganization}
        />;

      case 'driven-users':
        return (
          <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Driven Users Management */}
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${currentTheme.border}`,
              overflow: 'auto'
            }}>
              {/* Header */}
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
                  onClick={handleAddDrivenUser}
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

              {/* Quick Stats */}
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

              {/* Search and Filters */}
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
              
              {/* Enhanced Table Container */}
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
                      <div style={{ color: currentTheme.textPrimary, fontWeight: '600', fontSize: '15px' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={{ color: currentTheme.textSecondary, fontSize: '13px', marginTop: '2px' }}>
                        ID: {user.id} • Joined {user.joinDate}
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <Mail size={14} style={{ color: currentTheme.textSecondary }} />
                        <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>{user.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} style={{ color: currentTheme.textSecondary }} />
                        <span style={{ color: currentTheme.textSecondary, fontSize: '13px' }}>{user.phone}</span>
                      </div>
                    </div>
                    
                    {/* Last Login */}
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>
                        {user.lastLogin}
                      </div>
                    </div>
                    
                    {/* 2FA Status */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {user.twoFactorEnabled ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={16} style={{ color: currentTheme.success }} />
                          <span style={{
                            color: currentTheme.success,
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            Enabled
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Shield size={16} style={{ color: currentTheme.danger }} />
                          <span style={{
                            color: currentTheme.danger,
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            Disabled
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Status */}
                    <div>
                      <span style={{
                        padding: '6px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: user.active ? currentTheme.success + '20' : currentTheme.danger + '20',
                        color: user.active ? currentTheme.success : currentTheme.danger
                      }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        title="Edit User"
                        onClick={() => handleEditUser(user)}
                        style={{
                          backgroundColor: 'transparent',
                          border: `1px solid ${currentTheme.border}`,
                          color: currentTheme.textPrimary,
                          padding: '8px 16px',
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
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = currentTheme.textPrimary;
                          e.currentTarget.style.borderColor = currentTheme.border;
                        }}
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}

                {/* Enhanced Load More Button */}
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
                        transition: 'all 0.2s ease',
                        minWidth: '200px',
                        justifyContent: 'center'
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
                      Load More ({filteredUsers.length - visibleUsers.length} remaining)
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );

      case 'edit-user':
        const userToEdit = mockDrivenUsers.find(user => user.id === selectedUserId);
        if (!userToEdit) {
          // If user not found, go back to users list
          setCurrentView('driven-users');
          return null;
        }
        
        return (
          <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Edit User Page */}
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '32px',
              border: `1px solid ${currentTheme.border}`
            }}>
              {/* Header with Back Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button
                  onClick={handleCancelEdit}
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
                    gap: '8px'
                  }}
                >
                  ← Back to Users
                </button>
                <div>
                  <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '24px', fontWeight: '600' }}>
                    Edit User: {userToEdit.firstName} {userToEdit.lastName}
                  </h2>
                  <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '16px' }}>
                    Update user information and settings
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
                    User ID: {userToEdit.id} • Joined: {userToEdit.joinDate}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: userToEdit.active ? currentTheme.success + '20' : currentTheme.danger + '20',
                      color: userToEdit.active ? currentTheme.success : currentTheme.danger
                    }}>
                      {userToEdit.active ? 'Active' : 'Inactive'}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: userToEdit.twoFactorEnabled ? currentTheme.success + '20' : currentTheme.danger + '20',
                      color: userToEdit.twoFactorEnabled ? currentTheme.success : currentTheme.danger
                    }}>
                      2FA {userToEdit.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Personal Information Section */}
                <div>
                  <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
                    Personal Information
                  </h3>
                  
                  {/* Name Fields Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  
                  {/* First Name Field */}
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

                  {/* Middle Name Field */}
                  <div>
                    <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                      Middle Name
                    </label>
                    <input
                      type="text"
                      defaultValue={userToEdit.middleName}
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

                  {/* Last Name Field */}
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
                
                {/* Contact Information Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  {/* Username Field */}
                  <div>
                    <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                      Username *
                    </label>
                    <input
                      type="text"
                      defaultValue={userToEdit.username}
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

                  {/* Email Field */}
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

                  {/* Phone Field */}
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

                {/* Account Settings Section */}
                <div>
                  <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
                    Account Settings
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                    {/* Status Section */}
                  <div style={{
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    backgroundColor: currentTheme.background
                  }}>
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
                          {userAccountActive 
                            ? 'Full Admin Access' 
                            : 'Access Restricted'
                          }
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
                        onClick={handleAccountStatusToggle}
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
                    <div style={{
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    backgroundColor: currentTheme.background
                  }}>
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
                      border: `1px solid ${userTwoFactorEnabled ? currentTheme.success : currentTheme.warning}20`,
                      borderRadius: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          color: currentTheme.textPrimary, 
                          fontSize: '14px', 
                          fontWeight: '500',
                          margin: '0 0 4px 0'
                        }}>
                          {userTwoFactorEnabled 
                            ? 'Enhanced Security Active' 
                            : 'Basic Security Only'
                          }
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
                        onClick={handleTwoFactorToggle}
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
                          onClick={() => handleResetPassword(userToEdit)}
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
                  </div>
                  
                  {/* Last Login Info - Full Width */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: currentTheme.background,
                    borderRadius: '12px',
                    border: `1px solid ${currentTheme.border}`,
                    marginTop: '16px',
                    gridColumn: '1 / -1'
                  }}>
                    <h4 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                      Last Login Activity
                    </h4>
                    <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
                      {userToEdit.lastLogin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '32px', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: '12px 24px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: currentTheme.textPrimary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEditedUser(userToEdit)}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: currentTheme.primary,
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
        );

      case 'add-driven-user':
        return (
          <AddDrivenUser 
            onBack={() => {
              setIsTransitioning(true);
              setActiveNavItem('driven-users');
              setTimeout(() => {
                setCurrentView('driven-users');
                setIsTransitioning(false);
              }, 300);
            }}
            onSave={handleSaveDrivenUser}
          />
        );

      case 'profile':
        return (
          <UserProfileEdit 
            onBack={() => {
              setIsTransitioning(true);
              setActiveNavItem('dashboard');
              setTimeout(() => {
                setCurrentView('dashboard');
                setIsTransitioning(false);
              }, 300);
            }}
            onSave={handleSaveUserProfile}
          />
        );

      default:
        return (
          <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '48px',
              border: `1px solid ${currentTheme.border}`,
              textAlign: 'center'
            }}>
              <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 16px 0' }}>
                {navigationItems.find(item => item.id === currentView)?.text}
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
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: currentTheme.background,
      color: currentTheme.textPrimary
    }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: '256px',
        backgroundColor: currentTheme.sidebarBg,
        borderRight: `1px solid ${currentTheme.border}`,
        transition: 'all 0.7s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <DrivenBrandLogo 
              variant="square"
              height={56}
              style={{
                filter: 'brightness(0) invert(1)', // Make it white for dark sidebar
              }}
            />
            <div>
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: '500' }}>Platform Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ 
          marginTop: '32px', 
          padding: '0 16px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {navigationItems.map((item) => {
            const isActive = activeNavItem === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewType)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                  padding: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive ? currentTheme.primary : 'transparent',
                  color: isActive ? 'white' : '#CBD5E1',
                  transform: isActive ? 'translateX(4px)' : 'translateX(0px)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon style={{ width: '24px', height: '24px' }} />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontWeight: '600', display: 'block', fontSize: '14px' }}>{item.text}</span>
                    <span style={{ fontSize: '12px', opacity: 0.75 }}>{item.description}</span>
                  </div>
                </div>
                
                {item.badge && (
                  <span 
                    style={{
                      padding: '4px 8px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: isActive 
                        ? 'white' 
                        : item.badge === 'New' || item.badge === 'Live'
                          ? '#10B981'
                          : '#475569',
                      color: isActive 
                        ? '#1E293B' 
                        : item.badge === 'New' || item.badge === 'Live'
                          ? 'white'
                          : '#CBD5E1'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Section at Bottom */}
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${currentTheme.border}`,
          marginTop: 'auto'
        }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: isProfileOpen ? `${currentTheme.primary}15` : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: currentTheme.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  flexShrink: 0
                }}
              >
                {user?.avatar || user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: '500', margin: 0 }}>{user?.name}</p>
                <p style={{ color: '#94A3B8', fontSize: '12px', margin: 0 }}>{user?.role}</p>
              </div>
              <ChevronDown 
                style={{ 
                  color: '#94A3B8', 
                  width: '16px', 
                  height: '16px',
                  transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  flexShrink: 0
                }} 
              />
            </button>
            
            {isProfileOpen && (
              <div 
                style={{ 
                  position: 'absolute',
                  left: '-8px',
                  right: '-8px',
                  bottom: '100%',
                  marginBottom: '8px',
                  backgroundColor: currentTheme.cardBg,
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '16px',
                  padding: '20px',
                  zIndex: 50,
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  maxWidth: '240px',
                  width: 'calc(100% + 16px)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginBottom: '20px', 
                  paddingBottom: '16px',
                  borderBottom: `1px solid ${currentTheme.border}`
                }}>
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: currentTheme.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    {user?.avatar || user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                  <div>
                    <h3 style={{ color: currentTheme.textPrimary, fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' }}>
                      {user?.name}
                    </h3>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '13px', margin: '0 0 4px 0' }}>{user?.role}</p>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '11px', margin: '0 0 8px 0' }}>{user?.email}</p>
                    <span 
                      style={{
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '600',
                        backgroundColor: `${currentTheme.primary}33`,
                        color: currentTheme.primary
                      }}
                    >
                      Platform Admin
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button 
                    onClick={() => {
                      setIsTransitioning(true);
                      setActiveNavItem('profile');
                      setIsProfileOpen(false);
                      
                      setTimeout(() => {
                        setCurrentView('profile');
                        setIsTransitioning(false);
                      }, 300);
                    }}
                    style={{ 
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: `${currentTheme.primary}1A`,
                      color: currentTheme.textPrimary,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.primary}33`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.primary}1A`;
                    }}
                  >
                    <UserCheck style={{ color: currentTheme.primary, width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: '500' }}>Edit Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleToggleTheme();
                      setIsProfileOpen(false);
                    }}
                    style={{ 
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: `${currentTheme.primary}1A`,
                      color: currentTheme.textPrimary,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.primary}33`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.primary}1A`;
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {theme === 'light' ? (
                        <Moon style={{ color: currentTheme.primary, width: '18px', height: '18px' }} />
                      ) : (
                        <Sun style={{ color: '#F59E0B', width: '18px', height: '18px' }} />
                      )}
                      <span style={{ fontWeight: '500' }}>
                        Switch to {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
                      </span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setIsThemeSelectorOpen(true);
                      setIsProfileOpen(false);
                    }}
                    style={{ 
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: `${currentTheme.primary}1A`,
                      color: currentTheme.textPrimary,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.primary}33`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.primary}1A`;
                    }}
                  >
                    <Palette style={{ color: currentTheme.primary, width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: '500' }}>Choose Theme</span>
                  </button>
                  
                  <button 
                    style={{ 
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: `${currentTheme.danger}1A`,
                      color: currentTheme.danger,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease'
                    }}
                    onClick={handleLogout}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.danger}33`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                      e.currentTarget.style.backgroundColor = `${currentTheme.danger}1A`;
                    }}
                  >
                    <LogOut style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: '500' }}>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: '256px', 
        padding: currentView === 'manage-organization' ? '16px 32px 32px 32px' : '32px' 
      }}>
        {/* Header - Hidden for manage-organization view since it has its own header */}
        {currentView !== 'manage-organization' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div>
                <h1 style={{ color: currentTheme.textPrimary, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {currentView === 'dashboard' && 'Platform Dashboard'}
                  {currentView === 'organizations' && 'Organizations Management'}
                  {currentView === 'driven-users' && 'Driven Users Management'}
                  {currentView === 'settings' && 'Platform Settings'}
                </h1>
                <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
                  {currentView === 'dashboard' && 'Comprehensive platform overview and analytics'}
                  {currentView === 'organizations' && 'Manage client organizations and configurations'}
                  {currentView === 'driven-users' && 'Platform user access and permissions'}
                  {currentView === 'settings' && 'Configure platform-wide settings and preferences'}
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
        )}

        {/* Content Area */}
        <div>
          {renderMainContent()}
        </div>
      </div>

      {/* Account Deactivation Warning Dialog */}
      {showInactiveWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }} onClick={() => setShowInactiveWarning(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: currentTheme.background,
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '480px',
              width: '90%',
              border: `1px solid ${currentTheme.border}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: `${currentTheme.warning}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle style={{ width: '24px', height: '24px', color: currentTheme.warning }} />
              </div>
              <div>
                <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  Deactivate User Account
                </h3>
                <p style={{ color: currentTheme.textSecondary, margin: '4px 0 0 0', fontSize: '14px' }}>
                  This action will restrict user access
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div style={{ 
              padding: '20px', 
              backgroundColor: `${currentTheme.warning}10`, 
              border: `1px solid ${currentTheme.warning}30`,
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p style={{ 
                color: currentTheme.textPrimary, 
                fontSize: '14px', 
                lineHeight: '1.5',
                margin: 0 
              }}>
                <strong>Warning:</strong> Making this account inactive will prevent the user from accessing the admin panel. 
                The user will be logged out of all active sessions and will not be able to sign in until the account is reactivated.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelAccountDeactivation}
                style={{
                  padding: '12px 24px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentTheme.textSecondary}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.background;
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

      {/* Theme Selector */}
      {isThemeSelectorOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }} onClick={() => setIsThemeSelectorOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ThemeSelector isOpen={isThemeSelectorOpen} onClose={() => setIsThemeSelectorOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAdminDashboard;
