// Admin Layout Component
// Extracted from CompanyAdminDashboard to maintain exact styling and behavior

import React from 'react';
import { useTheme } from '../theme';
import { useAuth } from '../auth/AuthContext';
import { DrivenBrandLogo } from '../components/DrivenBrandLogo';
import { ThemeSelector } from '../components/ThemeSelector';
import { 
  BarChart3, 
  Users, 
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  Palette,
  UserCheck,
  Edit3
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ViewType } from '../hooks/useAdminNavigation';
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
}

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  activeNavItem: ViewType;
  isTransitioning: boolean;
  isProfileOpen: boolean;
  isThemeSelectorOpen: boolean;
  onNavClick: (viewType: ViewType) => void;
  onToggleProfileDropdown: () => void;
  onCloseProfileDropdown: () => void;
  onOpenThemeSelector: () => void;
  onCloseThemeSelector: () => void;
  onNavigateToProfile: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentView,
  activeNavItem,
  isTransitioning,
  isProfileOpen,
  isThemeSelectorOpen,
  onNavClick,
  onToggleProfileDropdown,
  onCloseProfileDropdown,
  onOpenThemeSelector,
  onCloseThemeSelector,
  onNavigateToProfile
}) => {
  const { currentTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Company Admin Navigation - exact same as original
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', icon: BarChart3, text: 'Dashboard', description: 'Platform Overview' },
    { id: 'organizations', icon: Building2, text: 'Organizations', description: 'Manage Client Organizations' },
    { id: 'driven-users', icon: Users, text: 'Driven Users', description: 'Platform User Management' },
    { id: 'settings', icon: Settings, text: 'Settings', description: 'Platform Configuration' }
  ];

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
                onClick={() => onNavClick(item.id as ViewType)}
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

        {/* Profile Section - exact same structure and styling */}
        <div style={profileDropdownStyles.container}>
          <div style={{ position: 'relative' }}>
            {/* Profile Dropdown - exact same positioning and styling */}
            <div style={profileDropdownStyles.dropdown(isProfileOpen)}>
              <button
                onClick={() => {
                  onNavigateToProfile();
                  onCloseProfileDropdown();
                }}
                style={profileDropdownStyles.dropdownItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = profileDropdownStyles.dropdownItemHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  onOpenThemeSelector();
                  onCloseProfileDropdown();
                }}
                style={profileDropdownStyles.dropdownItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = profileDropdownStyles.dropdownItemHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Palette size={16} />
                Change Theme
              </button>
              <button
                onClick={logout}
                style={profileDropdownStyles.dropdownItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = profileDropdownStyles.dropdownItemHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            <button
              onClick={onToggleProfileDropdown}
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

      {/* Content Area - exact same structure and styling */}
      <div style={contentStyles.container}>
        <div style={contentStyles.content}>
          {children}
        </div>
      </div>

      {/* Theme Selector Modal - exact same structure and styling */}
      {isThemeSelectorOpen && (
        <div 
          style={modalStyles.overlay} 
          onClick={onCloseThemeSelector}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ThemeSelector 
              isOpen={isThemeSelectorOpen} 
              onClose={onCloseThemeSelector} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
