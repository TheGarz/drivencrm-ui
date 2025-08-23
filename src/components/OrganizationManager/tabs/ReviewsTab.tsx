import React, { useState, useEffect } from 'react';
import { Star, Globe, Facebook, MessageSquare, Save, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

interface ReviewsTabProps {
  organization: Organization;
  onUpdate: (org: Organization) => void;
}

interface ReviewSettings {
  enabled: boolean;
  googleConnected: boolean;
  googleBusinessName: string;
  googleLocationId: string;
  facebookConnected: boolean;
  facebookPageName: string;
  facebookPageId: string;
  yelpBusinessId: string;
  autoRequestReviews: boolean;
  reviewRequestDelay: number;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [settings, setSettings] = useState<ReviewSettings>({
    enabled: false,
    googleConnected: false,
    googleBusinessName: '',
    googleLocationId: '',
    facebookConnected: false,
    facebookPageName: '',
    facebookPageId: '',
    yelpBusinessId: '',
    autoRequestReviews: true,
    reviewRequestDelay: 3
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    // Load existing review settings for the organization
    // This would typically come from the organization data or a separate API call
    if (organization.id) {
      // Load settings from organization data
      setSettings(prev => ({
        ...prev,
        enabled: organization.reviewsEnabled || false
      }));
    }
  }, [organization.id, organization.reviewsEnabled]);

  const handleSettingChange = (key: keyof ReviewSettings, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    setSaveStatus('idle');
    
    // If the enabled status changed, immediately update the organization
    if (key === 'enabled') {
      const updatedOrg = {
        ...organization,
        reviewsEnabled: value,
        reviewSettings: newSettings
      };
      onUpdate(updatedOrg);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('saving');

    try {
      // Simulate API call to save review settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update organization with review settings
      const updatedOrg = {
        ...organization,
        reviewsEnabled: settings.enabled,
        reviewSettings: settings
      };
      onUpdate(updatedOrg);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving review settings:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div style={{ width: '16px', height: '16px', border: `2px solid ${currentTheme.primary}`, borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />;
      case 'saved':
        return <CheckCircle size={16} color={currentTheme.success} />;
      case 'error':
        return <AlertCircle size={16} color={currentTheme.danger} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: `1px solid ${currentTheme.border}`
      }}>
        <div>
          <h2 style={{
            color: currentTheme.textPrimary,
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 8px 0'
          }}>
            Review Management
          </h2>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '14px',
            margin: 0
          }}>
            Configure review collection and management for your organization
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: currentTheme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          {renderStatusIcon() || <Save size={16} />}
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Enable/Disable Toggle */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Star size={24} color={currentTheme.primary} />
            <div>
              <h3 style={{
                color: currentTheme.textPrimary,
                fontSize: '18px',
                fontWeight: '600',
                margin: 0
              }}>
                Review Services
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                fontSize: '14px',
                margin: '4px 0 0 0'
              }}>
                Enable review collection and management for this organization
              </p>
            </div>
          </div>
          
          <label style={{
            position: 'relative',
            display: 'inline-block',
            width: '60px',
            height: '34px'
          }}>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => handleSettingChange('enabled', e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: settings.enabled ? currentTheme.primary : currentTheme.border,
              transition: '0.4s',
              borderRadius: '34px',
              '::before': {
                position: 'absolute',
                content: '',
                height: '26px',
                width: '26px',
                left: settings.enabled ? '30px' : '4px',
                bottom: '4px',
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%'
              }
            }}>
              <div style={{
                position: 'absolute',
                content: '',
                height: '26px',
                width: '26px',
                left: settings.enabled ? '30px' : '4px',
                bottom: '4px',
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%'
              }} />
            </span>
          </label>
        </div>
      </div>

      {/* Configuration Sections - Only show when enabled */}
      {settings.enabled && (
        <>
          {/* Google Reviews Configuration */}
          <div style={{
            backgroundColor: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#4285f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Globe size={18} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Google Reviews
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  margin: '2px 0 0 0'
                }}>
                  Connect your Google My Business account
                </p>
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.background,
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: settings.googleConnected ? currentTheme.success : currentTheme.danger
                    }} />
                    <span style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {settings.googleConnected ? 'Connected to Google My Business' : 'Not Connected'}
                    </span>
                  </div>
                  {settings.googleConnected && (
                    <p style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px',
                      margin: '4px 0 0 20px'
                    }}>
                      Connected as: {settings.googleBusinessName || 'Business Account'}
                    </p>
                  )}
                </div>
                
                {settings.googleConnected ? (
                  <button
                    onClick={() => handleSettingChange('googleConnected', false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: currentTheme.danger,
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // This would trigger OAuth flow
                      const oauthUrl = `https://accounts.google.com/oauth/authorize?client_id=your-client-id&redirect_uri=${encodeURIComponent(window.location.origin)}/oauth/google&scope=${encodeURIComponent('https://www.googleapis.com/auth/business.manage')}&response_type=code&access_type=offline`;
                      window.open(oauthUrl, 'google-oauth', 'width=500,height=600');
                      // For demo, we'll simulate connection after a delay
                      setTimeout(() => {
                        handleSettingChange('googleConnected', true);
                        handleSettingChange('googleBusinessName', 'Demo Business Location');
                        handleSettingChange('googleLocationId', 'ChIJN1t_tDeuEmsRUsoyG83frY4');
                      }, 2000);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4285f4',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ExternalLink size={12} />
                    Connect Google
                  </button>
                )}
              </div>
            </div>

            {settings.googleConnected && (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '16px',
                padding: '16px',
                backgroundColor: currentTheme.success + '10',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.success}40`
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    Business Name
                  </label>
                  <span style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {settings.googleBusinessName}
                  </span>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    Location ID
                  </label>
                  <span style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'monospace'
                  }}>
                    {settings.googleLocationId}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Facebook Reviews Configuration */}
          <div style={{
            backgroundColor: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Facebook size={18} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: 0
                }}>
                  Facebook Reviews
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  margin: '2px 0 0 0'
                }}>
                  Connect your Facebook Business page
                </p>
              </div>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.background,
              borderRadius: '8px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: settings.facebookConnected ? currentTheme.success : currentTheme.danger
                    }} />
                    <span style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {settings.facebookConnected ? 'Connected to Facebook' : 'Not Connected'}
                    </span>
                  </div>
                  {settings.facebookConnected && (
                    <p style={{
                      color: currentTheme.textSecondary,
                      fontSize: '12px',
                      margin: '4px 0 0 20px'
                    }}>
                      Connected page: {settings.facebookPageName || 'Business Page'}
                    </p>
                  )}
                </div>
                
                {settings.facebookConnected ? (
                  <button
                    onClick={() => {
                      handleSettingChange('facebookConnected', false);
                      handleSettingChange('facebookPageName', '');
                      handleSettingChange('facebookPageId', '');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: currentTheme.danger,
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // This would trigger Facebook OAuth flow
                      const facebookOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=your-facebook-app-id&redirect_uri=${encodeURIComponent(window.location.origin)}/oauth/facebook&scope=pages_show_list,pages_read_engagement&response_type=code`;
                      window.open(facebookOAuthUrl, 'facebook-oauth', 'width=500,height=600');
                      // For demo, we'll simulate connection after a delay
                      setTimeout(() => {
                        handleSettingChange('facebookConnected', true);
                        handleSettingChange('facebookPageName', 'Demo Business Page');
                        handleSettingChange('facebookPageId', '123456789012345');
                      }, 2000);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#1877f2',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ExternalLink size={12} />
                    Connect Facebook
                  </button>
                )}
              </div>
            </div>

            {settings.facebookConnected && (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '16px',
                padding: '16px',
                backgroundColor: currentTheme.success + '10',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.success}40`
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    Page Name
                  </label>
                  <span style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {settings.facebookPageName}
                  </span>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    Page ID
                  </label>
                  <span style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'monospace'
                  }}>
                    {settings.facebookPageId}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Review Request Settings */}
          <div style={{
            backgroundColor: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <MessageSquare size={20} color={currentTheme.primary} />
              <h3 style={{
                color: currentTheme.textPrimary,
                fontSize: '16px',
                fontWeight: '600',
                margin: 0
              }}>
                Review Request Settings
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <label style={{
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Auto-Request Reviews
                  </label>
                  <p style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px',
                    margin: '4px 0 0 0'
                  }}>
                    Automatically send review requests after service completion
                  </p>
                </div>
                
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '50px',
                  height: '28px'
                }}>
                  <input
                    type="checkbox"
                    checked={settings.autoRequestReviews}
                    onChange={(e) => handleSettingChange('autoRequestReviews', e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.autoRequestReviews ? currentTheme.primary : currentTheme.border,
                    transition: '0.4s',
                    borderRadius: '28px'
                  }}>
                    <div style={{
                      position: 'absolute',
                      height: '20px',
                      width: '20px',
                      left: settings.autoRequestReviews ? '26px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }} />
                  </span>
                </label>
              </div>
              
              {settings.autoRequestReviews && (
                <div>
                  <label style={{
                    display: 'block',
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '6px'
                  }}>
                    Request Delay (days after service)
                  </label>
                  <select
                    value={settings.reviewRequestDelay}
                    onChange={(e) => handleSettingChange('reviewRequestDelay', parseInt(e.target.value))}
                    style={{
                      width: '200px',
                      padding: '10px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      fontSize: '14px'
                    }}
                  >
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={3}>3 days</option>
                    <option value={7}>1 week</option>
                    <option value={14}>2 weeks</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsTab;