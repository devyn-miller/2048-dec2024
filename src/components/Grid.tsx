import React from 'react';
import { Tile as TileComponent } from './Tile';
import { Tile } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface GridProps {
  grid: Tile[][];
}

export function Grid({ grid }: GridProps) {
  const { theme } = useTheme();
  const size = grid.length;
  const containerSize = 400;
  const gap = 8;
  const padding = 8;
  const totalGaps = size - 1;
  const availableSpace = containerSize - (2 * padding) - (gap * totalGaps);
  const cellSize = Math.floor(availableSpace / size);
  
  return (
    <div 
      className="relative rounded-lg overflow-hidden"
      style={{ 
        backgroundColor: theme.gridBackground,
        width: `${containerSize}px`,
        height: `${containerSize}px`,
        padding: `${padding}px`,
      }}
    >
      {/* Grid background cells */}
      <div 
        className="grid absolute inset-0 m-2"
        style={{ 
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {Array(size * size).fill(null).map((_, i) => (
          <div
            key={i}
            className="rounded bg-opacity-20"
            style={{
              backgroundColor: theme.gridCellBackground || 'rgba(0,0,0,0.1)',
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        ))}
      </div>
      
      {/* Tiles */}
      <div className="absolute inset-0 m-2">
        {grid.flat().map((tile) => 
          tile && (
            <TileComponent 
              key={tile.id} 
              tile={tile}
              cellSize={cellSize}
            />
          )
        )}
      </div>
    </div>
  );
}