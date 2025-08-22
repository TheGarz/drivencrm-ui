import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

const CustomRulesTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();
  
  const [rules, setRules] = useState([
    { 
      id: 1, 
      name: 'High Value Customer Alert', 
      description: 'Notify when customer value exceeds $5,000', 
      active: true, 
      trigger: 'customer_value > 5000',
      action: 'Send notification to managers'
    },
    { 
      id: 2, 
      name: 'Overdue Service Alert', 
      description: 'Alert when service is overdue by 30+ days', 
      active: true, 
      trigger: 'days_since_service > 30',
      action: 'Create follow-up task'
    },
    { 
      id: 3, 
      name: 'Low Tech Availability', 
      description: 'Alert when available technicians < 3', 
      active: false, 
      trigger: 'available_techs < 3',
      action: 'Notify operations team'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    trigger: '',
    action: '',
    active: true
  });

  const handleCreateRule = () => {
    if (newRule.name && newRule.description && newRule.trigger && newRule.action) {
      setRules([...rules, { ...newRule, id: Date.now() }]);
      setNewRule({ name: '', description: '', trigger: '', action: '', active: true });
      setIsCreating(false);
    }
  };

  const handleToggleRule = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const handleDeleteRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <div>
      {/* Rules List */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '12px',
        border: `1px solid ${currentTheme.border}`,
        marginBottom: '24px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{
                color: currentTheme.textPrimary,
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Custom Business Rules ({rules.length})
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                Automated rules and triggers for organization management
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              style={{
                padding: '8px 16px',
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
              <Plus size={16} />
              Add Rule
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {rules.map((rule) => (
            <div key={rule.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: `1px solid ${currentTheme.border}`
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: rule.active ? currentTheme.success : currentTheme.textSecondary
                  }} />
                  <h4 style={{
                    color: currentTheme.textPrimary,
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {rule.name}
                  </h4>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: rule.active ? currentTheme.success + '20' : currentTheme.textSecondary + '20',
                    color: rule.active ? currentTheme.success : currentTheme.textSecondary
                  }}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: '0 0 8px 20px',
                  fontSize: '14px'
                }}>
                  {rule.description}
                </p>
                <div style={{
                  margin: '0 0 0 20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: currentTheme.textSecondary, fontWeight: '500' }}>Trigger: </span>
                    <span style={{ color: currentTheme.textPrimary, fontFamily: 'monospace' }}>{rule.trigger}</span>
                  </div>
                  <div>
                    <span style={{ color: currentTheme.textSecondary, fontWeight: '500' }}>Action: </span>
                    <span style={{ color: currentTheme.textPrimary }}>{rule.action}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: rule.active ? currentTheme.warning : currentTheme.success,
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {rule.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  style={{
                    padding: '6px',
                    backgroundColor: currentTheme.danger,
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Rule Form */}
      {isCreating && (
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
              margin: 0,
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Create New Rule
            </h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Enter rule name"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Brief description of the rule"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Trigger Condition
                </label>
                <input
                  type="text"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                  placeholder="e.g., customer_value > 1000"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Action to Take
                </label>
                <input
                  type="text"
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  placeholder="What should happen when triggered"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsCreating(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  color: currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomRulesTab;