import React, { useEffect, useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../../theme/ThemeContext';
import { ScriptEditor } from '../../../features/script-editor';
import { rulesAPI as userRulesAPI } from '../../api/userRules';
import type { Organization, User as UserType } from '../../types';

interface UserRulesTabProps {
  organization: Organization;
  onUpdate: (org: Organization) => void;
}

const UserRulesTab: React.FC<UserRulesTabProps> = ({ organization }) => {
  const { currentTheme } = useTheme();

  // User rules state
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [userScript, setUserScript] = useState<string>('');
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);

  // Fetch users with connected CRM users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        // Get users from organization and filter for connected CRM users
        const orgUsers = organization.users || [];
        const connectedUsers = orgUsers.filter(user => user.connectedCrmUser);
        setUsers(connectedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [organization.users]);

  // Fetch user rules when user is selected
  useEffect(() => {
    const fetchUserRules = async () => {
      if (!selectedUser) {
return;
}
      
      setUserLoading(true);
      setUserError(null);

      try {
        const userRulesScript = await userRulesAPI.getRulesForUser({ id: selectedUser.id });
        setUserScript(userRulesScript);
      } catch (err) {
        console.error('Failed to fetch user rules:', err);
        setUserError('Failed to load user rules. Please try again.');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserRules();
  }, [selectedUser]);

  // User script handlers
  const handleUserScriptSave = async (script: string) => {
    if (!selectedUser) {
return;
}
    
    try {
      await userRulesAPI.updateRulesForUser({ id: selectedUser.id, script });
      console.log('User rules saved successfully for user:', selectedUser.name);
    } catch (err) { 
      console.error('Failed to save user rules:', err);
      throw err;
    }
  };

  const handleUserScriptCompile = async (script: string) => {
    try {
      await userRulesAPI.testCompileRules(script);
      console.log('User script compiled successfully');
    } catch (err) {
      console.error('Failed to compile user script:', err);
      throw err;
    }
  };

  if (usersLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: currentTheme.textSecondary
      }}>
        Loading users...
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
          User-Specific Rules
        </h3>
        <p style={{
          color: currentTheme.textSecondary,
          margin: 0,
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          Select a user with a connected CRM account to define and edit rules that apply specifically to that user.
          User rules have the highest priority and override both branch and organization rules.
        </p>
      </div>

      {/* User Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          color: currentTheme.textSecondary,
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          display: 'block'
        }}>
          Select a User:
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedUser?.id || ''}
            onChange={(e) => {
              const user = users.find(u => u.id === parseInt(e.target.value)) || null;
              setSelectedUser(user);
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
            <option value="">Select a user...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.role} ({user.email})
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
        {selectedUser && (
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
            <User size={14} style={{ color: currentTheme.primary }} />
            <span>
              <strong>{selectedUser.name}</strong> - {selectedUser.role}, 
              Connected CRM User: {selectedUser.connectedCrmUser}
            </span>
          </div>
        )}
        {users.length === 0 && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            backgroundColor: currentTheme.warning + '10',
            borderRadius: '6px',
            fontSize: '12px',
            color: currentTheme.textSecondary,
            fontStyle: 'italic'
          }}>
            No users with connected CRM accounts found
          </div>
        )}
      </div>

      {/* User Rules Editor */}
      {selectedUser ? (
        <>
          {userError && (
            <div style={{
              color: currentTheme.danger,
              backgroundColor: currentTheme.danger + '10',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {userError}
            </div>
          )}
          
          {userLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: currentTheme.textSecondary
            }}>
              Loading user rules...
            </div>
          ) : (
            <ScriptEditor
              script={userScript}
              onSave={handleUserScriptSave}
              onCompile={handleUserScriptCompile}
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
          Select a user above to edit their specific rules
        </div>
      )}
    </div>
  );
};

export default UserRulesTab;