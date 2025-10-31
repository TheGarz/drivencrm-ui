import React from 'react';
import { useTheme } from '../theme';
import { Star } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '24px'
    }}>
      <div style={{
        backgroundColor: currentTheme.cardBg,
        borderRadius: '24px',
        padding: '64px 48px',
        border: `1px solid ${currentTheme.border}`,
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <Star 
          style={{ 
            color: currentTheme.primary, 
            width: '64px', 
            height: '64px', 
            margin: '0 auto 24px',
            opacity: 0.5
          }} 
        />
        <h2 style={{ 
          color: currentTheme.textPrimary, 
          fontSize: '32px', 
          fontWeight: 'bold', 
          margin: '0 0 16px 0' 
        }}>
          Coming Soon
        </h2>
        <p style={{ 
          color: currentTheme.textSecondary, 
          fontSize: '18px', 
          margin: 0,
          lineHeight: '1.6'
        }}>
          The Reviews feature is currently under development. Check back soon for updates!
        </p>
      </div>
    </div>
  );
};

export default ReviewsPage;
