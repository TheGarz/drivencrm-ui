import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../../theme/ThemeContext';
import type { IntegrationModalProps } from '../../types';

const IntegrationModal: React.FC<IntegrationModalProps> = ({ 
  isOpen, 
  onClose, 
  integration, 
  onConnect, 
  hasCrmIntegration 
}) => {
  const { currentTheme } = useTheme();

  if (!isOpen || !integration) return null;

  const canConnect = integration.crmSystem || hasCrmIntegration;

  return (
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
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            color: currentTheme.textPrimary, 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '600' 
          }}>
            Connect {integration.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: currentTheme.textSecondary,
              cursor: 'pointer',
              padding: '4px'
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: currentTheme.primary + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            {integration.icon}
          </div>
          <div>
            <h3 style={{
              color: currentTheme.textPrimary,
              margin: '0 0 4px 0',
              fontSize: '18px',
              fontWeight: '500'
            }}>
              {integration.name}
            </h3>
            <div style={{
              display: 'inline-block',
              padding: '4px 8px',
              backgroundColor: currentTheme.primary + '20',
              color: currentTheme.primary,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {integration.category}
            </div>
          </div>
        </div>

        <p style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          lineHeight: '1.5',
          marginBottom: '24px'
        }}>
          {integration.description}
        </p>

        {!canConnect && !integration.crmSystem && (
          <div style={{
            backgroundColor: currentTheme.warning + '20',
            border: `1px solid ${currentTheme.warning}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} color={currentTheme.warning} />
            <div>
              <div style={{
                color: currentTheme.warning,
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                CRM Integration Required
              </div>
              <div style={{
                color: currentTheme.textSecondary,
                fontSize: '13px'
              }}>
                You must connect a CRM system (PestPac, FieldRoutes, FieldWork, or BrioStack) before adding other integrations.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
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
            onClick={() => {
              if (canConnect) {
                onConnect(integration);
                onClose();
              }
            }}
            disabled={!canConnect}
            style={{
              padding: '10px 20px',
              backgroundColor: canConnect ? currentTheme.primary : currentTheme.border,
              border: 'none',
              borderRadius: '8px',
              color: canConnect ? 'white' : currentTheme.textSecondary,
              cursor: canConnect ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Connect Integration
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationModal;