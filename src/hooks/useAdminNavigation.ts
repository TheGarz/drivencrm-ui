// Custom hook for admin navigation state and handlers
// Extracted from CompanyAdminDashboard to maintain exact behavior

import { useState, useCallback } from 'react';

export type ViewType = 'dashboard' | 'organizations' | 'manage-organization' | 'add-organization' | 'driven-users' | 'edit-user' | 'add-driven-user' | 'profile' | 'settings';

export const useAdminNavigation = () => {
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeNavItem, setActiveNavItem] = useState<ViewType>('dashboard');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);

  // Handle navigation with exact same transition logic
  const handleNavClick = useCallback((viewType: ViewType) => {
    if (viewType === currentView) {
      return;
    }
    
    setIsTransitioning(true);
    setActiveNavItem(viewType);
    
    setTimeout(() => {
      setCurrentView(viewType);
      setIsTransitioning(false);
    }, 300);
  }, [currentView]);

  // Navigation helpers with exact same behavior
  const navigateToView = useCallback((viewType: ViewType) => {
    setIsTransitioning(true);
    setActiveNavItem(viewType);
    
    setTimeout(() => {
      setCurrentView(viewType);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const navigateBack = useCallback((targetView: ViewType) => {
    setIsTransitioning(true);
    setActiveNavItem(targetView);
    
    setTimeout(() => {
      setCurrentView(targetView);
      setIsTransitioning(false);
    }, 300);
  }, []);

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

  return {
    // State
    isTransitioning,
    activeNavItem,
    currentView,
    isProfileOpen,
    isThemeSelectorOpen,
    
    // Navigation handlers
    handleNavClick,
    navigateToView,
    navigateBack,
    
    // UI handlers
    toggleProfileDropdown,
    closeProfileDropdown,
    openThemeSelector,
    closeThemeSelector
  };
};
