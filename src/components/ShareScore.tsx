import React from 'react';
import { GameConfig, Tile } from '../types/game';

interface ShareScoreProps {
  score: number;
  bestScore: number;
  config: GameConfig;
  gameOver: boolean;
  won: boolean;
  grid: Tile[][];
}

export function ShareScore({ score, bestScore, config, gameOver, won, grid }: ShareScoreProps) {
  const getLargestTile = () => {
    let max = 0;
    grid.forEach(row => {
      row.forEach(tile => {
        if (tile && tile.value > max) {
          max = tile.value;
        }
      });
    });
    return max;
  };

  const handleShare = async () => {
    const largestTile = getLargestTile();
    const gameStatus = won ? "Victory!" : gameOver ? "Game Over" : "In Progress";
    
    const shareText = 
`2048 | ${gameStatus}
Score: ${score.toLocaleString()} | Best: ${bestScore.toLocaleString()}
Largest Tile: ${largestTile.toLocaleString()}
${config.gridSize}×${config.gridSize} Grid | Target: ${config.winningTile.toLocaleString()}

Play now: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: '2048 Game Score',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Score copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
      aria-label="Share score"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </button>
  );
}
