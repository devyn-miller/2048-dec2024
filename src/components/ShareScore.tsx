import React, { useState } from 'react';
import { GameConfig, Tile } from '../types/game';
import { Info } from 'lucide-react';

interface ShareScoreProps {
  score: number;
  bestScore: number;
  config: GameConfig;
  gameOver: boolean;
  won: boolean;
  grid: Tile[][];
}

export function ShareScore({ score, bestScore, config, gameOver, won, grid }: ShareScoreProps) {
  const [showInstructions, setShowInstructions] = useState(false);

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

  const getStatusEmoji = () => {
    if (won) return '🏆';
    if (gameOver) return '🎮';
    return '🎲';
  };

  const handleShare = async () => {
    const largestTile = getLargestTile();
    const gameStatus = won ? "Victory!" : gameOver ? "Game Over" : "In Progress";
    
    const shareText = 
`🎮 2048 ${getStatusEmoji()}
━━━━━━━━━━
${gameStatus}
🎯 Score: ${score.toLocaleString()}
👑 Best: ${bestScore.toLocaleString()}
💫 Largest Tile: ${largestTile.toLocaleString()}
📊 Grid: ${config.gridSize}×${config.gridSize}
🎯 Target: ${config.winningTile.toLocaleString()}
━━━━━━━━━━
🌐 Play now: ${window.location.href}`;

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

  const GameInstructions = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Game Instructions</h2>
          <button 
            onClick={() => setShowInstructions(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p className="font-semibold text-lg">🎯 Game Objective</p>
          <p>Combine tiles to reach the {config.winningTile} tile on a {config.gridSize}×{config.gridSize} grid!</p>
          
          <p className="font-semibold text-lg mt-4">🏁 Basic Rules</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use arrow keys (←↑→↓) or swipe to move all tiles simultaneously</li>
            <li>Tiles with the same number merge when they collide</li>
            <li>After each move, a new tile (2 or 4) appears in a random empty cell</li>
            <li>Game ends when no more moves are possible or you reach the {config.winningTile} tile</li>
          </ul>

          <p className="font-semibold text-lg mt-4">🧠 Advanced Strategies</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep your highest-value tile in one corner</li>
            <li>Try to maintain a consistent tile arrangement</li>
            <li>Plan moves to create larger tile combinations</li>
            <li>Use the grid edges to your advantage</li>
          </ul>

          <p className="font-semibold text-lg mt-4">🎨 Customization Options</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Grid Size: Choose from 3×3 to 6×6 to adjust difficulty</li>
            <li>Winning Tile: Set your target from 256 to 16,384</li>
            <li>Theme Selection: Personalize game appearance</li>
            <li>Responsive design works on desktop and mobile</li>
          </ul>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            💡 Pro Tip: Every move counts! Think strategically and aim to create larger tiles efficiently.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowInstructions(true)}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
        aria-label="Game instructions"
      >
        <Info size={22} />
      </button>
      <button
        onClick={handleShare}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
        aria-label="Share game score"
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
      {showInstructions && <GameInstructions />}
    </div>
  );
}
