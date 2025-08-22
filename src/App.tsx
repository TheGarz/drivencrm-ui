import { useState } from 'react';
import { ThemeProvider } from './theme';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { RoleBasedDashboard } from './components/RoleBasedDashboard';
import { LoginScreen } from './components/LoginScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { TwoFactorScreen } from './components/TwoFactorScreen';

type AuthView = 'login' | 'forgot-password' | 'reset-password' | '2fa';

const AppContent = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [pendingAuth, setPendingAuth] = useState<{ email: string; password: string; rememberMe?: boolean } | null>(null);

  const handleForgotPassword = async (email: string) => {
    // Simulate API call for password reset
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Password reset email sent
    setResetEmail(email); // Store email for later use
    // In a real app, this would make an API call to send the reset email
  };

  const handleVerifyToken = async (token: string) => {
    // Simulate API call for token verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Token verified successfully
    // In a real app, this would verify the token with your backend
    // and then redirect to password reset page
    setCurrentView('reset-password');
  };

  const handleResetPassword = async (_passwords: { password: string; confirmPassword: string }) => {
    // Simulate API call for password reset
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Password reset successful
    // In a real app, this would send the new password to your backend
    // After successful reset, the success screen will show and then user can go back to login
  };

  const handleLogin = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    // First verify credentials
    // Simulate credential verification (without completing login)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if credentials are valid for any demo user
    const validEmails = ['admin@driven.com', 'owner@demo.com', 'manager@demo.com', 'tech@demo.com', 'demo@driven.com'];
    
    if (validEmails.includes(credentials.email) && credentials.password === 'demo123') {
      // All demo users have 2FA enabled for testing, show 2FA screen
      setPendingAuth(credentials);
      setCurrentView('2fa');
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const handleTwoFactorVerify = async (code: string) => {
    // Simulate 2FA verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, accept any 6-digit code
    if (code.length === 6) {
      if (pendingAuth) {
        // Complete the login process
        await login(pendingAuth);
        setPendingAuth(null);
        setCurrentView('login');
      }
    } else {
      throw new Error('Invalid verification code');
    }
  };

  const handleResendTwoFactorCode = async () => {
    // Simulate resending 2FA code
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 2FA code resent
  };

  const handleBackFrom2FA = () => {
    setPendingAuth(null);
    setCurrentView('login');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: 500
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentView === 'forgot-password') {
      return (
        <ForgotPasswordScreen 
          onBack={() => setCurrentView('login')}
          onSubmit={handleForgotPassword}
          onVerifyToken={handleVerifyToken}
        />
      );
    }
    
    if (currentView === 'reset-password') {
      return (
        <ResetPasswordScreen 
          onBack={() => setCurrentView('login')}
          onSubmit={handleResetPassword}
          email={resetEmail}
        />
      );
    }

    if (currentView === '2fa' && pendingAuth) {
      return (
        <TwoFactorScreen 
          onBack={handleBackFrom2FA}
          onVerify={handleTwoFactorVerify}
          onResendCode={handleResendTwoFactorCode}
          userEmail={pendingAuth.email}
        />
      );
    }
    
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onForgotPassword={() => setCurrentView('forgot-password')}
      />
    );
  }

  return <RoleBasedDashboard />;
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;