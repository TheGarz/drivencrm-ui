# 🎨 Theme System Documentation

## Overview

The CRMV2-UI project features a comprehensive theming system that allows easy customization of colors, supports multiple built-in themes, and provides tools for creating custom themes.

## 🏗️ Architecture

### File Structure
```
src/theme/
├── types.ts              # TypeScript interfaces
├── themes.ts             # Built-in theme definitions
├── ThemeContext.tsx      # React context provider
└── index.ts              # Exports and utilities

src/components/
├── ThemeSelector.tsx     # Theme selection modal
└── CustomThemeCreator.tsx # Custom theme creation tool
```

## 🎯 Core Features

### 1. **Built-in Themes**
- **Coastal Dawn** (Light) - Default light theme with coastal blue tones
- **Deep Current** (Dark) - Dark theme with ocean depths feel
- **Sunset Glow** - Warm orange/amber theme
- **Forest Canopy** - Green nature-inspired theme
- **Ocean Depths** - Blue professional theme
- **Lavender Fields** - Purple/violet creative theme

### 2. **Theme Properties**
Each theme contains 15 carefully chosen color properties:

```typescript
interface Theme {
  name: string;         // Display name
  primary: string;      // Main brand color
  secondary: string;    // Supporting brand color
  accent: string;       // Highlight color
  success: string;      // Success states
  warning: string;      // Warning states
  danger: string;       // Error states
  background: string;   // Main background
  cardBg: string;       // Card/panel background
  sidebarBg: string;    // Navigation background
  textPrimary: string;  // Main text color
  textSecondary: string; // Subtitle text color
  border: string;       // Border and dividers
  sand: string;         // Light accent background
  warmSand: string;     // Warmer accent background
}
```

### 3. **Theme Context**
Global state management with React Context:

```typescript
interface ThemeContextType {
  theme: ThemeKey;                    // Current theme key
  currentTheme: Theme;                // Current theme object
  setTheme: (theme: ThemeKey) => void; // Set specific theme
  toggleTheme: () => void;            // Toggle light/dark
  availableThemes: Record<ThemeKey, Theme>; // All themes
}
```

## 🚀 Usage

### Basic Usage

```tsx
import { useTheme } from '../theme';

const MyComponent = () => {
  const { currentTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: currentTheme.background }}>
      <h1 style={{ color: currentTheme.textPrimary }}>
        Hello World
      </h1>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};
```

### Using Theme Utilities

```tsx
import { addOpacity, hexToRgb } from '../theme';

// Add transparency to colors
const transparentPrimary = addOpacity(currentTheme.primary, 0.1);

// Convert hex to RGB
const rgb = hexToRgb('#0891B2'); // { r: 8, g: 145, b: 178 }
```

## 🎨 Components

### ThemeSelector
Modal component for selecting from built-in themes:

```tsx
import { ThemeSelector } from './ThemeSelector';

const [isOpen, setIsOpen] = useState(false);

<ThemeSelector 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
/>
```

**Features:**
- Visual theme previews
- Color palette display
- Smooth animations
- Current theme indication

### CustomThemeCreator
Advanced tool for creating custom themes:

```tsx
import { CustomThemeCreator } from './CustomThemeCreator';

<CustomThemeCreator 
  isOpen={isCreatorOpen} 
  onClose={() => setIsCreatorOpen(false)} 
/>
```

**Features:**
- Live color pickers
- Real-time preview mode
- Hex code inputs
- Color validation
- Export functionality

## 💾 Persistence

Themes are automatically saved to `localStorage`:
- **Key:** `app-theme`
- **Value:** Theme key (e.g., 'light', 'dark', 'sunset')
- **Auto-restore:** On app reload

## 🔧 Customization

### Adding New Themes

1. **Define the theme** in `src/theme/themes.ts`:

```typescript
export const themes: Record<ThemeKey, Theme> = {
  // ... existing themes
  myTheme: {
    name: 'My Custom Theme',
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    // ... other properties
  }
};
```

2. **Update the ThemeKey type** in `src/theme/types.ts`:

```typescript
export type ThemeKey = 'light' | 'dark' | 'sunset' | 'forest' | 'ocean' | 'lavender' | 'myTheme';
```

### Creating Theme Variants

Use the utility functions to create variants:

```typescript
import { addOpacity, hexToRgb } from '../theme';

const darkVariant = {
  ...lightTheme,
  background: '#1a1a1a',
  cardBg: addOpacity(lightTheme.primary, 0.1),
  textPrimary: '#ffffff'
};
```

## 🎯 Best Practices

### 1. **Consistent Color Usage**
```tsx
// ✅ Good - Use theme colors
backgroundColor: currentTheme.primary

// ❌ Bad - Hardcoded colors
backgroundColor: '#0891B2'
```

### 2. **Semantic Color Names**
```tsx
// ✅ Good - Semantic usage
color: currentTheme.success  // for success states
color: currentTheme.danger   // for error states

// ❌ Bad - Non-semantic usage
color: currentTheme.success  // for general text
```

### 3. **Opacity for Variations**
```tsx
// ✅ Good - Use opacity for variations
backgroundColor: addOpacity(currentTheme.primary, 0.1)

// ❌ Bad - Create new color properties
backgroundColor: currentTheme.primaryLight
```

### 4. **Responsive Design**
```tsx
// ✅ Good - Theme-aware responsive styles
const styles = {
  container: {
    backgroundColor: currentTheme.background,
    '@media (max-width: 768px)': {
      backgroundColor: currentTheme.cardBg
    }
  }
};
```

## 🛠️ Development Tools

### Theme Testing
Use the **CustomThemeCreator** component to:
- Test color combinations
- Preview themes in real-time
- Export theme configurations
- Validate accessibility contrast

### Browser DevTools
Inspect theme colors in browser:
1. Open DevTools
2. Search for CSS custom properties
3. Modify colors in real-time
4. Copy values for theme definitions

## 🔮 Future Enhancements

### Planned Features
- [ ] **Theme inheritance** - Base themes with overrides
- [ ] **CSS custom properties** - Better browser DevTools integration
- [ ] **Theme animations** - Smooth color transitions
- [ ] **Accessibility validation** - Automatic contrast checking
- [ ] **Theme marketplace** - Community-shared themes
- [ ] **Export/Import** - Theme configuration files
- [ ] **Dynamic theming** - Runtime theme generation

### Integration Ideas
- [ ] **Design tokens** - Integration with design systems
- [ ] **Brand theming** - Customer-specific themes
- [ ] **Seasonal themes** - Time-based theme switching
- [ ] **System preference** - Auto light/dark based on OS

## 📚 Examples

### Complete Theme Implementation

```tsx
import { useTheme, addOpacity } from '../theme';

const DashboardCard = ({ children, title }) => {
  const { currentTheme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: currentTheme.cardBg,
      border: `2px solid ${currentTheme.border}`,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: `0 4px 20px ${addOpacity(currentTheme.primary, 0.1)}`,
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{
        color: currentTheme.textPrimary,
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '16px'
      }}>
        {title}
      </h3>
      <div style={{ color: currentTheme.textSecondary }}>
        {children}
      </div>
    </div>
  );
};
```

This theme system provides a solid foundation for consistent, customizable, and maintainable UI theming across the entire application.