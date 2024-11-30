import React, { useEffect, useRef } from 'react';
import { Tile as TileComponent } from './Tile';
import { Tile } from '../types/game';
import { useTheme } from '../contexts/ThemeContext';

interface GridProps {
  grid: Tile[][];
}

export function Grid({ grid }: GridProps) {
  const { theme } = useTheme();
  const gridRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const minSwipeDistance = 30; // minimum swipe distance in pixels

      // Determine the primary direction of the swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) >= minSwipeDistance) {
          const event = new KeyboardEvent('keydown', {
            key: deltaX > 0 ? 'ArrowRight' : 'ArrowLeft'
          });
          window.dispatchEvent(event);
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) >= minSwipeDistance) {
          const event = new KeyboardEvent('keydown', {
            key: deltaY > 0 ? 'ArrowDown' : 'ArrowUp'
          });
          window.dispatchEvent(event);
        }
      }

      touchStartRef.current = null;
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('touchstart', handleTouchStart);
      gridElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('touchstart', handleTouchStart);
        gridElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  const size = grid.length;
  const containerSize = 400;
  const gap = 8;
  const padding = 8;
  const totalGaps = size - 1;
  const availableSpace = containerSize - (2 * padding) - (gap * totalGaps);
  const cellSize = Math.floor(availableSpace / size);
  
  return (
    <div 
      ref={gridRef}
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