import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn, Loader2 } from 'lucide-react';
import { useTheme } from '../theme';
import { DrivenBrandLogo } from './DrivenBrandLogo';

interface LoginScreenProps {
  onLogin: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  onForgotPassword?: () => void;
}

export const LoginScreen = ({ onLogin, onForgotPassword }: LoginScreenProps) => {
  const { currentTheme, theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin({ ...formData, rememberMe });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(''); // Clear error when user starts typing
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

      {/* Login Card */}
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <DrivenBrandLogo 
            variant="square"
            height={120}
            style={{ marginBottom: '12px' }}
          />
          <h1 style={{
            color: currentTheme.textPrimary,
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 6px 0'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '16px',
            margin: 0
          }}>
            Sign in to your Driven Analytics account
          </p>
        </div>

        {/* Login Form */}
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
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter your email"
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

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Password
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
                placeholder="Enter your password"
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

          {/* Remember Me Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: currentTheme.primary,
                  cursor: 'pointer'
                }}
              />
            </div>
            <label 
              htmlFor="rememberMe"
              style={{
                color: currentTheme.textSecondary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              Remember me for 30 days
            </label>
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

          {/* Login Button */}
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
              <LogIn size={20} />
            )}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: currentTheme.primary,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'none',
                padding: '4px 0'
              }}
              onClick={onForgotPassword || (() => alert('Please contact your administrator to reset your password'))}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Forgot your password?
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
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '14px',
            margin: '0 0 16px 0'
          }}>
            Don't have an account?{' '}
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
              onClick={() => alert('Contact your administrator for account setup')}
            >
              Contact Administrator
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

export default LoginScreen;