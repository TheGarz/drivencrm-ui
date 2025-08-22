import React, { useState } from 'react';
import { Globe, AlertCircle, Trash2 } from 'lucide-react';
import { useTheme } from '../../../../theme/ThemeContext';
import type { Organization, Integration } from '../../types';
import IntegrationModal from './IntegrationModal';
import { allIntegrations, categories } from './constants';

const IntegrationsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const hasCrmIntegration = organization.services?.some(service => 
    allIntegrations.find(integration => integration.id === service.type)?.crmSystem
  ) || false;

  const connectedIntegrations = organization.services?.map(service => service.type) || [];

  const filteredIntegrations = allIntegrations.filter(integration => {
    const categoryMatch = selectedCategory === 'All' || integration.category === selectedCategory;
    const notConnected = !connectedIntegrations.includes(integration.id);
    return categoryMatch && notConnected;
  });

  const handleConnectIntegration = (integration: Integration) => {
    // Here you would typically make an API call to connect the integration
    console.log('Connecting integration:', integration);
    // For demo purposes, we'll just show a success message
  };

  const handleRemoveIntegration = (serviceUid: string) => {
    // Here you would typically make an API call to remove the integration
    console.log('Removing integration:', serviceUid);
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
            organization.services.map((service) => {
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
                      <div style={{
                        color: currentTheme.textPrimary,
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}>
                        {integration?.name || service.name || service.type}
                      </div>
                      <div style={{
                        color: currentTheme.textSecondary,
                        fontSize: '14px'
                      }}>
                        {integration?.category} • Last sync: {new Date(service.last_sync || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: service.status === 'active' ? currentTheme.success : currentTheme.danger
                      }} />
                      <span style={{
                        color: currentTheme.textSecondary,
                        fontSize: '14px',
                        textTransform: 'capitalize'
                      }}>
                        {service.status || 'Active'}
                      </span>
                    </div>
                    <button style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${currentTheme.border}`,
                      borderRadius: '6px',
                      color: currentTheme.textPrimary,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      Configure
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          padding: '24px'
        }}>
          {filteredIntegrations.map((integration) => (
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
                opacity: integration.crmSystem || hasCrmIntegration ? 1 : 0.6,
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

              {!integration.crmSystem && !hasCrmIntegration && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  color: currentTheme.warning
                }}>
                  <AlertCircle size={16} />
                </div>
              )}
            </div>
          ))}
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

export default IntegrationsTab;
