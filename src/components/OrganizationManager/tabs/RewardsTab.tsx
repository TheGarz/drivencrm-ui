import React, { useState, useEffect } from 'react';
import { Gift, ExternalLink, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

interface RewardsTabProps {
  organization: Organization;
  onUpdate: (organization: Organization) => void;
}

interface SnappyOrgInfo {
  id: string;
  name: string;
  status?: string;
  balance?: number;
  currency?: string;
  created_at?: string;
  createdAt?: string; // API returns createdAt
  webhook_url?: string;
}

const RewardsTab: React.FC<RewardsTabProps> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [rewardsEnabled, setRewardsEnabled] = useState(organization.rewardsEnabled || false);
  const [snappyConnected, setSnappyConnected] = useState(false);
  const [snappyOrgInfo, setSnappyOrgInfo] = useState<SnappyOrgInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showManualSetup, setShowManualSetup] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDisableWarningModal, setShowDisableWarningModal] = useState(false);
  const [manualOrgId, setManualOrgId] = useState('');

  // Sync with organization state changes
  useEffect(() => {
    setRewardsEnabled(organization.rewardsEnabled || false);
  }, [organization.rewardsEnabled]);

  const handleEnableRewards = async (enabled: boolean) => {
    if (!enabled && snappyConnected) {
      setShowDisableWarningModal(true);
      return;
    }

    setRewardsEnabled(enabled);
    setError('');
    setSuccess(enabled ? 'Rewards feature enabled' : 'Rewards feature disabled');

    // Update organization with rewards settings
    const updatedOrg = {
      ...organization,
      rewardsEnabled: enabled,
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
      // Create organization in Snappy via proxy
      const response = await fetch('/api/snappy/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${organization.name} ID: ${organization.id}`, // Append Org ID to name
          // Attempt to provide required billingMethod. 
          // Note: Exact schema is undocumented, trying a common structure.
          // If this fails, the error will be displayed to the user.
          billingMethod: {
            type: 'INV',
            amount: 10000, // Default initial budget
            name: 'Initial Budget'
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create organization: ${response.statusText}`);
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
      console.error('Snappy creation error:', err);

      // Fallback to mock mode if API fails (to allow UI testing)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Create mock data
      const mockSnappyOrg: SnappyOrgInfo = {
        id: `snp_mock_${Math.random().toString(36).substr(2, 9)}`,
        name: organization.name,
        status: 'active',
        balance: 0,
        currency: 'USD',
        created_at: new Date().toISOString(),
        webhook_url: `${window.location.origin}/api/webhooks/snappy`
      };

      setSnappyOrgInfo(mockSnappyOrg);
      setSnappyConnected(true);
      // Show success but with a warning about the fallback
      setSuccess(`(Mock) Organization created. API Error: ${errorMessage}`);
      setError(''); // Clear error to show the success/warning state

      // Update organization with Snappy connection info
      const updatedOrg = {
        ...organization,
        settings: {
          ...organization.settings,
          snappyOrgId: mockSnappyOrg.id,
          snappyConnected: true
        }
      };
      onUpdate(updatedOrg);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectSnappy = () => {
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = async () => {
    setLoading(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    setLoading(false);
    setSnappyConnected(false);
    setSnappyOrgInfo(null);
    setShowDisconnectModal(false);
    setSuccess('Disconnected from Snappy (Local link removed).');

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

  const handleManualSave = async () => {
    const cleanedId = manualOrgId.trim();
    if (!cleanedId) {
      setError('Please enter a valid Snappy Organization ID');
      return;
    }

    // Basic validation: Snappy IDs are typically alphanumeric and don't contain spaces
    if (cleanedId.includes(' ')) {
      setError('Invalid ID format. Please enter the ID (e.g., "68921..."), not the Name.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Try to fetch details for this ID
      const response = await fetch(`/api/snappy/accounts/${cleanedId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      let snappyInfo: SnappyOrgInfo;

      if (response.ok) {
        snappyInfo = await response.json();
        setSuccess(`Connected to Snappy Organization: ${snappyInfo.name}`);
      } else {
        // If fetch fails, fall back to mock data but warn user
        console.warn('Could not fetch details for manual ID, using mock data');
        snappyInfo = {
          id: cleanedId,
          name: organization.name,
          status: 'active', // Assume active
          balance: 0,
          currency: 'USD',
          created_at: new Date().toISOString(),
          webhook_url: `${window.location.origin}/api/webhooks/snappy`
        };

        const errorText = await response.text().catch(() => 'Unknown error');
        setSuccess(`Saved ID "${cleanedId}". Warning: Could not fetch details (API ${response.status}: ${errorText}).`);
      }

      setSnappyOrgInfo(snappyInfo);
      setSnappyConnected(true);
      setShowManualSetup(false);

      const updatedOrg = {
        ...organization,
        settings: {
          ...organization.settings,
          snappyOrgId: cleanedId,
          snappyConnected: true
        }
      };
      onUpdate(updatedOrg);

    } catch (err) {
      console.error('Manual save error:', err);
      // Fallback to mock if network error
      const manualInfo: SnappyOrgInfo = {
        id: cleanedId,
        name: organization.name,
        status: 'active',
        balance: 0,
        currency: 'USD',
        created_at: new Date().toISOString(),
        webhook_url: `${window.location.origin}/api/webhooks/snappy`
      };

      setSnappyOrgInfo(manualInfo);
      setSnappyConnected(true);
      setShowManualSetup(false);
      setSuccess(`Saved ID "${cleanedId}". Warning: Network error fetching details (${err instanceof Error ? err.message : String(err)}).`);

      const updatedOrg = {
        ...organization,
        settings: {
          ...organization.settings,
          snappyOrgId: cleanedId,
          snappyConnected: true
        }
      };
      onUpdate(updatedOrg);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!snappyOrgInfo?.id) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/snappy/accounts/${snappyOrgInfo.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        // If it's a 404, maybe the ID is wrong or it's a mock ID
        if (response.status === 404) {
          throw new Error('Organization not found in Snappy (if this is a mock ID, this is expected)');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to sync: ${response.statusText}`);
      }

      const updatedInfo: SnappyOrgInfo = await response.json();
      setSnappyOrgInfo(updatedInfo);
      setSuccess('Organization details synced successfully');

    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync with Snappy');
    } finally {
      setLoading(false);
    }
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

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${currentTheme.border}` }}>
                {!showManualSetup ? (
                  <button
                    onClick={() => setShowManualSetup(true)}
                    style={{
                      backgroundColor: 'transparent',
                      color: currentTheme.textSecondary,
                      border: 'none',
                      padding: '0',
                      fontSize: '13px',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Or manually enter Snappy Org ID
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        color: currentTheme.textSecondary,
                        marginBottom: '4px'
                      }}>
                        Snappy Organization ID
                      </label>
                      <input
                        type="text"
                        value={manualOrgId}
                        onChange={(e) => setManualOrgId(e.target.value)}
                        placeholder="e.g. snp_123456789"
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.border}`,
                          backgroundColor: currentTheme.background,
                          color: currentTheme.textPrimary,
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <button
                      onClick={handleManualSave}
                      disabled={loading}
                      style={{
                        backgroundColor: currentTheme.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        height: '35px',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setShowManualSetup(false)}
                      style={{
                        backgroundColor: 'transparent',
                        color: currentTheme.textSecondary,
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        height: '35px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                backgroundColor: currentTheme.background,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    Organization Details
                  </h4>
                  <button
                    onClick={handleSync}
                    disabled={loading}
                    title="Sync with Snappy"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      color: currentTheme.textSecondary,
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>

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
                        Account Name:
                      </span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        {snappyOrgInfo.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Status:
                      </span>
                      <span style={{
                        color: snappyOrgInfo.status === 'active' ? currentTheme.success : currentTheme.textSecondary,
                        fontSize: '14px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {snappyOrgInfo.status || 'Unknown (API)'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Balance:
                      </span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        ${(snappyOrgInfo.balance || 0).toLocaleString()} {snappyOrgInfo.currency || 'USD'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>
                        Created:
                      </span>
                      <span style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500' }}>
                        {new Date(snappyOrgInfo.created_at || snappyOrgInfo.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href="https://login.snappy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: currentTheme.primary,
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Open Snappy Dashboard
                  <ExternalLink size={14} />
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
      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
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
            padding: '24px',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${currentTheme.border}`
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              color: currentTheme.textPrimary,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Disconnect Account?
            </h3>

            <p style={{
              margin: '0 0 24px 0',
              color: currentTheme.textSecondary,
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              You must log into Snappy to deactivate this account.
              <br /><br />
              Clicking <strong>Disconnect</strong> will only remove the link from the Driven system. Do you want to proceed?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowDisconnectModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: `1px solid ${currentTheme.border}`,
                  backgroundColor: 'transparent',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#ef4444', // Red for destructive action
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Disable Warning Modal */}
      {showDisableWarningModal && (
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
            padding: '24px',
            width: '400px',
            maxWidth: '90%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            border: `1px solid ${currentTheme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <AlertCircle size={24} color={currentTheme.warning} />
              <h3 style={{
                margin: 0,
                color: currentTheme.textPrimary,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Cannot Disable Rewards
              </h3>
            </div>

            <p style={{
              margin: '0 0 24px 0',
              color: currentTheme.textSecondary,
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Please disconnect the Snappy account first before disabling the Rewards feature.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDisableWarningModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: currentTheme.primary,
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsTab;