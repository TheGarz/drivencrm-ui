import { Shield, Settings, ArrowRight, Lock, Smartphone, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme';
import { DrivenBrandLogo } from './DrivenBrandLogo';

interface TwoFactorSetupRequiredScreenProps {
  onGoToProfile: () => void;
  userEmail: string;
  userName: string;
}

export const TwoFactorSetupRequiredScreen = ({ onGoToProfile, userEmail, userName }: TwoFactorSetupRequiredScreenProps) => {
  const { currentTheme, theme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh',
      background: theme === 'dark' 
        ? `linear-gradient(135deg, ${currentTheme.background} 0%, ${currentTheme.sidebarBg} 100%)`
        : `linear-gradient(135deg, ${currentTheme.background} 0%, ${currentTheme.sand} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 25% 25%, ${currentTheme.primary}08 0%, transparent 50%), 
                         radial-gradient(circle at 75% 75%, ${currentTheme.accent}05 0%, transparent 50%)`,
        pointerEvents: 'none'
      }} />

      {/* Setup Required Card */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '580px',
        border: `2px solid ${currentTheme.border}`,
        boxShadow: theme === 'dark' 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <DrivenBrandLogo 
            variant="square"
            height={100}
            style={{ marginBottom: '12px' }}
          />
          
          <div style={{
            backgroundColor: `${currentTheme.warning}15`,
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <Shield size={32} style={{ color: currentTheme.warning }} />
          </div>

          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 12px 0'
          }}>
            Two-Factor Authentication Required
          </h1>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: '0 0 8px 0',
            lineHeight: '1.5'
          }}>
            Welcome <strong style={{ color: currentTheme.textPrimary }}>{userName}</strong>!
          </p>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Your account is enabled and required to have two-factor authentication. Please complete the setup below before accessing the dashboard.
          </p>
        </div>

        {/* Setup Steps */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            How to Set Up 2FA:
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '16px',
              backgroundColor: `${currentTheme.primary}08`,
              borderRadius: '12px',
              border: `1px solid ${currentTheme.primary}20`
            }}>
              <div style={{
                backgroundColor: currentTheme.primary,
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 6px 0'
                }}>
                  Download an Authenticator App
                </h4>
                <p style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Install Google Authenticator, Authy, or another TOTP authenticator app on your smartphone.
                </p>
              </div>
              <Smartphone size={20} style={{ color: currentTheme.primary, flexShrink: 0 }} />
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '16px',
              backgroundColor: `${currentTheme.primary}08`,
              borderRadius: '12px',
              border: `1px solid ${currentTheme.primary}20`
            }}>
              <div style={{
                backgroundColor: currentTheme.primary,
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 6px 0'
                }}>
                  Go to Your Profile Settings
                </h4>
                <p style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Navigate to your profile settings and look for the "Two-Factor Authentication" section.
                </p>
              </div>
              <Settings size={20} style={{ color: currentTheme.primary, flexShrink: 0 }} />
            </div>

            {/* Step 3 */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              padding: '16px',
              backgroundColor: `${currentTheme.primary}08`,
              borderRadius: '12px',
              border: `1px solid ${currentTheme.primary}20`
            }}>
              <div style={{
                backgroundColor: currentTheme.primary,
                color: 'white',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <h4 style={{
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 6px 0'
                }}>
                  Scan the QR Code & Enable 2FA
                </h4>
                <p style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  Scan the QR code with your authenticator app and complete the setup process.
                </p>
              </div>
              <CheckCircle size={20} style={{ color: currentTheme.primary, flexShrink: 0 }} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onGoToProfile}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: currentTheme.primary,
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 25px ${currentTheme.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Settings size={20} />
          Go to Profile Settings
          <ArrowRight size={20} />
        </button>

        {/* Security Note */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: `${currentTheme.success}10`,
          border: `1px solid ${currentTheme.success}30`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <Lock size={20} style={{ color: currentTheme.success, flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              Why is 2FA required?
            </h4>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              margin: 0,
              lineHeight: '1.4'
            }}>
              Two-factor authentication adds an extra layer of security to your account by requiring both your password and a verification code from your phone.
            </p>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default TwoFactorSetupRequiredScreen;