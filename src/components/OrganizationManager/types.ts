export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  connectedCrmUser: string | null;
  memberSince?: string;
  closedOn?: string;
}

export interface Organization {
  id: number;
  name: string;
  active: boolean;
  sync_limit: number;
  pay_period: string;
  pay_start: string;
  created_at: string;
  last_sync: string;
  total_users: number;
  total_branches: number;
  monthly_revenue: number;
  integration_count: number;
  reviewsEnabled?: boolean;
  rewardsEnabled?: boolean;
  settings?: Record<string, any>;
  app_config?: AppConfig;
  services?: ServiceResource[];
  users?: User[];
}

export interface AppConfig {
  version: number;
  metrics: {
    [group: string]: MetricConfig[];
  };
}

export interface MetricConfig {
  type: string;
  uid?: string;
  displayName?: string;
  customRule?: string;
}

export interface MetricDescription {
  key: string;
  name: string;
  shortLabel: string;
  icon: string;
  category: 'branch' | 'csr' | 'sales' | 'tech' | 'custom';
}

export interface MetricGroup {
  id: string;
  name: string;
  displayName: string;
  isDefault: boolean;
  isActive: boolean;
  metrics: MetricConfig[];
  users?: number[];
}

export interface ServiceResource {
  uid: string;
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'needs_setup';
  last_sync?: string;
  config?: Record<string, any>;
  configured?: boolean;
  config_status?: 'complete' | 'incomplete' | 'testing' | 'failed';
}

export interface TabProps {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<{ organization: Organization; onUpdate: (org: Organization) => void }>;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  crmSystem?: boolean;
}

export interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: Integration | null;
  onConnect: (integration: Integration) => void;
  hasCrmIntegration: boolean;
}

export interface OrganizationManagerProps {
  onBack?: () => void;
  organizationId?: number;
}