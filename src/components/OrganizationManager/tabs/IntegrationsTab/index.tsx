import React, { useState } from 'react';
import { Globe, AlertCircle, Trash2, Settings, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../../../theme/ThemeContext';
import type { Organization, Integration } from '../../types';
import IntegrationModal from './IntegrationModal';
import { allIntegrations, categories } from './constants';
import { getIntegrationConfig } from './configDefinitions';

const IntegrationsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization, onUpdate }) => {
  const { currentTheme } = useTheme();

  // Category color mapping
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      'CRM': '#3B82F6',           // Blue
      'Communication': '#10B981', // Green  
      'Reviews': '#F59E0B',       // Amber
      'Accounting': '#8B5CF6',    // Purple
      'Marketing': '#EF4444',     // Red
      'Other': '#6B7280'          // Gray
    };
    return categoryColors[category] || categoryColors['Other'];
  };
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<{uid: string, name: string} | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedServiceForConfig, setSelectedServiceForConfig] = useState<any>(null);
  const [showCrmDeleteModal, setShowCrmDeleteModal] = useState(false);
  const [crmIntegrationToDelete, setCrmIntegrationToDelete] = useState<{uid: string, name: string} | null>(null);
  const [crmDeleteConfirmed, setCrmDeleteConfirmed] = useState(false);
  const [crmDeleteText, setCrmDeleteText] = useState('');

  const hasCrmIntegration = organization.services?.some(service => 
    allIntegrations.find(integration => integration.id === service.type)?.crmSystem
  ) || false;

  const connectedCrmIntegration = organization.services?.find(service => 
    allIntegrations.find(integration => integration.id === service.type)?.crmSystem
  );

  // Get the CRM type that's already connected (if any)
  const connectedCrmType = connectedCrmIntegration?.type;

  const connectedIntegrations = organization.services?.map(service => service.type) || [];

  const filteredIntegrations = allIntegrations.filter(integration => {
    const categoryMatch = selectedCategory === 'All' || integration.category === selectedCategory;
    
    // Business Rule 1: CRM must be added first (unless this IS a CRM)
    const crmFirstRule = integration.crmSystem || hasCrmIntegration;
    
    // Business Rule 2: Only allow the SAME CRM type if a CRM already exists
    const sameCrmTypeRule = !integration.crmSystem || !hasCrmIntegration || integration.id === connectedCrmType;
    
    return categoryMatch && crmFirstRule && sameCrmTypeRule;
  });

  const handleConnectIntegration = (integration: Integration) => {
    // Business Rule Validation
    if (!integration.crmSystem && !hasCrmIntegration) {
      alert('⚠️ CRM Required First\n\nYou must connect a CRM system (PestPac, FieldRoutes, FieldWork, or BrioStack) before adding other integrations.');
      return;
    }

    if (integration.crmSystem && hasCrmIntegration && integration.id !== connectedCrmType) {
      const currentCrmName = allIntegrations.find(i => i.id === connectedCrmType)?.name || 'Unknown CRM';
      alert(`⚠️ Different CRM Type Not Allowed\n\nYou already have ${currentCrmName} connected. You can only use one CRM type at a time.\n\nYou can add multiple ${currentCrmName} instances, but to switch to ${integration.name}, please remove all ${currentCrmName} instances first.`);
      return;
    }

    // Create a new service entry for this integration
    const newService = {
      uid: `${integration.id.toLowerCase()}-${Date.now()}`,
      type: integration.id,
      name: integration.name,
      status: 'needs_setup' as const,
      last_sync: new Date().toISOString(),
      config: {},
      configured: false,
      config_status: 'incomplete' as const
    };

    // Add the integration to the organization's services
    const updatedOrganization = {
      ...organization,
      services: [...(organization.services || []), newService],
      integration_count: (organization.integration_count || 0) + 1
    };

    // Update the organization
    onUpdate(updatedOrganization);

    console.log('Integration connected:', integration.name);
  };

  const handleRemoveIntegration = (serviceUid: string) => {
    // Find the integration details for the confirmation modal
    const service = organization.services?.find(s => s.uid === serviceUid);
    const integration = allIntegrations.find(i => i.id === service?.type);
    
    const integrationName = integration?.name || service?.name || 'Unknown Integration';
    
    // Check if this is a CRM integration
    if (integration?.crmSystem) {
      setCrmIntegrationToDelete({
        uid: serviceUid,
        name: integrationName
      });
      setShowCrmDeleteModal(true);
    } else {
      setIntegrationToDelete({
        uid: serviceUid,
        name: integrationName
      });
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!integrationToDelete) {
return;
}

    // Remove the integration from the organization's services
    const updatedOrganization = {
      ...organization,
      services: organization.services?.filter(service => service.uid !== integrationToDelete.uid) || [],
      integration_count: (organization.integration_count || 1) - 1
    };

    // Update the organization
    onUpdate(updatedOrganization);

    // Close the modal and reset state
    setShowDeleteModal(false);
    setIntegrationToDelete(null);

    console.log('Integration removed:', integrationToDelete.name);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setIntegrationToDelete(null);
  };

  const handleConfirmCrmDelete = () => {
    if (!crmIntegrationToDelete) {
return;
}

    // Remove the CRM integration from the organization's services
    const updatedOrganization = {
      ...organization,
      services: organization.services?.filter(service => service.uid !== crmIntegrationToDelete.uid) || [],
      integration_count: (organization.integration_count || 1) - 1
    };

    // Update the organization
    onUpdate(updatedOrganization);

    // Close the modal and reset state
    setShowCrmDeleteModal(false);
    setCrmIntegrationToDelete(null);
    setCrmDeleteConfirmed(false);
    setCrmDeleteText('');

    console.log('CRM Integration removed:', crmIntegrationToDelete.name);
  };

  const handleCancelCrmDelete = () => {
    setShowCrmDeleteModal(false);
    setCrmIntegrationToDelete(null);
    setCrmDeleteConfirmed(false);
    setCrmDeleteText('');
  };

  const handleConfigureIntegration = (service: any) => {
    setSelectedServiceForConfig(service);
    setShowConfigModal(true);
  };

  const handleSaveConfig = (config: Record<string, any>) => {
    if (!selectedServiceForConfig) {
return;
}

    // Update the service with new configuration
    const updatedServices = organization.services?.map(service => {
      if (service.uid === selectedServiceForConfig.uid) {
        return {
          ...service,
          config,
          configured: true,
          config_status: 'complete' as const,
          status: 'active' as const
        };
      }
      return service;
    }) || [];

    const updatedOrganization = {
      ...organization,
      services: updatedServices
    };

    onUpdate(updatedOrganization);
    setShowConfigModal(false);
    setSelectedServiceForConfig(null);
  };

  const getStatusColor = (service: any) => {
    if (service.status === 'needs_setup') {
return currentTheme.warning;
}
    if (service.status === 'active' && service.configured) {
return currentTheme.success;
}
    if (service.status === 'error') {
return currentTheme.danger;
}
    return currentTheme.textSecondary;
  };

  const getStatusText = (service: any) => {
    if (service.status === 'needs_setup') {
return 'Needs Setup';
}
    if (service.status === 'active' && service.configured) {
return 'Active';
}
    if (service.status === 'error') {
return 'Error';
}
    return 'Inactive';
  };

  const getStatusIcon = (service: any) => {
    if (service.status === 'needs_setup') {
return <Clock size={16} />;
}
    if (service.status === 'active' && service.configured) {
return <CheckCircle size={16} />;
}
    if (service.status === 'error') {
return <AlertCircle size={16} />;
}
    return <AlertCircle size={16} />;
  };

  return (
    <div>
      {/* CRM Warning Banner */}
      {!hasCrmIntegration && (
        <div style={{
          backgroundColor: currentTheme.warning + '20',
          border: `1px solid ${currentTheme.warning}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <AlertCircle size={24} color={currentTheme.warning} />
          <div>
            <div style={{
              color: currentTheme.warning,
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              CRM Integration Required
            </div>
            <div style={{
              color: currentTheme.textSecondary,
              fontSize: '14px'
            }}>
              To ensure proper data synchronization, you must first connect a CRM system (PestPac, FieldRoutes, FieldWork, or BrioStack) before adding other integrations.
            </div>
          </div>
        </div>
      )}

      {/* Active Integrations */}
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
                Active Integrations
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                {organization.services?.length || 0} integrations connected
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {organization.services && organization.services.length > 0 ? (
            organization.services
              .sort((a, b) => {
                const integrationA = allIntegrations.find(i => i.id === a.type);
                const integrationB = allIntegrations.find(i => i.id === b.type);
                
                // First sort by category (CRM first, then alphabetically)
                const categoryA = integrationA?.category || 'Other';
                const categoryB = integrationB?.category || 'Other';
                
                if (categoryA !== categoryB) {
                  // CRM category goes first
                  if (categoryA === 'CRM') {
return -1;
}
                  if (categoryB === 'CRM') {
return 1;
}
                  // Then alphabetical by category
                  return categoryA.localeCompare(categoryB);
                }
                
                // Within same category, sort by integration name
                const nameA = integrationA?.name || a.name || a.type;
                const nameB = integrationB?.name || b.name || b.type;
                return nameA.localeCompare(nameB);
              })
              .map((service) => {
              const integration = allIntegrations.find(i => i.id === service.type);
              return (
                <div key={service.uid} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: `1px solid ${currentTheme.border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: currentTheme.primary + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {integration?.icon || '🔧'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          color: currentTheme.textPrimary,
                          fontSize: '16px',
                          fontWeight: '500'
                        }}>
                          {integration?.name || service.name || service.type}
                        </span>
                        
                        {/* Category Tag */}
                        <span style={{
                          padding: '2px 6px',
                          backgroundColor: getCategoryColor(integration?.category || 'Other'),
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {integration?.category || 'Other'}
                        </span>

                        {/* Free Account Tag (only for FieldRoutes with free account) */}
                        {service.type === 'FIELDROUTES' && service.config?.free && (
                          <span style={{
                            padding: '2px 6px',
                            backgroundColor: currentTheme.warning + '20',
                            color: currentTheme.warning,
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            Free
                          </span>
                        )}
                      </div>
                      
                      <div style={{
                        color: currentTheme.textSecondary,
                        fontSize: '14px'
                      }}>
                        {/* Show Office ID for FieldRoutes if available */}
                        {service.type === 'FIELDROUTES' && service.config?.officeID && (
                          <span>Office: {service.config.officeID} • </span>
                        )}
                        Last sync: {new Date(service.last_sync || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: getStatusColor(service) }}>
                        {getStatusIcon(service)}
                      </div>
                      <span style={{
                        color: getStatusColor(service),
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {getStatusText(service)}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleConfigureIntegration(service)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: service.status === 'needs_setup' ? currentTheme.warning : 'transparent',
                        border: `1px solid ${service.status === 'needs_setup' ? currentTheme.warning : currentTheme.border}`,
                        borderRadius: '6px',
                        color: service.status === 'needs_setup' ? 'white' : currentTheme.textPrimary,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Settings size={12} />
                      {service.status === 'needs_setup' ? 'Set Up' : 'Configure'}
                    </button>
                    <button 
                      onClick={() => handleRemoveIntegration(service.uid)}
                      style={{
                        padding: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: currentTheme.danger,
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              padding: '40px 24px',
              textAlign: 'center',
              color: currentTheme.textSecondary
            }}>
              <Globe size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '16px' }}>
                No integrations connected yet
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                Start by connecting a CRM system to sync your data
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Integrations */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{
                color: currentTheme.textPrimary,
                margin: 0,
                fontSize: '18px',
                fontWeight: '600'
              }}>
                Available Integrations
              </h3>
              <p style={{
                color: currentTheme.textSecondary,
                margin: '4px 0 0 0',
                fontSize: '14px'
              }}>
                {filteredIntegrations.length} integrations available • Connect services to enhance your data sync
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedCategory === category ? currentTheme.primary : 'transparent',
                  border: `1px solid ${selectedCategory === category ? currentTheme.primary : currentTheme.border}`,
                  borderRadius: '20px',
                  color: selectedCategory === category ? 'white' : currentTheme.textPrimary,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Group integrations by category */}
          {categories
            .filter(category => category === 'All' ? false : filteredIntegrations.some(int => int.category === category))
            .map(category => {
              const categoryIntegrations = filteredIntegrations.filter(int => int.category === category);
              if (categoryIntegrations.length === 0) {
return null;
}
              
              return (
                <div key={category} style={{ marginBottom: '32px' }}>
                  {/* Category Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${currentTheme.border}`
                  }}>
                    <h4 style={{
                      color: currentTheme.textPrimary,
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      {category}
                    </h4>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: currentTheme.textSecondary + '20',
                      color: currentTheme.textSecondary,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {categoryIntegrations.length}
                    </span>
                  </div>
                  
                  {/* Category Integrations Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px'
                  }}>
                    {categoryIntegrations.map((integration) => (
            <div
              key={integration.id}
              onClick={() => {
                setSelectedIntegration(integration);
                setShowModal(true);
              }}
              style={{
                backgroundColor: currentTheme.background,
                borderRadius: '12px',
                border: `1px solid ${currentTheme.border}`,
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                opacity: (() => {
                  // Show full opacity if this integration can be added
                  if (integration.crmSystem && !hasCrmIntegration) {
return 1;
} // First CRM
                  if (integration.crmSystem && hasCrmIntegration && integration.id === connectedCrmType) {
return 1;
} // Same CRM type
                  if (!integration.crmSystem && hasCrmIntegration) {
return 1;
} // Non-CRM and CRM exists
                  return 0.6; // Disabled state
                })(),
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {integration.crmSystem && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '2px 8px',
                  backgroundColor: currentTheme.primary,
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  CRM
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: currentTheme.primary + '20',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {integration.icon}
                </div>
                <div>
                  <h4 style={{
                    color: currentTheme.textPrimary,
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    {integration.name}
                  </h4>
                  <span style={{
                    color: currentTheme.textSecondary,
                    fontSize: '12px'
                  }}>
                    {integration.category}
                  </span>
                </div>
              </div>

              <p style={{
                color: currentTheme.textSecondary,
                fontSize: '13px',
                lineHeight: '1.4',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {integration.description}
              </p>

              {/* Warning indicators for disabled integrations */}
              {!integration.crmSystem && !hasCrmIntegration && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  color: currentTheme.warning,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} title="CRM Required: Connect a CRM system first">
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '10px', fontWeight: '500' }}>CRM Required</span>
                </div>
              )}
              {integration.crmSystem && hasCrmIntegration && integration.id !== connectedCrmType && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  color: currentTheme.danger,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }} title={`Different CRM type not allowed. You already have ${allIntegrations.find(i => i.id === connectedCrmType)?.name} connected.`}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '10px', fontWeight: '500' }}>Different CRM</span>
                </div>
              )}
            </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {filteredIntegrations.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: currentTheme.textSecondary
          }}>
            <Globe size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ margin: 0, fontSize: '16px' }}>
              No integrations available in this category
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
              Try selecting a different category or check back later
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && integrationToDelete && (
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
                  Remove Integration
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

            <p style={{
              color: currentTheme.textPrimary,
              margin: '0 0 24px 0',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to remove <strong>{integrationToDelete.name}</strong>? 
              This will disconnect the integration and stop all data synchronization.
            </p>

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
                  fontWeight: '500'
                }}
              >
                Remove Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced CRM Delete Confirmation Modal */}
      {showCrmDeleteModal && crmIntegrationToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `2px solid ${currentTheme.danger}`,
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: currentTheme.danger + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={32} style={{ color: currentTheme.danger }} />
              </div>
              <div>
                <h3 style={{
                  color: currentTheme.danger,
                  margin: '0 0 4px 0',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  ⚠️ CRITICAL WARNING
                </h3>
                <p style={{
                  color: currentTheme.textSecondary,
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  You are about to remove a CRM system
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: currentTheme.danger + '10',
              border: `1px solid ${currentTheme.danger}40`,
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <p style={{
                color: currentTheme.textPrimary,
                margin: '0 0 16px 0',
                fontSize: '16px',
                lineHeight: '1.5',
                fontWeight: '500'
              }}>
                Removing <strong>{crmIntegrationToDelete.name}</strong> will cause serious problems:
              </p>
              <ul style={{
                color: currentTheme.textPrimary,
                margin: '0 0 16px 0',
                paddingLeft: '20px',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <li><strong>Break all metrics and dashboards</strong> - Your performance data will be corrupted</li>
                <li><strong>Stop data synchronization</strong> - Customer and service data will no longer sync</li>
                <li><strong>Disrupt other integrations</strong> - Connected services rely on CRM data</li>
                <li><strong>Cause data inconsistencies</strong> - Historical reports may become unreliable</li>
              </ul>
              <div style={{
                backgroundColor: currentTheme.primary + '20',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '6px',
                padding: '12px',
                color: currentTheme.textPrimary,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                💡 <strong>Need to change CRM settings?</strong> Contact our support team instead:<br/>
                <a 
                  href="mailto:Support@bemoredriven.com" 
                  style={{ color: currentTheme.primary, textDecoration: 'none' }}
                >
                  Support@bemoredriven.com
                </a>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}>
                <input
                  type="checkbox"
                  checked={crmDeleteConfirmed}
                  onChange={(e) => setCrmDeleteConfirmed(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: currentTheme.danger
                  }}
                />
                <span style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  I understand this will break metrics and cause data problems
                </span>
              </label>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px'
                }}>
                  Type "DELETE" to confirm (all caps):
                </label>
                <input
                  type="text"
                  value={crmDeleteText}
                  onChange={(e) => setCrmDeleteText(e.target.value)}
                  placeholder="Type DELETE here..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `2px solid ${crmDeleteText === 'DELETE' ? currentTheme.success : currentTheme.border}`,
                    borderRadius: '8px',
                    backgroundColor: currentTheme.background,
                    color: currentTheme.textPrimary,
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleCancelCrmDelete}
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentTheme.primary,
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Cancel (Recommended)
              </button>
              <button
                onClick={handleConfirmCrmDelete}
                disabled={!crmDeleteConfirmed || crmDeleteText !== 'DELETE'}
                style={{
                  padding: '12px 24px',
                  backgroundColor: crmDeleteConfirmed && crmDeleteText === 'DELETE' ? currentTheme.danger : currentTheme.border,
                  border: 'none',
                  borderRadius: '8px',
                  color: crmDeleteConfirmed && crmDeleteText === 'DELETE' ? 'white' : currentTheme.textSecondary,
                  cursor: crmDeleteConfirmed && crmDeleteText === 'DELETE' ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: crmDeleteConfirmed && crmDeleteText === 'DELETE' ? 1 : 0.6
                }}
              >
                Delete CRM System
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedServiceForConfig && (
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
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <ConfigurationForm
              service={selectedServiceForConfig}
              onSave={handleSaveConfig}
              onCancel={() => setShowConfigModal(false)}
              currentTheme={currentTheme}
            />
          </div>
        </div>
      )}

      {/* Integration Modal */}
      <IntegrationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedIntegration(null);
        }}
        integration={selectedIntegration}
        onConnect={handleConnectIntegration}
        hasCrmIntegration={hasCrmIntegration}
      />
    </div>
  );
};

// Configuration Form Component
const ConfigurationForm: React.FC<{
  service: any;
  onSave: (config: Record<string, any>) => void;
  onCancel: () => void;
  currentTheme: any;
}> = ({ service, onSave, onCancel, currentTheme }) => {
  const integrationConfig = getIntegrationConfig(service.type);
  const [formData, setFormData] = useState<Record<string, any>>(service.config || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>({});

  const validateField = (field: any, value: string) => {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `Invalid ${field.label.toLowerCase()}`;
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email address';
      }
    }

    if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return 'Invalid URL format';
      }
    }

    return '';
  };

  const handleFieldChange = (fieldKey: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
    
    // Clear error for this field
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: '' }));
    }
  };

  const toggleFieldVisibility = (fieldKey: string) => {
    setFieldVisibility(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      // Import the testing function
      const { testIntegrationConnection } = await import('../../../../api/integrationTesting');
      
      // Test the connection with current form data
      const result = await testIntegrationConnection(service.type, formData);
      
      setIsTestingConnection(false);
      
      // Use a more detailed and user-friendly display
      const title = result.success ? 'Connection Successful!' : 'Connection Failed';
      const icon = result.success ? '✅' : '❌';
      const message = `${icon} ${result.message}`;
      
      // For now, still use alert but with better formatting
      // TODO: Replace with a proper modal component
      alert(message);
      
      // Log details for debugging
      if (result.details) {
        console.log('Connection test details:', result.details);
      }
      
    } catch (error: any) {
      setIsTestingConnection(false);
      console.error('Connection test error:', error);
      alert(`❌ Connection test failed: ${error.message}`);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    integrationConfig.fields.forEach(field => {
      const error = validateField(field, formData[field.key] || '');
      if (error) {
        newErrors[field.key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const renderField = (field: any) => {
    const value = formData[field.key] || '';
    const hasError = !!errors[field.key];
    const isSensitiveField = field.type === 'password' || 
                           field.key.toLowerCase().includes('password') || 
                           field.key.toLowerCase().includes('api_key') || 
                           field.key.toLowerCase().includes('secret') || 
                           field.key.toLowerCase().includes('token');
    const isVisible = fieldVisibility[field.key] || false;
    const inputType = isSensitiveField && !isVisible ? 'password' : (field.type === 'password' ? 'text' : field.type);

    return (
      <div key={field.key} style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          color: currentTheme.textPrimary,
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '6px'
        }}>
          {field.label}
          {field.required && <span style={{ color: currentTheme.danger, marginLeft: '4px' }}>*</span>}
        </label>
        
        {field.description && (
          <p style={{
            color: currentTheme.textSecondary,
            fontSize: '12px',
            margin: '0 0 8px 0',
            lineHeight: '1.4'
          }}>
            {field.description}
          </p>
        )}

        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${hasError ? currentTheme.danger : currentTheme.border}`,
              borderRadius: '8px',
              backgroundColor: currentTheme.background,
              color: currentTheme.textPrimary,
              fontSize: '14px'
            }}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'toggle' ? (
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            gap: '8px'
          }}>
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: currentTheme.primary
              }}
            />
            <span style={{
              color: currentTheme.textPrimary,
              fontSize: '14px',
              userSelect: 'none'
            }}>
              Enable {field.label}
            </span>
          </label>
        ) : (
          <div style={{ position: 'relative' }}>
            <input
              type={inputType}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              style={{
                width: '100%',
                padding: isSensitiveField ? '10px 40px 10px 12px' : '10px 12px',
                border: `1px solid ${hasError ? currentTheme.danger : currentTheme.border}`,
                borderRadius: '8px',
                backgroundColor: currentTheme.background,
                color: currentTheme.textPrimary,
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {isSensitiveField && (
              <button
                type="button"
                onClick={() => toggleFieldVisibility(field.key)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: currentTheme.textSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0'
                }}
                aria-label={isVisible ? 'Hide password' : 'Show password'}
              >
                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        )}

        {hasError && (
          <p style={{
            color: currentTheme.danger,
            fontSize: '12px',
            margin: '4px 0 0 0'
          }}>
            {errors[field.key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: currentTheme.primary + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Settings size={24} style={{ color: currentTheme.primary }} />
        </div>
        <div>
          <h3 style={{
            color: currentTheme.textPrimary,
            margin: '0 0 4px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Configure {integrationConfig.name}
          </h3>
          <p style={{
            color: currentTheme.textSecondary,
            margin: 0,
            fontSize: '14px'
          }}>
            {integrationConfig.description}
          </p>
        </div>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '24px' }}>
        {integrationConfig.fields.map(renderField)}
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between',
        paddingTop: '20px',
        borderTop: `1px solid ${currentTheme.border}`
      }}>
        <div>
          {integrationConfig.testConnection && (
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: `1px solid ${currentTheme.primary}`,
                borderRadius: '8px',
                color: currentTheme.primary,
                cursor: isTestingConnection ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: isTestingConnection ? 0.6 : 1
              }}
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
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
            onClick={handleSubmit}
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
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsTab;
