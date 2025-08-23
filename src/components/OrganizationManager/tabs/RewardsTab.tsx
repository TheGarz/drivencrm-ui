import React, { useState } from 'react';
import { Gift, ExternalLink, Check, X, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

interface RewardsTabProps {
  organization: Organization;
  onUpdate: (organization: Organization) => void;
}

interface SnappyOrgInfo {
  id: string;
  name: string;
  status: string;
  balance: number;
  currency: string;
  created_at: string;
  webhook_url?: string;
}

const RewardsTab: React.FC<RewardsTabProps> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [rewardsEnabled, setRewardsEnabled] = useState(false);
  const [snappyConnected, setSnappyConnected] = useState(false);
  const [snappyOrgInfo, setSnappyOrgInfo] = useState<SnappyOrgInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleEnableRewards = async (enabled: boolean) => {
    setRewardsEnabled(enabled);
    setError('');
    setSuccess(enabled ? 'Rewards feature enabled' : 'Rewards feature disabled');
    
    // Update organization with rewards settings
    const updatedOrg = {
      ...organization,
      settings: {
        ...organization.settings,
        rewardsEnabled: enabled
      }
    };
    onUpdate(updatedOrg);
  };

  const handleCreateSnappyOrg = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call to create organization in Snappy
      const response = await fetch('/api/snappy/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: organization.name,
          external_id: organization.id.toString(),
          webhook_url: `${window.location.origin}/api/webhooks/snappy`,
          settings: {
            currency: 'USD',
            auto_approval: false,
            budget_limit: 10000
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create organization in Snappy');
      }

      const snappyOrg: SnappyOrgInfo = await response.json();
      
      setSnappyOrgInfo(snappyOrg);
      setSnappyConnected(true);
      setSuccess(`Organization "${snappyOrg.name}" created successfully in Snappy`);

      // Update organization with Snappy connection info
      const updatedOrg = {
        ...organization,
        settings: {
          ...organization.settings,
          snappyOrgId: snappyOrg.id,
          snappyConnected: true
        }
      };
      onUpdate(updatedOrg);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization in Snappy');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectSnappy = () => {
    setSnappyConnected(false);
    setSnappyOrgInfo(null);
    setSuccess('Disconnected from Snappy');

    const updatedOrg = {
      ...organization,
      settings: {
        ...organization.settings,
        snappyOrgId: null,
        snappyConnected: false
      }
    };
    onUpdate(updatedOrg);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          color: currentTheme.textPrimary,
          fontSize: '24px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Gift size={24} />
          Rewards Management
        </h2>
        <p style={{
          color: currentTheme.textSecondary,
          fontSize: '16px',
          margin: 0
        }}>
          Integrate with Snappy to send rewards and gifts to your customers
        </p>
      </div>

      {/* Status Messages */}
      {error && (
        <div style={{
          backgroundColor: currentTheme.danger + '10',
          border: `1px solid ${currentTheme.danger}40`,
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} style={{ color: currentTheme.danger }} />
          <span style={{ color: currentTheme.danger, fontSize: '14px' }}>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: currentTheme.success + '10',
          border: `1px solid ${currentTheme.success}40`,
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} style={{ color: currentTheme.success }} />
          <span style={{ color: currentTheme.success, fontSize: '14px' }}>{success}</span>
        </div>
      )}

      {/* Enable Rewards */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h3 style={{
              color: currentTheme.textPrimary,
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              Enable Rewards Feature
            </h3>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '14px',
              margin: 0
            }}>
              Allow this organization to send rewards and gifts to customers
            </p>
          </div>
          
          <button
            onClick={() => handleEnableRewards(!rewardsEnabled)}
            style={{
              position: 'relative',
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: rewardsEnabled ? currentTheme.primary : currentTheme.border,
              transition: 'background-color 0.2s ease'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '2px',
              left: rewardsEnabled ? '22px' : '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'white',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
            }} />
          </button>
        </div>
      </div>

      {/* Snappy Integration */}
      {rewardsEnabled && (
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '12px',
          border: `1px solid ${currentTheme.border}`,
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: currentTheme.textPrimary,
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>
              Snappy Integration
            </h3>
            {snappyConnected && (
              <span style={{
                backgroundColor: currentTheme.success + '20',
                color: currentTheme.success,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Check size={12} />
                Connected
              </span>
            )}
          </div>

          {!snappyConnected ? (
            <div>
              <p style={{
                color: currentTheme.textSecondary,
                fontSize: '14px',
                marginBottom: '16px'
              }}>
                Create an organization in Snappy to start sending rewards and gifts to your customers.
              </p>
              
              <button
                onClick={handleCreateSnappyOrg}
                disabled={loading}
                style={{
                  backgroundColor: currentTheme.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ExternalLink size={16} />
                {loading ? 'Creating...' : 'Create Org in Snappy'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                backgroundColor: currentTheme.background,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 12px 0'
                }}>
                  Organization Details
                </h4>
                
                {snappyOrgInfo && (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Snappy Org ID:
                      </span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        {snappyOrgInfo.id}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Status:
                      </span>
                      <span style={{ 
                        color: snappyOrgInfo.status === 'active' ? currentTheme.success : currentTheme.warning, 
                        fontSize: '14px', 
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {snappyOrgInfo.status}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Balance:
                      </span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        ${snappyOrgInfo.balance.toLocaleString()} {snappyOrgInfo.currency}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Created:
                      </span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        {new Date(snappyOrgInfo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href="https://app.snappy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'transparent',
                    color: currentTheme.primary,
                    border: `1px solid ${currentTheme.primary}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={14} />
                  Open Snappy Dashboard
                </a>
                
                <button
                  onClick={handleDisconnectSnappy}
                  style={{
                    backgroundColor: 'transparent',
                    color: currentTheme.danger,
                    border: `1px solid ${currentTheme.danger}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <X size={14} />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RewardsTab;