import { useState, useEffect } from 'react';
import { useTheme } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { getNavigationForRole, getRoleDisplayName } from '../utils/roleBasedNavigation';
import { ThemeSelector } from './ThemeSelector';
import { DrivenLogo } from './DrivenLogo';
import { DrivenBrandLogo } from './DrivenBrandLogo';
import { 
  Moon, 
  Sun, 
  BarChart3, 
  Users, 
  DollarSign, 
  Bell,
  Search,
  ArrowUpRight,
  Target,
  Bug,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Star,
  MessageSquare,
  Phone,
  Navigation,
  Link,
  Database,
  Gauge,
  AlertCircle,
  CheckCircle,
  XCircle,
  Palette
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// TypeScript Interfaces
interface User {
  name: string;
  role: 'Owner' | 'Manager' | 'Technician' | 'Admin';
  email: string;
  status: 'active' | 'inactive';
  permissions: string[];
  avatar?: string;
  company?: string;
  location?: string;
  plan?: string;
}

interface Integration {
  name: string;
  status: 'connected' | 'pending' | 'disconnected';
  lastSync: string;
  type: 'CRM' | 'GPS' | 'Reviews' | 'Phone';
  icon: LucideIcon;
}


interface NavigationItem {
  id: string;
  icon: LucideIcon;
  text: string;
  description: string;
  badge?: string;
}


type ViewType = 'dashboard' | 'integrations' | 'metrics' | 'users' | 'reviews' | 'settings';

const DrivenPestControlDashboard: React.FC = () => {
  // Theme system
  const { theme, currentTheme, toggleTheme } = useTheme();
  
  // Auth system
  const { user, logout } = useAuth();
  
  // State with proper typing
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeNavItem, setActiveNavItem] = useState<ViewType>('dashboard');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);

  // Get role-based navigation
  const navigationItems = user?.role ? getNavigationForRole(user.role) : [];
  const userDisplayRole = user?.role ? getRoleDisplayName(user.role) : 'User';

  // Sample data with proper typing
  const ownerMetrics = {
    totalRevenue: '$847,250',
    monthlyGrowth: '+15.3%',
    activeCustomers: '2,847',
    customerRetention: '94.2%',
    avgTicketSize: '$298',
    profitMargin: '32.1%'
  };


  const integrations: Integration[] = [
    { name: 'ServiceTitan CRM', status: 'connected', lastSync: '2 min ago', type: 'CRM', icon: Database },
    { name: 'Google Reviews', status: 'connected', lastSync: '5 min ago', type: 'Reviews', icon: Star },
    { name: 'Route4Me GPS', status: 'connected', lastSync: '1 min ago', type: 'GPS', icon: Navigation },
    { name: 'CallRail Phone', status: 'connected', lastSync: '3 min ago', type: 'Phone', icon: Phone },
    { name: 'PestPac CRM', status: 'pending', lastSync: 'Never', type: 'CRM', icon: Database },
    { name: 'Yelp Reviews', status: 'disconnected', lastSync: '2 days ago', type: 'Reviews', icon: MessageSquare }
  ];


  // Event handlers with proper typing
  const handleNavClick = (itemId: ViewType): void => {
    setActiveNavItem(itemId);
    setCurrentView(itemId);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleToggleTheme = (): void => {
    setIsTransitioning(true);
    setTimeout(() => {
      toggleTheme();
      setTimeout(() => setIsTransitioning(false), 400);
    }, 200);
  };

  const handleLogout = (): void => {
    setIsProfileOpen(false);
    logout();
  };

  const handleEditProfile = (): void => {
    setIsProfileOpen(false);
    alert('Edit profile functionality would be implemented here');
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (isProfileOpen && !(event.target as Element).closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Component interfaces
  interface MetricCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: LucideIcon;
    subtitle?: string;
  }

  interface IntegrationCardProps {
    integration: Integration;
  }


  // Components with proper typing
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
            {userDisplayRole}
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
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: '0 0 4px 0' }}>{currentUser.role}</p>
              <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>{currentUser.email}</p>
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
                {currentUser.plan} Plan
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
              onClick={handleEditProfile}
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

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon, subtitle }) => (
    <div 
      style={{ 
        backgroundColor: currentTheme.cardBg,
        border: `2px solid ${currentTheme.border}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
      className="metric-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: currentTheme.textSecondary, fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
            {title}
          </p>
          <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
              {subtitle}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowUpRight 
              style={{ 
                width: '16px', 
                height: '16px', 
                marginRight: '4px',
                color: changeType === 'positive' ? '#10B981' : '#EF4444'
              }} 
            />
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: changeType === 'positive' ? '#10B981' : '#EF4444'
            }}>
              {change}
            </span>
            <span style={{ color: currentTheme.textSecondary, fontSize: '14px', marginLeft: '4px' }}>
              vs last month
            </span>
          </div>
        </div>
        <div 
          style={{ 
            backgroundColor: `${currentTheme.primary}26`,
            padding: '16px',
            borderRadius: '16px'
          }}
        >
          <Icon style={{ color: currentTheme.primary, width: '28px', height: '28px' }} />
        </div>
      </div>
    </div>
  );

  const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
    const getStatusColor = (status: Integration['status']): string => {
      switch (status) {
        case 'connected': return currentTheme.success;
        case 'pending': return currentTheme.warning;
        case 'disconnected': return currentTheme.danger;
        default: return currentTheme.textSecondary;
      }
    };

    const getStatusIcon = (status: Integration['status']): LucideIcon => {
      switch (status) {
        case 'connected': return CheckCircle;
        case 'pending': return AlertCircle;
        case 'disconnected': return XCircle;
        default: return AlertCircle;
      }
    };

    const StatusIcon = getStatusIcon(integration.status);

    return (
      <div 
        style={{ 
          backgroundColor: currentTheme.cardBg,
          border: `2px solid ${currentTheme.border}`,
          borderRadius: '16px',
          padding: '24px',
          transition: 'all 0.3s ease'
        }}
        className="integration-card"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{ 
                backgroundColor: `${currentTheme.primary}26`,
                padding: '8px',
                borderRadius: '8px'
              }}
            >
              <integration.icon style={{ color: currentTheme.primary, width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 style={{ color: currentTheme.textPrimary, fontWeight: '600', margin: 0, fontSize: '16px' }}>
                {integration.name}
              </h3>
              <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                {integration.type}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusIcon style={{ color: getStatusColor(integration.status), width: '16px', height: '16px' }} />
            <span 
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: `${getStatusColor(integration.status)}33`,
                color: getStatusColor(integration.status)
              }}
            >
              {integration.status}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
            Last sync: {integration.lastSync}
          </span>
          <button 
            style={{ 
              color: currentTheme.primary,
              fontSize: '14px',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Configure
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      style={{ 
        backgroundColor: currentTheme.background,
        minHeight: '100vh',
        transition: 'all 0.7s ease',
        opacity: isTransitioning ? 0.5 : 1
      }}
    >
      {/* Sidebar */}
      <div 
        style={{ 
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width: '256px',
          backgroundColor: currentTheme.sidebarBg,
          borderRight: `1px solid ${currentTheme.border}`,
          transition: 'all 0.7s ease'
        }}
      >
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
              <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0, fontWeight: '500' }}>CRM Analytics Platform</p>
            </div>
          </div>
        </div>

        <nav style={{ marginTop: '32px', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                className={`nav-item ${isActive ? 'active' : ''}`}
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
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '256px', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <h1 style={{ color: currentTheme.textPrimary, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {currentView === 'dashboard' && 'Analytics Hub'}
                {currentView === 'integrations' && 'Data Integrations'}
                {currentView === 'metrics' && 'Metrics Dashboard'}
                {currentView === 'users' && 'User Management'}
                {currentView === 'reviews' && 'Review Analytics'}
                {currentView === 'settings' && 'System Settings'}
              </h1>
              <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
                {currentView === 'dashboard' && 'Unified business intelligence and analytics'}
                {currentView === 'integrations' && 'Connect your CRM, GPS, and review platforms'}
                {currentView === 'metrics' && 'Performance analytics across all business levels'}
                {currentView === 'users' && 'Manage staff access and permissions'}
                {currentView === 'reviews' && 'Monitor and respond to customer feedback'}
                {currentView === 'settings' && 'Configure system preferences and integrations'}
              </p>
            </div>
            
            {/* Subtle Driven Logo Badge */}
            <div style={{
              backgroundColor: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <DrivenBrandLogo height={24} />
              <span style={{ 
                color: currentTheme.textSecondary, 
                fontSize: '12px', 
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                POWERED BY
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ 
                color: currentTheme.textSecondary, 
                position: 'absolute', 
                left: '16px', 
                top: '16px', 
                width: '20px', 
                height: '20px' 
              }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ 
                  backgroundColor: theme === 'light' ? currentTheme.sand : currentTheme.cardBg,
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '16px',
                  paddingLeft: '48px',
                  paddingRight: '24px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  width: '256px',
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            
            <button 
              style={{ 
                backgroundColor: theme === 'light' ? currentTheme.sand : currentTheme.cardBg,
                border: `2px solid ${currentTheme.border}`,
                borderRadius: '16px',
                padding: '12px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.3s ease'
              }}
              className="notification-btn"
            >
              <Bell style={{ color: currentTheme.textSecondary, width: '24px', height: '24px' }} />
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>3</span>
              </div>
            </button>
            
            <ProfileDropdown />
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          transition: 'all 0.5s ease',
          opacity: isTransitioning ? 0.5 : 1,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
        }}>
          
          {/* Analytics Hub */}
          {currentView === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Owner Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <MetricCard 
                  title="Total Revenue" 
                  value={ownerMetrics.totalRevenue}
                  change={ownerMetrics.monthlyGrowth}
                  changeType="positive" 
                  icon={DollarSign}
                  subtitle="All branches combined"
                />
                <MetricCard 
                  title="Active Customers" 
                  value={ownerMetrics.activeCustomers}
                  change="+8.2%"
                  changeType="positive" 
                  icon={Users}
                  subtitle="Retention rate: 94.2%"
                />
                <MetricCard 
                  title="Avg Ticket Size" 
                  value={ownerMetrics.avgTicketSize}
                  change="+5.7%"
                  changeType="positive" 
                  icon={Target}
                  subtitle="Profit margin: 32.1%"
                />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div 
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `2px solid ${currentTheme.border}`,
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <h3 style={{ color: currentTheme.textPrimary, fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
                    Revenue Trend (6 Months)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { month: 'Jan', revenue: 145000 },
                      { month: 'Feb', revenue: 152000 },
                      { month: 'Mar', revenue: 148000 },
                      { month: 'Apr', revenue: 161000 },
                      { month: 'May', revenue: 158000 },
                      { month: 'Jun', revenue: 167000 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
                      <XAxis dataKey="month" stroke={currentTheme.textSecondary} />
                      <YAxis stroke={currentTheme.textSecondary} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke={currentTheme.primary} 
                        fill={currentTheme.primary} 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div 
                  style={{ 
                    backgroundColor: currentTheme.cardBg,
                    border: `2px solid ${currentTheme.border}`,
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <h3 style={{ color: currentTheme.textPrimary, fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
                    Service Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Residential', value: 65, color: currentTheme.primary },
                          { name: 'Commercial', value: 25, color: currentTheme.secondary },
                          { name: 'Emergency', value: 10, color: currentTheme.warning }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {[
                          { name: 'Residential', value: 65, color: currentTheme.primary },
                          { name: 'Commercial', value: 25, color: currentTheme.secondary },
                          { name: 'Emergency', value: 10, color: currentTheme.warning }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Branded Welcome Section */}
              <div style={{
                backgroundColor: `linear-gradient(135deg, ${currentTheme.primary}15 0%, ${currentTheme.accent}10 100%)`,
                border: `2px solid ${currentTheme.border}`,
                borderRadius: '24px',
                padding: '32px',
                textAlign: 'center',
                marginTop: '24px'
              }}>
                <DrivenBrandLogo height={48} style={{ marginBottom: '16px' }} />
                <h3 style={{ 
                  color: currentTheme.textPrimary, 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  margin: '0 0 12px 0' 
                }}>
                  Welcome to Driven Analytics
                </h3>
                <p style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: '16px', 
                  margin: 0,
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Powerful business intelligence and CRM analytics platform designed to drive your success. 
                  Monitor performance, track metrics, and make data-driven decisions with confidence.
                </p>
              </div>
            </div>
          )}

          {/* Integrations */}
          {currentView === 'integrations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    Connected Integrations
                  </h2>
                  <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
                    Manage your CRM, GPS tracking, phone systems, and review platforms
                  </p>
                </div>
                <button 
                  style={{ 
                    backgroundColor: currentTheme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'transform 0.3s ease'
                  }}
                  className="add-integration-btn"
                >
                  <Plus style={{ width: '20px', height: '20px' }} />
                  <span>Add Integration</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                {integrations.map((integration, index) => (
                  <IntegrationCard key={index} integration={integration} />
                ))}
              </div>
            </div>
          )}

          {/* Add other views here following the same pattern */}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .profile-button:hover .profile-avatar {
          transform: scale(1.1);
        }
        
        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .integration-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .nav-item:hover {
          transform: scale(1.05) !important;
        }
        
        .nav-item.active {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .theme-toggle-btn:hover,
        .edit-profile-btn:hover,
        .add-integration-btn:hover,
        .notification-btn:hover {
          transform: scale(1.05);
        }
        
        .logout-btn:hover {
          transform: scale(1.05);
          background-color: #FEE2E2 !important;
        }
      `}</style>

      {/* Theme Selector Modal */}
      <ThemeSelector 
        isOpen={isThemeSelectorOpen} 
        onClose={() => setIsThemeSelectorOpen(false)} 
      />
    </div>
  );
};

export default DrivenPestControlDashboard;