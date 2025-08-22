import type { Theme, ThemeKey } from './types';

export const themes: Record<ThemeKey, Theme> = {
  light: {
    name: 'Coastal Dawn',
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
  },
  dark: {
    name: 'Deep Current',
    primary: '#06B6D4',
    secondary: '#0891B2',
    accent: '#22D3EE',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#0A0E14',
    cardBg: '#1E293B',
    sidebarBg: '#0F172A',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    sand: '#2D3748',
    warmSand: '#4A5568'
  },
  sunset: {
    name: 'Sunset Glow',
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FDE047',
    success: '#059669',
    warning: '#DC2626',
    danger: '#EF4444',
    background: '#FEF7ED',
    cardBg: '#FED7AA',
    sidebarBg: '#9A3412',
    textPrimary: '#1C1917',
    textSecondary: '#78716C',
    border: '#FED7AA',
    sand: '#FDBA74',
    warmSand: '#FB923C'
  },
  forest: {
    name: 'Forest Canopy',
    primary: '#059669',
    secondary: '#047857',
    accent: '#10B981',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#F0FDF4',
    cardBg: '#DCFCE7',
    sidebarBg: '#14532D',
    textPrimary: '#14532D',
    textSecondary: '#6B7280',
    border: '#BBF7D0',
    sand: '#A7F3D0',
    warmSand: '#86EFAC'
  },
  ocean: {
    name: 'Ocean Depths',
    primary: '#1E40AF',
    secondary: '#1D4ED8',
    accent: '#3B82F6',
    success: '#059669',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#F8FAFC',
    cardBg: '#E2E8F0',
    sidebarBg: '#0F172A',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    border: '#CBD5E1',
    sand: '#E2E8F0',
    warmSand: '#CBD5E1'
  },
  lavender: {
    name: 'Lavender Fields',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    success: '#059669',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#FAF5FF',
    cardBg: '#F3E8FF',
    sidebarBg: '#581C87',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E9D5FF',
    sand: '#DDD6FE',
    warmSand: '#C4B5FD'
  }
};

export const getTheme = (themeKey: ThemeKey): Theme => {
  return themes[themeKey] || themes.light;
};

export const getThemeKeys = (): ThemeKey[] => {
  return Object.keys(themes) as ThemeKey[];
};