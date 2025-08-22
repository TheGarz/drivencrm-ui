import { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { useTheme } from '../theme';
import { DrivenBrandLogo } from './DrivenBrandLogo';

interface TwoFactorScreenProps {
  onBack: () => void;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  userEmail: string;
}

export const TwoFactorScreen = ({ onBack, onVerify, onResendCode, userEmail }: TwoFactorScreenProps) => {
  const { currentTheme, theme } = useTheme();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onVerify(fullCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code. Please try again.');
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value !== '' && !/^\d$/.test(value)) {
return;
}

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (error) {
setError('');
} // Clear error when user starts typing

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && !isLoading) {
      setTimeout(() => {
        const fullCode = newCode.join('');
        handleVerifyCode(fullCode);
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      
      // Auto-submit pasted code
      setTimeout(() => {
        handleVerifyCode(pastedData);
      }, 100);
    }
  };

  const handleVerifyCode = async (fullCode: string) => {
    if (fullCode.length !== 6) {
return;
}

    setError('');
    setIsLoading(true);

    try {
      await onVerify(fullCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      await onResendCode();
      setResendTimer(60); // 60 second cooldown
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

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

      {/* 2FA Card */}
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
          
          <div style={{
            backgroundColor: `${currentTheme.primary}15`,
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto'
          }}>
            <Shield size={32} style={{ color: currentTheme.primary }} />
          </div>

          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 6px 0'
          }}>
            Two-Factor Authentication
          </h1>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Enter the 6-digit code from your authenticator app or SMS sent to <strong style={{ color: currentTheme.textPrimary }}>{userEmail}</strong>
          </p>
        </div>

        {/* 2FA Code Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Code Input Fields */}
          <div>
            <label style={{
              display: 'block',
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              Verification Code
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
 if (el) {
inputRefs.current[index] = el;
} 
}}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    border: `2px solid ${error ? currentTheme.danger : (digit ? currentTheme.primary : currentTheme.border)}`,
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = currentTheme.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${currentTheme.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = error ? currentTheme.danger : (digit ? currentTheme.primary : currentTheme.border);
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              textAlign: 'center',
              margin: '0'
            }}>
              Enter code manually or paste from clipboard
            </p>
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
              fontWeight: '500',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || code.join('').length !== 6}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: (isLoading || code.join('').length !== 6) ? currentTheme.textSecondary : currentTheme.primary,
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (isLoading || code.join('').length !== 6) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading && code.join('').length === 6) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${currentTheme.primary}40`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && code.join('').length === 6) {
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

          {/* Resend Code */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '14px',
              margin: '0 0 8px 0'
            }}>
              Didn't receive a code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || resendTimer > 0}
              style={{
                background: 'none',
                border: 'none',
                color: (isResending || resendTimer > 0) ? currentTheme.textSecondary : currentTheme.primary,
                fontSize: '14px',
                fontWeight: '600',
                cursor: (isResending || resendTimer > 0) ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                margin: '0 auto'
              }}
            >
              {isResending ? (
                <>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Sending...
                </>
              ) : resendTimer > 0 ? (
                `Resend in ${resendTimer}s`
              ) : (
                <>
                  <RotateCcw size={14} />
                  Resend Code
                </>
              )}
            </button>
          </div>
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

export default TwoFactorScreen;
