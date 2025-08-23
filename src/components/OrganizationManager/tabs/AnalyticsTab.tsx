import React, { useState } from 'react';
import { Database, Activity } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';
import { TableDataManager } from '../components/TableDataManager';
import { SyncLogManager } from '../components/SyncLogManager';

const AnalyticsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();
  const [showTableManager, setShowTableManager] = useState(false);
  const [showSyncLogManager, setShowSyncLogManager] = useState(false);

  return (
    <div>
      {/* Table Data Management Section */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        padding: '24px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Database Management
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            View and manage actual database table data for this organization.
          </p>
        </div>
        
        <button
          onClick={() => setShowTableManager(true)}
          style={{
            padding: '12px 20px',
            backgroundColor: currentTheme.primary,
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Database size={16} />
          Manage Table Data
        </button>
      </div>

      {/* Sync Logs Management Section */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        padding: '24px',
        marginTop: '24px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Sync Logs Management
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            View and manage synchronization logs, state data, and journal entries for this organization.
          </p>
        </div>
        
        <button
          onClick={() => setShowSyncLogManager(true)}
          style={{
            padding: '12px 20px',
            backgroundColor: currentTheme.primary,
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Activity size={16} />
          Manage Sync Logs
        </button>
      </div>

      {/* Table Data Manager Modal */}
      {showTableManager && (
        <TableDataManager
          organization={organization}
          onClose={() => setShowTableManager(false)}
        />
      )}

      {/* Sync Log Manager Modal */}
      {showSyncLogManager && (
        <SyncLogManager
          organization={organization}
          onClose={() => setShowSyncLogManager(false)}
        />
      )}
    </div>
  );
};

export default AnalyticsTab;