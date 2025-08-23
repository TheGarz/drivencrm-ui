import type { Organization } from './types';

export const mockOrganization: Organization = {
  id: 1,
  name: 'Cross Pest Control',
  active: true,
  sync_limit: 0,
  pay_period: 'PERIOD_WEEKLY',
  pay_start: '2023-01-01',
  created_at: '2023-01-01T00:00:00Z',
  last_sync: '2024-01-15T10:30:00Z',
  total_users: 47,
  total_branches: 3,
  monthly_revenue: 125000,
  integration_count: 0,
  app_config: {
    version: 2,
    metrics: {
      branch: [
        { type: 'revenue' },
        { type: 'cancels' },
        { type: 'leads' }
      ],
      tech: [
        { type: 'completion' },
        { type: 'prodperhour' },
        { type: 'reviews' }
      ]
    }
  },
  services: [],
  users: [
    { id: 1, name: 'John Smith', email: 'john@crosspest.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15', connectedCrmUser: 'john.smith' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@crosspest.com', role: 'Manager', status: 'Active', lastLogin: '2024-01-14', connectedCrmUser: 'sarah.johnson' },
    { id: 3, name: 'Mike Davis', email: 'mike@crosspest.com', role: 'Technician', status: 'Active', lastLogin: '2024-01-13', connectedCrmUser: 'mike.davis' },
    { id: 4, name: 'Lisa Wilson', email: 'lisa@crosspest.com', role: 'Sales Rep', status: 'Active', lastLogin: '2024-01-12', connectedCrmUser: 'lisa.wilson' },
    { id: 5, name: 'David Brown', email: 'david@crosspest.com', role: 'CSR', status: 'Active', lastLogin: '2024-01-11', connectedCrmUser: 'david.brown' },
    { id: 6, name: 'Emily Taylor', email: 'emily@crosspest.com', role: 'Technician', status: 'Active', lastLogin: '2024-01-10', connectedCrmUser: 'emily.taylor' },
    { id: 7, name: 'James Anderson', email: 'james@crosspest.com', role: 'Manager', status: 'Inactive', lastLogin: '2024-01-05', connectedCrmUser: null },
    { id: 8, name: 'Jennifer Martinez', email: 'jennifer@crosspest.com', role: 'Sales Rep', status: 'Active', lastLogin: '2024-01-09', connectedCrmUser: 'jennifer.martinez' }
  ]
};