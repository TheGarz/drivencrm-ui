import React, { useState } from 'react';
import { IntegrationsView } from '../components/IntegrationsView';
import type { Organization } from '../components/OrganizationManager/types';

const IntegrationsPage: React.FC = () => {
  // Organization state - exact same as OrganizationDashboard
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

  // Integration data - exact same as OrganizationDashboard but with safe icon placeholders
  const allIntegrations = [
    // CRM Systems
    { id: 'PESTPAC', name: 'PestPac', category: 'CRM', icon: 'CRM', description: 'Complete pest control management system with customer, scheduling, and billing features.', crmSystem: true },
    { id: 'FIELDROUTES', name: 'FieldRoutes', category: 'CRM', icon: 'CRM', description: 'Field service management platform for route optimization and customer management.', crmSystem: true },
    { id: 'FIELDWORK', name: 'FieldWork', category: 'CRM', icon: 'CRM', description: 'Mobile-first field service management for pest control and lawn care businesses.', crmSystem: true },
    { id: 'BRIOSTACK', name: 'BrioStack', category: 'CRM', icon: 'CRM', description: 'Comprehensive business management software for service companies.', crmSystem: true },
    
    // Communication & Marketing
    { id: 'HUBSPOT', name: 'HubSpot', category: 'Communication', icon: 'COM', description: 'Inbound marketing, sales, and customer service platform.' },
    { id: 'GOHIGHLEVEL', name: 'GoHighLevel', category: 'Communication', icon: 'COM', description: 'All-in-one marketing automation and CRM platform.' },
    { id: 'RINGCENTRAL', name: 'RingCentral', category: 'Communication', icon: 'COM', description: 'Cloud-based business communications and collaboration platform.' },
    { id: 'CALLRAIL', name: 'CallRail', category: 'Communication', icon: 'COM', description: 'Call tracking and analytics for marketing attribution.' },
    { id: 'AIRCALL', name: 'Aircall', category: 'Communication', icon: 'COM', description: 'Cloud-based phone system for sales and support teams.' },
    { id: 'DIALPAD', name: 'Dialpad', category: 'Communication', icon: 'COM', description: 'AI-powered business communications platform.' },
    { id: 'NETSAPIENS', name: 'NetSapiens', category: 'Communication', icon: 'COM', description: 'Cloud communications platform for service providers.' },
    { id: 'POSTCALL', name: 'PostCall', category: 'Communication', icon: 'COM', description: 'Automated follow-up and communication system.' },
    { id: 'VOICEFORPEST', name: 'Voice for Pest', category: 'Communication', icon: 'COM', description: 'Specialized voice services for pest control industry.' },
    { id: 'CTM', name: 'CTM', category: 'Communication', icon: 'COM', description: 'Call tracking and marketing attribution platform.' },
    
    // Fleet Management
    { id: 'SAMSARA', name: 'Samsara', category: 'Fleet', icon: 'FLEET', description: 'Connected fleet management with GPS tracking and driver safety.' },
    { id: 'VERIZONCONNECT', name: 'Verizon Connect', category: 'Fleet', icon: 'FLEET', description: 'Fleet management and mobile workforce solutions.' },
    { id: 'LINXUP', name: 'Linxup', category: 'Fleet', icon: 'FLEET', description: 'GPS fleet tracking and management platform.' },
    { id: 'ZUBIE', name: 'Zubie', category: 'Fleet', icon: 'FLEET', description: 'Connected car platform for fleet management.' },
    { id: 'AZUGA', name: 'Azuga', category: 'Fleet', icon: 'FLEET', description: 'Fleet management and driver behavior monitoring.' },
    { id: 'BOUNCIE', name: 'Bouncie', category: 'Fleet', icon: 'FLEET', description: 'Vehicle tracking and diagnostics platform.' },
    { id: 'SPIREON', name: 'Spireon', category: 'Fleet', icon: 'FLEET', description: 'Fleet intelligence and asset tracking solutions.' },
    { id: 'TELETRONICS', name: 'Teletronics', category: 'Fleet', icon: 'FLEET', description: 'Vehicle tracking and fleet management systems.' },
    { id: 'FLEETPRO', name: 'FleetPro', category: 'Fleet', icon: 'FLEET', description: 'Professional fleet management and optimization.' },
    
    // Reviews & Feedback
    { id: 'LISTEN360', name: 'Listen360', category: 'Reviews', icon: 'REV', description: 'Customer feedback and review management platform.' },
    { id: 'APPLAUSE', name: 'Applause', category: 'Reviews', icon: 'REV', description: 'Customer experience and feedback collection.' },
    
    // Other Services
    { id: 'DIGITALSOUTH', name: 'Digital South', category: 'Other', icon: 'OTHER', description: 'Digital marketing and web services.' },
    { id: 'ONESTEP', name: 'OneStep', category: 'Other', icon: 'OTHER', description: 'Specialized service integration platform.' }
  ];

  const categories = ['All', 'CRM', 'Communication', 'Fleet', 'Reviews', 'Other'];

  return (
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
  );
};

export default IntegrationsPage;