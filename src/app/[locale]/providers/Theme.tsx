'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { applyCSSVariables, generateCSSVariables } from '@/styles/themes/utils';

import { DEFAULT_THEME, themes } from '@/styles/themes/consts';

import { createTheme } from '@/styles/themes';
import { ThemeConfig } from '@/styles/themes/types';

type ThemeContextType = {
  theme: keyof typeof themes;
  setTheme: (theme: keyof typeof themes) => void;
  themeConfig: ThemeConfig;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeContextType['theme']>(DEFAULT_THEME);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(createTheme(DEFAULT_THEME));

  useEffect(() => {
    const newThemeConfig = createTheme(theme);
    setThemeConfig(newThemeConfig);

    const cssVariables = generateCSSVariables(newThemeConfig);
    applyCSSVariables(cssVariables);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme, themeConfig }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
