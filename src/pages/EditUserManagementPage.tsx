// Edit User Management Page Component
// For editing organization users from the User Management section
// This is separate from the Driven Employee edit page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { ArrowLeft, Save, Mail, Phone, Building2, Shield, ShieldCheck } from 'lucide-react';

interface EditUserManagementPageProps {
  userToEdit: {
    id: number;
    name: string;
    organization: string;
    organizationId: number;
    email?: string;
    phone?: string;
    role?: string;
    status?: 'Active' | 'Inactive';
  };
  onBack: () => void;
  onSave: (userData: any) => void;
}

const EditUserManagementPage: React.FC<EditUserManagementPageProps> = ({
  userToEdit,
  onBack,
  onSave
}) => {
  const { currentTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: userToEdit.name || '',
    email: userToEdit.email || '',
    phone: userToEdit.phone || '',
    role: userToEdit.role || '',
    status: userToEdit.status || 'Active'
  });

  const handleSave = () => {
    onSave({
      ...userToEdit,
      ...formData
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Edit User Form */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '32px',
        border: `1px solid ${currentTheme.border}`
      }}>
        {/* Header with Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.textPrimary,
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.sidebarBg;
              e.currentTarget.style.color = currentTheme.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.textPrimary;
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>
            <h2 style={{ color: currentTheme.textPrimary, margin: '0 0 4px 0', fontSize: '24px', fontWeight: '600' }}>
              {userToEdit.name}
            </h2>
            <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
              ID: {userToEdit.id} • {userToEdit.organization}
            </p>
          </div>
        </div>

        {/* User Profile Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr', 
          gap: '24px', 
          marginBottom: '32px',
          alignItems: 'center',
          padding: '24px',
          backgroundColor: currentTheme.background,
          borderRadius: '12px'
        }}>
          {/* Avatar */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            backgroundColor: currentTheme.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px'
          }}>
            {userToEdit.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          
          {/* User Info */}
          <div>
            <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
              {userToEdit.name}
            </h3>
            {formData.email && (
              <p style={{ color: currentTheme.textSecondary, margin: '0 0 4px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                {formData.email}
              </p>
            )}
            {formData.phone && (
              <p style={{ color: currentTheme.textSecondary, margin: '0 0 8px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                {formData.phone}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: formData.status === 'Active' ? currentTheme.success + '20' : currentTheme.danger + '20',
                color: formData.status === 'Active' ? currentTheme.success : currentTheme.danger
              }}>
                {formData.status}
              </span>
              {formData.role && (
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: currentTheme.primary + '20',
                  color: currentTheme.primary
                }}>
                  {formData.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
            User Information
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.textPrimary,
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Owner, Manager, Technician"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organization Information */}
        <div style={{
          padding: '20px',
          backgroundColor: currentTheme.background,
          borderRadius: '12px',
          border: `1px solid ${currentTheme.border}`,
          marginBottom: '16px'
        }}>
          <h4 style={{ color: currentTheme.textPrimary, margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} />
            Organization
          </h4>
          <p style={{ color: currentTheme.textSecondary, margin: 0, fontSize: '14px' }}>
            {userToEdit.organization} (ID: {userToEdit.organizationId})
          </p>
          <p style={{ color: currentTheme.textSecondary, margin: '8px 0 0 0', fontSize: '12px' }}>
            Organization cannot be changed from this page
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: currentTheme.textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
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
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: currentTheme.primary,
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: `0 2px 8px ${currentTheme.primary}30`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${currentTheme.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 2px 8px ${currentTheme.primary}30`;
            }}
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserManagementPage;

