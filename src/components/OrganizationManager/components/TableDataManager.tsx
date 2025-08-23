import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

interface TableDataManagerProps {
  organization: Organization;
  onClose: () => void;
}

interface TableItem {
  name: string;
  key: string;
}

// Available tables matching DrivenCRM V1
const tables: TableItem[] = [
  { name: 'Branch', key: 'Branch' },
  { name: 'User', key: 'User' },
  { name: 'AnswerDetail', key: 'AnswerDetail' },
  { name: 'CancelDetail', key: 'CancelDetail' },
  { name: 'CompletionDetail', key: 'CompletionDetail' },
  { name: 'CustomerPayment', key: 'CustomerPayment' },
  { name: 'CustomerReview', key: 'CustomerReview' },
  { name: 'DrivingDetail', key: 'DrivingDetail' },
  { name: 'HistoricalAging', key: 'HistoricalAging' },
  { name: 'InvoiceDetail', key: 'InvoiceDetail' },
  { name: 'Leads', key: 'Leads' },
  { name: 'SoldDetail', key: 'SoldDetail' },
  { name: 'SubscriptionDetail', key: 'SubscriptionDetail' },
];

interface TableData {
  id: number;
  [key: string]: any;
}

// Mock table schemas for demonstration - replace with actual API
const mockTableSchemas: Record<string, any> = {
  Branch: {
    fields: [
      { key: 'id', name: 'ID', type: 'number', editable: false },
      { key: 'name', name: 'Name', type: 'string', editable: true },
      { key: 'active', name: 'Active', type: 'boolean', editable: true },
      { key: 'created_at', name: 'Created At', type: 'date', editable: false },
    ]
  },
  User: {
    fields: [
      { key: 'id', name: 'ID', type: 'number', editable: false },
      { key: 'firstname', name: 'First Name', type: 'string', editable: true },
      { key: 'lastname', name: 'Last Name', type: 'string', editable: true },
      { key: 'email', name: 'Email', type: 'string', editable: true },
      { key: 'active', name: 'Active', type: 'boolean', editable: true },
    ]
  },
  // Add more schemas as needed...
};

// Mock data for demonstration - replace with actual API
const mockTableData: Record<string, TableData[]> = {
  Branch: [
    { id: 1, name: 'Main Branch', active: true, created_at: '2024-01-15' },
    { id: 2, name: 'North Branch', active: true, created_at: '2024-02-20' },
    { id: 3, name: 'South Branch', active: false, created_at: '2024-03-10' },
  ],
  User: [
    { id: 1, firstname: 'John', lastname: 'Doe', email: 'john.doe@example.com', active: true },
    { id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@example.com', active: true },
    { id: 3, firstname: 'Bob', lastname: 'Johnson', email: 'bob.johnson@example.com', active: false },
  ]
};

export const TableDataManager: React.FC<TableDataManagerProps> = ({ organization, onClose }) => {
  const { currentTheme } = useTheme();
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data when table selection changes
  useEffect(() => {
    if (selectedTable) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTableData(mockTableData[selectedTable.key] || []);
        setLoading(false);
      }, 500);
    }
  }, [selectedTable]);

  const toggleSearch = () => setSearchOpen((prev) => !prev);

  const getTableSchema = (tableKey: string) => {
    return mockTableSchemas[tableKey] || { fields: [] };
  };

  const renderTableCell = (field: any, value: any, entry: TableData) => {
    if (value === null || value === undefined) {
      return <span style={{ color: currentTheme.textSecondary, fontStyle: 'italic' }}>null</span>;
    }

    if (!field.editable) {
      switch (field.type) {
        case 'boolean':
          return value ? '✓' : '';
        case 'date':
          return new Date(value).toLocaleDateString();
        default:
          return String(value);
      }
    }

    // Editable fields
    switch (field.type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => {
              // Handle inline edit
              console.log('Updating:', entry.id, field.key, e.target.checked);
            }}
            style={{ cursor: 'pointer' }}
          />
        );
      case 'string':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => {
              // Handle inline edit
              console.log('Updating:', entry.id, field.key, e.target.value);
            }}
            style={{
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '4px',
              padding: '4px 8px',
              backgroundColor: currentTheme.background,
              color: currentTheme.textPrimary,
              fontSize: '14px',
            }}
          />
        );
      default:
        return String(value);
    }
  };

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
              Manage Table Data: {organization.name}
            </h2>
            <p style={{
              color: currentTheme.textSecondary,
              margin: 0,
              fontSize: '14px'
            }}>
              View and edit database table data for organization #{organization.id}
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
            Select a Table:
          </label>
          <select
            value={selectedTable?.key || ''}
            onChange={(e) => {
              const table = tables.find((t) => t.key === e.target.value) || null;
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
            {tables.map((table) => (
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

        {/* Table Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              Loading table data...
            </div>
          )}
          
          {!loading && selectedTable && tableData.length === 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              No data found for table: {selectedTable.name}
            </div>
          )}

          {!loading && selectedTable && tableData.length > 0 && (
            <div style={{ overflow: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: currentTheme.background,
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ backgroundColor: currentTheme.cardBg }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      color: currentTheme.textPrimary,
                      fontWeight: '600',
                      borderBottom: `1px solid ${currentTheme.border}`
                    }}>
                      #
                    </th>
                    {getTableSchema(selectedTable.key).fields.map((field: any, index: number) => (
                      <th key={index} style={{
                        padding: '12px',
                        textAlign: 'left',
                        color: currentTheme.textPrimary,
                        fontWeight: '600',
                        borderBottom: `1px solid ${currentTheme.border}`
                      }}>
                        {field.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((entry, index) => (
                    <tr key={entry.id} style={{
                      borderBottom: `1px solid ${currentTheme.border}`
                    }}>
                      <td style={{
                        padding: '12px',
                        color: currentTheme.textSecondary,
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </td>
                      {getTableSchema(selectedTable.key).fields.map((field: any) => (
                        <td key={field.key} style={{
                          padding: '12px',
                          color: currentTheme.textPrimary,
                          fontSize: '14px'
                        }}>
                          {renderTableCell(field, entry[field.key], entry)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Select a table to view its data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};