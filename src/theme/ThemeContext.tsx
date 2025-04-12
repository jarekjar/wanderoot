import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ThemeColors, themes } from './theme';

const ThemeContext = createContext<ThemeColors>(themes.default);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const uiTheme = useSelector((state: RootState) => state.settings.uiTheme);
  const theme = themes[uiTheme];

  React.useEffect(() => {
    // Set CSS variables
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-border', theme.border);
    document.documentElement.style.setProperty('--theme-shadow', theme.shadow);
    document.documentElement.style.setProperty('--theme-hover', theme.hover);
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>
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