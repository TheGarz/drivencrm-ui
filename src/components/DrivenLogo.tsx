import type { CSSProperties } from 'react';

interface DrivenLogoProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export const DrivenLogo = ({ 
  size = 48, 
  color = '#0891B2', 
  style,
  className 
}: DrivenLogoProps) => {
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular background */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={color}
          stroke="none"
        />
        
        {/* Letter D */}
        <path
          d="M25 25 L25 75 L50 75 C65 75 75 65 75 50 C75 35 65 25 50 25 L25 25 Z M35 35 L50 35 C58 35 65 42 65 50 C65 58 58 65 50 65 L35 65 L35 35 Z"
          fill="white"
        />
        
        {/* Inner accent */}
        <circle
          cx="50"
          cy="50"
          r="15"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default DrivenLogo;