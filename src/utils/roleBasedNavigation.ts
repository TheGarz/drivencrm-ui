import { 
  BarChart3, 
  Users, 
  Settings,
  Link,
  Gauge,
  Star,
  UserCheck,
  Calendar,
  FileText,
  CreditCard,
  Phone,
  Navigation,
  Wrench,
  Shield,
  ClipboardList
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  icon: LucideIcon;
  text: string;
  description: string;
  badge?: string;
  permissions?: string[];
}

type UserRole = 
  | 'DRIVEN_EMPLOYEE' 
  | 'THIRD_PARTY' 
  | 'OWNER' 
  | 'ADMIN' 
  | 'EXECUTIVE_BRANCH_MANAGER'
  | 'BRANCH_MANAGER'
  | 'TEAM_CAPTAIN'
  | 'CSR_UNIT_LEADER'
  | 'CSR_MEMBER'
  | 'SALES_UNIT_LEADER'
  | 'SALES_MEMBER'
  | 'TECH_UNIT_LEADER'
  | 'TECH_MEMBER'
  | 'GUEST';

// Define role hierarchies and permissions
export const rolePermissions: Record<UserRole, string[]> = {
  'DRIVEN_EMPLOYEE': ['all_access', 'company_admin', 'super_admin'],
  'THIRD_PARTY': ['dashboard', 'integrations', 'settings'],
  'OWNER': ['dashboard', 'analytics', 'integrations', 'metrics', 'users', 'reviews', 'settings', 'billing'],
  'ADMIN': ['dashboard', 'analytics', 'integrations', 'metrics', 'users', 'reviews', 'settings'],
  'EXECUTIVE_BRANCH_MANAGER': ['dashboard', 'analytics', 'metrics', 'users', 'reviews', 'branch_management'],
  'BRANCH_MANAGER': ['dashboard', 'analytics', 'metrics', 'users', 'scheduling', 'reports'],
  'TEAM_CAPTAIN': ['dashboard', 'team_metrics', 'scheduling', 'users'],
  'CSR_UNIT_LEADER': ['dashboard', 'csr_metrics', 'scheduling', 'customer_service'],
  'CSR_MEMBER': ['dashboard', 'customer_service', 'scheduling'],
  'SALES_UNIT_LEADER': ['dashboard', 'sales_metrics', 'leads', 'sales_reports'],
  'SALES_MEMBER': ['dashboard', 'leads', 'sales_pipeline'],
  'TECH_UNIT_LEADER': ['dashboard', 'tech_metrics', 'scheduling', 'service_reports'],
  'TECH_MEMBER': ['dashboard', 'scheduling', 'service_tickets'],
  'GUEST': ['dashboard']
};

// All possible navigation items
const allNavigationItems: Record<string, NavigationItem> = {
  dashboard: { id: 'dashboard', icon: BarChart3, text: 'Analytics Hub', description: 'Key Performance Metrics' },
  analytics: { id: 'analytics', icon: BarChart3, text: 'Advanced Analytics', description: 'Detailed Performance Analysis' },
  integrations: { id: 'integrations', icon: Link, text: 'Integrations', description: 'CRM & Data Sources', badge: '5 Active' },
  metrics: { id: 'metrics', icon: Gauge, text: 'Metrics Views', description: 'Owner/Branch/Tech Views' },
  users: { id: 'users', icon: Users, text: 'User Management', description: 'Staff & Permissions', badge: '24 Users' },
  reviews: { id: 'reviews', icon: Star, text: 'Reviews', description: 'Google & Online Reviews', badge: 'New' },
  settings: { id: 'settings', icon: Settings, text: 'Settings', description: 'System Configuration' },
  
  // Role-specific items
  billing: { id: 'billing', icon: CreditCard, text: 'Billing', description: 'Subscription & Payments' },
  scheduling: { id: 'scheduling', icon: Calendar, text: 'Scheduling', description: 'Appointments & Routes' },
  customer_service: { id: 'customer_service', icon: Phone, text: 'Customer Service', description: 'Support & Tickets' },
  leads: { id: 'leads', icon: UserCheck, text: 'Leads', description: 'Sales Pipeline Management' },
  sales_pipeline: { id: 'sales_pipeline', icon: UserCheck, text: 'Sales Pipeline', description: 'Lead Management' },
  service_tickets: { id: 'service_tickets', icon: Wrench, text: 'Service Tickets', description: 'Work Orders & Tasks' },
  reports: { id: 'reports', icon: FileText, text: 'Reports', description: 'Performance Reports' },
  
  // Specialized metrics
  team_metrics: { id: 'team_metrics', icon: Gauge, text: 'Team Metrics', description: 'Team Performance' },
  csr_metrics: { id: 'csr_metrics', icon: Gauge, text: 'CSR Metrics', description: 'Customer Service Analytics' },
  sales_metrics: { id: 'sales_metrics', icon: Gauge, text: 'Sales Metrics', description: 'Sales Performance' },
  tech_metrics: { id: 'tech_metrics', icon: Gauge, text: 'Tech Metrics', description: 'Service Metrics' },
  sales_reports: { id: 'sales_reports', icon: FileText, text: 'Sales Reports', description: 'Sales Analytics' },
  service_reports: { id: 'service_reports', icon: FileText, text: 'Service Reports', description: 'Service Analytics' },
  branch_management: { id: 'branch_management', icon: Users, text: 'Branch Management', description: 'Multi-location Management' }
};

// Get navigation items based on user role
export const getNavigationForRole = (role: UserRole): NavigationItem[] => {
  const permissions = rolePermissions[role] || [];
  
  const navigationItems: NavigationItem[] = [];
  
  // Always include dashboard for everyone
  if (allNavigationItems.dashboard) {
    navigationItems.push(allNavigationItems.dashboard);
  }
  
  // Add items based on permissions
  permissions.forEach(permission => {
    if (allNavigationItems[permission] && !navigationItems.find(item => item.id === permission)) {
      navigationItems.push(allNavigationItems[permission]);
    }
  });
  
  return navigationItems;
};

// Check if user has specific permission
export const hasPermission = (role: UserRole, permission: string): boolean => {
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission) || permissions.includes('all_access');
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    'DRIVEN_EMPLOYEE': 'Driven Employee',
    'THIRD_PARTY': 'Third Party',
    'OWNER': 'Owner',
    'ADMIN': 'Administrator',
    'EXECUTIVE_BRANCH_MANAGER': 'Executive Branch Manager',
    'BRANCH_MANAGER': 'Branch Manager',
    'TEAM_CAPTAIN': 'Team Captain',
    'CSR_UNIT_LEADER': 'CSR Unit Leader',
    'CSR_MEMBER': 'CSR Member',
    'SALES_UNIT_LEADER': 'Sales Unit Leader',
    'SALES_MEMBER': 'Sales Member',
    'TECH_UNIT_LEADER': 'Tech Unit Leader',
    'TECH_MEMBER': 'Tech Member',
    'GUEST': 'Guest'
  };
  
  return roleNames[role] || role;
};

// Get role level (for UI styling/priority)
export const getRoleLevel = (role: UserRole): number => {
  const roleLevels: Record<UserRole, number> = {
    'DRIVEN_EMPLOYEE': 10,
    'OWNER': 9,
    'ADMIN': 8,
    'EXECUTIVE_BRANCH_MANAGER': 7,
    'BRANCH_MANAGER': 6,
    'TEAM_CAPTAIN': 5,
    'CSR_UNIT_LEADER': 4,
    'SALES_UNIT_LEADER': 4,
    'TECH_UNIT_LEADER': 4,
    'CSR_MEMBER': 3,
    'SALES_MEMBER': 3,
    'TECH_MEMBER': 3,
    'THIRD_PARTY': 2,
    'GUEST': 1
  };
  
  return roleLevels[role] || 1;
};
