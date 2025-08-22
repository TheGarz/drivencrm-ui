import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useTheme } from '../theme';
import { DrivenBrandLogo } from './DrivenBrandLogo';

interface ResetPasswordScreenProps {
  onBack: () => void;
  onSubmit: (passwords: { password: string; confirmPassword: string }) => Promise<void>;
  email: string;
}

export const ResetPasswordScreen = ({ onBack, onSubmit, email }: ResetPasswordScreenProps) => {
  const { currentTheme, theme } = useTheme();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'password' | 'confirmPassword') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) {
setError('');
} // Clear error when user starts typing
  };

  // Success state after password reset
  if (isSubmitted) {
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

        {/* Success Card */}
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '24px',
          padding: '48px',
          width: '100%',
          maxWidth: '480px',
          border: `2px solid ${currentTheme.border}`,
          boxShadow: theme === 'dark' 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}>
          <DrivenBrandLogo 
            variant="square"
            height={80}
            style={{ marginBottom: '24px' }}
          />
          
          <div style={{
            backgroundColor: `${currentTheme.success}15`,
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <CheckCircle size={32} style={{ color: currentTheme.success }} />
          </div>

          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 16px 0'
          }}>
            Password Reset Successful
          </h1>
          
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: '0 0 32px 0',
            lineHeight: '1.5'
          }}>
            Your password has been successfully reset. You can now sign in with your new password.
          </p>

          <button
            onClick={onBack}
            style={{
              width: '100%',
              padding: '16px',
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
              gap: '8px'
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
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

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

      {/* Reset Password Card */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '480px',
        border: `2px solid ${currentTheme.border}`,
        boxShadow: theme === 'dark' 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: currentTheme.textSecondary,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: '24px',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = currentTheme.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = currentTheme.textSecondary;
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <DrivenBrandLogo 
            variant="square"
            height={100}
            style={{ marginBottom: '12px' }}
          />
          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 6px 0'
          }}>
            Reset Password
          </h1>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Enter your new password for <strong style={{ color: currentTheme.textPrimary }}>{email}</strong>
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* New Password Field */}
          <div>
            <label style={{
              display: 'block',
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: currentTheme.textSecondary,
                width: '20px',
                height: '20px'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="Enter new password"
                required
                style={{
                  width: '100%',
                  padding: '16px 48px 16px 48px',
                  borderRadius: '12px',
                  border: `2px solid ${error ? currentTheme.danger : currentTheme.border}`,
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentTheme.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${currentTheme.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? currentTheme.danger : currentTheme.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: currentTheme.textSecondary,
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.textSecondary;
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label style={{
              display: 'block',
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Confirm New Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: currentTheme.textSecondary,
                width: '20px',
                height: '20px'
              }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Confirm new password"
                required
                style={{
                  width: '100%',
                  padding: '16px 48px 16px 48px',
                  borderRadius: '12px',
                  border: `2px solid ${error ? currentTheme.danger : currentTheme.border}`,
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentTheme.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${currentTheme.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? currentTheme.danger : currentTheme.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: currentTheme.textSecondary,
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = currentTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = currentTheme.textSecondary;
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div style={{
            backgroundColor: `${currentTheme.primary}10`,
            border: `1px solid ${currentTheme.primary}30`,
            borderRadius: '12px',
            padding: '12px 16px'
          }}>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              margin: '0 0 4px 0',
              fontWeight: '600'
            }}>
              Password Requirements:
            </p>
            <ul style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              margin: 0,
              paddingLeft: '16px'
            }}>
              <li>At least 8 characters long</li>
              <li>Both passwords must match</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: `${currentTheme.danger}15`,
              border: `1px solid ${currentTheme.danger}`,
              borderRadius: '12px',
              padding: '12px 16px',
              color: currentTheme.danger,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isLoading ? currentTheme.textSecondary : currentTheme.primary,
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${currentTheme.primary}40`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <CheckCircle size={20} />
            )}
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${currentTheme.border}`,
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: currentTheme.textSecondary,
            fontSize: '12px'
          }}>
            <span>Powered by</span>
            <DrivenBrandLogo height={16} />
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordScreen;
