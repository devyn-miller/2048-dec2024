import React from 'react';
import { GameConfig } from '../types/game';

interface GameSettingsProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onClose: () => void;
}

export function GameSettings({ config, onConfigChange, onClose }: GameSettingsProps) {
  const gridSizes = [4, 5, 6, 7, 8];
  const targets = [1024, 2048, 4096, 8192];

  const handleGridSizeChange = (size: number) => {
    onConfigChange({ ...config, gridSize: size });
  };

  const handleTargetChange = (target: number) => {
    onConfigChange({ ...config, winningTile: target });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Game Settings</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close settings"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Grid Size
          </label>
          <div className="flex flex-wrap gap-2">
            {gridSizes.map(size => (
              <button
                key={size}
                onClick={() => handleGridSizeChange(size)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  config.gridSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Target Tile
          </label>
          <div className="flex flex-wrap gap-2">
            {targets.map(target => (
              <button
                key={target}
                onClick={() => handleTargetChange(target)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  config.winningTile === target
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {target.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}