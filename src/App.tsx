import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './theme';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { RoleBasedDashboard } from './components/RoleBasedDashboard';
import CustomerLayout from './components/layouts/CustomerLayout';
import { LoginScreen } from './components/LoginScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { TwoFactorScreen } from './components/TwoFactorScreen';
import { TwoFactorSetupRequiredScreen } from './components/TwoFactorSetupRequiredScreen';

type AuthView = 'login' | 'forgot-password' | 'reset-password' | '2fa' | '2fa-setup-required';

const AppContent = () => {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
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

  // Helper function to get user 2FA status (simulates API call)
  const getUserTwoFactorStatus = (email: string) => {
    const userConfigs = {
      'admin@driven.com': { enabled: true, setupComplete: true },
      'admin-no2fa@driven.com': { enabled: true, setupComplete: false },
      'owner@demo.com': { enabled: true, setupComplete: true },
      'manager@demo.com': { enabled: true, setupComplete: true },
      'tech@demo.com': { enabled: true, setupComplete: true },
      'demo@driven.com': { enabled: true, setupComplete: true }
    };
    return userConfigs[email as keyof typeof userConfigs] || { enabled: false, setupComplete: false };
  };

  const handleLogin = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    // First verify credentials
    // Simulate credential verification (without completing login)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if credentials are valid for any demo user
    const validEmails = ['admin@driven.com', 'admin-no2fa@driven.com', 'owner@demo.com', 'manager@demo.com', 'tech@demo.com', 'demo@driven.com'];
    
    if (validEmails.includes(credentials.email) && credentials.password === 'demo123') {
      const twoFactorStatus = getUserTwoFactorStatus(credentials.email);
      
      if (twoFactorStatus.enabled && !twoFactorStatus.setupComplete) {
        // User has 2FA enabled but hasn't completed setup, show setup required screen
        setPendingAuth(credentials);
        setCurrentView('2fa-setup-required');
      } else if (twoFactorStatus.enabled && twoFactorStatus.setupComplete) {
        // User has 2FA enabled and setup complete, show 2FA verification screen
        setPendingAuth(credentials);
        setCurrentView('2fa');
      } else {
        // User doesn't have 2FA enabled, complete login directly (shouldn't happen in this system)
        await login(credentials);
      }
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
        // Explicitly navigate to root to ensure user goes to dashboard
        navigate('/');
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

  const handleGoToProfile = () => {
    // Complete login for admin users without 2FA to give them temporary access
    if (pendingAuth) {
      // Complete login for users without 2FA (temporary access to set up 2FA)
      login(pendingAuth);
      setPendingAuth(null);
      setCurrentView('login');
      
      // For admin users, they will be routed to the admin dashboard
      // In real implementation, you'd use navigate('/profile') or similar
      setTimeout(() => {
        alert('Welcome to the Admin Dashboard! Please go to Profile Settings to set up your Two-Factor Authentication.');
      }, 100);
    }
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
          userEmail={pendingAuth.email}
        />
      );
    }

    if (currentView === '2fa-setup-required' && pendingAuth) {
      return (
        <TwoFactorSetupRequiredScreen 
          onGoToProfile={handleGoToProfile}
          userEmail={pendingAuth.email}
          userName={pendingAuth.email === 'admin-no2fa@driven.com' ? 'Alex Johnson' : 'User'}
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

  // Use routing for authenticated users
  return (
    <Routes>
      <Route path="/*" element={<RoleBasedDashboard />} />
    </Routes>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;