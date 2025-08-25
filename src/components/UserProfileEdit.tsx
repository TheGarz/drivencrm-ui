import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Shield, Lock, Key, Eye, EyeOff, AlertCircle, Check, QrCode, Smartphone } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface UserProfileData {
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  twoFactorEnabled: boolean;
  joinDate: string;
}

interface UserProfileEditProps {
  onBack: () => void;
  onSave: (userData: UserProfileData) => void;
}

const UserProfileEdit: React.FC<UserProfileEditProps> = ({ onBack, onSave }) => {
  const { currentTheme } = useTheme();
  
  // Mock current user data - in real app this would come from auth context
  const [userData, setUserData] = useState<UserProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    username: 'john.doe',
    email: 'john.doe@driven.com',
    phone: '+1 (555) 123-4567',
    role: 'DRIVEN_EMPLOYEE',
    active: true,
    twoFactorEnabled: true,
    joinDate: '2024-01-15'
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');

  // 2FA setup state
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [setupStep, setSetupStep] = useState<'qr' | 'verify' | 'backup'>('qr');
  const [showManualEntry, setShowManualEntry] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to generate random secret for 2FA
  const generateTwoFASecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  // Helper function to generate backup codes
  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString().substr(2, 6);
      codes.push(code);
    }
    return codes;
  };

  // Helper function to generate QR code URL
  const generateQRCodeUrl = (secret: string) => {
    const issuer = 'Driven CRM';
    const accountName = userData.email;
    const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    
    // In a real app, you'd use a QR code library or API
    // For now, we'll create a placeholder URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`;
  };

  const handleInputChange = (field: keyof UserProfileData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    setPasswordError('');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userData.firstName.trim()) {
newErrors.firstName = 'First name is required';
}
    if (!userData.lastName.trim()) {
newErrors.lastName = 'Last name is required';
}
    if (!userData.username.trim()) {
newErrors.username = 'Username is required';
}
    if (!userData.email.trim()) {
newErrors.email = 'Email is required';
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return false;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
return;
}

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave(userData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswordChange()) {
return;
}

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // Reset password form
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup2FA = () => {
    // Generate new secret and backup codes
    const secret = generateTwoFASecret();
    const codes = generateBackupCodes();
    const qrUrl = generateQRCodeUrl(secret);
    
    setTwoFASecret(secret);
    setBackupCodes(codes);
    setQrCodeUrl(qrUrl);
    setSetupStep('qr');
    setShow2FASetup(true);
    setShowManualEntry(false);
    setVerificationCode('');
  };

  const handleDisable2FA = () => {
    if (confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      setUserData(prev => ({ ...prev, twoFactorEnabled: false }));
      // In a real app, you'd make an API call to disable 2FA on the server
      alert('2FA has been disabled for your account.');
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      alert('Please enter a 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd verify the code with the server
      // For demo purposes, we'll simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful verification (in real app, check against server)
      const isValid = true; // This would be the server response
      
      if (isValid) {
        setSetupStep('backup');
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      alert('Failed to verify code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete2FASetup = () => {
    setUserData(prev => ({ ...prev, twoFactorEnabled: true }));
    setShow2FASetup(false);
    setSetupStep('qr');
    setVerificationCode('');
    alert('2FA has been successfully enabled! Make sure to save your backup codes in a secure location.');
  };

  const handleCancel2FASetup = () => {
    if (confirm('Are you sure you want to cancel 2FA setup? Your progress will be lost.')) {
      setShow2FASetup(false);
      setSetupStep('qr');
      setVerificationCode('');
      setTwoFASecret('');
      setBackupCodes([]);
      setQrCodeUrl('');
      setShowManualEntry(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: currentTheme.background,
      minHeight: '100vh',
      color: currentTheme.textPrimary
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px',
        paddingBottom: '16px',
        borderBottom: `2px solid ${currentTheme.border}`
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            backgroundColor: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '12px',
            color: currentTheme.textPrimary,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.sidebarBg;
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.cardBg;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: currentTheme.textPrimary
          }}>
            My Profile
          </h1>
          <p style={{
            fontSize: '16px',
            color: currentTheme.textSecondary,
            margin: 0
          }}>
            Manage your personal information and security settings
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Personal Information */}
        <div style={{
          padding: '24px',
          border: `1px solid ${currentTheme.border}`,
          borderRadius: '16px',
          backgroundColor: currentTheme.cardBg
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: `${currentTheme.primary}1A`,
              borderRadius: '12px'
            }}>
              <User style={{ color: currentTheme.primary, width: '20px', height: '20px' }} />
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
              color: currentTheme.textPrimary
            }}>
              Personal Information
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* First Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                First Name *
              </label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.firstName ? currentTheme.danger : currentTheme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.firstName) {
                    e.target.style.borderColor = currentTheme.primary;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.firstName) {
                    e.target.style.borderColor = currentTheme.border;
                  }
                }}
              />
              {errors.firstName && (
                <span style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.firstName}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Last Name *
              </label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.lastName ? currentTheme.danger : currentTheme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.lastName) {
                    e.target.style.borderColor = currentTheme.primary;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.lastName) {
                    e.target.style.borderColor = currentTheme.border;
                  }
                }}
              />
              {errors.lastName && (
                <span style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.lastName}
                </span>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Middle Name
              </label>
              <input
                type="text"
                value={userData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
                onBlur={(e) => e.target.style.borderColor = currentTheme.border}
              />
            </div>

            {/* Username */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Username *
              </label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.username ? currentTheme.danger : currentTheme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.username) {
                    e.target.style.borderColor = currentTheme.primary;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.username) {
                    e.target.style.borderColor = currentTheme.border;
                  }
                }}
              />
              {errors.username && (
                <span style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.username}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.email ? currentTheme.danger : currentTheme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = currentTheme.primary;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = currentTheme.border;
                  }
                }}
              />
              {errors.email && (
                <span style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: currentTheme.background,
                  color: currentTheme.textPrimary,
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
                onBlur={(e) => e.target.style.borderColor = currentTheme.border}
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Role
              </label>
              <div style={{
                padding: '12px 16px',
                border: `2px solid ${currentTheme.border}`,
                borderRadius: '12px',
                fontSize: '14px',
                backgroundColor: currentTheme.sidebarBg,
                color: currentTheme.textSecondary
              }}>
                {userData.role.replace('_', ' ')}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: currentTheme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.primary}40`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Change Password */}
          <div style={{
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '16px',
            backgroundColor: currentTheme.cardBg
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: `${currentTheme.warning}1A`,
                borderRadius: '12px'
              }}>
                <Lock style={{ color: currentTheme.warning, width: '20px', height: '20px' }} />
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0,
                color: currentTheme.textPrimary
              }}>
                Change Password
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Current Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: `2px solid ${currentTheme.border}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
                    onBlur={(e) => e.target.style.borderColor = currentTheme.border}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: currentTheme.textSecondary
                    }}
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: `2px solid ${currentTheme.border}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
                    onBlur={(e) => e.target.style.borderColor = currentTheme.border}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: currentTheme.textSecondary
                    }}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 16px',
                      border: `2px solid ${currentTheme.border}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
                    onBlur={(e) => e.target.style.borderColor = currentTheme.border}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: currentTheme.textSecondary
                    }}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px',
                  backgroundColor: `${currentTheme.danger}1A`,
                  border: `1px solid ${currentTheme.danger}40`,
                  borderRadius: '8px',
                  color: currentTheme.danger
                }}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '14px' }}>{passwordError}</span>
                </div>
              )}

              <button
                onClick={handlePasswordSave}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: currentTheme.warning,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.warning}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div style={{
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '16px',
            backgroundColor: currentTheme.cardBg
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '12px',
                backgroundColor: `${userData.twoFactorEnabled ? currentTheme.success : currentTheme.warning}1A`,
                borderRadius: '12px'
              }}>
                <Shield style={{ 
                  color: userData.twoFactorEnabled ? currentTheme.success : currentTheme.warning, 
                  width: '20px', 
                  height: '20px' 
                }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: 0,
                  color: currentTheme.textPrimary
                }}>
                  Two-Factor Authentication
                </h2>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  backgroundColor: userData.twoFactorEnabled ? `${currentTheme.success}20` : `${currentTheme.warning}20`,
                  color: userData.twoFactorEnabled ? currentTheme.success : currentTheme.warning,
                  marginTop: '4px'
                }}>
                  {userData.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                </div>
              </div>
            </div>

            {!show2FASetup ? (
              <div style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: userData.twoFactorEnabled ? `${currentTheme.success}0A` : `${currentTheme.warning}0A`,
                border: `1px solid ${userData.twoFactorEnabled ? currentTheme.success : currentTheme.warning}20`
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: userData.twoFactorEnabled ? currentTheme.success : currentTheme.warning
                    }} />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: currentTheme.textPrimary
                    }}>
                      {userData.twoFactorEnabled ? 'Enhanced Security Active' : 'Security Enhancement Available'}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: currentTheme.textSecondary,
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {userData.twoFactorEnabled 
                      ? 'Your account is protected with two-factor authentication. You can disable it if needed, but this will reduce your account security.'
                      : 'Add an extra layer of security to your account by enabling two-factor authentication using an authenticator app.'
                    }
                  </p>
                </div>

                <button
                  onClick={userData.twoFactorEnabled ? handleDisable2FA : handleSetup2FA}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: userData.twoFactorEnabled ? currentTheme.danger : currentTheme.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${userData.twoFactorEnabled ? currentTheme.danger : currentTheme.success}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {userData.twoFactorEnabled ? (
                    <>
                      <Shield size={16} />
                      Disable 2FA
                    </>
                  ) : (
                    <>
                      <Key size={16} />
                      Setup 2FA
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* 2FA Setup Flow */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Progress Indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: currentTheme.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${currentTheme.border}`
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: setupStep === 'qr' ? currentTheme.primary : setupStep === 'verify' || setupStep === 'backup' ? currentTheme.success : currentTheme.border,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {setupStep === 'qr' ? '1' : '✓'}
                    </div>
                    <span style={{ color: currentTheme.textPrimary }}>Scan QR Code</span>
                  </div>
                  
                  <div style={{
                    width: '32px',
                    height: '2px',
                    backgroundColor: setupStep === 'verify' || setupStep === 'backup' ? currentTheme.success : currentTheme.border
                  }} />
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: setupStep === 'verify' ? currentTheme.primary : setupStep === 'backup' ? currentTheme.success : currentTheme.border,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {setupStep === 'backup' ? '✓' : setupStep === 'verify' ? '2' : '2'}
                    </div>
                    <span style={{ color: currentTheme.textPrimary }}>Verify Code</span>
                  </div>
                  
                  <div style={{
                    width: '32px',
                    height: '2px',
                    backgroundColor: setupStep === 'backup' ? currentTheme.success : currentTheme.border
                  }} />
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: setupStep === 'backup' ? currentTheme.primary : currentTheme.border,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      3
                    </div>
                    <span style={{ color: currentTheme.textPrimary }}>Backup Codes</span>
                  </div>
                </div>

                {/* Step 1: QR Code */}
                {setupStep === 'qr' && (
                  <div style={{
                    padding: '24px',
                    backgroundColor: `${currentTheme.primary}0A`,
                    border: `1px solid ${currentTheme.primary}20`,
                    borderRadius: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                      color: currentTheme.textPrimary
                    }}>
                      Step 1: Add Account to Authenticator App
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.textSecondary,
                      margin: '0 0 20px 0',
                      lineHeight: '1.5'
                    }}>
                      Use your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.) to scan this QR code:
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: `1px solid ${currentTheme.border}`,
                        display: 'inline-block'
                      }}>
                        {qrCodeUrl ? (
                          <img 
                            src={qrCodeUrl} 
                            alt="2FA QR Code"
                            style={{
                              width: '200px',
                              height: '200px',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '200px',
                            height: '200px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '8px'
                          }}>
                            <QrCode size={48} color="#666" />
                            <span style={{ fontSize: '12px', color: '#666' }}>Generating QR Code...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        height: '1px',
                        flex: 1,
                        backgroundColor: currentTheme.border
                      }} />
                      <span style={{
                        fontSize: '14px',
                        color: currentTheme.textSecondary,
                        fontWeight: '500'
                      }}>
                        OR
                      </span>
                      <div style={{
                        height: '1px',
                        flex: 1,
                        backgroundColor: currentTheme.border
                      }} />
                    </div>

                    <button
                      onClick={() => setShowManualEntry(!showManualEntry)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: currentTheme.cardBg,
                        color: currentTheme.textPrimary,
                        border: `1px solid ${currentTheme.border}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginBottom: showManualEntry ? '16px' : '0'
                      }}
                    >
                      {showManualEntry ? 'Hide Manual Entry' : 'Enter Code Manually'}
                    </button>

                    {showManualEntry && (
                      <div style={{
                        padding: '16px',
                        backgroundColor: currentTheme.background,
                        borderRadius: '8px',
                        border: `1px solid ${currentTheme.border}`,
                        marginBottom: '20px'
                      }}>
                        <p style={{
                          fontSize: '14px',
                          color: currentTheme.textSecondary,
                          margin: '0 0 12px 0'
                        }}>
                          If you can't scan the QR code, enter this secret key manually:
                        </p>
                        <div style={{
                          padding: '12px',
                          backgroundColor: currentTheme.cardBg,
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.border}`,
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          color: currentTheme.textPrimary,
                          wordBreak: 'break-all',
                          textAlign: 'center',
                          letterSpacing: '2px'
                        }}>
                          {twoFASecret}
                        </div>
                        <p style={{
                          fontSize: '12px',
                          color: currentTheme.textSecondary,
                          margin: '8px 0 0 0',
                          textAlign: 'center'
                        }}>
                          Account: {userData.email} | Issuer: Driven CRM
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setSetupStep('verify')}
                      style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: currentTheme.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.primary}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      I've Added the Account - Continue
                    </button>
                  </div>
                )}

                {/* Step 2: Verify Code */}
                {setupStep === 'verify' && (
                  <div style={{
                    padding: '24px',
                    backgroundColor: `${currentTheme.success}0A`,
                    border: `1px solid ${currentTheme.success}20`,
                    borderRadius: '12px'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 16px 0',
                      color: currentTheme.textPrimary
                    }}>
                      Step 2: Verify Your Setup
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.textSecondary,
                      margin: '0 0 20px 0',
                      lineHeight: '1.5'
                    }}>
                      Enter the 6-digit verification code from your authenticator app to confirm the setup:
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        style={{
                          width: '200px',
                          padding: '16px 20px',
                          border: `2px solid ${currentTheme.border}`,
                          borderRadius: '12px',
                          fontSize: '24px',
                          textAlign: 'center',
                          letterSpacing: '4px',
                          backgroundColor: currentTheme.background,
                          color: currentTheme.textPrimary,
                          outline: 'none',
                          fontWeight: '600'
                        }}
                        onFocus={(e) => e.target.style.borderColor = currentTheme.primary}
                        onBlur={(e) => e.target.style.borderColor = currentTheme.border}
                        maxLength={6}
                      />
                      
                      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <button
                          onClick={() => setSetupStep('qr')}
                          style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: currentTheme.cardBg,
                            color: currentTheme.textPrimary,
                            border: `1px solid ${currentTheme.border}`,
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Back
                        </button>
                        <button
                          onClick={handleVerify2FA}
                          disabled={verificationCode.length !== 6 || isLoading}
                          style={{
                            flex: 2,
                            padding: '12px 20px',
                            backgroundColor: verificationCode.length === 6 && !isLoading ? currentTheme.success : currentTheme.sidebarBg,
                            color: verificationCode.length === 6 && !isLoading ? 'white' : currentTheme.textSecondary,
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: verificationCode.length === 6 && !isLoading ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isLoading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: '20px',
                      padding: '12px',
                      backgroundColor: `${currentTheme.warning}0A`,
                      border: `1px solid ${currentTheme.warning}20`,
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: currentTheme.textSecondary,
                      textAlign: 'center'
                    }}>
                      <Smartphone size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                      Make sure your device's time is synchronized for accurate codes
                    </div>
                  </div>
                )}

                {/* Step 3: Backup Codes */}
                {setupStep === 'backup' && (
                  <div style={{
                    padding: '24px',
                    backgroundColor: `${currentTheme.warning}0A`,
                    border: `1px solid ${currentTheme.warning}20`,
                    borderRadius: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        padding: '8px',
                        backgroundColor: currentTheme.success,
                        borderRadius: '50%'
                      }}>
                        <Check size={16} color="white" />
                      </div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                        color: currentTheme.textPrimary
                      }}>
                        Step 3: Save Your Backup Codes
                      </h3>
                    </div>
                    
                    <div style={{
                      padding: '16px',
                      backgroundColor: `${currentTheme.success}0A`,
                      border: `1px solid ${currentTheme.success}20`,
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <Check size={16} color={currentTheme.success} />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: currentTheme.success
                        }}>
                          2FA Successfully Configured!
                        </span>
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: currentTheme.textSecondary,
                        margin: 0
                      }}>
                        Your authenticator app is now linked to your account.
                      </p>
                    </div>
                    
                    <p style={{
                      fontSize: '14px',
                      color: currentTheme.textSecondary,
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>
                      <strong>Important:</strong> Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device. Each code can only be used once.
                    </p>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      padding: '20px',
                      backgroundColor: currentTheme.background,
                      borderRadius: '12px',
                      border: `2px solid ${currentTheme.border}`,
                      fontFamily: 'monospace',
                      marginBottom: '20px'
                    }}>
                      {backupCodes.map((code, index) => (
                        <div key={index} style={{
                          padding: '12px',
                          fontSize: '16px',
                          color: currentTheme.textPrimary,
                          textAlign: 'center',
                          backgroundColor: currentTheme.cardBg,
                          borderRadius: '8px',
                          border: `1px solid ${currentTheme.border}`,
                          fontWeight: '600',
                          letterSpacing: '1px'
                        }}>
                          {code}
                        </div>
                      ))}
                    </div>

                    <div style={{
                      padding: '16px',
                      backgroundColor: `${currentTheme.danger}0A`,
                      border: `1px solid ${currentTheme.danger}20`,
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        <AlertCircle size={16} color={currentTheme.danger} />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: currentTheme.danger
                        }}>
                          Security Reminder
                        </span>
                      </div>
                      <ul style={{
                        fontSize: '13px',
                        color: currentTheme.textSecondary,
                        margin: 0,
                        paddingLeft: '16px',
                        lineHeight: '1.4'
                      }}>
                        <li>Store these codes in a secure password manager</li>
                        <li>Don't share them with anyone</li>
                        <li>Each code can only be used once</li>
                        <li>Generate new codes if these are compromised</li>
                      </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => {
                          // Copy backup codes to clipboard
                          navigator.clipboard.writeText(backupCodes.join('\n'));
                          alert('Backup codes copied to clipboard!');
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: currentTheme.cardBg,
                          color: currentTheme.textPrimary,
                          border: `1px solid ${currentTheme.border}`,
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.sidebarBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                        }}
                      >
                        📋 Copy Codes
                      </button>
                      <button
                        onClick={handleComplete2FASetup}
                        style={{
                          flex: 2,
                          padding: '12px 20px',
                          backgroundColor: currentTheme.success,
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `0 4px 12px ${currentTheme.success}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Complete Setup
                      </button>
                    </div>
                  </div>
                )}

                {/* Cancel Setup Button */}
                <button
                  onClick={handleCancel2FASetup}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    backgroundColor: 'transparent',
                    color: currentTheme.textSecondary,
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.sidebarBg;
                    e.currentTarget.style.color = currentTheme.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = currentTheme.textSecondary;
                  }}
                >
                  Cancel Setup
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEdit;
