import React, { useState } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  ChevronDown, 
  X, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  Users, 
  MapPin, 
  Target, 
  Users2, 
  AlertCircle,
  GripVertical,
  TrendingUp
} from 'lucide-react';
import { useTheme } from '../../../../theme/ThemeContext';
import type { Organization, MetricGroup, MetricConfig, MetricDescription } from '../../types';
import { availableMetrics, defaultGroups } from './constants';

const MetricsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();

  // Available metrics by category

  // State management
  const [activeTab, setActiveTab] = useState('branch');
  const [metricGroups, setMetricGroups] = useState<MetricGroup[]>(() => {
    // Initialize with default groups and current organization config
    return defaultGroups.map(group => ({
      ...group,
      isActive: !!organization.app_config?.metrics[group.name],
      metrics: organization.app_config?.metrics[group.name] || []
    }));
  });
  
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<MetricGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState<{groupName?: string}>({});
  const [usersToTransfer, setUsersToTransfer] = useState<number[]>([]); // Users being moved from other groups
  const [isLoading, setIsLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [groupToDeactivate, setGroupToDeactivate] = useState<string | null>(null);
  const [showDefaultGroupModal, setShowDefaultGroupModal] = useState(false);
  const [viewingDefaultGroup, setViewingDefaultGroup] = useState<MetricGroup | null>(null);
  const [showEditMetricModal, setShowEditMetricModal] = useState(false);
  const [editingMetric, setEditingMetric] = useState<{groupId: string, metricIndex: number, metric: MetricConfig} | null>(null);
  const [editForm, setEditForm] = useState({
    displayName: '',
    customRule: ''
  });

  // Generate UID from display name
  const generateUID = (displayName: string): string => {
    return displayName.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
  };

  // Get current active group
  const currentGroup = metricGroups.find(g => g.id === activeTab);

  // Handle adding a metric to current group
  const handleAddMetric = () => {
    if (!selectedMetric || !currentGroup || currentGroup.metrics.length >= 5) {
return;
}

    const updatedGroups = metricGroups.map(group => {
      if (group.id === activeTab) {
        return {
          ...group,
          metrics: [...group.metrics, { type: selectedMetric }]
        };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    setSelectedMetric('');
  };

  // Handle removing a metric
  const handleRemoveMetric = (metricType: string) => {
    const updatedGroups = metricGroups.map(group => {
      if (group.id === activeTab) {
        return {
          ...group,
          metrics: group.metrics.filter(m => m.type !== metricType)
        };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
  };

  // Handle toggling group active state
  const handleToggleGroup = (groupId: string) => {
    const group = metricGroups.find(g => g.id === groupId);
    
    // If group is currently active and has metrics, show confirmation modal
    if (group?.isActive && group.metrics.length > 0) {
      setGroupToDeactivate(groupId);
      setShowDeactivateModal(true);
      return;
    }

    // For inactive groups or groups without metrics, toggle immediately
    const updatedGroups = metricGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, isActive: !group.isActive };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
  };

  // Handle confirmed deactivation
  const handleConfirmDeactivate = () => {
    if (!groupToDeactivate) {
return;
}

    const updatedGroups = metricGroups.map(group => {
      if (group.id === groupToDeactivate) {
        return { ...group, isActive: false };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    
    // Switch to first remaining active group if deactivating current tab
    if (activeTab === groupToDeactivate) {
      const firstActive = updatedGroups.find(g => g.isActive);
      if (firstActive) {
        setActiveTab(firstActive.id);
      }
    }

    setShowDeactivateModal(false);
    setGroupToDeactivate(null);
  };

  // Handle cancel deactivation
  const handleCancelDeactivate = () => {
    setShowDeactivateModal(false);
    setGroupToDeactivate(null);
  };

  // Handle edit metric
  const handleEditMetric = (groupId: string, metricIndex: number, metric: MetricConfig) => {
    setEditingMetric({ groupId, metricIndex, metric });
    setEditForm({
      displayName: metric.displayName || '',
      customRule: metric.customRule || ''
    });
    setShowEditMetricModal(true);
  };

  // Handle save metric edit
  const handleSaveMetricEdit = () => {
    if (!editingMetric) {
return;
}

    const displayName = editForm.displayName.trim();
    const uid = displayName ? generateUID(displayName) : undefined;

    const updatedGroups = metricGroups.map(group => {
      if (group.id === editingMetric.groupId) {
        const updatedMetrics = group.metrics.map((metric, index) => {
          if (index === editingMetric.metricIndex) {
            return {
              ...metric,
              displayName: displayName || undefined,
              uid: uid,
              customRule: editForm.customRule.trim() || undefined
            };
          }
          return metric;
        });
        return { ...group, metrics: updatedMetrics };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    setShowEditMetricModal(false);
    setEditingMetric(null);
    setEditForm({ displayName: '', customRule: '' });
  };

  // Handle cancel metric edit
  const handleCancelMetricEdit = () => {
    setShowEditMetricModal(false);
    setEditingMetric(null);
    setEditForm({ displayName: '', customRule: '' });
  };

  // Handle adding custom group
  const handleAddCustomGroup = async () => {
    // Clear previous errors
    setFormErrors({});
    setIsLoading(true);
    
    try {
      if (!newGroupName.trim()) {
        setFormErrors({ groupName: 'Group name is required' });
        return;
      }
      
      // Check if group name already exists
      const existingGroup = metricGroups.find(g => 
        g.displayName.toLowerCase() === newGroupName.trim().toLowerCase()
      );
      if (existingGroup) {
        setFormErrors({ groupName: 'A group with this name already exists' });
        return;
      }

      const groupId = newGroupName.toLowerCase().replace(/\s+/g, '-');
      const newGroup: MetricGroup = {
        id: groupId,
        name: groupId,
        displayName: newGroupName,
        isDefault: false,
        isActive: true,
        metrics: [],
        users: selectedUsers.length > 0 ? [...selectedUsers] : undefined
      };

      // Simulate API delay for better UX demonstration
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove users from their current groups if they're being transferred
      let updatedGroups = [...metricGroups];
      for (const userIdToTransfer of usersToTransfer) {
        updatedGroups = updatedGroups.map(group => ({
          ...group,
          users: group.users ? group.users.filter(id => id !== userIdToTransfer) : group.users
        }));
      }

      // Add the new group
      updatedGroups.push(newGroup);
      
      setMetricGroups(updatedGroups);
      updateOrganizationConfig(updatedGroups);
      resetModalState();
      setShowAddGroupModal(false);
      setActiveTab(groupId);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing custom group
  const handleEditCustomGroup = (group: MetricGroup) => {
    setEditingGroup(group);
    setNewGroupName(group.displayName);
    setSelectedUsers(group.users || []);
    setUsersToTransfer([]); // Reset transfer list for editing
    setShowEditGroupModal(true);
  };

  // Handle saving group edit
  const handleSaveGroupEdit = () => {
    if (!editingGroup || !newGroupName.trim()) {
return;
}

    // Remove users from their current groups if they're being transferred
    let updatedGroups = metricGroups.map(group => {
      // Remove transferred users from other groups
      if (group.id !== editingGroup.id) {
        return {
          ...group,
          users: group.users ? group.users.filter(id => !usersToTransfer.includes(id)) : group.users
        };
      }
      return group;
    });

    // Update the current group with new users and name
    updatedGroups = updatedGroups.map(group => {
      if (group.id === editingGroup.id) {
        return {
          ...group,
          displayName: newGroupName,
          users: selectedUsers.length > 0 ? [...selectedUsers] : undefined
        };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    updateOrganizationConfig(updatedGroups);
    resetModalState();
    setShowEditGroupModal(false);
  };

  // Reset modal state
  const resetModalState = () => {
    setNewGroupName('');
    setSelectedUsers([]);
    setUsersToTransfer([]);
    setUserRoleFilter('all');
    setUserSearchTerm('');
    setEditingGroup(null);
    setFormErrors({});
  };

  // Handle user selection with transfer logic
  const handleUserSelection = (userId: number, isSelected: boolean) => {
    const currentGroup = getUserCurrentGroup(userId);
    
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
      // If user is in another group, mark for transfer
      if (currentGroup && currentGroup.id !== 'unassigned') {
        setUsersToTransfer(prev => [...prev, userId]);
      }
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      setUsersToTransfer(prev => prev.filter(id => id !== userId));
    }
  };

  // Get filtered and sorted users
  const getFilteredUsers = () => {
    const users = organization.users || [];
    
    // Filter by role
    let filteredUsers = userRoleFilter === 'all' 
      ? users 
      : users.filter(user => user.role.toLowerCase() === userRoleFilter.toLowerCase());
    
    // Filter by search term
    if (userSearchTerm) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
    }

    // Sort by role first, then by name
    return filteredUsers.sort((a, b) => {
      if (a.role !== b.role) {
        return a.role.localeCompare(b.role);
      }
      return a.name.localeCompare(b.name);
    });
  };

  // Get unique roles for filter dropdown
  const getUniqueRoles = () => {
    const roles = (organization.users || []).map(user => user.role);
    return [...new Set(roles)].sort();
  };

  // Get which group a user is currently assigned to
  const getUserCurrentGroup = (userId: number) => {
    // First check custom groups
    for (const group of metricGroups) {
      if (group.users && group.users.includes(userId)) {
        return group;
      }
    }
    
    // Then check default group assignment based on role
    const user = organization.users?.find(u => u.id === userId);
    if (!user) {
return null;
}
    
    const roleToGroupMap: Record<string, string> = {
      'tech': 'tech',
      'technician': 'tech',
      'csr': 'csr',
      'sales': 'sales',
      'sales rep': 'sales',
      'branch manager': 'branch',
      'manager': 'branch',
      'admin': 'branch',
      'owner': 'branch'
    };
    
    const groupId = roleToGroupMap[user.role.toLowerCase()];
    if (groupId) {
      const defaultGroup = metricGroups.find(g => g.id === groupId && g.isDefault && g.isActive);
      if (defaultGroup) {
        return defaultGroup;
      }
    }
    
    return null;
  };

  // Check if user can be moved to a new group
  const canMoveUser = (userId: number) => {
    const currentGroup = getUserCurrentGroup(userId);
    return currentGroup !== null; // User can be moved if they're in any group
  };

  // Get users that belong to a default group based on role
  const getDefaultGroupUsers = (groupId: string) => {
    const users = organization.users || [];
    
    const roleToGroupMap: Record<string, string[]> = {
      'tech': ['tech', 'technician'],
      'csr': ['csr', 'customer service rep', 'customer service'],
      'sales': ['sales', 'sales rep', 'sales representative'],
      'branch': ['branch manager', 'manager', 'admin', 'administrator', 'owner', 'executive']
    };

    const allowedRoles = roleToGroupMap[groupId] || [];
    
    return users.filter(user => 
      allowedRoles.some(role => 
        user.role.toLowerCase().includes(role.toLowerCase())
      ) && user.status === 'Active'
    ).filter(user => {
      // Exclude users who are explicitly assigned to custom groups
      const assignedToCustomGroup = metricGroups.some(group => 
        !group.isDefault && group.users && group.users.includes(user.id)
      );
      return !assignedToCustomGroup;
    });
  };

  // Handle viewing default group users
  const handleViewDefaultGroup = (group: MetricGroup) => {
    setViewingDefaultGroup(group);
    setShowDefaultGroupModal(true);
  };

  // Handle removing custom group (show confirmation)
  const handleRemoveGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setShowDeleteModal(true);
  };

  // Handle confirmed delete
  const handleConfirmDelete = () => {
    if (groupToDelete) {
      const updatedGroups = metricGroups.filter(g => g.id !== groupToDelete);
      setMetricGroups(updatedGroups);
      updateOrganizationConfig(updatedGroups);
      
      // Switch to first active group
      const firstActive = updatedGroups.find(g => g.isActive);
      if (firstActive) {
        setActiveTab(firstActive.id);
      }
    }
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setGroupToDelete(null);
  };

  // Handle drag and drop reordering
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) {
return;
}

    const updatedGroups = metricGroups.map(group => {
      if (group.id === activeTab) {
        const newMetrics = [...group.metrics];
        const draggedMetric = newMetrics[draggedItem];
        newMetrics.splice(draggedItem, 1);
        newMetrics.splice(index, 0, draggedMetric);
        return { ...group, metrics: newMetrics };
      }
      return group;
    });

    setMetricGroups(updatedGroups);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    updateOrganizationConfig(metricGroups);
  };

  // Update organization config
  const updateOrganizationConfig = (groups: MetricGroup[]) => {
    const metricsConfig: { [key: string]: MetricConfig[] } = {};
    
    groups.forEach(group => {
      if (group.isActive && group.metrics.length > 0) {
        metricsConfig[group.name] = group.metrics;
      }
    });

    const updatedOrg = {
      ...organization,
      app_config: {
        ...organization.app_config,
        metrics: metricsConfig
      }
    };

    onUpdate(updatedOrg);
  };

  // Get available metrics for current group
  const getAvailableMetrics = () => {
    if (!currentGroup) {
return [];
}
    
    const category = currentGroup.isDefault ? currentGroup.name as 'branch' | 'csr' | 'sales' | 'tech' : 'custom';
    return availableMetrics.filter(metric => 
      category === 'custom' || metric.category === category
    );
  };

  return (
    <div>
      {/* Metric Groups Management */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{
                color: currentTheme.textPrimary,
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Metric Groups Configuration
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                Configure up to 5 metrics per group. Enable/disable groups as needed.
              </p>
            </div>
            <button
              onClick={() => setShowAddGroupModal(true)}
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
              Add Custom Group
            </button>
          </div>

          {/* Group Toggle Switches */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {metricGroups.map(group => {
              const IconComponent = group.isDefault ? 
                defaultGroups.find(d => d.id === group.id)?.icon || TrendingUp : 
                TrendingUp;
              
              return (
                <div key={group.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '16px',
                  backgroundColor: group.isActive ? currentTheme.primary + '10' : currentTheme.background,
                  border: `1px solid ${group.isActive ? currentTheme.primary + '30' : currentTheme.border}`,
                  borderRadius: '8px'
                }}>
                  {/* Header Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <IconComponent size={20} style={{ color: currentTheme.primary }} />
                      <div>
                        <div style={{
                          color: currentTheme.textPrimary,
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {group.displayName}
                        </div>
                        {group.isDefault && (
                          <div style={{
                            color: currentTheme.textSecondary,
                            fontSize: '11px',
                            marginTop: '2px'
                          }}>
                            Default Group
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleGroup(group.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: group.isActive ? currentTheme.success : currentTheme.textSecondary,
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {group.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Stats Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '16px'
                    }}>
                      {/* Metrics Count */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        backgroundColor: currentTheme.cardBg,
                        borderRadius: '6px',
                        border: `1px solid ${currentTheme.border}`
                      }}>
                        <TrendingUp size={14} style={{ color: currentTheme.secondary }} />
                        <span style={{
                          color: currentTheme.textPrimary,
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {group.metrics.length}/5 metrics
                        </span>
                      </div>

                      {/* User Count */}
                      {group.isDefault ? (
                        <div 
                          onClick={() => handleViewDefaultGroup(group)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '6px 8px',
                            backgroundColor: currentTheme.cardBg,
                            borderRadius: '6px',
                            border: `1px solid ${currentTheme.border}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '80px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.primary + '10';
                            e.currentTarget.style.borderColor = currentTheme.primary + '50';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.cardBg;
                            e.currentTarget.style.borderColor = currentTheme.border;
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginBottom: '2px'
                          }}>
                            <Users2 size={14} style={{ color: currentTheme.primary }} />
                            <span style={{
                              color: currentTheme.textPrimary,
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {getDefaultGroupUsers(group.id).length} user{getDefaultGroupUsers(group.id).length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <span style={{
                            color: currentTheme.textSecondary,
                            fontSize: '9px',
                            fontStyle: 'italic',
                            textAlign: 'center'
                          }}>
                            click to view
                          </span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 8px',
                          backgroundColor: currentTheme.cardBg,
                          borderRadius: '6px',
                          border: `1px solid ${currentTheme.border}`
                        }}>
                          <Users2 size={14} style={{ color: currentTheme.primary }} />
                          <span style={{
                            color: currentTheme.textPrimary,
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {group.users?.length || 0} user{(group.users?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  {!group.isDefault && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleEditCustomGroup(group)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: currentTheme.secondary,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveGroup(group.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: currentTheme.danger,
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>


        {/* Group Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          {metricGroups.filter(g => g.isActive).map(group => {
            const IconComponent = group.isDefault ? 
              defaultGroups.find(d => d.id === group.id)?.icon || TrendingUp : 
              TrendingUp;
              
            return (
              <button
                key={group.id}
                onClick={() => setActiveTab(group.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  backgroundColor: activeTab === group.id ? currentTheme.primary + '10' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === group.id ? `2px solid ${currentTheme.primary}` : '2px solid transparent',
                  color: activeTab === group.id ? currentTheme.primary : currentTheme.textSecondary,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComponent size={16} />
                {group.displayName} ({group.metrics.length}/5)
              </button>
            );
          })}
        </div>

        {/* Current Group Configuration */}
        {currentGroup && currentGroup.isActive && (
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{
                color: currentTheme.textPrimary,
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {currentGroup.displayName} Metrics ({currentGroup.metrics.length}/5)
              </h4>

              {/* Current Metrics */}
              <div style={{ marginBottom: '24px' }}>
                {currentGroup.metrics.length === 0 ? (
                  <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: currentTheme.textSecondary,
                    border: `2px dashed ${currentTheme.border}`,
                    borderRadius: '8px'
                  }}>
                    No metrics configured for this group
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentGroup.metrics.map((metric, index) => {
                      const metricDesc = availableMetrics.find(m => m.key === metric.type);
                      return (
                        <div
                          key={metric.type}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: currentTheme.primary + '10',
                            border: `1px solid ${currentTheme.primary}30`,
                            borderRadius: '8px',
                            cursor: 'grab'
                          }}
                        >
                          <GripVertical size={16} style={{ color: currentTheme.textSecondary, marginRight: '12px' }} />
                          <div style={{ marginRight: '12px', fontSize: '18px' }}>
                            {metricDesc?.icon || '📊'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: currentTheme.textPrimary,
                              fontSize: '14px',
                              fontWeight: '500'
                            }}>
                              {metric.displayName || metricDesc?.name || metric.type}
                              {metric.displayName && (
                                <span style={{
                                  color: currentTheme.textSecondary,
                                  fontSize: '12px',
                                  fontWeight: '400',
                                  marginLeft: '8px'
                                }}>
                                  (was: {metricDesc?.name || metric.type})
                                </span>
                              )}
                            </div>
                            <div style={{
                              color: currentTheme.textSecondary,
                              fontSize: '12px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px'
                            }}>
                              <span>Type: {metric.type}</span>
                              {metric.uid && <span>• UID: {metric.uid}</span>}
                              {metric.customRule && <span>• Custom Rule: Yes</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMetric(currentGroup.id, index, metric);
                              }}
                              style={{
                                padding: '4px',
                                backgroundColor: currentTheme.primary,
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMetric(metric.type);
                              }}
                              style={{
                                padding: '4px',
                                backgroundColor: currentTheme.danger,
                                border: 'none',
                                borderRadius: '4px',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Metric */}
              {currentGroup.metrics.length < 5 && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: currentTheme.background,
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.border}`
                }}>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '8px',
                      backgroundColor: currentTheme.cardBg,
                      color: currentTheme.textPrimary,
                      fontSize: '14px'
                    }}
                  >
                    <option value="" disabled>Select a metric to add</option>
                    {getAvailableMetrics().map(metric => (
                      <option key={metric.key} value={metric.key}>
                        {metric.icon} {metric.name} ({metric.key})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddMetric}
                    disabled={!selectedMetric}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedMetric ? currentTheme.primary : currentTheme.textSecondary,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: selectedMetric ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={16} />
                    Add Metric
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && groupToDeactivate && (
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
            maxWidth: '450px',
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
                backgroundColor: currentTheme.warning + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={24} style={{ color: currentTheme.warning }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Deactivate Metric Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  This will remove configured metrics
                </p>
              </div>
            </div>

            <div style={{
              marginBottom: '24px'
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 16px 0',
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                Are you sure you want to deactivate the <strong>
                  {metricGroups.find(g => g.id === groupToDeactivate)?.displayName}
                </strong> metric group?
              </p>
              
              <div style={{
                padding: '16px',
                backgroundColor: currentTheme.warning + '10',
                border: `1px solid ${currentTheme.warning}30`,
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} style={{ color: currentTheme.warning, marginTop: '2px' }} />
                  <div>
                    <div style={{
                      color: currentTheme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}>
                      This will:
                    </div>
                    <ul style={{
                      color: currentTheme.textSecondary,
                      fontSize: '13px',
                      margin: 0,
                      paddingLeft: '16px'
                    }}>
                      <li>Remove all {metricGroups.find(g => g.id === groupToDeactivate)?.metrics.length || 0} configured metrics</li>
                      <li>Hide this group from the dashboard</li>
                      <li>Stop tracking these metrics for this organization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p style={{
                color: currentTheme.textSecondary,
                margin: 0,
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                You can reactivate this group later, but you'll need to reconfigure the metrics.
              </p>
            </div>

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
                  backgroundColor: currentTheme.warning,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Deactivate Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metric Modal */}
      {showEditMetricModal && editingMetric && (
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
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Edit3 size={24} style={{ color: currentTheme.primary }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.textPrimary,
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Edit Metric Configuration
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Customize display name and business rules
                </p>
              </div>
            </div>

            {/* Current Metric Info */}
            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.background,
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '20px' }}>
                  {availableMetrics.find(m => m.key === editingMetric.metric.type)?.icon || '📊'}
                </div>
                <div>
                  <div style={{
                    color: currentTheme.textPrimary,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {availableMetrics.find(m => m.key === editingMetric.metric.type)?.name || editingMetric.metric.type}
                  </div>
                  <div style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    Type: {editingMetric.metric.type}
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Custom Display Name (UID)
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  placeholder="Enter custom name for this metric"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '14px'
                  }}
                />
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}>
                  Leave empty to use default name: "{availableMetrics.find(m => m.key === editingMetric.metric.type)?.name || editingMetric.metric.type}"
                </div>
              </div>

              <div>
                <label style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  Custom Rule Logic
                </label>
                <textarea
                  value={editForm.customRule}
                  onChange={(e) => setEditForm({ ...editForm, customRule: e.target.value })}
                  placeholder="Enter custom rule logic (optional)&#10;&#10;Example:&#10;MODULE [Metric: Sales]:&#10;    RULESET [Label]:&#10;        RULE [Default]: SWITCH(&#10;            UPPER(uid),&#10;            &quot;RPC_SALES&quot;, &quot;RPC Sales&quot;,&#10;            UPPER(uid)&#10;        )&#10;    END&#10;END"
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.cardBg,
                    color: currentTheme.textPrimary,
                    fontSize: '12px',
                    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                    resize: 'vertical',
                    minHeight: '120px'
                  }}
                />
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px',
                  marginTop: '8px',
                  lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Advanced filtering logic for this metric. When provided:
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '16px' }}>
                    <li>Creates custom label and short-label rules</li>
                    <li>Defines include/exclude criteria</li>
                    <li>Uses service categories and business rules</li>
                    <li>Auto-generates UID: <strong>{editForm.displayName ? generateUID(editForm.displayName) : 'DISPLAY_NAME'}</strong></li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelMetricEdit}
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
                onClick={handleSaveMetricEdit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Add Custom Group Modal */}
      {showAddGroupModal && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddGroupModal(false);
              resetModalState();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowAddGroupModal(false);
              resetModalState();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '85vh',
            overflowY: 'auto',
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
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={24} style={{ color: currentTheme.primary }} />
              </div>
              <div>
                <h3 
                  id="add-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Add Custom Metric Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Create a new group and assign users from their current groups
                </p>
              </div>
            </div>

            {/* Group Name Input */}
            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="add-group-name-input"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}
              >
                Group Name
              </label>
              <input
                id="add-group-name-input"
                type="text"
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                  // Clear error when user starts typing
                  if (formErrors.groupName) {
                    setFormErrors({ ...formErrors, groupName: undefined });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newGroupName.trim()) {
                    handleAddCustomGroup();
                  }
                }}
                placeholder="e.g., Management, Quality, Custom"
                aria-label="Group name"
                aria-required="true"
                aria-invalid={formErrors.groupName ? 'true' : 'false'}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${formErrors.groupName ? '#ef4444' : currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
              {formErrors.groupName && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {formErrors.groupName}
                </div>
              )}
            </div>

            {/* User Assignment Section */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '12px'
              }}>
                Assign Users to This Group
              </label>
              
              {/* Search and Filter */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    aria-label="Search users"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      fontSize: '13px'
                    }}
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '6px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '13px',
                    minWidth: '120px'
                  }}
                >
                  <option value="all">All Roles</option>
                  {getUniqueRoles().map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* User Assignment Table */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.background
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                  padding: '12px 16px',
                  backgroundColor: currentTheme.cardBg,
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentTheme.textSecondary,
                  textTransform: 'uppercase'
                }}>
                  <div>Select</div>
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Current Assignment</div>
                  <div>Action</div>
                </div>

                {/* Table Rows */}
                {getFilteredUsers().map((user, index) => {
                  const currentGroup = getUserCurrentGroup(user.id);
                  const isSelected = selectedUsers.includes(user.id);
                  const willTransfer = usersToTransfer.includes(user.id);
                  const isAvailable = !currentGroup;

                  return (
                    <div
                      key={user.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                        padding: '12px 16px',
                        borderBottom: index < getFilteredUsers().length - 1 ? `1px solid ${currentTheme.border}` : 'none',
                        fontSize: '13px',
                        color: currentTheme.textPrimary,
                        backgroundColor: isSelected ? (willTransfer ? currentTheme.danger + '15' : currentTheme.success + '15') : 'transparent',
                        transition: 'all 0.2s ease',
                        alignItems: 'center'
                      }}
                    >
                      {/* Select Checkbox */}
                      <div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          style={{
                            accentColor: willTransfer ? currentTheme.danger : currentTheme.primary,
                            width: '16px',
                            height: '16px'
                          }}
                        />
                      </div>

                      {/* User Info */}
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '11px', color: currentTheme.textSecondary }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: currentTheme.secondary + '20',
                          color: currentTheme.secondary,
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          {user.role}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: user.status === 'Active' ? '#10b981' : currentTheme.border,
                          color: user.status === 'Active' ? 'white' : currentTheme.textSecondary
                        }}>
                          {user.status}
                        </span>
                      </div>

                      {/* Current Assignment */}
                      <div>
                        {currentGroup ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: currentGroup.isDefault ? currentTheme.primary + '20' : currentTheme.warning + '20',
                              color: currentGroup.isDefault ? currentTheme.primary : currentTheme.warning,
                              fontSize: '9px',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {currentGroup.displayName}
                            </span>
                            <span style={{
                              fontSize: '8px',
                              color: currentTheme.textSecondary,
                              textAlign: 'center'
                            }}>
                              {currentGroup.isDefault ? 'Default' : 'Custom'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ 
                            color: currentTheme.textSecondary, 
                            fontSize: '11px',
                            fontStyle: 'italic'
                          }}>
                            Unassigned
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div>
                        {isSelected && willTransfer ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.danger,
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <span style={{ fontSize: '8px' }}>⚠️</span>
                            Will Move
                          </span>
                        ) : isSelected && isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '500'
                          }}>
                            Will Add
                          </span>
                        ) : isSelected ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.primary,
                            fontWeight: '500'
                          }}>
                            Selected
                          </span>
                        ) : currentGroup && !isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.textSecondary,
                            cursor: 'help'
                          }}>
                            Can Move
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '400'
                          }}>
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {getFilteredUsers().length === 0 && (
                  <div style={{
                    padding: '40px 24px',
                    textAlign: 'center',
                    color: currentTheme.textSecondary,
                    fontSize: '14px'
                  }}>
                    No users found matching the current filters
                  </div>
                )}
              </div>
              
              {/* Selection Summary */}
              {selectedUsers.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: currentTheme.primary + '10',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: currentTheme.primary,
                  fontWeight: '500'
                }}>
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected for this group
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowAddGroupModal(false);
                  resetModalState();
                }}
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
                onClick={handleAddCustomGroup}
                disabled={!newGroupName.trim() || isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newGroupName.trim() && !isLoading) {
                    handleAddCustomGroup();
                  }
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: (newGroupName.trim() && !isLoading) ? currentTheme.primary : currentTheme.border,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: (newGroupName.trim() && !isLoading) ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: (newGroupName.trim() && !isLoading) ? 1 : 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creating...
                  </>
                ) : (
                  'Create Group'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Custom Group Modal */}
      {showEditGroupModal && editingGroup && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditGroupModal(false);
              resetModalState();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowEditGroupModal(false);
              resetModalState();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '85vh',
            overflowY: 'auto',
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
                backgroundColor: currentTheme.secondary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Edit3 size={24} style={{ color: currentTheme.secondary }} />
              </div>
              <div>
                <h3 
                  id="edit-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Edit Metric Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Modify group settings and user assignments
                </p>
              </div>
            </div>

            {/* Group Name Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '8px'
              }}>
                Group Name
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g., Management, Quality, Custom"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px',
                  backgroundColor: currentTheme.cardBg,
                  color: currentTheme.textPrimary,
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Current Metrics Info */}
            {editingGroup.metrics.length > 0 && (
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: currentTheme.background,
                borderRadius: '8px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: currentTheme.textPrimary,
                  marginBottom: '8px'
                }}>
                  Current Metrics ({editingGroup.metrics.length}/5)
                </div>
                <div style={{
                  fontSize: '12px',
                  color: currentTheme.textSecondary
                }}>
                  {editingGroup.metrics.map(metric => {
                    const metricInfo = availableMetrics.find(m => m.key === metric.type);
                    return metricInfo ? metricInfo.name : metric.type;
                  }).join(', ')}
                </div>
              </div>
            )}

            {/* User Assignment Section - Same as Add Modal */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: currentTheme.textPrimary,
                marginBottom: '12px'
              }}>
                Assign Users to This Group
              </label>
              
              {/* Search and Filter */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    aria-label="Search users"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      backgroundColor: currentTheme.background,
                      color: currentTheme.textPrimary,
                      fontSize: '13px'
                    }}
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                  style={{
                    padding: '8px 12px',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '6px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '13px',
                    minWidth: '120px'
                  }}
                >
                  <option value="all">All Roles</option>
                  {getUniqueRoles().map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* User Assignment Table */}
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.background
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                  padding: '12px 16px',
                  backgroundColor: currentTheme.cardBg,
                  borderBottom: `1px solid ${currentTheme.border}`,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentTheme.textSecondary,
                  textTransform: 'uppercase'
                }}>
                  <div>Select</div>
                  <div>User</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Current Assignment</div>
                  <div>Action</div>
                </div>

                {/* Table Rows */}
                {getFilteredUsers().map((user, index) => {
                  const currentGroup = getUserCurrentGroup(user.id);
                  const isSelected = selectedUsers.includes(user.id);
                  const willTransfer = usersToTransfer.includes(user.id);
                  const isAvailable = !currentGroup;

                  return (
                    <div
                      key={user.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 2fr 100px 80px 160px 120px',
                        padding: '12px 16px',
                        borderBottom: index < getFilteredUsers().length - 1 ? `1px solid ${currentTheme.border}` : 'none',
                        fontSize: '13px',
                        color: currentTheme.textPrimary,
                        backgroundColor: isSelected ? (willTransfer ? currentTheme.danger + '15' : currentTheme.success + '15') : 'transparent',
                        transition: 'all 0.2s ease',
                        alignItems: 'center'
                      }}
                    >
                      {/* Select Checkbox */}
                      <div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                          style={{
                            accentColor: willTransfer ? currentTheme.danger : currentTheme.primary,
                            width: '16px',
                            height: '16px'
                          }}
                        />
                      </div>

                      {/* User Info */}
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '11px', color: currentTheme.textSecondary }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Role */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: currentTheme.secondary + '20',
                          color: currentTheme.secondary,
                          fontSize: '10px',
                          fontWeight: '500'
                        }}>
                          {user.role}
                        </span>
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '500',
                          backgroundColor: user.status === 'Active' ? '#10b981' : currentTheme.border,
                          color: user.status === 'Active' ? 'white' : currentTheme.textSecondary
                        }}>
                          {user.status}
                        </span>
                      </div>

                      {/* Current Assignment */}
                      <div>
                        {currentGroup ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: currentGroup.isDefault ? currentTheme.primary + '20' : currentTheme.warning + '20',
                              color: currentGroup.isDefault ? currentTheme.primary : currentTheme.warning,
                              fontSize: '9px',
                              fontWeight: '500',
                              textAlign: 'center'
                            }}>
                              {currentGroup.displayName}
                            </span>
                            <span style={{
                              fontSize: '8px',
                              color: currentTheme.textSecondary,
                              textAlign: 'center'
                            }}>
                              {currentGroup.isDefault ? 'Default' : 'Custom'}
                            </span>
                          </div>
                        ) : (
                          <span style={{ 
                            color: currentTheme.textSecondary, 
                            fontSize: '11px',
                            fontStyle: 'italic'
                          }}>
                            Unassigned
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div>
                        {isSelected && willTransfer ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.danger,
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <span style={{ fontSize: '8px' }}>⚠️</span>
                            Will Move
                          </span>
                        ) : isSelected && isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '500'
                          }}>
                            Will Add
                          </span>
                        ) : isSelected ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.primary,
                            fontWeight: '500'
                          }}>
                            Selected
                          </span>
                        ) : currentGroup && !isAvailable ? (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.textSecondary,
                            cursor: 'help'
                          }}>
                            Can Move
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '10px',
                            color: currentTheme.success,
                            fontWeight: '400'
                          }}>
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {getFilteredUsers().length === 0 && (
                  <div style={{
                    padding: '40px 24px',
                    textAlign: 'center',
                    color: currentTheme.textSecondary,
                    fontSize: '14px'
                  }}>
                    No users found matching the current filters
                  </div>
                )}
              </div>
              
              {/* Selection Summary */}
              {selectedUsers.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: currentTheme.primary + '10',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: currentTheme.primary,
                  fontWeight: '500'
                }}>
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected for this group
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowEditGroupModal(false);
                  resetModalState();
                }}
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
                onClick={handleSaveGroupEdit}
                disabled={!newGroupName.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: newGroupName.trim() ? currentTheme.secondary : currentTheme.border,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: newGroupName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: newGroupName.trim() ? 1 : 0.6
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Custom Group Confirmation Modal */}
      {showDeleteModal && groupToDelete && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancelDelete();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleCancelDelete();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '500px',
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
                <Trash2 size={24} style={{ color: currentTheme.danger }} />
              </div>
              <div>
                <h3 
                  id="delete-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  Delete Custom Group
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.danger + '10',
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.danger}20`
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Are you sure you want to delete "{metricGroups.find(g => g.id === groupToDelete)?.displayName}"?
              </p>
              <p style={{
                color: currentTheme.textSecondary,
                margin: 0,
                fontSize: '13px'
              }}>
                This will permanently remove the group and all its configured metrics. 
                Users will no longer have access to metrics from this group.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelDelete}
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
                onClick={handleConfirmDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.danger,
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
                <Trash2 size={16} />
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Default Group Users Modal */}
      {showDefaultGroupModal && viewingDefaultGroup && (
        <div 
          style={{
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
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDefaultGroupModal(false);
              setViewingDefaultGroup(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowDefaultGroupModal(false);
              setViewingDefaultGroup(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="default-group-title"
        >
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '32px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
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
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users2 size={24} style={{ color: currentTheme.primary }} />
              </div>
              <div>
                <h3 
                  id="default-group-title"
                  style={{
                    color: currentTheme.textPrimary,
                    margin: '0 0 4px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                >
                  {viewingDefaultGroup.displayName} Group Users
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px'
                }}>
                  Users automatically assigned based on their roles
                </p>
              </div>
            </div>

            {/* Group Description */}
            <div style={{
              padding: '16px',
              backgroundColor: currentTheme.primary + '10',
              borderRadius: '8px',
              marginBottom: '24px',
              border: `1px solid ${currentTheme.primary}20`
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Default Group Assignment Rules:
              </p>
              <p style={{
                color: currentTheme.textSecondary,
                margin: 0,
                fontSize: '13px'
              }}>
                {viewingDefaultGroup.id === 'tech' && 'Users with Tech or Technician roles are automatically assigned to this group.'}
                {viewingDefaultGroup.id === 'csr' && 'Users with CSR or Customer Service roles are automatically assigned to this group.'}
                {viewingDefaultGroup.id === 'sales' && 'Users with Sales or Sales Rep roles are automatically assigned to this group.'}
                {viewingDefaultGroup.id === 'branch' && 'Users with Branch Manager, Manager, Admin, or Owner roles are automatically assigned to this group.'}
              </p>
            </div>

            {/* Users Table */}
            <div style={{
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.background,
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 80px 120px',
                padding: '12px 16px',
                backgroundColor: currentTheme.cardBg,
                borderBottom: `1px solid ${currentTheme.border}`,
                fontSize: '12px',
                fontWeight: '600',
                color: currentTheme.textSecondary,
                textTransform: 'uppercase'
              }}>
                <div>User</div>
                <div>Role</div>
                <div>Status</div>
                <div>Assignment</div>
              </div>

              {/* Table Rows */}
              {getDefaultGroupUsers(viewingDefaultGroup.id).map((user, index) => (
                <div
                  key={user.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 80px 120px',
                    padding: '12px 16px',
                    borderBottom: index < getDefaultGroupUsers(viewingDefaultGroup.id).length - 1 ? `1px solid ${currentTheme.border}` : 'none',
                    fontSize: '13px',
                    color: currentTheme.textPrimary,
                    alignItems: 'center'
                  }}
                >
                  {/* User Info */}
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '11px', color: currentTheme.textSecondary }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: currentTheme.secondary + '20',
                      color: currentTheme.secondary,
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      {user.role}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '500',
                      backgroundColor: user.status === 'Active' ? '#10b981' : currentTheme.border,
                      color: user.status === 'Active' ? 'white' : currentTheme.textSecondary
                    }}>
                      {user.status}
                    </span>
                  </div>

                  {/* Assignment */}
                  <div>
                    <span style={{
                      fontSize: '10px',
                      color: currentTheme.success,
                      fontWeight: '500'
                    }}>
                      Auto-assigned
                    </span>
                  </div>
                </div>
              ))}

              {getDefaultGroupUsers(viewingDefaultGroup.id).length === 0 && (
                <div style={{
                  padding: '40px 24px',
                  textAlign: 'center',
                  color: currentTheme.textSecondary,
                  fontSize: '14px'
                }}>
                  <Users2 size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <div>No users found for this group</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Users with matching roles will appear here automatically
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            {getDefaultGroupUsers(viewingDefaultGroup.id).length > 0 && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: currentTheme.success + '10',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.success}30`
              }}>
                <div style={{
                  fontSize: '12px',
                  color: currentTheme.success,
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Total Users: {getDefaultGroupUsers(viewingDefaultGroup.id).length}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: currentTheme.textSecondary
                }}>
                  These users have access to {viewingDefaultGroup.displayName} group metrics and will see them in their dashboard.
                </div>
              </div>
            )}

            {/* Close Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              <button
                onClick={() => {
                  setShowDefaultGroupModal(false);
                  setViewingDefaultGroup(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Integration interfaces

export default MetricsTab;
