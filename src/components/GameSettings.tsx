import React from 'react';
import { GameConfig } from '../types/game';

interface GameSettingsProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
}

export function GameSettings({ config, onConfigChange }: GameSettingsProps) {
  const gridSizes = [4, 5, 6, 8];
  const winningTiles = [2048, 4096, 8192];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Grid Size</h3>
        <div className="flex gap-2">
          {gridSizes.map(size => (
            <button
              key={size}
              onClick={() => onConfigChange({ ...config, gridSize: size })}
              className={`px-4 py-2 rounded ${
                config.gridSize === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Winning Tile</h3>
        <div className="flex gap-2">
          {winningTiles.map(tile => (
            <button
              key={tile}
              onClick={() => onConfigChange({ ...config, winningTile: tile })}
              className={`px-4 py-2 rounded ${
                config.winningTile === tile
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tile}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}