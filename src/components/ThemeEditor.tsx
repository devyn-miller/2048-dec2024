import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ColorPicker } from './ColorPicker';
import { Theme } from '../types/theme';

interface ThemeEditorProps {
  onClose: () => void;
}

export function ThemeEditor({ onClose }: ThemeEditorProps) {
  const { theme: currentTheme, addCustomTheme, customThemeCount } = useTheme();
  const [editedTheme, setEditedTheme] = useState<Theme>(() => {
    // Only include tile colors that exist in the current theme
    const filteredTileColors = { ...currentTheme.tileColors };
    return {
      ...currentTheme,
      tileColors: filteredTileColors
    };
  });
  const [themeName, setThemeName] = useState('Custom ' + currentTheme.name);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with current theme's colors, but only for existing tiles
    const filteredTileColors = { ...currentTheme.tileColors };
    setEditedTheme({
      ...currentTheme,
      tileColors: filteredTileColors
    });
    setThemeName('Custom ' + currentTheme.name);
  }, [currentTheme]);

  const handleSave = () => {
    if (!themeName.trim()) {
      setError('Theme name cannot be empty');
      return;
    }

    if (customThemeCount >= 3) {
      setError('Maximum number of custom themes reached. Please delete a theme before creating a new one.');
      return;
    }

    const newTheme = {
      ...editedTheme,
      id: 'custom-' + Date.now(),
      name: themeName.trim(),
    };

    const success = addCustomTheme(newTheme);
    if (success) {
      onClose();
    } else {
      setError('Failed to save theme. Maximum number of custom themes reached.');
    }
  };

  const updateTileColor = (value: number, color: string, isBackground: boolean) => {
    setEditedTheme(prev => ({
      ...prev,
      tileColors: {
        ...prev.tileColors,
        [value]: {
          ...prev.tileColors[value],
          [isBackground ? 'backgroundColor' : 'color']: color,
          [isBackground ? 'background' : 'text']: color // Keep both new and old properties in sync
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theme Editor</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close theme editor"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme Name
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => {
              setThemeName(e.target.value);
              setError(null);
            }}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter theme name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grid Colors
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Background</label>
              <ColorPicker
                color={editedTheme.gridBackground}
                onChange={(color) => setEditedTheme(prev => ({ ...prev, gridBackground: color }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cell Background</label>
              <ColorPicker
                color={editedTheme.gridCellBackground}
                onChange={(color) => setEditedTheme(prev => ({ ...prev, gridCellBackground: color }))}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Colors
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Light Text</label>
              <ColorPicker
                color={editedTheme.lightText}
                onChange={(color) => setEditedTheme(prev => ({ ...prev, lightText: color }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Dark Text</label>
              <ColorPicker
                color={editedTheme.darkText}
                onChange={(color) => setEditedTheme(prev => ({ ...prev, darkText: color }))}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tile Colors
          </label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(editedTheme.tileColors)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([value, colors]) => (
                <div key={value} className="space-y-2">
                  <label className="block text-sm text-gray-600">Tile {value}</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <ColorPicker
                        color={colors.backgroundColor || colors.background}
                        onChange={(color) => updateTileColor(Number(value), color, true)}
                      />
                    </div>
                    <div className="flex-1">
                      <ColorPicker
                        color={colors.color || colors.text}
                        onChange={(color) => updateTileColor(Number(value), color, false)}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={customThemeCount >= 3}
        >
          Save Theme
        </button>
      </div>
    </div>
  );
}