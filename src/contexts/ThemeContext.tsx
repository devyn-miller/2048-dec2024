import React, { createContext, useContext, useState } from 'react';

interface Theme {
  id: string;
  name: string;
  background: string;
  gridBackground: string;
  gridCellBackground: string;
  lightText: string;
  darkText: string;
  tileColors: {
    [key: number]: {
      background: string;
      text: string;
      backgroundColor: string;
      color: string;
    };
  };
}

const defaultThemes: Theme[] = [
  {
    id: 'classic',
    name: 'Classic',
    background: '#faf8ef',
    gridBackground: '#bbada0',
    gridCellBackground: '#cdc1b4',
    lightText: '#f9f6f2',
    darkText: '#776e65',
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
    id: 'dark',
    name: 'Dark',
    gridBackground: '#1a1a1a',
    gridCellBackground: '#2d2d2d',
    lightText: '#ffffff',
    darkText: '#e0e0e0',
    tileColors: {
      2: { backgroundColor: '#2d2d2d', color: '#ffffff' },
      4: { backgroundColor: '#3d3d3d', color: '#ffffff' },
      8: { backgroundColor: '#4a4a4a', color: '#ffffff' },
      16: { backgroundColor: '#5a5a5a', color: '#ffffff' },
      32: { backgroundColor: '#696969', color: '#ffffff' },
      64: { backgroundColor: '#787878', color: '#ffffff' },
      128: { backgroundColor: '#888888', color: '#ffffff' },
      256: { backgroundColor: '#989898', color: '#ffffff' },
      512: { backgroundColor: '#a8a8a8', color: '#ffffff' },
      1024: { backgroundColor: '#b8b8b8', color: '#ffffff' },
      2048: { backgroundColor: '#c8c8c8', color: '#1a1a1a' },
      4096: { backgroundColor: '#d8d8d8', color: '#1a1a1a' },
      8192: { backgroundColor: '#e8e8e8', color: '#1a1a1a' },
    },
  },
  {
    id: 'ocean',
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

interface ThemeContextType {
  theme: Theme;
  themes: Theme[];
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultThemes[0]);

  return (
    <ThemeContext.Provider value={{ theme, themes: defaultThemes, setTheme }}>
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