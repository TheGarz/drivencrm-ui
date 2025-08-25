import React from 'react';
import { useTheme } from '../theme';
import { 
  CreditCard,
  Clock,
  Receipt,
  TrendingUp
} from 'lucide-react';

const BillingPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '500px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '24px',
        padding: '48px',
        border: `2px dashed ${currentTheme.border}`,
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: currentTheme.primary + '15',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CreditCard style={{ 
            color: currentTheme.primary, 
            width: '40px', 
            height: '40px' 
          }} />
        </div>
        
        <h2 style={{ 
          color: currentTheme.textPrimary, 
          fontSize: '32px', 
          fontWeight: 'bold', 
          margin: '0 0 16px 0' 
        }}>
          Billing & Payments
        </h2>
        
        <div style={{
          backgroundColor: currentTheme.warning + '20',
          border: `1px solid ${currentTheme.warning}40`,
          borderRadius: '12px',
          padding: '12px 24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          <Clock style={{ 
            color: currentTheme.warning, 
            width: '18px', 
            height: '18px' 
          }} />
          <span style={{
            color: currentTheme.warning,
            fontSize: '14px',
            fontWeight: '600'
          }}>
            COMING SOON
          </span>
        </div>
        
        <p style={{ 
          color: currentTheme.textSecondary, 
          fontSize: '18px', 
          lineHeight: '1.6',
          margin: '0 0 32px 0' 
        }}>
          We're developing a comprehensive billing and subscription management system. 
          This feature will help you track payments, manage subscriptions, and monitor 
          your financial performance all in one place.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: currentTheme.background,
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${currentTheme.border}`
          }}>
            <CreditCard style={{ 
              color: currentTheme.primary, 
              width: '24px', 
              height: '24px',
              marginBottom: '8px'
            }} />
            <h4 style={{
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              Subscription Management
            </h4>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              margin: 0
            }}>
              Track and manage billing cycles
            </p>
          </div>
          
          <div style={{
            backgroundColor: currentTheme.background,
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${currentTheme.border}`
          }}>
            <Receipt style={{ 
              color: currentTheme.primary, 
              width: '24px', 
              height: '24px',
              marginBottom: '8px'
            }} />
            <h4 style={{
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              Payment History
            </h4>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              margin: 0
            }}>
              View invoices and transactions
            </p>
          </div>
          
          <div style={{
            backgroundColor: currentTheme.background,
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${currentTheme.border}`
          }}>
            <TrendingUp style={{ 
              color: currentTheme.primary, 
              width: '24px', 
              height: '24px',
              marginBottom: '8px'
            }} />
            <h4 style={{
              color: currentTheme.textPrimary,
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 4px 0'
            }}>
              Usage Analytics
            </h4>
            <p style={{
              color: currentTheme.textSecondary,
              fontSize: '12px',
              margin: 0
            }}>
              Monitor platform usage metrics
            </p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: currentTheme.background,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${currentTheme.border}`,
          fontSize: '14px',
          color: currentTheme.textSecondary
        }}>
          <strong style={{ color: currentTheme.textPrimary }}>Stay tuned!</strong> We'll notify you when this feature becomes available.
        </div>
      </div>
    </div>
  );
};

export default BillingPage;