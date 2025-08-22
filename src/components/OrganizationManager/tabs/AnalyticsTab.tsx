import React from 'react';
import { DollarSign, Users, Activity, Clock } from 'lucide-react';
import { useTheme } from '../../../theme/ThemeContext';
import type { Organization } from '../types';

const AnalyticsTab: React.FC<{ organization: Organization; onUpdate: (org: Organization) => void }> = ({ organization }) => {
  const { currentTheme } = useTheme();

  const metrics = [
    { label: 'Total Revenue', value: '$125,000', change: '+12%', positive: true, icon: DollarSign },
    { label: 'Active Users', value: '47', change: '+3', positive: true, icon: Users },
    { label: 'Sync Success Rate', value: '98.5%', change: '+0.5%', positive: true, icon: Activity },
    { label: 'Avg Response Time', value: '2.3s', change: '-0.2s', positive: true, icon: Clock }
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            border: `1px solid ${currentTheme.border}`,
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: currentTheme.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentTheme.primary
              }}>
                <metric.icon size={20} />
              </div>
              <div>
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  {metric.label}
                </div>
                <div style={{
                  color: currentTheme.textPrimary,
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  {metric.value}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: metric.positive ? currentTheme.success : currentTheme.danger,
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {metric.change}
              <span style={{ color: currentTheme.textSecondary }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

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
            Recent Activity
          </h3>
        </div>
        <div style={{ padding: '16px 0' }}>
          {[
            { time: '2 hours ago', action: 'Data sync completed successfully', type: 'success' },
            { time: '5 hours ago', action: 'New user Sarah Johnson added', type: 'info' },
            { time: '1 day ago', action: 'HubSpot integration configured', type: 'info' },
            { time: '2 days ago', action: 'Sync error resolved for FieldRoutes', type: 'warning' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 24px',
              borderBottom: index < 3 ? `1px solid ${currentTheme.border}` : 'none'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: activity.type === 'success' ? currentTheme.success :
                               activity.type === 'warning' ? currentTheme.warning : currentTheme.primary
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  color: currentTheme.textPrimary,
                  fontSize: '14px',
                  marginBottom: '2px'
                }}>
                  {activity.action}
                </div>
                <div style={{
                  color: currentTheme.textSecondary,
                  fontSize: '12px'
                }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;