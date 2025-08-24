import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Shield, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface DrivenUserData {
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

interface AddDrivenUserProps {
  onBack: () => void;
  onSave: (userData: DrivenUserData) => void;
}

const AddDrivenUser: React.FC<AddDrivenUserProps> = ({ onBack, onSave }) => {
  const { currentTheme } = useTheme();
  
  // Form state with default values for Driven employee
  const [userData, setUserData] = useState<DrivenUserData>({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    phone: '',
    role: 'DRIVEN_EMPLOYEE', // Default role
    active: true,
    twoFactorEnabled: true, // Default to enabled for security
    joinDate: new Date().toISOString()
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validation
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
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // Username validation (alphanumeric and underscore only)
    if (userData.username && !/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof DrivenUserData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Add current timestamp
      const completeUserData = {
        ...userData,
        joinDate: new Date().toISOString()
      };
      
      await onSave(completeUserData);
    } catch (error) {
      console.error('Error saving driven user:', error);
      setErrors({ general: 'Failed to save user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${currentTheme.border}`,
    borderRadius: '8px',
    backgroundColor: currentTheme.background,
    color: currentTheme.textPrimary,
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  };

  const labelStyle = {
    color: currentTheme.textSecondary,
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    display: 'block' as const
  };

  return (
    <div style={{
      padding: '40px',
      backgroundColor: currentTheme.background,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '8px',
            color: currentTheme.textSecondary,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = currentTheme.primary;
            e.currentTarget.style.color = currentTheme.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = currentTheme.border;
            e.currentTarget.style.color = currentTheme.textSecondary;
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div>
          <h1 style={{
            color: currentTheme.textPrimary,
            margin: 0,
            fontSize: '32px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <User size={32} style={{ color: currentTheme.primary }} />
            Add Driven Employee
          </h1>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '4px 0 0 0',
            fontSize: '16px'
          }}>
            Create a new Driven Software employee account with admin access
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        padding: '32px',
        maxWidth: '800px'
      }}>
        {/* Error Message */}
        {errors.general && (
          <div style={{
            backgroundColor: currentTheme.danger + '10',
            color: currentTheme.danger,
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {errors.general}
          </div>
        )}

        {/* Employee Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={20} style={{ color: currentTheme.primary }} />
            Employee Information
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* First Name */}
            <div>
              <label style={labelStyle}>
                First Name <span style={{ color: currentTheme.danger }}>*</span>
              </label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.firstName ? currentTheme.danger : currentTheme.border
                }}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                  {errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label style={labelStyle}>
                Last Name <span style={{ color: currentTheme.danger }}>*</span>
              </label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.lastName ? currentTheme.danger : currentTheme.border
                }}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                  {errors.lastName}
                </div>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label style={labelStyle}>
                Middle Name
              </label>
              <input
                type="text"
                value={userData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                style={inputStyle}
                placeholder="Enter middle name (optional)"
              />
            </div>

            {/* Username */}
            <div>
              <label style={labelStyle}>
                Username <span style={{ color: currentTheme.danger }}>*</span>
              </label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.username ? currentTheme.danger : currentTheme.border
                }}
                placeholder="Enter username"
              />
              {errors.username && (
                <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                  {errors.username}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>
                Email Address <span style={{ color: currentTheme.danger }}>*</span>
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? currentTheme.danger : currentTheme.border
                }}
                placeholder="Enter email address"
              />
              {errors.email && (
                <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>
                Phone Number
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={inputStyle}
                placeholder="Enter phone number (optional)"
              />
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Shield size={20} style={{ color: currentTheme.primary }} />
            Account Settings
          </h3>

          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {/* Role (Read-only) */}
            <div>
              <label style={labelStyle}>
                Employee Role
              </label>
              <div style={{
                ...inputStyle,
                backgroundColor: currentTheme.sand,
                color: currentTheme.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Shield size={16} style={{ color: currentTheme.primary }} />
                Driven Employee (Admin Access)
              </div>
              <p style={{ 
                color: currentTheme.textSecondary, 
                fontSize: '12px', 
                margin: '4px 0 0 0' 
              }}>
                This role provides full administrative access to the platform
              </p>
            </div>

            {/* Account Status */}
            <div>
              <label style={labelStyle}>
                Account Status
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleInputChange('active', true)}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${userData.active ? currentTheme.success : currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: userData.active ? currentTheme.success : 'transparent',
                    color: userData.active ? 'white' : currentTheme.textPrimary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {userData.active && <Check size={14} />}
                  Active
                </button>
                <button
                  onClick={() => handleInputChange('active', false)}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${!userData.active ? currentTheme.danger : currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: !userData.active ? currentTheme.danger : 'transparent',
                    color: !userData.active ? 'white' : currentTheme.textPrimary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {!userData.active && <Check size={14} />}
                  Inactive
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div>
              <label style={labelStyle}>
                Two-Factor Authentication
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleInputChange('twoFactorEnabled', true)}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${userData.twoFactorEnabled ? currentTheme.success : currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: userData.twoFactorEnabled ? currentTheme.success : 'transparent',
                    color: userData.twoFactorEnabled ? 'white' : currentTheme.textPrimary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {userData.twoFactorEnabled && <Check size={14} />}
                  Enabled (Recommended)
                </button>
                <button
                  onClick={() => handleInputChange('twoFactorEnabled', false)}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${!userData.twoFactorEnabled ? currentTheme.warning : currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: !userData.twoFactorEnabled ? currentTheme.warning : 'transparent',
                    color: !userData.twoFactorEnabled ? 'white' : currentTheme.textPrimary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {!userData.twoFactorEnabled && <Check size={14} />}
                  Disabled
                </button>
              </div>
              <p style={{ 
                color: currentTheme.textSecondary, 
                fontSize: '12px', 
                margin: '4px 0 0 0' 
              }}>
                2FA is strongly recommended for all Driven employees for enhanced security
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          paddingTop: '20px',
          borderTop: `1px solid ${currentTheme.border}`
        }}>
          <button
            onClick={onBack}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              color: currentTheme.textSecondary,
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = currentTheme.textSecondary;
                e.currentTarget.style.color = currentTheme.textPrimary;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = currentTheme.border;
                e.currentTarget.style.color = currentTheme.textSecondary;
              }
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: currentTheme.primary,
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = currentTheme.primary + 'dd';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = currentTheme.primary;
              }
            }}
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDrivenUser;
