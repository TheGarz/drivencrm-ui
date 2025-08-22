import { MapPin, Users2, Target, Users } from 'lucide-react';
import type { MetricDescription } from '../../types';

export const availableMetrics: MetricDescription[] = [
  // Branch Metrics
  { key: 'revenue', name: 'Revenue', shortLabel: 'Revenue', icon: '💰', category: 'branch' },
  { key: 'cancels', name: 'Cancellations', shortLabel: 'Cancels', icon: '❌', category: 'branch' },
  { key: 'leads', name: 'Leads Generated', shortLabel: 'Leads', icon: '🎯', category: 'branch' },
  { key: 'sales', name: 'Sales Closed', shortLabel: 'Sales', icon: '💼', category: 'branch' },
  { key: 'arc', name: 'AR Collected', shortLabel: 'AR', icon: '💵', category: 'branch' },
  { key: 'closeratio', name: 'Close Ratio', shortLabel: 'Close %', icon: '📊', category: 'branch' },
  { key: 'activesubs', name: 'Active Subscriptions', shortLabel: 'Active Subs', icon: '✅', category: 'branch' },
  { key: 'cancelrate', name: 'Cancel Rate', shortLabel: 'Cancel %', icon: '📉', category: 'branch' },
  
  // CSR Metrics
  { key: 'answering', name: 'Call Answering', shortLabel: 'Answering', icon: '📞', category: 'csr' },
  { key: 'reviews', name: 'Customer Reviews', shortLabel: 'Reviews', icon: '⭐', category: 'csr' },
  { key: 'csr_cancels', name: 'CSR Cancellations', shortLabel: 'Cancels', icon: '❌', category: 'csr' },
  { key: 'csr_arc', name: 'CSR AR Collected', shortLabel: 'AR', icon: '💵', category: 'csr' },
  { key: 'arcpercent', name: 'AR Collection %', shortLabel: 'AR %', icon: '📊', category: 'csr' },
  
  // Sales Metrics
  { key: 'commission', name: 'Commission Earned', shortLabel: 'Commission', icon: '💰', category: 'sales' },
  { key: 'sales_sales', name: 'Sales Volume', shortLabel: 'Sales', icon: '💼', category: 'sales' },
  { key: 'closing', name: 'Closing Rate', shortLabel: 'Close %', icon: '🎯', category: 'sales' },
  { key: 'treatment', name: 'Treatment Sales', shortLabel: 'Treatment', icon: '🛡️', category: 'sales' },
  { key: 'sales_cancels', name: 'Sales Cancellations', shortLabel: 'Cancels', icon: '❌', category: 'sales' },
  
  // Tech Metrics
  { key: 'completion', name: 'Service Completion', shortLabel: 'Completion', icon: '✅', category: 'tech' },
  { key: 'prodperhour', name: 'Production per Hour', shortLabel: 'Prod/Hr', icon: '⏱️', category: 'tech' },
  { key: 'tech_reviews', name: 'Tech Reviews', shortLabel: 'Reviews', icon: '⭐', category: 'tech' },
  { key: 'attendance', name: 'Attendance Rate', shortLabel: 'Attendance', icon: '👥', category: 'tech' },
  { key: 'driving', name: 'Driving Time', shortLabel: 'Drive Time', icon: '🚗', category: 'tech' },
  { key: 'quality', name: 'Service Quality', shortLabel: 'Quality', icon: '🏆', category: 'tech' },
  { key: 'nps', name: 'Net Promoter Score', shortLabel: 'NPS', icon: '📈', category: 'tech' },
  { key: 'reservice', name: 'Re-service Rate', shortLabel: 'Re-service', icon: '🔄', category: 'tech' }
];

export const defaultGroups = [
  { id: 'branch', name: 'branch', displayName: 'Branch', icon: MapPin, isDefault: true },
  { id: 'csr', name: 'csr', displayName: 'CSR', icon: Users2, isDefault: true },
  { id: 'sales', name: 'sales', displayName: 'Sales', icon: Target, isDefault: true },
  { id: 'tech', name: 'tech', displayName: 'Tech', icon: Users, isDefault: true }
];