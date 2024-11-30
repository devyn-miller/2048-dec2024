import React, { useState } from 'react';
import { Theme } from '../types/game';
import { ColorPicker } from './ColorPicker';

interface ThemeEditorProps {
  onSave: (theme: Theme) => void;
  onClose: () => void;
  initialTheme?: Theme;
}

export function ThemeEditor({ onSave, onClose, initialTheme }: ThemeEditorProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme || {
    name: 'Custom Theme',
    background: '#ffffff',
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
    isCustom: true,
  });

  const updateTileColor = (value: number, type: 'background' | 'text', color: string) => {
    setTheme(prev => ({
      ...prev,
      tileColors: {
        ...prev.tileColors,
        [value]: {
          ...prev.tileColors[value],
          [type]: color,
        },
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Custom Theme Editor</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
            <input
              type="text"
              value={theme.name}
              onChange={(e) => setTheme(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Global Colors</h3>
            <ColorPicker
              label="Background"
              value={theme.background}
              onChange={(color) => setTheme(prev => ({ ...prev, background: color }))}
            />
            <ColorPicker
              label="Grid Background"
              value={theme.gridBackground}
              onChange={(color) => setTheme(prev => ({ ...prev, gridBackground: color }))}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Tile Colors</h3>
            {Object.entries(theme.tileColors).map(([value, colors]) => (
              <div key={value} className="border-t pt-2">
                <h4 className="font-medium mb-2">Tile {value}</h4>
                <div className="space-y-2">
                  <ColorPicker
                    label="Background"
                    value={colors.background}
                    onChange={(color) => updateTileColor(Number(value), 'background', color)}
                  />
                  <ColorPicker
                    label="Text"
                    value={colors.text}
                    onChange={(color) => updateTileColor(Number(value), 'text', color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(theme)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Theme
          </button>
        </div>
      </div>
    </div>
  );
}