import React from 'react';
import { useTheme } from '../theme';
import { DrivenLogo } from '../components/DrivenLogo';
import { 
  DollarSign,
  Users,
  Target,
  ArrowUpRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// MetricCard Props Interface
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  subtitle?: string;
}

const AnalyticsPage: React.FC = () => {
  const { currentTheme } = useTheme();

  // Sample data - exact same as original
  const ownerMetrics = {
    totalRevenue: '$847,250',
    monthlyGrowth: '+15.3%',
    activeCustomers: '2,847',
    customerRetention: '94.2%',
    avgTicketSize: '$298',
    profitMargin: '32.1%'
  };

  // MetricCard Component - exact same as original
  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon: Icon, subtitle }) => (
    <div 
      style={{ 
        backgroundColor: currentTheme.cardBg,
        border: `2px solid ${currentTheme.border}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
      className="metric-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: currentTheme.textSecondary, fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>
            {title}
          </p>
          <p style={{ color: currentTheme.textPrimary, fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ color: currentTheme.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
              {subtitle}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowUpRight 
              style={{ 
                width: '16px', 
                height: '16px', 
                marginRight: '4px',
                color: changeType === 'positive' ? '#10B981' : '#EF4444'
              }} 
            />
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600',
              color: changeType === 'positive' ? '#10B981' : '#EF4444'
            }}>
              {change}
            </span>
            <span style={{ color: currentTheme.textSecondary, fontSize: '14px', marginLeft: '4px' }}>
              vs last month
            </span>
          </div>
        </div>
        <div 
          style={{ 
            backgroundColor: `${currentTheme.primary}26`,
            padding: '16px',
            borderRadius: '16px'
          }}
        >
          <Icon style={{ color: currentTheme.primary, width: '28px', height: '28px' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Owner Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <MetricCard 
          title="Total Revenue" 
          value={ownerMetrics.totalRevenue}
          change={ownerMetrics.monthlyGrowth}
          changeType="positive" 
          icon={DollarSign}
          subtitle="All branches combined"
        />
        <MetricCard 
          title="Active Customers" 
          value={ownerMetrics.activeCustomers}
          change="+8.2%"
          changeType="positive" 
          icon={Users}
          subtitle="Retention rate: 94.2%"
        />
        <MetricCard 
          title="Avg Ticket Size" 
          value={ownerMetrics.avgTicketSize}
          change="+5.7%"
          changeType="positive" 
          icon={Target}
          subtitle="Profit margin: 32.1%"
        />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div 
          style={{ 
            backgroundColor: currentTheme.cardBg,
            border: `2px solid ${currentTheme.border}`,
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <h3 style={{ color: currentTheme.textPrimary, fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
            Revenue Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { month: 'Jan', revenue: 145000 },
              { month: 'Feb', revenue: 152000 },
              { month: 'Mar', revenue: 148000 },
              { month: 'Apr', revenue: 161000 },
              { month: 'May', revenue: 158000 },
              { month: 'Jun', revenue: 167000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={currentTheme.border} />
              <XAxis dataKey="month" stroke={currentTheme.textSecondary} />
              <YAxis stroke={currentTheme.textSecondary} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={currentTheme.primary} 
                fill={currentTheme.primary} 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div 
          style={{ 
            backgroundColor: currentTheme.cardBg,
            border: `2px solid ${currentTheme.border}`,
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <h3 style={{ color: currentTheme.textPrimary, fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
            Service Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Residential', value: 65, color: currentTheme.primary },
                  { name: 'Commercial', value: 25, color: currentTheme.secondary },
                  { name: 'Emergency', value: 10, color: currentTheme.warning }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {[
                  { name: 'Residential', value: 65, color: currentTheme.primary },
                  { name: 'Commercial', value: 25, color: currentTheme.secondary },
                  { name: 'Emergency', value: 10, color: currentTheme.warning }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Branded Welcome Section */}
      <div style={{
        backgroundColor: `linear-gradient(135deg, ${currentTheme.primary}15 0%, ${currentTheme.accent}10 100%)`,
        border: `2px solid ${currentTheme.border}`,
        borderRadius: '24px',
        padding: '32px',
        textAlign: 'center',
        marginTop: '24px'
      }}>
        <DrivenLogo size={48} style={{ marginBottom: '16px' }} />
        <h3 style={{ 
          color: currentTheme.textPrimary, 
          fontSize: '24px', 
          fontWeight: 'bold', 
          margin: '0 0 12px 0' 
        }}>
          Welcome to Driven Analytics
        </h3>
        <p style={{ 
          color: currentTheme.textSecondary, 
          fontSize: '16px', 
          margin: 0,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Powerful business intelligence and CRM analytics platform designed to drive your success. 
          Monitor performance, track metrics, and make data-driven decisions with confidence.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;