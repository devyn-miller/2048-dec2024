import React, { useState, useEffect } from 'react';
import { GameConfig } from '../types/game';
import { Save } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface GameSettingsProps {
  config: GameConfig;
  onConfigChange: (newConfig: GameConfig) => void;
  onClose: () => void;
}

export function GameSettings({ config, onConfigChange, onClose }: GameSettingsProps) {
  const [localConfig, setLocalConfig] = useState<GameConfig>({ ...config });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Reset local config if prop changes
    setLocalConfig({ ...config });
    setHasChanges(false);
  }, [config]);

  const handleGridSizeChange = (size: number) => {
    const newConfig = { ...localConfig, gridSize: size };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const handleTargetChange = (target: number) => {
    const newConfig = { ...localConfig, winningTile: target };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    onConfigChange(localConfig);
    setHasChanges(false);
    onClose(); // Close settings after applying changes
  };

  const gridSizes = [4, 5, 6, 7, 8];
  const targets = [1024, 2048, 4096, 8192];

  return (
    <div className="relative p-6 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Game Settings</h2>
        <Tooltip text="Close settings menu">
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ×
          </button>
        </Tooltip>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Grid Size</h3>
          <div className="flex gap-2">
            {gridSizes.map(size => (
              <Tooltip key={size} text={`Change game board to ${size}x${size} grid size`}>
                <button
                  onClick={() => handleGridSizeChange(size)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    localConfig.gridSize === size
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {size}×{size}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Winning Tile</h3>
          <div className="flex gap-2 flex-wrap">
            {targets.map(target => (
              <Tooltip key={target} text={`Set ${target.toLocaleString()} as the winning tile target`}>
                <button
                  onClick={() => handleTargetChange(target)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    localConfig.winningTile === target
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {target.toLocaleString()}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="mt-6 flex justify-end">
          <Tooltip text="Save and apply your changes to grid size and winning tile settings">
            <button
              onClick={handleSaveChanges}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Save size={18} />
              Apply Changes
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}