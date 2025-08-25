import React from 'react';
import { useTheme } from '../theme';
import { 
  DollarSign,
  Users,
  Target,
  MessageSquare,
  Star,
  ArrowUpRight
} from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <>
      {/* Reviews Analytics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Review Analytics
            </h2>
            <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
              Monitor customer feedback and online reputation
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Revenue Metrics */}
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.3s ease'
          }} className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <DollarSign style={{ color: currentTheme.success, width: '24px', height: '24px' }} />
              <h3 style={{ color: currentTheme.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Revenue Metrics
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Monthly Revenue</span>
                <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>$85,420</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Growth Rate</span>
                <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>+12.5%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Avg. Ticket Size</span>
                <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>$298</span>
              </div>
            </div>
          </div>

          {/* Customer Metrics */}
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.3s ease'
          }} className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Users style={{ color: currentTheme.primary, width: '24px', height: '24px' }} />
              <h3 style={{ color: currentTheme.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Customer Metrics
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Active Customers</span>
                <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>2,847</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Retention Rate</span>
                <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>94.2%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>New Customers</span>
                <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>+142</span>
              </div>
            </div>
          </div>

          {/* Service Metrics */}
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            transition: 'all 0.3s ease'
          }} className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Target style={{ color: currentTheme.warning, width: '24px', height: '24px' }} />
              <h3 style={{ color: currentTheme.textPrimary, fontSize: '18px', fontWeight: '600', margin: 0 }}>
                Service Metrics
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Services Completed</span>
                <span style={{ color: currentTheme.textPrimary, fontSize: '16px', fontWeight: '600' }}>1,284</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>On-Time Rate</span>
                <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>96.8%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>Customer Satisfaction</span>
                <span style={{ color: currentTheme.success, fontSize: '16px', fontWeight: '600' }}>4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              Customer Reviews
            </h2>
            <p style={{ color: currentTheme.textSecondary, margin: 0 }}>
              Monitor and respond to reviews across all platforms
            </p>
          </div>
          <button 
            style={{ 
              backgroundColor: currentTheme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'transform 0.3s ease'
            }}
          >
            <MessageSquare style={{ width: '20px', height: '20px' }} />
            <span>Respond to Review</span>
          </button>
        </div>

        {/* Review Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            textAlign: 'center'
          }}>
            <Star style={{ color: '#F59E0B', width: '32px', height: '32px', margin: '0 auto 12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              4.8
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              Average Rating
            </p>
          </div>

          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            textAlign: 'center'
          }}>
            <MessageSquare style={{ color: currentTheme.primary, width: '32px', height: '32px', margin: '0 auto 12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              247
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              Total Reviews
            </p>
          </div>

          <div style={{
            backgroundColor: currentTheme.cardBg,
            borderRadius: '16px',
            padding: '24px',
            border: `1px solid ${currentTheme.border}`,
            textAlign: 'center'
          }}>
            <ArrowUpRight style={{ color: currentTheme.success, width: '32px', height: '32px', margin: '0 auto 12px' }} />
            <h3 style={{ color: currentTheme.textPrimary, fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              +15%
            </h3>
            <p style={{ color: currentTheme.textSecondary, fontSize: '14px', margin: 0 }}>
              This Month
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;