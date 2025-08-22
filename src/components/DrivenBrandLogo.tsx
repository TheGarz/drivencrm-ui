import type { CSSProperties } from 'react';
import { useTheme } from '../theme';

interface DrivenBrandLogoProps {
  variant?: 'horizontal' | 'square';
  height?: number;
  style?: CSSProperties;
  className?: string;
}

export const DrivenBrandLogo = ({ 
  variant = 'horizontal',
  height = 48, 
  style,
  className 
}: DrivenBrandLogoProps) => {
  const { theme } = useTheme();
  
  const getLogoSrc = () => {
    if (variant === 'square') {
      return '/Driven Black Square.png';
    }
    return theme === 'dark' ? '/driven-logo-dark.png' : '/driven-logo-light.png';
  };
  
  return (
    <img
      src={getLogoSrc()}
      alt="Driven"
      className={className}
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
        ...style
      }}
    />
  );
};

export default DrivenBrandLogo;