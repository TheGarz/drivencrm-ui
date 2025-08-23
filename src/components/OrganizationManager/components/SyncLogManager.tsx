import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

interface SyncLogManagerProps {
  organization: Organization;
  onClose: () => void;
}

interface SyncTableItem {
  name: string;
  key: string;
}

// Available sync tables matching DrivenCRM V1
const syncTables: SyncTableItem[] = [
  { name: 'SyncState', key: 'SyncState' },
  { name: 'JournalEntry', key: 'JournalEntry' },
  { name: 'DataSnapshot', key: 'DataSnapshot' },
];

interface SyncLogData {
  id: string;
  [key: string]: any;
}

// Mock sync log data for demonstration - replace with actual API
const mockSyncData: Record<string, SyncLogData[]> = {
  SyncState: [
    {
      id: '507f1f77bcf86cd799439011',
      org: 1,
      service: 'PestPac',
      status: 'SUCCESS',
      lastSync: { $date: '2024-08-23T10:30:00.000Z' },
      recordsProcessed: 1250,
      errors: [],
      metadata: {
        syncType: 'FULL',
        duration: 45000,
        endpoint: '/api/v1/customers'
      }
    },
    {
      id: '507f1f77bcf86cd799439012',
      org: 1,
      service: 'FieldRoutes',
      status: 'ERROR',
      lastSync: { $date: '2024-08-23T09:15:00.000Z' },
      recordsProcessed: 0,
      errors: ['Authentication failed', 'Rate limit exceeded'],
      metadata: {
        syncType: 'INCREMENTAL',
        duration: 5000,
        endpoint: '/api/v2/routes'
      }
    }
  ],
  JournalEntry: [
    {
      id: '507f1f77bcf86cd799439013',
      org: 1,
      table: 'Customers',
      operation: 'UPDATE',
      timestamp: { $date: '2024-08-23T10:35:00.000Z' },
      recordId: 12345,
      changes: {
        before: { name: 'John Doe', status: 'ACTIVE' },
        after: { name: 'John Smith', status: 'ACTIVE' }
      },
      source: 'PestPac'
    },
    {
      id: '507f1f77bcf86cd799439014',
      org: 1,
      table: 'Branches',
      operation: 'CREATE',
      timestamp: { $date: '2024-08-23T10:40:00.000Z' },
      recordId: 67890,
      changes: {
        after: { name: 'North Branch', active: true, manager: 'Jane Doe' }
      },
      source: 'FieldRoutes'
    }
  ],
  DataSnapshot: [
    {
      id: '507f1f77bcf86cd799439015',
      org: 1,
      snapshotDate: { $date: '2024-08-23T00:00:00.000Z' },
      totalCustomers: 15420,
      activeSubscriptions: 12850,
      monthlyRevenue: 245000.50,
      syncSources: ['PestPac', 'FieldRoutes', 'HubSpot'],
      dataQuality: {
        completeness: 0.95,
        accuracy: 0.98,
        consistency: 0.92
      }
    }
  ]
};

// CompassJsonPanel component - recreating the V1 functionality
const CompassJsonPanel: React.FC<{ data: Record<string, any> }> = ({ data }) => {
  const { currentTheme } = useTheme();

  const renderValue = (value: any, key?: string, depth = 0): React.ReactElement => {
    const indentStyle = { paddingLeft: `${depth * 20}px` };

    if (value === null || value === undefined) {
      return (
        <div key={key} style={indentStyle}>
          <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
            {key ? `${key}: ` : ''}
          </span>
          <span style={{ color: currentTheme.warning }}>null</span>
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key} style={indentStyle}>
          <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
            {key ? `${key}: ` : ''}
          </span>
          <span style={{ color: currentTheme.primary }}>{value ? 'true' : 'false'}</span>
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div key={key} style={indentStyle}>
          <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
            {key ? `${key}: ` : ''}
          </span>
          <span style={{ color: currentTheme.success }}>{value}</span>
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <div key={key} style={indentStyle}>
          <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
            {key ? `${key}: ` : ''}
          </span>
          <span style={{ color: currentTheme.primary }}>"{value}"</span>
        </div>
      );
    }

    if (value && typeof value === 'object') {
      // Handle MongoDB ObjectId and Date formats
      if ('$oid' in value) {
        return (
          <div key={key} style={indentStyle}>
            <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
              {key ? `${key}: ` : ''}
            </span>
            <span style={{ color: currentTheme.danger }}>ObjectId('{value.$oid}')</span>
          </div>
        );
      }

      if ('$date' in value) {
        return (
          <div key={key} style={indentStyle}>
            <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
              {key ? `${key}: ` : ''}
            </span>
            <span style={{ color: currentTheme.success }}>
              {new Date(value.$date).toISOString()}
            </span>
          </div>
        );
      }

      if (Array.isArray(value)) {
        const [expanded, setExpanded] = useState(false);
        
        return (
          <div key={key}>
            <div
              style={{ ...indentStyle, cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setExpanded(!expanded)}
            >
              <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
                {expanded ? '▼' : '▶'} {key ? `${key}: ` : ''}[{value.length}]
              </span>
            </div>
            {expanded && (
              <div>
                {value.map((item, index) => renderValue(item, `[${index}]`, depth + 1))}
              </div>
            )}
          </div>
        );
      }

      // Regular object
      const [expanded, setExpanded] = useState(key === undefined); // Auto-expand root object
      
      return (
        <div key={key}>
          <div
            style={{ ...indentStyle, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setExpanded(!expanded)}
          >
            <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
              {expanded ? '▼' : '▶'} {key ? `${key}: ` : ''}Object
            </span>
          </div>
          {expanded && (
            <div>
              {Object.entries(value).map(([childKey, childValue]) =>
                renderValue(childValue, childKey, depth + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={key} style={indentStyle}>
        <span style={{ color: currentTheme.textSecondary, fontWeight: '600' }}>
          {key ? `${key}: ` : ''}
        </span>
        <span style={{ color: currentTheme.textPrimary }}>{String(value)}</span>
      </div>
    );
  };

  return (
    <div style={{
      fontFamily: '"Fira Mono", Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata", "Courier New", monospace',
      fontSize: '12px',
      backgroundColor: currentTheme.background,
      border: `1px solid ${currentTheme.border}`,
      borderRadius: '8px',
      padding: '16px',
      margin: '8px 0',
      overflow: 'auto'
    }}>
      {renderValue(data)}
    </div>
  );
};

export const SyncLogManager: React.FC<SyncLogManagerProps> = ({ organization, onClose }) => {
  const { currentTheme } = useTheme();
  const [selectedTable, setSelectedTable] = useState<SyncTableItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [syncLogData, setSyncLogData] = useState<SyncLogData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch sync log data when table selection changes
  useEffect(() => {
    if (selectedTable) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setSyncLogData(mockSyncData[selectedTable.key] || []);
        setLoading(false);
      }, 500);
    }
  }, [selectedTable]);

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
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
        width: '90%',
        maxWidth: '1200px',
        height: '90%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${currentTheme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              color: currentTheme.textPrimary,
              margin: '0 0 4px 0',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              Manage Sync Logs: {organization.name}
            </h2>
            <p style={{
              color: currentTheme.textSecondary,
              margin: 0,
              fontSize: '14px'
            }}>
              View synchronization logs, state data, and journal entries for organization #{organization.id}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={toggleSearch}
              style={{
                padding: '8px 16px',
                backgroundColor: currentTheme.background,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                color: currentTheme.textPrimary,
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {searchOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {searchOpen ? 'Hide Search' : 'Show Search'}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: currentTheme.textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Table Selection */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${currentTheme.border}` }}>
          <label style={{
            color: currentTheme.textSecondary,
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            display: 'block'
          }}>
            Select a Sync Table:
          </label>
          <select
            value={selectedTable?.key || ''}
            onChange={(e) => {
              const table = syncTables.find((t) => t.key === e.target.value) || null;
              setSelectedTable(table);
            }}
            style={{
              padding: '8px 12px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.background,
              color: currentTheme.textPrimary,
              fontSize: '14px',
              minWidth: '200px'
            }}
          >
            <option value="">Select a Table...</option>
            {syncTables.map((table) => (
              <option key={table.key} value={table.key}>
                {table.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Section */}
        {searchOpen && (
          <div style={{
            padding: '24px',
            backgroundColor: currentTheme.background,
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            <div style={{
              color: currentTheme.textSecondary,
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              Advanced search functionality would be implemented here
            </div>
          </div>
        )}

        {/* Sync Log Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              Loading sync log data...
            </div>
          )}
          
          {!loading && selectedTable && syncLogData.length === 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              No sync log data found for table: {selectedTable.name}
            </div>
          )}

          {!loading && selectedTable && syncLogData.length > 0 && (
            <div>
              {syncLogData.map((entry, index) => (
                <CompassJsonPanel key={`${entry.id}-${index}`} data={entry} />
              ))}
            </div>
          )}

          {!selectedTable && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              Select a sync table to view its log data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};