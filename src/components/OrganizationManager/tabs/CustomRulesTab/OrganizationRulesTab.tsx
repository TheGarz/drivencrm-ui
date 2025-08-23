import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../../theme/ThemeContext';
import { ScriptEditor } from '../../../features/script-editor';
import { rulesAPI } from '../../../../api/rules';
import type { Organization } from '../../types';

interface OrganizationRulesTabProps {
  organization: Organization;
  onUpdate: (org: Organization) => void;
}

const OrganizationRulesTab: React.FC<OrganizationRulesTabProps> = ({ organization }) => {
  const { currentTheme } = useTheme();
  const [script, setScript] = useState<string>(`
-- Sample Driven script
MODULE [My Organization]:
    RULESET [Has High Value Customers]:
        RULE [Default]: customer_value > 5000
    END

    ===
    Multiline comment
    for organization rules
    ===
    RULESET [Service Schedule]:
        RULE [Default]: TIME(12, 0, 0)
        RULE [Priority]:
            = IF(customer_priority == "HIGH", 20 minutes)
            = TIME(12, 0, 0)
    END
END
`);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch organization rules on component mount
  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      setError(null);

      try {
        const rulesScript = await rulesAPI.getRulesForOrganization(organization.id);
        setScript(rulesScript);
      } catch (err) {
        console.error('Failed to fetch rules:', err);
        setError('Failed to load organization rules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [organization.id]);

  const handleScriptSave = async (script: string) => {
    try {
      await rulesAPI.updateRulesForOrganization({ id: organization.id, script });
      console.log('Rules saved successfully for organization:', organization.id);
    } catch (err) { 
      console.error('Failed to save rules:', err);
      throw err;
    }
  };

  const handleScriptCompile = async (script: string) => {
    try {
      await rulesAPI.testCompileRules(script);
      console.log('Script compiled successfully');
    } catch (err) {
      console.error('Failed to compile script:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: currentTheme.textSecondary
      }}>
        Loading organization rules...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          color: currentTheme.textPrimary,
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Organization-Wide Rules
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          Define and edit rules that apply to all users and branches within this organization.
          These rules serve as defaults and can be overridden by branch-specific or user-specific rules.
        </p>
      </div>
      
      {error && (
        <div style={{
          color: currentTheme.danger,
          backgroundColor: currentTheme.danger + '10',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <ScriptEditor
        script={script}
        onSave={handleScriptSave}
        onCompile={handleScriptCompile}
      />
    </div>
  );
};

export default OrganizationRulesTab;