import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme';
import { TrendingUp, Link, Gauge, Users } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{
        background: `linear-gradient(135deg, ${currentTheme.primary}15, ${currentTheme.success}15)`,
        borderRadius: '16px',
        padding: '32px',
        border: `1px solid ${currentTheme.border}`,
        textAlign: 'center'
      }}>
        <h2 style={{ color: currentTheme.textPrimary, fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          Welcome to Cross Pest Control
        </h2>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: '0 0 24px 0' }}>
          Quick overview and access to key business functions
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '24px' }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${currentTheme.border}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} 
          className="quick-action-card"
          onClick={() => navigate('/analytics')}>
            <TrendingUp style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
              View Analytics
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              Access detailed performance metrics and charts
            </p>
          </div>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${currentTheme.border}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} 
          className="quick-action-card"
          onClick={() => navigate('/integrations')}>
            <Link style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Manage Integrations
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              Connect your CRM and other business tools
            </p>
          </div>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${currentTheme.border}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} 
          className="quick-action-card"
          onClick={() => navigate('/metrics')}>
            <Gauge style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Configure Metrics
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              Set up KPIs and performance tracking
            </p>
          </div>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${currentTheme.border}`,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} 
          className="quick-action-card"
          onClick={() => navigate('/users')}>
            <Users style={{ color: currentTheme.primary, width: '32px', height: '32px', marginBottom: '12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
              Manage Users
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              Staff accounts, roles, and permissions
            </p>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${currentTheme.border}`
      }}>
        <h3 style={{ color: currentTheme.textPrimary, fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: currentTheme.cardBg, borderRadius: '8px', border: `1px solid ${currentTheme.border}` }}>
            <p style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
              Integration Updated
            </p>
            <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: 0 }}>
              PestPac integration synced successfully - 2 hours ago
            </p>
          </div>
          <div style={{ padding: '12px', backgroundColor: currentTheme.cardBg, borderRadius: '8px', border: `1px solid ${currentTheme.border}` }}>
            <p style={{ color: currentTheme.textPrimary, fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
              New Metric Configured
            </p>
            <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: 0 }}>
              Customer retention rate tracking enabled - 1 day ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
