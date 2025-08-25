// Admin Layout Styling Constants
// Extracted from CompanyAdminDashboard to maintain exact pixel-perfect styling

import type { Theme } from '../theme/types';

export const LAYOUT_CONSTANTS = {
  sidebar: {
    width: '256px',
    padding: '24px',
    headerGap: '16px',
    navigationMarginTop: '32px',
    navigationPadding: '0 16px',
    navigationGap: '12px'
  },
  content: {
    marginLeft: '256px',
    minHeight: '100vh'
  },
  transitions: {
    default: 'all 0.7s ease',
    navigation: 'all 0.3s ease',
    quick: 'all 0.2s ease'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  zIndex: {
    sidebar: 1000,
    dropdown: 9000,
    modal: 10000
  }
};

export const getSidebarStyles = (currentTheme: Theme) => ({
  container: {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    height: '100%',
    width: LAYOUT_CONSTANTS.sidebar.width,
    backgroundColor: currentTheme.sidebarBg,
    borderRight: `1px solid ${currentTheme.border}`,
    transition: LAYOUT_CONSTANTS.transitions.default,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: LAYOUT_CONSTANTS.zIndex.sidebar
  },
  header: {
    padding: LAYOUT_CONSTANTS.sidebar.padding,
    display: 'flex',
    alignItems: 'center',
    gap: LAYOUT_CONSTANTS.sidebar.headerGap
  },
  logo: {
    filter: 'brightness(0) invert(1)', // Make it white for dark sidebar
  },
  userInfo: {
    color: '#E2E8F0',
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.2',
    margin: 0
  },
  userRole: {
    color: '#94A3B8',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: 0
  }
});

export const getNavigationStyles = (currentTheme: Theme) => ({
  container: {
    marginTop: LAYOUT_CONSTANTS.sidebar.navigationMarginTop,
    padding: LAYOUT_CONSTANTS.sidebar.navigationPadding,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: LAYOUT_CONSTANTS.spacing.md,
    flex: 1,
    overflowY: 'auto' as const
  },
  item: (isActive: boolean) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: LAYOUT_CONSTANTS.borderRadius.lg,
    padding: LAYOUT_CONSTANTS.spacing.lg,
    border: 'none',
    cursor: 'pointer',
    transition: LAYOUT_CONSTANTS.transitions.navigation,
    backgroundColor: isActive ? currentTheme.primary : 'transparent',
    color: isActive ? 'white' : '#CBD5E1',
    transform: isActive ? 'translateX(4px)' : 'translateX(0px)'
  }),
  itemContent: {
    display: 'flex',
    alignItems: 'center',
    gap: LAYOUT_CONSTANTS.spacing.md
  },
  itemText: {
    textAlign: 'left' as const
  },
  itemTitle: {
    fontWeight: '600',
    display: 'block',
    fontSize: '14px'
  },
  itemDescription: {
    fontSize: '12px',
    opacity: 0.75
  },
  itemBadge: (currentTheme: Theme) => ({
    backgroundColor: currentTheme.danger,
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    minWidth: '20px',
    textAlign: 'center' as const
  })
});

export const getProfileDropdownStyles = (currentTheme: Theme) => ({
  container: {
    marginTop: 'auto',
    padding: LAYOUT_CONSTANTS.sidebar.padding,
    borderTop: `1px solid ${currentTheme.border}`
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: LAYOUT_CONSTANTS.spacing.md,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: LAYOUT_CONSTANTS.borderRadius.md,
    cursor: 'pointer',
    transition: LAYOUT_CONSTANTS.transitions.quick,
    color: '#CBD5E1'
  },
  buttonHover: {
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: LAYOUT_CONSTANTS.spacing.md
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: currentTheme.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px'
  },
  userDetails: {
    textAlign: 'left' as const
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
    color: '#E2E8F0'
  },
  userEmail: {
    fontSize: '12px',
    margin: 0,
    color: '#94A3B8'
  },
  dropdown: (isOpen: boolean) => ({
    position: 'absolute' as const,
    bottom: '100%',
    left: LAYOUT_CONSTANTS.spacing.lg,
    right: LAYOUT_CONSTANTS.spacing.lg,
    backgroundColor: currentTheme.cardBg,
    border: `1px solid ${currentTheme.border}`,
    borderRadius: LAYOUT_CONSTANTS.borderRadius.md,
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    zIndex: LAYOUT_CONSTANTS.zIndex.dropdown,
    marginBottom: LAYOUT_CONSTANTS.spacing.sm,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
    transition: LAYOUT_CONSTANTS.transitions.quick,
    pointerEvents: (isOpen ? 'auto' : 'none') as 'auto' | 'none'
  }),
  dropdownItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: LAYOUT_CONSTANTS.spacing.md,
    padding: LAYOUT_CONSTANTS.spacing.md,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: currentTheme.textPrimary,
    transition: LAYOUT_CONSTANTS.transitions.quick,
    textAlign: 'left' as const
  },
  dropdownItemHover: {
    backgroundColor: currentTheme.primary + '10'
  }
});

export const getContentStyles = (currentTheme: Theme, isTransitioning: boolean) => ({
  container: {
    marginLeft: LAYOUT_CONSTANTS.content.marginLeft,
    minHeight: LAYOUT_CONSTANTS.content.minHeight,
    backgroundColor: currentTheme.background,
    color: currentTheme.textPrimary,
    padding: '32px'  // Added padding to match CustomerLayout
  },
  content: {
    opacity: isTransitioning ? 0 : 1,
    transition: LAYOUT_CONSTANTS.transitions.navigation
  }
});

export const getModalStyles = (currentTheme: Theme) => ({
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: LAYOUT_CONSTANTS.zIndex.modal
  },
  content: {
    backgroundColor: currentTheme.cardBg,
    borderRadius: LAYOUT_CONSTANTS.borderRadius.lg,
    padding: LAYOUT_CONSTANTS.spacing.xl,
    border: `1px solid ${currentTheme.border}`,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto'
  }
});
