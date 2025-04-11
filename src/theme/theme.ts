import { UITheme } from '../state/settingsState';

export interface ThemeColors {
  primary: string;    // Main UI elements
  secondary: string;  // Darker accents
  border: string;     // Borders
  shadow: string;     // Text shadows
  hover: string;      // Hover states
}

const themes: Record<UITheme, ThemeColors> = {
  orange: {
    primary: '#db6616',
    secondary: '#8f3e0c',
    border: '#b54e0f',
    shadow: '#8f3e0c',
    hover: '#c45c13'
  },
  brown: {
    primary: '#8B4513',
    secondary: '#5C2C0C',
    border: '#6B3E26',
    shadow: '#3E1E0A',
    hover: '#7A3B10'
  },
  grey: {
    primary: '#696969',
    secondary: '#404040',
    border: '#545454',
    shadow: '#2E2E2E',
    hover: '#595959'
  },
  yellow: {
    primary: '#FFE600',    // Slightly darker cadmium yellow
    secondary: '#D4AF00',  // Darker accent
    border: '#E6C700',     // Darker gold
    shadow: '#A68F00',     // Deeper shadow
    hover: '#FFF147'       // Slightly darker hover
  }
};

export const getThemeColors = (theme: UITheme): ThemeColors => themes[theme];

// Hook to get current theme colors
export const useTheme = () => {
  // This will be implemented after we set up the theme context
  return themes.orange;
}; 