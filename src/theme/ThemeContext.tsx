import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ThemeColors, themes } from './theme';
import { UITheme } from '../state/settingsState';

const ThemeContext = createContext<ThemeColors>(themes.default);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const uiTheme = useSelector((state: RootState) => state.settings.uiTheme) as UITheme;
  const theme = themes[uiTheme];

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 