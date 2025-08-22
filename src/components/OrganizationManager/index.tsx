import React, { useState } from 'react';
import { ArrowLeft, Building2, Users, BarChart3, Plug, Wrench } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import type { Organization, OrganizationManagerProps } from './types';
import { mockOrganization } from './mockData';

// Import all tab components
import GeneralTab from './tabs/GeneralTab';
import UsersTab from './tabs/UsersTab';
import MetricsTab from './tabs/MetricsTab';
import IntegrationsTab from './tabs/IntegrationsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import CustomRulesTab from './tabs/CustomRulesTab';

const OrganizationManager: React.FC<OrganizationManagerProps> = ({ onBack }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [organization, setOrganization] = useState<Organization>(mockOrganization);
  const [showAddUser, setShowAddUser] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Building2, component: GeneralTab },
    { id: 'users', label: 'Users', icon: Users, component: UsersTab },
    { id: 'metrics', label: 'Metrics', icon: BarChart3, component: MetricsTab },
    { id: 'integrations', label: 'Integrations', icon: Plug, component: IntegrationsTab },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, component: AnalyticsTab },
    { id: 'rules', label: 'Custom Rules', icon: Wrench, component: CustomRulesTab }
  ];

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    setOrganization(updatedOrg);
    // Here you would typically make an API call to save the changes
    console.log('Organization updated:', updatedOrg);
  };

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

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
          <h1 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '32px',
            fontWeight: '600'
          }}>
            {organization.name}
          </h1>
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
          { label: 'Status', value: organization.active ? 'Active' : 'Inactive', color: organization.active ? currentTheme.success : currentTheme.danger },
          { label: 'Total Users', value: organization.total_users || 0, color: currentTheme.primary },
          { label: 'Total Branches', value: organization.total_branches || 0, color: currentTheme.primary },
          { label: 'Monthly Revenue', value: `$${(organization.monthly_revenue || 0).toLocaleString()}`, color: currentTheme.success },
          { label: 'Integrations', value: organization.integration_count || 0, color: currentTheme.primary },
          { label: 'Last Sync', value: new Date(organization.last_sync).toLocaleDateString(), color: currentTheme.textSecondary }
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
          {ActiveTabComponent && (
            <ActiveTabComponent
              organization={organization}
              onUpdate={handleUpdateOrganization}
              {...(activeTab === 'users' && { onShowAddUser: () => setShowAddUser(true) })}
            />
          )}
        </div>
      </div>

      {/* Add User Modal (placeholder for now) */}
      {showAddUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ color: currentTheme.textPrimary, marginBottom: '24px' }}>Add New User</h2>
            <p style={{ color: currentTheme.textSecondary, marginBottom: '24px' }}>
              User management functionality would go here.
            </p>
            <button
              onClick={() => setShowAddUser(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: currentTheme.primary,
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;