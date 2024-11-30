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
  const cellSize = 400 / size;
  
  return (
    <div 
      className="relative rounded-lg p-2"
      style={{ 
        backgroundColor: theme.gridBackground,
        width: '400px',
        height: '400px'
      }}
    >
      {/* Grid background cells */}
      <div 
        className="absolute inset-2 grid gap-2"
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {Array(size * size).fill(null).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded bg-opacity-20 bg-gray-600"
          />
        ))}
      </div>
      
      {/* Tiles */}
      <div className="absolute inset-2">
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