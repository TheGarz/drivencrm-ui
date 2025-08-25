// Admin Dashboard Page Component
// Platform overview and metrics for Driven admin users

import React from 'react';
import { useTheme } from '../theme';
import { Building2, Users, CreditCard, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminDashboardPage: React.FC = () => {
  const { currentTheme } = useTheme();

  // Sample platform metrics
  const platformMetrics = {
    totalOrganizations: '847',
    totalUsers: '12,437', 
    monthlyRevenue: '$2,847,250',
    activeIntegrations: '156',
    systemUptime: '99.9%',
    supportTickets: '23'
  };

  // Sample chart data
  const organizationGrowthData = [
    { month: 'Jan', organizations: 720, users: 9800 },
    { month: 'Feb', organizations: 745, users: 10200 },
    { month: 'Mar', organizations: 768, users: 10800 },
    { month: 'Apr', organizations: 792, users: 11400 },
    { month: 'May', organizations: 815, users: 11900 },
    { month: 'Jun', organizations: 847, users: 12437 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 2420000 },
    { month: 'Feb', revenue: 2580000 },
    { month: 'Mar', revenue: 2650000 },
    { month: 'Apr', revenue: 2720000 },
    { month: 'May', revenue: 2780000 },
    { month: 'Jun', revenue: 2847250 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Header */}
      <div style={{
        background: `linear-gradient(135deg, ${currentTheme.primary}15, ${currentTheme.success}15)`,
        borderRadius: '16px',
        padding: '32px',
        border: `1px solid ${currentTheme.border}`,
        textAlign: 'center'
      }}>
        <h2 style={{ color: currentTheme.textPrimary, fontSize: '28px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
          Admin Dashboard
        </h2>
        <p style={{ color: currentTheme.textSecondary, fontSize: '18px', margin: 0 }}>
          Platform overview and management tools
        </p>
      </div>

      {/* Platform Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Building2 style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
            <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Active Organizations
            </h3>
          </div>
          <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {platformMetrics.totalOrganizations}
          </p>
          <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
            +12 this month
          </p>
        </div>

        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Users style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
            <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Platform Users
            </h3>
          </div>
          <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {platformMetrics.totalUsers}
          </p>
          <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
            +537 this month
          </p>
        </div>

        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <CreditCard style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
            <h3 style={{ color: currentTheme.textPrimary, margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Monthly Revenue
            </h3>
          </div>
          <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {platformMetrics.monthlyRevenue}
          </p>
          <p style={{ color: currentTheme.success, fontSize: '14px', margin: 0 }}>
            +15.3% vs last month
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        {/* Company Growth Chart */}
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${currentTheme.border}`
        }}>
          <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
            Platform Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={organizationGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
              <XAxis dataKey="month" stroke={currentTheme.textSecondary} />
              <YAxis stroke={currentTheme.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="organizations" 
                stroke={currentTheme.primary} 
                fill={currentTheme.primary + '20'} 
                strokeWidth={2}
                name="Organizations"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div style={{
          backgroundColor: currentTheme.cardBg,
          borderRadius: '16px',
          padding: '24px',
          border: `1px solid ${currentTheme.border}`
        }}>
          <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
              <XAxis dataKey="month" stroke={currentTheme.textSecondary} />
              <YAxis stroke={currentTheme.textSecondary} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: currentTheme.cardBg,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Revenue']}
              />
              <Bar 
                dataKey="revenue" 
                fill={currentTheme.success} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${currentTheme.border}`
      }}>
        <h3 style={{ color: currentTheme.textPrimary, margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
          System Status
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentTheme.success
            }} />
            <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
              Uptime: {platformMetrics.systemUptime}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentTheme.warning
            }} />
            <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
              Open Tickets: {platformMetrics.supportTickets}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentTheme.success
            }} />
            <span style={{ color: currentTheme.textPrimary, fontSize: '14px' }}>
              Integrations: {platformMetrics.activeIntegrations} active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;