import React, { useState } from 'react';
import { Building, Building2, User } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import OrganizationRulesTab from './CustomRulesTab/OrganizationRulesTab';
import BranchRulesTab from './CustomRulesTab/BranchRulesTab';
import UserRulesTab from './CustomRulesTab/UserRulesTab';
import type { Organization } from '../types';

type TabType = 'organization' | 'branch' | 'user';

const CustomRulesTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('organization');

  const tabs = [
    {
      id: 'organization' as TabType,
      label: 'Organization',
      icon: Building,
      description: 'Organization-wide rules'
    },
    {
      id: 'branch' as TabType,
      label: 'Branch',
      icon: Building2,
      description: 'Branch-specific rules'
    },
    {
      id: 'user' as TabType,
      label: 'User',
      icon: User,
      description: 'User-specific rules'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'organization':
        return <OrganizationRulesTab organization={organization} onUpdate={onUpdate} />;
      case 'branch':
        return <BranchRulesTab organization={organization} onUpdate={onUpdate} />;
      case 'user':
        return <UserRulesTab organization={organization} onUpdate={onUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab Navigation */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px 12px 0 0',
        border: `1px solid ${currentTheme.border}`,
        borderBottom: 'none'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '16px 20px',
                  border: 'none',
                  backgroundColor: isActive ? currentTheme.background : 'transparent',
                  color: isActive ? currentTheme.primary : currentTheme.textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  borderBottom: isActive ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  borderRadius: tab.id === 'organization' ? '12px 0 0 0' : 
                            tab.id === 'user' ? '0 12px 0 0' : '0'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = currentTheme.border + '40';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <IconComponent size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Tab Description */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: currentTheme.background + '80',
          fontSize: '12px',
          color: currentTheme.textSecondary,
          fontStyle: 'italic'
        }}>
          {tabs.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '0 0 12px 12px',
        border: `1px solid ${currentTheme.border}`,
        borderTop: 'none',
        flex: 1,
        minHeight: '500px'
      }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CustomRulesTab;