import { useState, useEffect } from 'react';
import { useTheme } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { getNavigationForRole, getRoleDisplayName } from '../utils/roleBasedNavigation';
import { ThemeSelector } from './ThemeSelector';
import { DrivenLogo } from './DrivenLogo';
import { IntegrationsView } from './IntegrationsView';
import { 
  Moon, 
  Sun, 
  BarChart3, 
  Users, 
  DollarSign, 
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
  Palette,
  Gift,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Globe,
  X,
  TrendingUp,
  Pencil,
  Truck
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MetricsTab from './OrganizationManager/tabs/MetricsTab';
import UsersTab from './OrganizationManager/tabs/UsersTab';
import AddNewUser from './AddNewUser';
import UserProfileEdit from './UserProfileEdit';
import type { Organization } from './OrganizationManager/types';

// Import ServiceResource type from IntegrationsView
type ServiceResource = {
  uid: string;
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'needs_setup';
  last_sync?: string;
  config?: Record<string, any>;
  configured?: boolean;
  config_status?: 'complete' | 'incomplete' | 'testing' | 'failed';
};

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




interface NavigationItem {
  id: string;
  icon: LucideIcon;
  text: string;
  description: string;
  badge?: string;
}


type ViewType = 'dashboard' | 'analytics' | 'metrics' | 'integrations' | 'users' | 'reviews' | 'rewards' | 'profile';

const OrganizationDashboard: React.FC = () => {
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
  
  // Integrations state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showIntegrationModal, setShowIntegrationModal] = useState<boolean>(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<{uid: string, name: string} | null>(null);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [selectedServiceForConfig, setSelectedServiceForConfig] = useState<any>(null);
  const [showCrmDeleteModal, setShowCrmDeleteModal] = useState<boolean>(false);
  const [crmIntegrationToDelete, setCrmIntegrationToDelete] = useState<{uid: string, name: string} | null>(null);
  const [crmDeleteConfirmed, setCrmDeleteConfirmed] = useState<boolean>(false);
  const [crmDeleteText, setCrmDeleteText] = useState<string>('');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

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


  // Organization state - starts empty to show CRM warning
  const [organization, setOrganization] = useState<Organization>({
    id: 1,
    name: 'Cross Pest Control',
    active: true,
    sync_limit: 100,
    pay_period: 'monthly',
    pay_start: '2024-01-01',
    created_at: '2024-01-01',
    last_sync: '2024-01-01',
    total_users: 8,
    total_branches: 1,
    monthly_revenue: 85420,
    integration_count: 0,
    services: [],
    users: [
      { id: 1, name: 'John Smith', email: 'john@crosspest.com', role: 'Owner', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'John Smith', memberSince: '2024-01-01' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'Sarah Johnson', memberSince: '2024-07-20' },
      { id: 3, name: 'Mike Wilson', email: 'mike@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-09-10' },
      { id: 4, name: 'Lisa Brown', email: 'lisa@crosspest.com', role: 'CSR', status: 'Inactive', lastLogin: '2024-01-10', connectedCrmUser: null, closedOn: '2024-12-15' },
      { id: 5, name: 'David Garcia', email: 'david@crosspest.com', role: 'Tech', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'David Garcia', memberSince: '2024-06-15' },
      { id: 6, name: 'Emily Chen', email: 'emily@crosspest.com', role: 'CSR', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'Emily Chen', memberSince: '2024-05-20' },
      { id: 7, name: 'Robert Martinez', email: 'robert@crosspest.com', role: 'Branch Manager', status: 'Active', lastLogin: '2024-01-13', connectedCrmUser: 'Robert Martinez', memberSince: '2024-04-10' },
      { id: 8, name: 'Jennifer White', email: 'jennifer@crosspest.com', role: 'Sales', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: null, memberSince: '2024-08-01' }
    ],
    app_config: {
      version: 1,
      metrics: {}
    }
  });

  // Integration data - EXACT copy from admin panel constants
  const allIntegrations = [
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
    setCurrentView('profile');
  };

  const handleShowAddUser = (): void => {
    setShowAddUserModal(true);
  };

  const handleAddUserBack = (): void => {
    setShowAddUserModal(false);
  };

  const handleAddUserSave = (userData: any): void => {
    // Add the new user to the organization
    const updatedOrganization = {
      ...organization,
      users: [...(organization.users || []), userData],
      total_users: (organization.users?.length || 0) + 1
    };
    setOrganization(updatedOrganization);
    setShowAddUserModal(false);
    
    // Show success message
    alert(`User ${userData.name} has been created successfully!`);
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
                {user?.plan || 'Standard'} Plan
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
        {/* Company Header */}
        <div style={{ padding: '24px 24px 16px 24px', borderBottom: `1px solid ${currentTheme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {/* Company Logo */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}>
              CPC
            </div>
            <div>
              <h2 style={{ 
                color: '#FFFFFF', 
                fontSize: '18px', 
                fontWeight: '700', 
                margin: 0,
                letterSpacing: '0.5px'
              }}>
                Cross Pest Control
              </h2>
              <p style={{ 
                color: '#94A3B8', 
                fontSize: '12px', 
                margin: 0, 
                fontWeight: '500' 
              }}>
                Pest Control Services
              </p>
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
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'analytics' && 'Analytics Hub'}
                {currentView === 'metrics' && 'Metric Configurations'}
                {currentView === 'integrations' && 'Data Integrations'}
                {currentView === 'users' && 'User Management'}
                {currentView === 'reviews' && 'Review Analytics'}
                {currentView === 'rewards' && 'Rewards Program'}
                {currentView === 'profile' && 'My Profile'}
              </h1>
              <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
                {currentView === 'dashboard' && 'Overview and quick actions for your business'}
                {currentView === 'analytics' && 'Unified business intelligence and performance metrics'}
                {currentView === 'metrics' && 'Configure and manage metric tracking and KPIs'}
                {currentView === 'integrations' && 'Connect your CRM, GPS, and review platforms'}
                {currentView === 'users' && 'Manage staff accounts, roles, and permissions'}
                {currentView === 'reviews' && 'Monitor and respond to customer feedback'}
                {currentView === 'rewards' && 'Manage customer loyalty and reward programs'}
                {currentView === 'profile' && 'Manage your personal information and security settings'}
              </p>
            </div>

          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ProfileDropdown />
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          transition: 'all 0.5s ease',
          opacity: isTransitioning ? 0.5 : 1,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
        }}>
          
          {/* Dashboard Overview */}
          {currentView === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{
                background: `linear-gradient(135deg, ${currentTheme.primary}15, ${currentTheme.success}15)`,
                borderRadius: '16px',
                padding: '32px',
                border: `1px solid ${currentTheme.border}`,
                textAlign: 'center'
              }}>
                <h2 style={{ color: currentTheme.textPrimary, fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                  Welcome to Cross Pest Control
                </h2>
                <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: '0 0 24px 0' }}>
                  Quick overview and access to key business functions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '24px' }}>
                  <div style={{
                    backgroundColor: currentTheme.cardBg,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} 
                  className="quick-action-card"
                  onClick={() => setCurrentView('analytics')}>
                    <TrendingUp style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      View Analytics
                    </h3>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                      Access detailed performance metrics and charts
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: currentTheme.cardBg,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} 
                  className="quick-action-card"
                  onClick={() => setCurrentView('integrations')}>
                    <Link style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      Manage Integrations
                    </h3>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                      Connect your CRM and other business tools
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: currentTheme.cardBg,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} 
                  className="quick-action-card"
                  onClick={() => setCurrentView('metrics')}>
                    <Gauge style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      Configure Metrics
                    </h3>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                      Set up KPIs and performance tracking
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: currentTheme.cardBg,
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${currentTheme.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }} 
                  className="quick-action-card"
                  onClick={() => setCurrentView('users')}>
                    <Users style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      Manage Users
                    </h3>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                      Staff accounts, roles, and permissions
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h3 style={{ color: currentTheme.textPrimary, fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                  Recent Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: currentTheme.cardBg, borderRadius: '8px', border: `1px solid ${currentTheme.border}` }}>
                    <p style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
                      Integration Updated
                    </p>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: 0 }}>
                      PestPac integration synced successfully - 2 hours ago
                    </p>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: currentTheme.cardBg, borderRadius: '8px', border: `1px solid ${currentTheme.border}` }}>
                    <p style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
                      New Metric Configured
                    </p>
                    <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: 0 }}>
                      Customer retention rate tracking enabled - 1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Hub */}
          {currentView === 'analytics' && (
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
                <DrivenLogo size={48} style={{ marginBottom: '16px' }} />
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
            <IntegrationsView
              organization={organization}
              allIntegrations={allIntegrations}
              categories={categories}
              onUpdate={(updatedOrg) => {
                // Update the organization state
                setOrganization(updatedOrg as Organization);
                console.log('Organization updated:', updatedOrg);
              }}
            />
          )}

          {/* Metric Configurations */}
          {currentView === 'metrics' && (
            <MetricsTab
              organization={organization}
              onUpdate={(updatedOrg) => setOrganization(updatedOrg)}
            />
          )}

          {/* User Management */}
          {currentView === 'users' && !showAddUserModal && (
            <UsersTab
              organization={organization}
              onUpdate={(updatedOrg) => setOrganization(updatedOrg)}
              onShowAddUser={handleShowAddUser}
            />
          )}

          {/* Add User Modal */}
          {currentView === 'users' && showAddUserModal && (
            <AddNewUser
              onBack={handleAddUserBack}
              onSave={handleAddUserSave}
            />
          )}

          {/* Reviews Analytics */}
          {currentView === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    Review Analytics
                  </h2>
                  <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
                    Monitor customer feedback and online reputation
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Revenue Metrics */}
                <div style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  transition: 'all 0.3s ease'
                }} className="metric-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <DollarSign style={{ color: currentTheme.success, width: '24px', height: '24px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      Revenue Metrics
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Monthly Revenue</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>$85,420</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Growth Rate</span>
                      <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>+12.5%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Avg. Ticket Size</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>$298</span>
                    </div>
                  </div>
                </div>

                {/* Customer Metrics */}
                <div style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  transition: 'all 0.3s ease'
                }} className="metric-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Users style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      Customer Metrics
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Active Customers</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>2,847</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Retention Rate</span>
                      <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>94.2%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>New Customers</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>+142</span>
                    </div>
                  </div>
                </div>

                {/* Service Metrics */}
                <div style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  transition: 'all 0.3s ease'
                }} className="metric-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Target style={{ color: currentTheme.warning, width: '24px', height: '24px' }} />
                    <h3 style={{ color: currentTheme.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                      Service Metrics
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Services Completed</span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>1,284</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>On-Time Rate</span>
                      <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>96.8%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Customer Satisfaction</span>
                      <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {currentView === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    Customer Reviews
                  </h2>
                  <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
                    Monitor and respond to reviews across all platforms
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
                >
                  <MessageSquare style={{ width: '20px', height: '20px' }} />
                  <span>Respond to Review</span>
                </button>
              </div>

              {/* Review Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  textAlign: 'center'
                }}>
                  <Star style={{ color: '#F59E0B', width: '32px', height: '32px', margin: '0 auto 12px' }} />
                  <h3 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    4.8
                  </h3>
                  <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                    Average Rating
                  </p>
                </div>

                <div style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  textAlign: 'center'
                }}>
                  <MessageSquare style={{ color: currentTheme.primary, width: '32px', height: '32px', margin: '0 auto 12px' }} />
                  <h3 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    247
                  </h3>
                  <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                    Total Reviews
                  </p>
                </div>

                <div style={{
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${currentTheme.border}`,
                  textAlign: 'center'
                }}>
                  <ArrowUpRight style={{ color: currentTheme.success, width: '32px', height: '32px', margin: '0 auto 12px' }} />
                  <h3 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                    +15%
                  </h3>
                  <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
                    This Month
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rewards Program - Coming Soon */}
          {currentView === 'rewards' && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '500px',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: currentTheme.cardBg,
                borderRadius: '24px',
                padding: '48px',
                border: `2px dashed ${currentTheme.border}`,
                maxWidth: '600px',
                width: '100%'
              }}>
                <div style={{
                  backgroundColor: currentTheme.primary + '15',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <Gift style={{ 
                    color: currentTheme.primary, 
                    width: '40px', 
                    height: '40px' 
                  }} />
                </div>
                
                <h2 style={{ 
                  color: currentTheme.textPrimary, 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  margin: '0 0 16px 0' 
                }}>
                  Rewards Program
                </h2>
                
                <div style={{
                  backgroundColor: currentTheme.warning + '20',
                  border: `1px solid ${currentTheme.warning}40`,
                  borderRadius: '12px',
                  padding: '12px 24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px'
                }}>
                  <Clock style={{ 
                    color: currentTheme.warning, 
                    width: '18px', 
                    height: '18px' 
                  }} />
                  <span style={{
                    color: currentTheme.warning,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    COMING SOON
                  </span>
                </div>
                
                <p style={{ 
                  color: currentTheme.textSecondary, 
                  fontSize: '18px', 
                  lineHeight: '1.6',
                  margin: '0 0 32px 0' 
                }}>
                  We're working hard to bring you a comprehensive customer loyalty and rewards program. 
                  This feature will help you increase customer retention and boost revenue through 
                  personalized incentives.
                </p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    backgroundColor: currentTheme.background,
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${currentTheme.border}`
                  }}>
                    <Star style={{ 
                      color: currentTheme.primary, 
                      width: '24px', 
                      height: '24px',
                      marginBottom: '8px'
                    }} />
                    <h4 style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      Loyalty Points
                    </h4>
                    <p style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px',
                      margin: 0
                    }}>
                      Track customer points & rewards
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: currentTheme.background,
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${currentTheme.border}`
                  }}>
                    <Gift style={{ 
                      color: currentTheme.primary, 
                      width: '24px', 
                      height: '24px',
                      marginBottom: '8px'
                    }} />
                    <h4 style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      Custom Rewards
                    </h4>
                    <p style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px',
                      margin: 0
                    }}>
                      Create personalized incentives
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: currentTheme.background,
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${currentTheme.border}`
                  }}>
                    <TrendingUp style={{ 
                      color: currentTheme.primary, 
                      width: '24px', 
                      height: '24px',
                      marginBottom: '8px'
                    }} />
                    <h4 style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      Analytics
                    </h4>
                    <p style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px',
                      margin: 0
                    }}>
                      Monitor program performance
                    </p>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: currentTheme.background,
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${currentTheme.border}`,
                  fontSize: '14px',
                  color: currentTheme.textSecondary
                }}>
                  <strong style={{ color: currentTheme.textPrimary }}>Stay tuned!</strong> We'll notify you when this feature becomes available.
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Edit */}
          {currentView === 'profile' && (
            <UserProfileEdit 
              onBack={() => setCurrentView('dashboard')}
              onSave={(userData) => {
                console.log('Profile updated:', userData);
                alert('Profile updated successfully!');
                setCurrentView('dashboard');
              }}
            />
          )}
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
        .add-metric-btn:hover {
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

export default OrganizationDashboard;