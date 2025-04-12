import { UITheme } from '../state/settingsState';

export interface ThemeColors {
  primary: string;    // Main UI elements
  secondary: string;  // Darker accents
  border: string;     // Borders
  shadow: string;     // Text shadows
  hover: string;      // Hover states
}

export const themes: Record<UITheme, ThemeColors> = {
  default: {
    primary: '#D4813B',
    secondary: '#B36B31',
    border: '#E69138',
    shadow: '#8B4513',
    hover: '#FF9D4D'
  },
  brown: {
    primary: '#8B4513',
    secondary: '#6B3410',
    border: '#A0522D',
    shadow: '#3B1D0B',
    hover: '#A65F2D'
  },
  grey: {
    primary: '#808080',
    secondary: '#666666',
    border: '#999999',
    shadow: '#404040',
    hover: '#999999'
  },
  yellow: {
    primary: '#FFE600',
    secondary: '#D4AF00',
    border: '#E6C700',
    shadow: '#A68F00',
    hover: '#FFF147'
  },
  blue: {
    primary: '#1E3B70',
    secondary: '#152B52',
    border: '#264B8F',
    shadow: '#0A1526',
    hover: '#2E5BB0'
  }
};

export const getThemeColors = (theme: UITheme): ThemeColors => themes[theme];

export type ThemeType = keyof typeof themes; 