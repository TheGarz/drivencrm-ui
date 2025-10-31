// Admin Layout Component
// Extracted from CompanyAdminDashboard to maintain exact styling and behavior
// Updated to work with React Router

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { DrivenBrandLogo } from '../components/DrivenBrandLogo';
import { ThemeSelector } from '../components/ThemeSelector';
import { 
  BarChart3, 
  Users, 
  Building2,
  LogOut,
  ChevronDown,
  Palette,
  UserCheck,
  Edit3,
  Settings,
  Moon,
  Sun,
  UserCog
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { 
  getSidebarStyles, 
  getNavigationStyles, 
  getProfileDropdownStyles, 
  getContentStyles,
  getModalStyles
} from '../styles/adminLayout.styles';

// TypeScript Interfaces
interface NavigationItem {
  id: string;
  icon: LucideIcon;
  text: string;
  description: string;
  badge?: string;
  path: string;
}

const AdminLayout: React.FC = () => {
  const { theme, currentTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management for UI interactions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  // Company Admin Navigation with router paths
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', icon: BarChart3, text: 'Dashboard', description: 'Platform Overview', path: '/dashboard' },
    { id: 'organizations', icon: Building2, text: 'Organizations', description: 'Manage Client Organizations', path: '/organizations' },
    { id: 'user-management', icon: UserCog, text: 'User Management', description: 'Manage Organization Users', path: '/user-management' },
    { id: 'driven-users', icon: Users, text: 'Driven Employees', description: 'Employee User Management', path: '/driven-users' }
  ];
  
  // Get active nav item from current URL path
  const getActiveNavFromPath = (pathname: string): string => {
    if (pathname.includes('/organizations')) {
return 'organizations';
}
    if (pathname.includes('/user-management')) {
return 'user-management';
}
    if (pathname.includes('/driven-users')) {
return 'driven-users';
}
    return 'dashboard';
  };

  const activeNavItem = getActiveNavFromPath(location.pathname);

  // Navigation handlers
  const handleNavClick = (path: string): void => {
    setIsTransitioning(true);
    navigate(path);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNavigateToProfile = () => {
    setIsProfileOpen(false);
    navigate('/profile');
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

  const sidebarStyles = getSidebarStyles(currentTheme);
  const navigationStyles = getNavigationStyles(currentTheme);
  const profileDropdownStyles = getProfileDropdownStyles(currentTheme);
  const contentStyles = getContentStyles(currentTheme, isTransitioning);
  const modalStyles = getModalStyles(currentTheme);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: currentTheme.background,
      color: currentTheme.textPrimary
    }}>
      {/* Sidebar - exact same structure and styling */}
      <div style={sidebarStyles.container}>
        <div style={sidebarStyles.header}>
          <DrivenBrandLogo 
            variant="square"
            height={56}
            style={sidebarStyles.logo}
          />
          <div>
            <h1 style={sidebarStyles.userInfo}>
              Admin Portal
            </h1>
            <p style={sidebarStyles.userRole}>
              Company Administration
            </p>
          </div>
        </div>

        {/* Navigation - exact same structure and styling */}
        <nav style={navigationStyles.container}>
          {navigationItems.map((item) => {
            const isActive = activeNavItem === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                style={navigationStyles.item(isActive)}
              >
                <div style={navigationStyles.itemContent}>
                  <Icon style={{ width: '24px', height: '24px' }} />
                  <div style={navigationStyles.itemText}>
                    <span style={navigationStyles.itemTitle}>{item.text}</span>
                    <span style={navigationStyles.itemDescription}>{item.description}</span>
                  </div>
                </div>
                
                {item.badge && (
                  <span style={navigationStyles.itemBadge(currentTheme)}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Section - fixed with conditional rendering */}
        <div style={profileDropdownStyles.container}>
          <div style={{ position: 'relative' }}>
            {/* Profile Dropdown - conditional rendering like CustomerLayout */}
            {isProfileOpen && (
              <div 
                className="profile-dropdown"
                style={{ 
                  position: 'absolute',
                  bottom: '100%',
                  left: '16px',
                  right: '16px',
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 9000,
                  marginBottom: '8px',
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                <button 
                  onClick={() => {
                    handleToggleTheme();
                    setIsProfileOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: currentTheme.textPrimary,
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {theme === 'light' ? (
                      <Moon style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <Sun style={{ color: '#F59E0B', width: '16px', height: '16px' }} />
                    )}
                    <span>
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
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: currentTheme.textPrimary,
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Palette size={16} />
                  Choose Theme
                </button>
                
                <button
                  onClick={handleEditProfile}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: currentTheme.textPrimary,
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Settings size={16} />
                  Edit Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#FEF2F2',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: currentTheme.danger,
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}

            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={profileDropdownStyles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = profileDropdownStyles.buttonHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={profileDropdownStyles.userSection}>
                <div style={profileDropdownStyles.avatar}>
                  <UserCheck size={20} />
                </div>
                <div style={profileDropdownStyles.userDetails}>
                  <p style={profileDropdownStyles.userName}>
                    {user?.name}
                  </p>
                  <p style={profileDropdownStyles.userEmail}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <ChevronDown 
                size={20} 
                style={{ 
                  transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentStyles.container}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <h1 style={{ color: currentTheme.textPrimary, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {activeNavItem === 'dashboard' && 'Admin Dashboard'}
                {activeNavItem === 'organizations' && 'Organizations'}
                {activeNavItem === 'user-management' && (location.pathname.includes('/edit') ? 'Edit User' : 'User Management')}
                {activeNavItem === 'driven-users' && 'Driven Employees'}
              </h1>
              <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
                {activeNavItem === 'dashboard' && 'Platform overview and management tools'}
                {activeNavItem === 'organizations' && 'Manage Client Organizations'}
                {activeNavItem === 'user-management' && (location.pathname.includes('/edit') ? '' : 'Manage users across all organizations')}
                {activeNavItem === 'driven-users' && 'Platform User Management'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area - Rendered by React Router */}
        <div style={contentStyles.content}>
          <Outlet />
        </div>
      </div>

      {/* Theme Selector Modal - exact same structure and styling */}
      {isThemeSelectorOpen && (
        <div 
          style={modalStyles.overlay} 
          onClick={() => setIsThemeSelectorOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ThemeSelector 
              isOpen={isThemeSelectorOpen} 
              onClose={() => setIsThemeSelectorOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
