import { useState, useEffect } from 'react';
import { useTheme } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { ThemeSelector } from './ThemeSelector';
import { DrivenBrandLogo } from './DrivenBrandLogo';
import OrganizationManager from './OrganizationManager';
import { 
  Moon, 
  Sun, 
  BarChart3, 
  Users, 
  Building2,
  Search,
  ArrowUpRight,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Database,
  Shield,
  Activity,
  CreditCard,
  FileText,
  Globe,
  Palette,
  UserCheck,
  Building,
  Zap
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

type ViewType = 'dashboard' | 'organizations' | 'manage-organization' | 'driven-users' | 'settings';

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

  // Company Admin Navigation
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', icon: BarChart3, text: 'Dashboard', description: 'Platform Overview' },
    { id: 'organizations', icon: Building2, text: 'Organizations', description: 'Manage Client Organizations', badge: '847' },
    { id: 'driven-users', icon: Users, text: 'Driven Users', description: 'Platform User Management', badge: '12.4k' },
    { id: 'settings', icon: Settings, text: 'Settings', description: 'Platform Configuration' }
  ];

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

  const handleLogout = () => {
    logout();
  };

  const handleLoginAs = (organizationName: string, organizationId: number) => {
    // TODO: Implement organization impersonation logic
    // This would typically:
    // 1. Save current admin session
    // 2. Create new session as the organization
    // 3. Redirect to the organization's dashboard view
    console.log(`Logging in as organization: ${organizationName} (ID: ${organizationId})`);
    
    // For now, show a confirmation
    if (window.confirm(`Login as "${organizationName}"?\n\nThis will switch your view to see the system as this organization.`)) {
      // Here you would implement the actual impersonation logic
      alert(`Successfully logged in as ${organizationName}!\n\n(This is a demo - actual impersonation logic would be implemented here)`);
    }
  };

  // Components
  const ProfileDropdown: React.FC = () => (
    <div className="profile-dropdown" style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px',
          borderRadius: '16px',
          backgroundColor: isProfileOpen ? `${currentTheme.primary}33` : 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        className="profile-button"
      >
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: currentTheme.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'transform 0.3s ease'
          }}
          className="profile-avatar"
        >
          {user?.avatar || user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
        </div>
        <div style={{ textAlign: 'left', display: window.innerWidth >= 1024 ? 'block' : 'none' }}>
          <p style={{ color: currentTheme.textPrimary, fontWeight: '600', fontSize: '14px', margin: 0 }}>
            {user?.name}
          </p>
          <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: 0 }}>
            {user?.role}
          </p>
        </div>
        <ChevronDown 
          style={{ 
            color: currentTheme.textSecondary, 
            width: '16px', 
            height: '16px',
            transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }} 
        />
      </button>
      
      {isProfileOpen && (
        <div 
          style={{ 
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '8px',
            width: '320px',
            backgroundColor: currentTheme.cardBg,
            border: `2px solid ${currentTheme.border}`,
            borderRadius: '16px',
            padding: '24px',
            zIndex: 50,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px', 
            paddingBottom: '16px',
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: currentTheme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px'
              }}
            >
              {user?.avatar || user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: currentTheme.textPrimary, fontWeight: 'bold', fontSize: '18px', margin: '0 0 4px 0' }}>
                {user?.name}
              </h3>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: '0 0 4px 0' }}>{user?.role}</p>
              <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>{user?.email}</p>
              <span 
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: `${currentTheme.primary}33`,
                  color: currentTheme.primary
                }}
              >
                Platform Admin
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: `${currentTheme.primary}1A`,
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              className="theme-toggle-btn"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {theme === 'light' ? (
                  <Moon style={{ color: currentTheme.primary, width: '20px', height: '20px' }} />
                ) : (
                  <Sun style={{ color: '#F59E0B', width: '20px', height: '20px' }} />
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
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: `${currentTheme.primary}1A`,
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              className="theme-selector-btn"
            >
              <Palette style={{ color: currentTheme.primary, width: '20px', height: '20px' }} />
              <span style={{ fontWeight: '500' }}>Choose Theme</span>
            </button>
            
            <button 
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: `${currentTheme.primary}1A`,
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              className="edit-profile-btn"
            >
              <Settings style={{ color: currentTheme.primary, width: '20px', height: '20px' }} />
              <span style={{ fontWeight: '500' }}>Edit Profile</span>
            </button>
            
            <button 
              onClick={handleLogout}
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#FEF2F2',
                color: currentTheme.danger,
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              className="logout-btn"
            >
              <LogOut style={{ width: '20px', height: '20px' }} />
              <span style={{ fontWeight: '500' }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  Organizations
                </h2>
                <button
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  + Add Organization
                </button>
              </div>
              
              {/* Table Container */}
              <div style={{ minWidth: '600px' }}>
                {/* Organizations Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 2fr 100px 200px',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontWeight: '600',
                  fontSize: '14px',
                  color: currentTheme.textSecondary
                }}>
                <div>ID</div>
                <div>Name</div>
                <div>Active</div>
                <div>Actions</div>
              </div>

              {/* Sample Organizations Data */}
              {[
                { name: 'Cross Pest Control', active: true },
                { name: 'White Knight', active: true },
                { name: 'Pest-Stop', active: false },
                { name: 'ACTION Termite & Pest Control', active: true },
                { name: 'Thorn Pest Solutions', active: true },
                { name: 'Pest Master', active: true },
                { name: 'Trads Pest Control', active: false },
                { name: 'Kanga Pest Control', active: true },
                { name: 'Cape Pest Control', active: true }
              ].map((org, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 2fr 100px 200px',
                  gap: '16px',
                  padding: '20px 0',
                  borderBottom: `1px solid ${currentTheme.border}`,
                  alignItems: 'center'
                }}>
                  <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>
                    {index + 1}
                  </div>
                  <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>
                    {org.name}
                  </div>
                  <div>
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
                      onClick={() => setCurrentView('manage-organization')}
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
                      onClick={() => handleLoginAs(org.name, index + 1)}
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
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.textPrimary,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Load More Organizations
                </button>
              </div>
              </div>
            </div>
          </div>
        );

      case 'manage-organization':
        return <OrganizationManager onBack={() => setCurrentView('organizations')} />;

      case 'driven-users':
        return (
          <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Driven Users List */}
            <div style={{
              backgroundColor: currentTheme.cardBg,
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${currentTheme.border}`,
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '20px', fontWeight: '600' }}>
                  Driven Users
                </h2>
                <button
                  style={{
                    backgroundColor: currentTheme.primary,
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  + Add User
                </button>
              </div>
              
              {/* Table Container */}
              <div style={{ minWidth: '700px' }}>
                {/* Users Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontWeight: '600',
                  fontSize: '14px',
                  color: currentTheme.textSecondary
                }}>
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Sample Users Data */}
              {[
                { name: 'John Smith', email: 'john@driven.com', role: 'Admin', active: true },
                { name: 'Sarah Johnson', email: 'sarah@driven.com', role: 'Manager', active: true },
                { name: 'Mike Wilson', email: 'mike@driven.com', role: 'Support', active: false },
                { name: 'Lisa Brown', email: 'lisa@driven.com', role: 'Admin', active: true },
                { name: 'David Lee', email: 'david@driven.com', role: 'Analyst', active: true }
              ].map((user, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                  gap: '16px',
                  padding: '20px 0',
                  borderBottom: `1px solid ${currentTheme.border}`,
                  alignItems: 'center'
                }}>
                  <div style={{ color: currentTheme.textPrimary, fontWeight: '500' }}>
                    {user.name}
                  </div>
                  <div style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                    {user.email}
                  </div>
                  <div style={{ color: currentTheme.textPrimary }}>
                    {user.role}
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: user.active ? currentTheme.success + '20' : currentTheme.danger + '20',
                      color: user.active ? currentTheme.success : currentTheme.danger
                    }}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <button
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${currentTheme.border}`,
                        color: currentTheme.textPrimary,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.textPrimary,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Load More Users
                </button>
              </div>
              </div>
            </div>
          </div>
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
                      // Edit profile functionality - placeholder for now
                      alert('Edit Profile functionality would be implemented here');
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
