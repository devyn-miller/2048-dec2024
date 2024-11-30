import React, { createContext, useContext, useState } from 'react';
import { Theme } from '../types/game';

const themes: Theme[] = [
  {
    name: 'Classic',
    background: '#faf8ef',
    gridBackground: '#bbada0',
    tileColors: {
      2: { background: '#eee4da', text: '#776e65' },
      4: { background: '#ede0c8', text: '#776e65' },
      8: { background: '#f2b179', text: '#f9f6f2' },
      16: { background: '#f59563', text: '#f9f6f2' },
      32: { background: '#f67c5f', text: '#f9f6f2' },
      64: { background: '#f65e3b', text: '#f9f6f2' },
      128: { background: '#edcf72', text: '#f9f6f2' },
      256: { background: '#edcc61', text: '#f9f6f2' },
      512: { background: '#edc850', text: '#f9f6f2' },
      1024: { background: '#edc53f', text: '#f9f6f2' },
      2048: { background: '#edc22e', text: '#f9f6f2' },
    },
  },
  {
    name: 'Dark',
    background: '#1a1a1a',
    gridBackground: '#2d2d2d',
    tileColors: {
      2: { background: '#3d3d3d', text: '#ffffff' },
      4: { background: '#4d4d4d', text: '#ffffff' },
      8: { background: '#6d6d6d', text: '#ffffff' },
      16: { background: '#8d8d8d', text: '#ffffff' },
      32: { background: '#ad8d8d', text: '#ffffff' },
      64: { background: '#cd8d8d', text: '#ffffff' },
      128: { background: '#ed8d8d', text: '#ffffff' },
      256: { background: '#ed6d6d', text: '#ffffff' },
      512: { background: '#ed4d4d', text: '#ffffff' },
      1024: { background: '#ed2d2d', text: '#ffffff' },
      2048: { background: '#ed0d0d', text: '#ffffff' },
    },
  },
  {
    name: 'Ocean',
    background: '#e0f7fa',
    gridBackground: '#80deea',
    tileColors: {
      2: { background: '#b2ebf2', text: '#006064' },
      4: { background: '#80deea', text: '#006064' },
      8: { background: '#4dd0e1', text: '#ffffff' },
      16: { background: '#26c6da', text: '#ffffff' },
      32: { background: '#00bcd4', text: '#ffffff' },
      64: { background: '#00acc1', text: '#ffffff' },
      128: { background: '#0097a7', text: '#ffffff' },
      256: { background: '#00838f', text: '#ffffff' },
      512: { background: '#006064', text: '#ffffff' },
      1024: { background: '#004d40', text: '#ffffff' },
      2048: { background: '#00251a', text: '#ffffff' },
    },
  },
];

type ThemeContextType = {
  theme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(themes[0]);

  return (
    <ThemeContext.Provider value={{ theme, themes, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}