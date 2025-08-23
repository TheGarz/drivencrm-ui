import React, { useState } from 'react';
import { ArrowLeft, Building2, User, Eye, EyeOff, Calendar, DollarSign } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface OrganizationFormData {
  name: string;
  sync_limit: number;
  pay_period: 'PERIOD_WEEKLY' | 'PERIOD_BIWEEKLY' | 'PERIOD_MONTHLY';
  pay_start: string;
  active: boolean;
}

interface OwnerUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AddNewOrganizationProps {
  onBack: () => void;
  onSave: (orgData: OrganizationFormData, ownerData?: OwnerUserData) => void;
}

const AddNewOrganization: React.FC<AddNewOrganizationProps> = ({ onBack, onSave }) => {
  const { currentTheme } = useTheme();
  
  // Organization form state
  const [orgData, setOrgData] = useState<OrganizationFormData>({
    name: '',
    sync_limit: 0,
    pay_period: 'PERIOD_WEEKLY',
    pay_start: new Date().toISOString().split('T')[0],
    active: true
  });

  // Owner user form state
  const [includeOwner, setIncludeOwner] = useState(false);
  const [ownerData, setOwnerData] = useState<OwnerUserData>({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate organization fields
    if (!orgData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (orgData.sync_limit < 0) {
      newErrors.sync_limit = 'Sync limit cannot be negative';
    }

    // Validate owner fields if included
    if (includeOwner) {
      if (!ownerData.name.trim()) {
        newErrors.ownerName = 'Owner name is required';
      }

      if (!ownerData.email.trim()) {
        newErrors.ownerEmail = 'Owner email is required';
      } else if (!/\S+@\S+\.\S+/.test(ownerData.email)) {
        newErrors.ownerEmail = 'Please enter a valid email address';
      }

      if (!ownerData.password.trim()) {
        newErrors.ownerPassword = 'Owner password is required';
      } else if (ownerData.password.length < 8) {
        newErrors.ownerPassword = 'Password must be at least 8 characters';
      }

      if (!ownerData.role.trim()) {
        newErrors.ownerRole = 'Owner role is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(orgData, includeOwner ? ownerData : undefined);
    } catch (error) {
      console.error('Error saving organization:', error);
      setErrors({ general: 'Failed to save organization. Please try again.' });
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
            <Building2 size={32} style={{ color: currentTheme.primary }} />
            Add New Organization
          </h1>
          <p style={{
            color: currentTheme.textSecondary,
            margin: '4px 0 0 0',
            fontSize: '16px'
          }}>
            Create a new organization and optionally add an owner user
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

        {/* Organization Details Section */}
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
            <Building2 size={20} style={{ color: currentTheme.primary }} />
            Organization Details
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Organization Name */}
            <div>
              <label style={labelStyle}>
                Organization Name <span style={{ color: currentTheme.danger }}>*</span>
              </label>
              <input
                type="text"
                value={orgData.name}
                onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? currentTheme.danger : currentTheme.border
                }}
                placeholder="Enter organization name"
              />
              {errors.name && (
                <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Sync Limit */}
            <div>
              <label style={labelStyle}>
                Sync Limit
              </label>
              <input
                type="number"
                value={orgData.sync_limit}
                onChange={(e) => setOrgData({ ...orgData, sync_limit: parseInt(e.target.value) || 0 })}
                style={{
                  ...inputStyle,
                  borderColor: errors.sync_limit ? currentTheme.danger : currentTheme.border
                }}
                placeholder="0"
                min="0"
              />
              {errors.sync_limit && (
                <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                  {errors.sync_limit}
                </div>
              )}
            </div>

            {/* Pay Period */}
            <div>
              <label style={labelStyle}>
                Pay Period
              </label>
              <select
                value={orgData.pay_period}
                onChange={(e) => setOrgData({ ...orgData, pay_period: e.target.value as any })}
                style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}
              >
                <option value="PERIOD_WEEKLY">Weekly</option>
                <option value="PERIOD_BIWEEKLY">Bi-weekly</option>
                <option value="PERIOD_MONTHLY">Monthly</option>
              </select>
            </div>

            {/* Pay Start Date */}
            <div>
              <label style={labelStyle}>
                Pay Start Date
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={orgData.pay_start}
                  onChange={(e) => setOrgData({ ...orgData, pay_start: e.target.value })}
                  style={inputStyle}
                />
                <Calendar size={16} style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: currentTheme.textSecondary,
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div style={{ marginTop: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={orgData.active}
                onChange={(e) => setOrgData({ ...orgData, active: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span style={{
                color: currentTheme.textSecondary,
                fontSize: '14px'
              }}>
                Organization is active
              </span>
            </label>
          </div>
        </div>

        {/* Owner User Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: currentTheme.textPrimary,
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <User size={20} style={{ color: currentTheme.primary }} />
              Owner User (Optional)
            </h3>
            
            <button
              onClick={() => setIncludeOwner(!includeOwner)}
              style={{
                padding: '6px 12px',
                backgroundColor: includeOwner ? currentTheme.primary : 'transparent',
                color: includeOwner ? 'white' : currentTheme.primary,
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {includeOwner ? 'Remove Owner' : 'Add Owner'}
            </button>
          </div>

          {includeOwner && (
            <div style={{
              backgroundColor: currentTheme.background + '40',
              borderRadius: '8px',
              padding: '20px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {/* Owner Name */}
                <div>
                  <label style={labelStyle}>
                    Full Name <span style={{ color: currentTheme.danger }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={ownerData.name}
                    onChange={(e) => setOwnerData({ ...ownerData, name: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: errors.ownerName ? currentTheme.danger : currentTheme.border
                    }}
                    placeholder="Enter owner's full name"
                  />
                  {errors.ownerName && (
                    <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                      {errors.ownerName}
                    </div>
                  )}
                </div>

                {/* Owner Email */}
                <div>
                  <label style={labelStyle}>
                    Email Address <span style={{ color: currentTheme.danger }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={ownerData.email}
                    onChange={(e) => setOwnerData({ ...ownerData, email: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: errors.ownerEmail ? currentTheme.danger : currentTheme.border
                    }}
                    placeholder="Enter owner's email"
                  />
                  {errors.ownerEmail && (
                    <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                      {errors.ownerEmail}
                    </div>
                  )}
                </div>

                {/* Owner Password */}
                <div>
                  <label style={labelStyle}>
                    Password <span style={{ color: currentTheme.danger }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={ownerData.password}
                      onChange={(e) => setOwnerData({ ...ownerData, password: e.target.value })}
                      style={{
                        ...inputStyle,
                        borderColor: errors.ownerPassword ? currentTheme.danger : currentTheme.border,
                        paddingRight: '40px'
                      }}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: currentTheme.textSecondary,
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.ownerPassword && (
                    <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                      {errors.ownerPassword}
                    </div>
                  )}
                </div>

                {/* Owner Role */}
                <div>
                  <label style={labelStyle}>
                    Role <span style={{ color: currentTheme.danger }}>*</span>
                  </label>
                  <select
                    value={ownerData.role}
                    onChange={(e) => setOwnerData({ ...ownerData, role: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: errors.ownerRole ? currentTheme.danger : currentTheme.border,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Owner">Owner</option>
                  </select>
                  {errors.ownerRole && (
                    <div style={{ color: currentTheme.danger, fontSize: '12px', marginTop: '4px' }}>
                      {errors.ownerRole}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
            {loading ? 'Creating...' : 'Create Organization'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewOrganization;