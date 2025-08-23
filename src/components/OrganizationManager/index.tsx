import React, { useState } from 'react';
import { ArrowLeft, Building2, Users, BarChart3, Link, Shield, Activity, Star, Gift } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import type { Organization, OrganizationManagerProps } from './types';
import { mockOrganization } from './mockData';
import UserManagement from '../UserManagement';
import AddNewUser from '../AddNewUser';

// Import all tab components
import GeneralTab from './tabs/GeneralTab';
import UsersTab from './tabs/UsersTab';
import MetricsTab from './tabs/MetricsTab';
import IntegrationsTab from './tabs/IntegrationsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import CustomRulesTab from './tabs/CustomRulesTab';
import ReviewsTab from './tabs/ReviewsTab';
import RewardsTab from './tabs/RewardsTab';

const OrganizationManager: React.FC<OrganizationManagerProps> = ({ onBack, organizationId }) => {
  const { currentTheme } = useTheme();
  const [organization, setOrganization] = useState<Organization>(() => {
    // If organizationId is provided, use it to fetch the correct organization
    // For now, using mockOrganization but setting the ID if provided
    return organizationId ? { ...mockOrganization, id: organizationId } : mockOrganization;
  });
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'organization' | 'add-user'>('organization');

  const tabs = [
    { id: 'general', label: 'General', icon: Building2, component: GeneralTab },
    { id: 'users', label: 'Users', icon: Users, component: UsersTab },
    { id: 'metrics', label: 'Metrics', icon: Activity, component: MetricsTab },
    { id: 'integrations', label: 'Integrations', icon: Link, component: IntegrationsTab },
    { id: 'custom-rules', label: 'Custom Rules', icon: Shield, component: CustomRulesTab },
    { id: 'reviews', label: 'Reviews', icon: Star, component: ReviewsTab },
    { id: 'rewards', label: 'Rewards', icon: Gift, component: RewardsTab },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: AnalyticsTab }
  ];

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    setOrganization(updatedOrg);
    // Here you would typically make an API call to save the changes
    console.log('Organization updated:', updatedOrg);
  };

  const handleShowAddUser = () => {
    setCurrentView('add-user');
  };

  const handleBackToOrganization = () => {
    setCurrentView('organization');
  };

  const handleSaveNewUser = (userData: any) => {
    // Here you would typically make an API call to save the new user
    // For now, just go back to the organization view
    console.log('Saving new user with data:', userData);
    setCurrentView('organization');
    setActiveTab('users'); // Switch back to users tab
    // In a real app, you'd also refresh the user list or add the new user to the state
  };

  const renderTabContent = () => {
    if (activeTab === 'users') {
      return <UsersTab organization={organization} onUpdate={handleUpdateOrganization} onShowAddUser={handleShowAddUser} />;
    }
    
    const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralTab;
    return <ActiveTabComponent organization={organization} onUpdate={handleUpdateOrganization} />;
  };

  // If showing add user view, render that instead
  if (currentView === 'add-user') {
    return (
      <AddNewUser 
        onBack={handleBackToOrganization} 
        onSave={handleSaveNewUser} 
      />
    );
  }

  return (
    <div style={{
      padding: '40px',
      backgroundColor: currentTheme.background,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              color: currentTheme.textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = currentTheme.primary;
              e.currentTarget.style.color = currentTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = currentTheme.border;
              e.currentTarget.style.color = currentTheme.textSecondary;
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{
              color: currentTheme.textPrimary,
              margin: 0,
              fontSize: '32px',
              fontWeight: '600'
            }}>
              {organization.name}
            </h1>
            <span style={{
              backgroundColor: organization.active ? currentTheme.success + '20' : currentTheme.danger + '20',
              color: organization.active ? currentTheme.success : currentTheme.danger,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              border: `1px solid ${organization.active ? currentTheme.success + '40' : currentTheme.danger + '40'}`
            }}>
              {organization.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '4px 0 0 0',
            fontSize: '16px'
          }}>
            Organization ID: {organization.id} • Created: {new Date(organization.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Total Users', value: organization.total_users || 0, color: currentTheme.primary },
          { label: 'Total Branches', value: organization.total_branches || 0, color: currentTheme.primary },
          { label: 'Integrations', value: organization.integration_count || 0, color: currentTheme.primary }
        ].map((metric, index) => (
          <div key={index} style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '20px'
          }}>
            <div style={{
              color: currentTheme.textSecondary,
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              {metric.label}
            </div>
            <div style={{
              color: metric.color,
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        overflow: 'hidden'
      }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${currentTheme.border}`,
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                backgroundColor: activeTab === tab.id ? currentTheme.background : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                color: activeTab === tab.id ? currentTheme.primary : currentTheme.textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = currentTheme.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = currentTheme.textSecondary;
                }
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '32px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OrganizationManager;