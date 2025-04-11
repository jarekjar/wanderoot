import React, { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { getThemeColors } from './theme';
import type { ThemeColors } from './theme';

const ThemeContext = createContext<ThemeColors | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const uiTheme = useSelector((state: RootState) => state.settings.uiTheme);
  const themeColors = getThemeColors(uiTheme);

  useEffect(() => {
    // Set CSS variables
    document.documentElement.style.setProperty('--theme-primary', themeColors.primary);
    document.documentElement.style.setProperty('--theme-secondary', themeColors.secondary);
    document.documentElement.style.setProperty('--theme-border', themeColors.border);
    document.documentElement.style.setProperty('--theme-shadow', themeColors.shadow);
  }, [themeColors]);

  return (
    <ThemeContext.Provider value={themeColors}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}; 