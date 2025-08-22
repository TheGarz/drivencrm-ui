import type { Integration } from '../../types';

export const allIntegrations: Integration[] = [
  // CRM Systems
  { id: 'PESTPAC', name: 'PestPac', category: 'CRM', icon: '🏢', description: 'Complete pest control management system with customer, scheduling, and billing features.', crmSystem: true },
  { id: 'FIELDROUTES', name: 'FieldRoutes', category: 'CRM', icon: '🗺️', description: 'Field service management platform for route optimization and customer management.', crmSystem: true },
  { id: 'FIELDWORK', name: 'FieldWork', category: 'CRM', icon: '📋', description: 'Mobile-first field service management for pest control and lawn care businesses.', crmSystem: true },
  { id: 'BRIOSTACK', name: 'BrioStack', category: 'CRM', icon: '📊', description: 'Comprehensive business management software for service companies.', crmSystem: true },
  
  // Communication & Marketing
  { id: 'HUBSPOT', name: 'HubSpot', category: 'Communication', icon: '🎯', description: 'Inbound marketing, sales, and customer service platform.' },
  { id: 'GOHIGHLEVEL', name: 'GoHighLevel', category: 'Communication', icon: '📈', description: 'All-in-one marketing automation and CRM platform.' },
  { id: 'RINGCENTRAL', name: 'RingCentral', category: 'Communication', icon: '📞', description: 'Cloud-based business communications and collaboration platform.' },
  { id: 'CALLRAIL', name: 'CallRail', category: 'Communication', icon: '📱', description: 'Call tracking and analytics for marketing attribution.' },
  { id: 'AIRCALL', name: 'Aircall', category: 'Communication', icon: '☎️', description: 'Cloud-based phone system for sales and support teams.' },
  { id: 'DIALPAD', name: 'Dialpad', category: 'Communication', icon: '🔊', description: 'AI-powered business communications platform.' },
  { id: 'NETSAPIENS', name: 'NetSapiens', category: 'Communication', icon: '📡', description: 'Cloud communications platform for service providers.' },
  { id: 'POSTCALL', name: 'PostCall', category: 'Communication', icon: '📧', description: 'Automated follow-up and communication system.' },
  { id: 'VOICEFORPEST', name: 'Voice for Pest', category: 'Communication', icon: '🎙️', description: 'Specialized voice services for pest control industry.' },
  { id: 'CTM', name: 'CTM', category: 'Communication', icon: '📞', description: 'Call tracking and marketing attribution platform.' },
  
  // Fleet Management
  { id: 'SAMSARA', name: 'Samsara', category: 'Fleet', icon: '🚚', description: 'Connected fleet management with GPS tracking and driver safety.' },
  { id: 'VERIZONCONNECT', name: 'Verizon Connect', category: 'Fleet', icon: '🛰️', description: 'Fleet management and mobile workforce solutions.' },
  { id: 'LINXUP', name: 'Linxup', category: 'Fleet', icon: '📍', description: 'GPS fleet tracking and management platform.' },
  { id: 'ZUBIE', name: 'Zubie', category: 'Fleet', icon: '🚗', description: 'Connected car platform for fleet management.' },
  { id: 'AZUGA', name: 'Azuga', category: 'Fleet', icon: '🛣️', description: 'Fleet management and driver behavior monitoring.' },
  { id: 'BOUNCIE', name: 'Bouncie', category: 'Fleet', icon: '🔍', description: 'Vehicle tracking and diagnostics platform.' },
  { id: 'SPIREON', name: 'Spireon', category: 'Fleet', icon: '📡', description: 'Fleet intelligence and asset tracking solutions.' },
  { id: 'TELETRONICS', name: 'Teletronics', category: 'Fleet', icon: '📻', description: 'Vehicle tracking and fleet management systems.' },
  { id: 'FLEETPRO', name: 'FleetPro', category: 'Fleet', icon: '🚛', description: 'Professional fleet management and optimization.' },
  
  // Reviews & Feedback
  { id: 'LISTEN360', name: 'Listen360', category: 'Reviews', icon: '⭐', description: 'Customer feedback and review management platform.' },
  { id: 'APPLAUSE', name: 'Applause', category: 'Reviews', icon: '👏', description: 'Customer experience and feedback collection.' },
  
  // Other Services
  { id: 'DIGITALSOUTH', name: 'Digital South', category: 'Other', icon: '🌐', description: 'Digital marketing and web services.' },
  { id: 'ONESTEP', name: 'OneStep', category: 'Other', icon: '👣', description: 'Specialized service integration platform.' }
];

export const categories = ['All', 'CRM', 'Communication', 'Fleet', 'Reviews', 'Other'];