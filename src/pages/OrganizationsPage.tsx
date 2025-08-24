// Organizations Page Component  
// Extracted from CompanyAdminDashboard to maintain exact styling and functionality

import React from 'react';
import { useTheme } from '../theme';
import { Search, Plus } from 'lucide-react';
import { useOrganizationManagement } from '../hooks/useOrganizationManagement';

interface OrganizationsPageProps {
  onAddOrganization: () => void;
  onManageOrganization: (orgId: number) => void;
}

const OrganizationsPage: React.FC<OrganizationsPageProps> = ({
  onAddOrganization,
  onManageOrganization
}) => {
  const { currentTheme } = useTheme();
  const {
    orgSearchQuery,
    setOrgSearchQuery,
    filteredOrganizations,
    visibleOrganizations,
    handleLoadMoreOrgs,
    setSelectedOrganizationId
  } = useOrganizationManagement();

  const handleLoginAs = (orgName: string, orgId: number) => {
    console.log(`Login as ${orgName} (ID: ${orgId})`);
    // Here you would implement the login-as functionality
    alert(`Login as ${orgName} functionality would be implemented here`);
  };

  const handleManageClick = (orgId: number) => {
    setSelectedOrganizationId(orgId);
    onManageOrganization(orgId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <h1 style={{ color: currentTheme.textPrimary, fontSize: '36px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Organizations Management
            </h1>
            <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
              Manage client organizations and configurations
            </p>
          </div>
          
          {/* Spacer to maintain layout balance */}
          <div style={{ width: '120px' }}></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Spacer to maintain search bar space */}
          <div style={{ width: '256px' }}></div>
        </div>
      </div>

      {/* Organizations List - exact same styling */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${currentTheme.border}`,
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Organizations ({filteredOrganizations.length})
          </h2>
          <button
            onClick={onAddOrganization}
            style={{
              backgroundColor: currentTheme.primary,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            Add Organization
          </button>
        </div>

        {/* Search Bar - exact same styling */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: currentTheme.textSecondary
          }} />
          <input
            type="text"
            placeholder="Search organizations..."
            value={orgSearchQuery}
            onChange={(e) => setOrgSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.cardBg,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Table Container - compact styling */}
        <div style={{ 
          minWidth: '900px',
          overflowX: 'auto',
          backgroundColor: currentTheme.background,
          borderRadius: '12px',
          border: `1px solid ${currentTheme.border}15`
        }}>
          {/* Organizations Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '50px 1fr 70px 80px 90px 70px 70px 90px 160px',
            gap: '8px',
            padding: '16px 20px',
            backgroundColor: currentTheme.sidebarBg,
            borderBottom: `2px solid ${currentTheme.border}`,
            fontWeight: '600',
            fontSize: '11px',
            color: '#CBD5E1',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}>
            <div style={{ textAlign: 'left' }}>ID</div>
            <div style={{ textAlign: 'left' }}>Name</div>
            <div style={{ textAlign: 'center' }}>Users</div>
            <div style={{ textAlign: 'center' }}>Branches</div>
            <div style={{ textAlign: 'center' }}>Integrations</div>
            <div style={{ textAlign: 'center' }}>Reviews</div>
            <div style={{ textAlign: 'center' }}>Rewards</div>
            <div style={{ textAlign: 'center' }}>Status</div>
            <div style={{ textAlign: 'center' }}>Actions</div>
          </div>

          {/* Organizations Data */}
          {visibleOrganizations.map((org, index) => (
            <div key={org.id} style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 70px 80px 90px 70px 70px 90px 160px',
              gap: '8px',
              padding: '14px 20px',
              borderBottom: `1px solid ${currentTheme.border}15`,
              alignItems: 'center',
              backgroundColor: index % 2 === 0 ? 'transparent' : `${currentTheme.sidebarBg}15`,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${currentTheme.primary}06`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : `${currentTheme.sidebarBg}15`;
            }}>
              <div style={{ 
                color: currentTheme.textSecondary, 
                fontWeight: '600',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                #{org.id}
              </div>
              <div style={{ 
                color: currentTheme.textPrimary, 
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {org.name}
              </div>
              <div style={{ 
                color: currentTheme.textPrimary, 
                fontWeight: '600',
                textAlign: 'center',
                fontSize: '13px',
                padding: '4px 8px',
                backgroundColor: `${currentTheme.primary}12`,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.primary}25`
              }}>
                {org.userCount}
              </div>
              <div style={{ 
                color: currentTheme.textPrimary, 
                fontWeight: '600',
                textAlign: 'center',
                fontSize: '13px',
                padding: '4px 8px',
                backgroundColor: `${currentTheme.warning}12`,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.warning}25`
              }}>
                {org.branchCount}
              </div>
              <div style={{ 
                color: currentTheme.textPrimary, 
                fontWeight: '600',
                textAlign: 'center',
                fontSize: '13px',
                padding: '4px 8px',
                backgroundColor: `${currentTheme.success}12`,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.success}25`
              }}>
                {org.integrationCount}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  backgroundColor: org.reviewsEnabled ? currentTheme.success + '12' : currentTheme.danger + '12',
                  color: org.reviewsEnabled ? currentTheme.success : currentTheme.danger,
                  border: `1px solid ${org.reviewsEnabled ? currentTheme.success : currentTheme.danger}25`,
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {org.reviewsEnabled ? '✓' : '✗'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  backgroundColor: org.rewardsEnabled ? currentTheme.success + '12' : currentTheme.danger + '12',
                  color: org.rewardsEnabled ? currentTheme.success : currentTheme.danger,
                  border: `1px solid ${org.rewardsEnabled ? currentTheme.success : currentTheme.danger}25`,
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {org.rewardsEnabled ? '✓' : '✗'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '15px',
                  fontSize: '10px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  backgroundColor: org.active ? currentTheme.success + '12' : currentTheme.danger + '12',
                  color: org.active ? currentTheme.success : currentTheme.danger,
                  border: `1px solid ${org.active ? currentTheme.success : currentTheme.danger}30`,
                  minWidth: '70px',
                  textAlign: 'center'
                }}>
                  {org.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleManageClick(org.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${currentTheme.primary}40`,
                    color: currentTheme.primary,
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    minWidth: '60px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primary;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = currentTheme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = currentTheme.primary;
                    e.currentTarget.style.borderColor = `${currentTheme.primary}40`;
                  }}
                >
                  Manage
                </button>
                <button
                  onClick={() => handleLoginAs(org.name, org.id)}
                  style={{
                    backgroundColor: currentTheme.success,
                    border: `1px solid ${currentTheme.success}`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'white',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    minWidth: '60px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.primary;
                    e.currentTarget.style.borderColor = currentTheme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.success;
                    e.currentTarget.style.borderColor = currentTheme.success;
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          ))}

          {/* Load More Button - compact styling */}
          {filteredOrganizations.length > visibleOrganizations.length && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '16px 20px',
              borderTop: `1px solid ${currentTheme.border}15`,
              backgroundColor: `${currentTheme.sidebarBg}08`,
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px'
            }}>
              <button
                onClick={handleLoadMoreOrgs}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentTheme.primary + '10',
                  border: `1px solid ${currentTheme.primary}40`,
                  borderRadius: '8px',
                  color: currentTheme.primary,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = currentTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                  e.currentTarget.style.color = currentTheme.primary;
                  e.currentTarget.style.borderColor = `${currentTheme.primary}40`;
                }}
              >
                <Plus size={14} />
                Load More ({filteredOrganizations.length - visibleOrganizations.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationsPage;
