import React, { useEffect, useState } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../../theme/ThemeContext';
import { ScriptEditor } from '../../../features/script-editor';
import { branchRulesAPI, type Branch } from '../../../../api/branchRules';
import type { Organization } from '../../types';

interface BranchRulesTabProps {
  organization: Organization;
  onUpdate: (org: Organization) => void;
}

const BranchRulesTab: React.FC<BranchRulesTabProps> = ({ organization }) => {
  const { currentTheme } = useTheme();
  
  // Branch rules state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchScript, setBranchScript] = useState<string>('');
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      setBranchesLoading(true);
      try {
        const organizationBranches = await branchRulesAPI.getBranchesForOrganization(organization.id);
        setBranches(organizationBranches);
      } catch (err) {
        console.error('Failed to fetch branches:', err);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, [organization.id]);

  // Fetch branch rules when branch is selected
  useEffect(() => {
    const fetchBranchRules = async () => {
      if (!selectedBranch) {
return;
}
      
      setBranchLoading(true);
      setBranchError(null);

      try {
        const branchRulesScript = await branchRulesAPI.getRulesForBranch({ branchId: selectedBranch.id });
        setBranchScript(branchRulesScript);
      } catch (err) {
        console.error('Failed to fetch branch rules:', err);
        setBranchError('Failed to load branch rules. Please try again.');
      } finally {
        setBranchLoading(false);
      }
    };

    fetchBranchRules();
  }, [selectedBranch]);

  // Branch script handlers
  const handleBranchScriptSave = async (script: string) => {
    if (!selectedBranch) {
return;
}
    
    try {
      await branchRulesAPI.updateRulesForBranch({ branchId: selectedBranch.id, script });
      console.log('Branch rules saved successfully for branch:', selectedBranch.name);
    } catch (err) { 
      console.error('Failed to save branch rules:', err);
      throw err;
    }
  };

  const handleBranchScriptCompile = async (script: string) => {
    try {
      await branchRulesAPI.testCompileRules(script);
      console.log('Branch script compiled successfully');
    } catch (err) {
      console.error('Failed to compile branch script:', err);
      throw err;
    }
  };

  if (branchesLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: currentTheme.textSecondary
      }}>
        Loading branches...
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
          Branch-Specific Rules
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          Select a branch to define and edit rules that apply specifically to that branch.
          Branch rules override organization-wide rules for users assigned to the selected branch.
        </p>
      </div>

      {/* Branch Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          display: 'block'
        }}>
          Select a Branch:
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedBranch?.id || ''}
            onChange={(e) => {
              const branch = branches.find(b => b.id === parseInt(e.target.value)) || null;
              setSelectedBranch(branch);
            }}
            style={{
              padding: '12px 40px 12px 16px',
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.background,
              color: currentTheme.textPrimary,
              fontSize: '14px',
              width: '100%',
              maxWidth: '400px',
              appearance: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">Select a branch...</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.type} ({branch.city}, {branch.state})
              </option>
            ))}
          </select>
          <ChevronDown 
            size={16} 
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: currentTheme.textSecondary,
              pointerEvents: 'none'
            }}
          />
        </div>
        {selectedBranch && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: currentTheme.primary + '10',
            borderRadius: '6px',
            fontSize: '12px',
            color: currentTheme.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Building2 size={14} style={{ color: currentTheme.primary }} />
            <span>
              <strong>{selectedBranch.name}</strong> - {selectedBranch.employees} employees, 
              Manager: {selectedBranch.manager}
            </span>
          </div>
        )}
      </div>

      {/* Branch Rules Editor */}
      {selectedBranch ? (
        <>
          {branchError && (
            <div style={{
              color: currentTheme.danger,
              backgroundColor: currentTheme.danger + '10',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {branchError}
            </div>
          )}
          
          {branchLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              Loading branch rules...
            </div>
          ) : (
            <ScriptEditor
              script={branchScript}
              onSave={handleBranchScriptSave}
              onCompile={handleBranchScriptCompile}
            />
          )}
        </>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: currentTheme.textSecondary,
          fontStyle: 'italic'
        }}>
          Select a branch above to edit its specific rules
        </div>
      )}
    </div>
  );
};

export default BranchRulesTab;