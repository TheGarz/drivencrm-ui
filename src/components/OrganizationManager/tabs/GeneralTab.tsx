import React, { useState } from 'react';
import { Edit3, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

const GeneralTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState(organization);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = (field: string) => {
    onUpdate(formData);
    setEditingField(null);
  };

  const handleCancel = () => {
    setFormData(organization);
    setEditingField(null);
  };

  const handleStatusToggle = () => {
    if (organization.active) {
      // Show confirmation modal for deactivation
      setShowDeactivateModal(true);
    } else {
      // Directly activate without confirmation
      onUpdate({ ...organization, active: true });
    }
  };

  const handleConfirmDeactivate = () => {
    onUpdate({ ...organization, active: false });
    setShowDeactivateModal(false);
  };

  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
  };

  const renderEditableField = (field: string, label: string, value: string | number | boolean, type: string = 'text') => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderBottom: `1px solid ${currentTheme.border}`
    }}>
      <div style={{ flex: 1 }}>
        <label style={{
          display: 'block',
          color: currentTheme.textSecondary,
          fontSize: '14px',
          marginBottom: '4px',
          fontWeight: '500'
        }}>
          {label}
          {field === 'sync_limit' && (
            <span style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              fontWeight: '400',
              marginLeft: '8px',
              opacity: 0.7
            }}>
              (0-24)
            </span>
          )}
        </label>
        {editingField === field ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {type === 'select' ? (
              <select
                value={String(value)}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              >
                <option value="DAY">Day</option>
                <option value="MONTH">Month</option>
                <option value="QUARTER">Quarter</option>
                <option value="HALF">Half</option>
                <option value="YEAR">Year</option>
                <option value="PERIOD_DAILY">Period Daily</option>
                <option value="PERIOD_WEEKLY">Period Weekly</option>
                <option value="PERIOD_BIWEEKLY">Period Biweekly</option>
                <option value="PERIOD_SEMI_MONTHLY">Period Semi Monthly</option>
                <option value="PERIOD_MONTHLY">Period Monthly</option>
              </select>
            ) : (
              <input
                type={type}
                value={String(value)}
                min={field === 'sync_limit' ? 0 : undefined}
                max={field === 'sync_limit' ? 24 : undefined}
                onChange={(e) => {
                  let newValue = type === 'number' ? Number(e.target.value) : e.target.value;
                  
                  // Specific validation for sync_limit field
                  if (field === 'sync_limit' && type === 'number') {
                    newValue = Math.max(0, Math.min(24, Number(newValue)));
                  }
                  
                  setFormData({ ...formData, [field]: newValue });
                }}
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              />
            )}
            <button
              onClick={() => handleSave(field)}
              style={{
                padding: '8px',
                backgroundColor: currentTheme.success,
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <CheckCircle size={16} />
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '8px',
                backgroundColor: currentTheme.danger,
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <div style={{
            color: currentTheme.textPrimary,
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {field === 'pay_period' ? 
              String(value).startsWith('PERIOD_') ? 
                String(value).replace('PERIOD_', '').replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) :
                String(value).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
              : field === 'pay_start' ? 
                new Date(String(value)).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                })
              : value}
          </div>
        )}
      </div>
      {editingField !== field && (
        <button
          onClick={() => handleEdit(field)}
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: `1px solid ${currentTheme.border}`,
            borderRadius: '6px',
            color: currentTheme.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Edit3 size={14} />
          Edit
        </button>
      )}
    </div>
  );

  return (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      borderRadius: '12px',
      border: `1px solid ${currentTheme.border}`,
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '24px',
        borderBottom: `1px solid ${currentTheme.border}`
      }}>
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Organization Details
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px'
        }}>
          Basic information and configuration for this organization
        </p>
      </div>

      {renderEditableField('name', 'Organization Name', formData.name)}
      {renderEditableField('sync_limit', 'Daily Sync Limit', formData.sync_limit, 'number')}
      {renderEditableField('pay_period', 'Pay Period', formData.pay_period, 'select')}
      {renderEditableField('pay_start', 'Pay Start Date', formData.pay_start, 'date')}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px'
      }}>
        <div>
          <label style={{
            display: 'block',
            color: currentTheme.textSecondary,
            fontSize: '14px',
            marginBottom: '4px',
            fontWeight: '500'
          }}>
            Status
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: organization.active ? currentTheme.success : currentTheme.danger
            }} />
            <span style={{
              color: currentTheme.textPrimary,
              fontSize: '16px',
              fontWeight: '500'
            }}>
              {organization.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <button
          onClick={handleStatusToggle}
          style={{
            padding: '8px 16px',
            backgroundColor: organization.active ? currentTheme.danger : currentTheme.success,
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {organization.active ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: currentTheme.danger + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={24} style={{ color: currentTheme.danger }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Deactivate Organization
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  This action cannot be undone easily
                </p>
              </div>
            </div>

            <p style={{
              color: currentTheme.textPrimary,
              margin: '0 0 24px 0',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to deactivate <strong>{organization.name}</strong>? 
              This will disable all services, integrations, and user access for this organization.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelDeactivate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.danger,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralTab;