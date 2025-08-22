import { useState } from 'react';
import { Mail, ArrowLeft, Send, Loader2, Key, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme';
import { DrivenBrandLogo } from './DrivenBrandLogo';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSubmit: (email: string) => Promise<void>;
  onVerifyToken: (token: string) => Promise<void>;
}

export const ForgotPasswordScreen = ({ onBack, onSubmit, onVerifyToken }: ForgotPasswordScreenProps) => {
  const { currentTheme, theme } = useTheme();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tokenError, setTokenError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
setError('');
} // Clear error when user starts typing
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    if (tokenError) {
setTokenError('');
} // Clear error when user starts typing
  };

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError('');
    setIsLoading(true);

    try {
      await onVerifyToken(token);
      // Success will be handled by parent component (redirect to reset password page)
    } catch (err) {
      setTokenError(err instanceof Error ? err.message : 'Invalid token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Send size={32} style={{ color: currentTheme.success }} />
          </div>

          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 16px 0'
          }}>
            Check Your Email
          </h1>
          
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: '0 0 32px 0',
            lineHeight: '1.5'
          }}>
            We've sent a verification code to <strong style={{ color: currentTheme.textPrimary }}>{email}</strong>. 
            Enter the code below to continue.
          </p>

          {/* Token Input Form */}
          <form onSubmit={handleTokenSubmit} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                color: currentTheme.textPrimary,
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Verification Code
              </label>
              <div style={{ position: 'relative' }}>
                <Key style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: currentTheme.textSecondary,
                  width: '20px',
                  height: '20px'
                }} />
                <input
                  type="text"
                  value={token}
                  onChange={handleTokenChange}
                  placeholder="Enter verification code"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    borderRadius: '12px',
                    border: `2px solid ${tokenError ? currentTheme.danger : currentTheme.border}`,
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    letterSpacing: '2px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = currentTheme.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${currentTheme.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = tokenError ? currentTheme.danger : currentTheme.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Token Error Message */}
            {tokenError && (
              <div style={{
                backgroundColor: `${currentTheme.danger}15`,
                border: `1px solid ${currentTheme.danger}`,
                borderRadius: '12px',
                padding: '12px 16px',
                color: currentTheme.danger,
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '16px'
              }}>
                {tokenError}
              </div>
            )}

            {/* Verify Button */}
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
                gap: '8px',
                marginBottom: '16px'
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
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: `2px solid ${currentTheme.border}`,
              backgroundColor: currentTheme.background,
              color: currentTheme.textPrimary,
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = currentTheme.primary;
              e.currentTarget.style.backgroundColor = currentTheme.cardBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = currentTheme.border;
              e.currentTarget.style.backgroundColor = currentTheme.background;
            }}
          >
            <ArrowLeft size={20} />
            Back to Login
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

      {/* Forgot Password Card */}
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
          Back to Login
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
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: currentTheme.textSecondary,
                width: '20px',
                height: '20px'
              }} />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                required
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
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
            </div>
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

          {/* Send Reset Email Button */}
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
              <Send size={20} />
            )}
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: `1px solid ${currentTheme.border}`,
          textAlign: 'center'
        }}>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            Remember your password?{' '}
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: currentTheme.primary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={onBack}
            >
              Sign In
            </button>
          </p>
          
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

export default ForgotPasswordScreen;
