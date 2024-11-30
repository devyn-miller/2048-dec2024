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
  const gap = 8; // Match the gap size from Grid
  
  const style = {
    ...theme.tileColors[value],
    transform: `translate(${position.col * (cellSize + gap)}px, ${position.row * (cellSize + gap)}px)`,
    transition: 'all 100ms ease-in-out',
    position: 'absolute' as const,
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: value <= 512 ? `${cellSize / 2.2}px` : `${cellSize / 2.8}px`,
    color: value <= 4 ? theme.darkText : theme.lightText,
    zIndex: 10,
  };

  return (
    <div style={style}>
      {value}
    </div>
  );
}