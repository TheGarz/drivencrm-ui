import { useState } from 'react';
import { Save, X, Palette, Eye } from 'lucide-react';
import { useTheme, hexToRgb, addOpacity } from '../theme';
import type { Theme } from '../theme';

interface CustomThemeCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomThemeCreator = ({ isOpen, onClose }: CustomThemeCreatorProps) => {
  const { currentTheme } = useTheme();
  const [customTheme, setCustomTheme] = useState<Theme>({
    name: 'Custom Theme',
    primary: '#0891B2',
    secondary: '#0E7490',
    accent: '#06B6D4',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    background: '#FFFEF7',
    cardBg: '#F9F7F1',
    sidebarBg: '#164E63',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    border: '#E8E5D8',
    sand: '#F5F1E8',
    warmSand: '#E7DCC6'
  });
  const [previewMode, setPreviewMode] = useState(false);

  if (!isOpen) {
return null;
}

  const updateColor = (key: keyof Theme, value: string) => {
    setCustomTheme(prev => ({ ...prev, [key]: value }));
  };

  const colorInputs = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Supporting brand color' },
    { key: 'accent', label: 'Accent Color', description: 'Highlight color' },
    { key: 'success', label: 'Success Color', description: 'Success states' },
    { key: 'warning', label: 'Warning Color', description: 'Warning states' },
    { key: 'danger', label: 'Danger Color', description: 'Error states' },
    { key: 'background', label: 'Background', description: 'Main background' },
    { key: 'cardBg', label: 'Card Background', description: 'Card/panel background' },
    { key: 'sidebarBg', label: 'Sidebar Background', description: 'Navigation background' },
    { key: 'textPrimary', label: 'Primary Text', description: 'Main text color' },
    { key: 'textSecondary', label: 'Secondary Text', description: 'Subtitle text color' },
    { key: 'border', label: 'Border Color', description: 'Border and dividers' }
  ] as const;

  const displayTheme = previewMode ? customTheme : currentTheme;

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
          backgroundColor: displayTheme.cardBg,
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '900px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `2px solid ${displayTheme.border}`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                backgroundColor: addOpacity(displayTheme.primary, 0.15),
                padding: '12px',
                borderRadius: '12px'
              }}
            >
              <Palette style={{ color: displayTheme.primary, width: '24px', height: '24px' }} />
            </div>
            <div>
              <h2 style={{ 
                color: displayTheme.textPrimary, 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: 0 
              }}>
                Custom Theme Creator
              </h2>
              <p style={{ 
                color: displayTheme.textSecondary, 
                fontSize: '14px', 
                margin: 0 
              }}>
                Create your own color scheme
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: `2px solid ${displayTheme.border}`,
                backgroundColor: previewMode ? displayTheme.primary : 'transparent',
                color: previewMode ? 'white' : displayTheme.textPrimary,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Eye style={{ width: '16px', height: '16px' }} />
              {previewMode ? 'Exit Preview' : 'Preview'}
            </button>
            
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: addOpacity(displayTheme.danger, 0.15),
                color: displayTheme.danger,
                cursor: 'pointer'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        {/* Theme Name Input */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ 
            display: 'block', 
            color: displayTheme.textPrimary, 
            fontWeight: '600', 
            marginBottom: '8px' 
          }}>
            Theme Name
          </label>
          <input
            type="text"
            value={customTheme.name}
            onChange={(e) => updateColor('name', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: `2px solid ${displayTheme.border}`,
              backgroundColor: displayTheme.background,
              color: displayTheme.textPrimary,
              fontSize: '16px',
              outline: 'none'
            }}
            placeholder="Enter theme name"
          />
        </div>

        {/* Color Inputs */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {colorInputs.map(({ key, label, description }) => (
            <div key={key} style={{ 
              backgroundColor: displayTheme.background,
              padding: '20px',
              borderRadius: '16px',
              border: `1px solid ${displayTheme.border}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: customTheme[key],
                    border: `2px solid ${displayTheme.border}`,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    color: displayTheme.textPrimary, 
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'block'
                  }}>
                    {label}
                  </label>
                  <p style={{ 
                    color: displayTheme.textSecondary, 
                    fontSize: '12px', 
                    margin: 0 
                  }}>
                    {description}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="color"
                  value={customTheme[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  style={{
                    width: '48px',
                    height: '36px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={customTheme[key]}
                  onChange={(e) => updateColor(key, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${displayTheme.border}`,
                    backgroundColor: displayTheme.cardBg,
                    color: displayTheme.textPrimary,
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              border: `2px solid ${displayTheme.border}`,
              backgroundColor: 'transparent',
              color: displayTheme.textPrimary,
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.warn('Custom theme created:', customTheme);
              alert('Custom theme saved! (This would integrate with theme system)');
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: displayTheme.primary,
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            Save Theme
          </button>
        </div>
      </div>
    </div>
  );
};