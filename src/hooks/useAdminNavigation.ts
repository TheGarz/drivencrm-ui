// Custom hook for admin navigation state and handlers
// Updated to use React Router instead of state-based navigation

import { useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ViewType = 'dashboard' | 'organizations' | 'manage-organization' | 'add-organization' | 'driven-users' | 'edit-user' | 'add-driven-user' | 'profile';

// Map view types to their corresponding URL paths
const VIEW_TO_PATH_MAP: Record<ViewType, string> = {
  'dashboard': '/dashboard',
  'organizations': '/organizations',
  'manage-organization': '/organizations/:organizationId',
  'add-organization': '/organizations/add',
  'driven-users': '/driven-users',
  'edit-user': '/driven-users/:userId/edit',
  'add-driven-user': '/driven-users/add',
  'profile': '/profile'
};

// Map URL paths to view types
const PATH_TO_VIEW_MAP: Record<string, ViewType> = {
  '/dashboard': 'dashboard',
  '/organizations': 'organizations',
  '/driven-users': 'driven-users',
  '/profile': 'profile'
};

export const useAdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // UI state (not related to routing)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);

  // Get current view from URL path
  const currentView = useMemo((): ViewType => {
    const pathname = location.pathname;
    
    // Handle specific routes in order of specificity
    if (pathname === '/organizations/add') {
return 'add-organization';
}
    if (pathname === '/driven-users/add') {
return 'add-driven-user';
}
    if (pathname.includes('/driven-users/') && pathname.includes('/edit')) {
return 'edit-user';
}
    if (pathname.includes('/organizations/') && pathname !== '/organizations') {
return 'manage-organization';
}
    
    // Handle direct path matches
    return PATH_TO_VIEW_MAP[pathname] || 'dashboard';
  }, [location.pathname]);

  // Active nav item is the main section (for sidebar highlighting)
  const activeNavItem = useMemo((): ViewType => {
    const pathname = location.pathname;
    
    if (pathname.includes('/organizations')) {
return 'organizations';
}
    if (pathname.includes('/driven-users')) {
return 'driven-users';
}
    if (pathname.includes('/profile')) {
return 'profile';
}
    
    return 'dashboard';
  }, [location.pathname]);

  // Handle navigation with React Router
  const handleNavClick = useCallback((viewType: ViewType) => {
    const targetPath = VIEW_TO_PATH_MAP[viewType];
    
    if (location.pathname === targetPath) {
      return; // Already on this route
    }
    
    setIsTransitioning(true);
    navigate(targetPath);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [location.pathname, navigate]);

  // Navigation helpers updated for React Router
  const navigateToView = useCallback((viewType: ViewType, params?: Record<string, string>) => {
    let targetPath = VIEW_TO_PATH_MAP[viewType];
    
    // Replace path parameters if provided
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        targetPath = targetPath.replace(`:${key}`, value);
      });
    }
    
    setIsTransitioning(true);
    navigate(targetPath);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [navigate]);

  const navigateBack = useCallback((targetView: ViewType) => {
    const targetPath = VIEW_TO_PATH_MAP[targetView];
    
    setIsTransitioning(true);
    navigate(targetPath);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [navigate]);

  const toggleProfileDropdown = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const closeProfileDropdown = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const openThemeSelector = useCallback(() => {
    setIsThemeSelectorOpen(true);
  }, []);

  const closeThemeSelector = useCallback(() => {
    setIsThemeSelectorOpen(false);
  }, []);

  // Convenience navigation functions for common actions
  const navigateToOrganizationManager = useCallback((organizationId: string) => {
    navigateToView('manage-organization', { organizationId });
  }, [navigateToView]);

  const navigateToEditUser = useCallback((userId: string) => {
    navigateToView('edit-user', { userId });
  }, [navigateToView]);

  const navigateToProfile = useCallback(() => {
    setIsProfileOpen(false);
    navigateToView('profile');
  }, [navigateToView]);

  return {
    // State (URL-derived)
    currentView,
    activeNavItem,
    
    // UI State 
    isTransitioning,
    isProfileOpen,
    isThemeSelectorOpen,
    
    // Navigation handlers
    handleNavClick,
    navigateToView,
    navigateBack,
    
    // Convenience navigation functions
    navigateToOrganizationManager,
    navigateToEditUser,
    navigateToProfile,
    
    // UI handlers
    toggleProfileDropdown,
    closeProfileDropdown,
    openThemeSelector,
    closeThemeSelector
  };
};
