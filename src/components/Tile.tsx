import React from 'react';
import { Tile as TileType } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface TileProps {
  tile: TileType;
  cellSize: number;
}

export function Tile({ tile, cellSize }: TileProps) {
  const { theme } = useTheme();
  const { value, position } = tile;
  
  const style = {
    ...theme.tileColors[value],
    transform: `translate(${position.col * cellSize}px, ${position.row * cellSize}px)`,
    transition: 'transform 100ms ease-in-out',
    position: 'absolute' as const,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: value <= 512 ? `${cellSize / 3}px` : `${cellSize / 3.5}px`,
  };

  return (
    <div style={style}>
      {value}
    </div>
  );
}