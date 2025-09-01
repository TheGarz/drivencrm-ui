import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth/AuthContext';
import { getNavigationForRole, getRoleDisplayName } from '../../utils/roleBasedNavigation';
import { ThemeSelector } from '../ThemeSelector';
import { 
  Moon, 
  Sun, 
  Settings,
  LogOut,
  ChevronDown,
  Palette
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ViewType = 'dashboard' | 'analytics' | 'metrics' | 'integrations' | 'users' | 'reviews' | 'rewards' | 'billing' | 'profile';

const CustomerLayout: React.FC = () => {
  // Theme system
  const { theme, currentTheme, toggleTheme } = useTheme();
  
  // Auth system
  const { user, logout } = useAuth();
  
  // Navigation hooks
  const location = useLocation();
  const navigate = useNavigate();
  
  // State with proper typing
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);

  // Get role-based navigation
  const navigationItems = user?.role ? getNavigationForRole(user.role) : [];
  const userDisplayRole = user?.role ? getRoleDisplayName(user.role) : 'User';

  // Get current active nav item from URL path
  const getActiveNavFromPath = (pathname: string): ViewType => {
    if (pathname.includes('/analytics')) {
return 'analytics';
}
    if (pathname.includes('/metrics')) {
return 'metrics';
}
    if (pathname.includes('/integrations')) {
return 'integrations';
}
    if (pathname.includes('/users')) {
return 'users';
}
    if (pathname.includes('/reviews')) {
return 'reviews';
}
    if (pathname.includes('/rewards')) {
return 'rewards';
}
    if (pathname.includes('/billing')) {
return 'billing';
}
    if (pathname.includes('/profile')) {
return 'profile';
}
    return 'dashboard';
  };

  const activeNavItem = getActiveNavFromPath(location.pathname);

  // Event handlers with proper typing
  const handleNavClick = (itemId: ViewType): void => {
    setIsTransitioning(true);
    
    // Navigate to the appropriate route
    const routePath = itemId === 'dashboard' ? '/' : `/${itemId}`;
    navigate(routePath);
    
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
    navigate('/profile');
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
                {activeNavItem === 'dashboard' && 'Dashboard'}
                {activeNavItem === 'analytics' && 'Analytics Hub'}
                {activeNavItem === 'metrics' && 'Metric Configurations'}
                {activeNavItem === 'integrations' && 'Data Integrations'}
                {activeNavItem === 'users' && 'User Management'}
                {activeNavItem === 'reviews' && 'Review Analytics'}
                {activeNavItem === 'rewards' && 'Rewards Program'}
                {activeNavItem === 'billing' && 'Billing & Payments'}
                {activeNavItem === 'profile' && 'My Profile'}
              </h1>
              <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
                {activeNavItem === 'dashboard' && 'Overview and quick actions for your business'}
                {activeNavItem === 'analytics' && 'Unified business intelligence and performance metrics'}
                {activeNavItem === 'metrics' && 'Configure and manage metric tracking and KPIs'}
                {activeNavItem === 'integrations' && 'Connect your CRM, GPS, and review platforms'}
                {activeNavItem === 'users' && 'Manage staff accounts, roles, and permissions'}
                {activeNavItem === 'reviews' && 'Monitor and respond to customer feedback'}
                {activeNavItem === 'rewards' && 'Manage customer loyalty and reward programs'}
                {activeNavItem === 'billing' && 'Track subscriptions, payments, and financial metrics'}
                {activeNavItem === 'profile' && 'Manage your personal information and security settings'}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ProfileDropdown />
          </div>
        </div>

        {/* Content Area - Rendered by React Router */}
        <div style={{ 
          transition: 'all 0.5s ease',
          opacity: isTransitioning ? 0.5 : 1,
          transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
        }}>
          <Outlet />
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
        
        .nav-item:hover {
          transform: scale(1.05) !important;
        }
        
        .nav-item.active {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .theme-toggle-btn:hover,
        .edit-profile-btn:hover,
        .theme-selector-btn:hover {
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

export default CustomerLayout;