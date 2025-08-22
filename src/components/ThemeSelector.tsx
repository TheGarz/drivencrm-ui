import { useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { useTheme, getThemeKeys } from '../theme';
import type { ThemeKey } from '../theme';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector = ({ isOpen, onClose }: ThemeSelectorProps) => {
  const { theme: currentTheme, setTheme, availableThemes } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<ThemeKey | null>(null);
  
  if (!isOpen) return null;

  const handleThemeSelect = (themeKey: ThemeKey) => {
    setTheme(themeKey);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: availableThemes[currentTheme].cardBg,
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: `2px solid ${availableThemes[currentTheme].border}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div 
            style={{
              backgroundColor: `${availableThemes[currentTheme].primary}26`,
              padding: '12px',
              borderRadius: '12px'
            }}
          >
            <Palette style={{ color: availableThemes[currentTheme].primary, width: '24px', height: '24px' }} />
          </div>
          <div>
            <h2 style={{ 
              color: availableThemes[currentTheme].textPrimary, 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              Choose Theme
            </h2>
            <p style={{ 
              color: availableThemes[currentTheme].textSecondary, 
              fontSize: '14px', 
              margin: 0 
            }}>
              Select a color scheme for your dashboard
            </p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px' 
        }}>
          {getThemeKeys().map((themeKey) => {
            const theme = availableThemes[themeKey];
            const isSelected = currentTheme === themeKey;
            const isHovered = hoveredTheme === themeKey;
            
            return (
              <div
                key={themeKey}
                onClick={() => handleThemeSelect(themeKey)}
                onMouseEnter={() => setHoveredTheme(themeKey)}
                onMouseLeave={() => setHoveredTheme(null)}
                style={{
                  backgroundColor: theme.background,
                  border: `2px solid ${isSelected ? theme.primary : theme.border}`,
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected 
                    ? `0 8px 25px ${theme.primary}40` 
                    : isHovered 
                      ? '0 8px 25px rgba(0, 0, 0, 0.1)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ 
                    color: theme.textPrimary, 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    margin: 0 
                  }}>
                    {theme.name}
                  </h3>
                  {isSelected && (
                    <div 
                      style={{
                        backgroundColor: theme.primary,
                        borderRadius: '50%',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check style={{ color: 'white', width: '16px', height: '16px' }} />
                    </div>
                  )}
                </div>

                {/* Theme Preview */}
                <div style={{ 
                  backgroundColor: theme.cardBg,
                  borderRadius: '12px',
                  padding: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: theme.primary 
                    }} />
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: theme.secondary 
                    }} />
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: theme.accent 
                    }} />
                  </div>
                  <div style={{ 
                    height: '4px', 
                    backgroundColor: theme.border, 
                    borderRadius: '2px',
                    marginBottom: '4px'
                  }} />
                  <div style={{ 
                    height: '4px', 
                    backgroundColor: theme.border, 
                    borderRadius: '2px',
                    width: '60%'
                  }} />
                </div>

                {/* Color Palette */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {[theme.primary, theme.secondary, theme.success, theme.warning, theme.danger].map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: color,
                        border: `1px solid ${theme.border}`
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};