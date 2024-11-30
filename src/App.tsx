import React, { useEffect, useState } from 'react';
import { Grid } from './components/Grid';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Tile, Direction, GameConfig } from './types/game';
import { createInitialGrid, move, addRandomTile, isGameOver, hasWon } from './utils/gameLogic';
import { Settings, Rotate3D, Share2, Palette } from 'lucide-react';
import { ThemeEditor } from './components/ThemeEditor';
import { GameSettings } from './components/GameSettings';
import { ShareScore } from './components/ShareScore';
import { ThemeSelector } from './components/ThemeSelector';

function Game() {
  const [config, setConfig] = useState<GameConfig>({
    gridSize: 4,
    winningTile: 2048,
  });
  const [grid, setGrid] = useState<Tile[][]>(createInitialGrid(config.gridSize));
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const { theme, themes, setTheme } = useTheme();

  const resetGame = () => {
    const newGrid = createInitialGrid(config.gridSize);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    resetGame();
  }, [config.gridSize]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || won) return;

      const directions: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = directions[event.key];
      if (!direction) return;

      const { grid: newGrid, moved, score: points } = move(grid, direction);
      if (moved) {
        const gridWithNewTile = addRandomTile(newGrid);
        setGrid(gridWithNewTile);
        setScore(prev => {
          const newScore = prev + points;
          if (newScore > bestScore) {
            setBestScore(newScore);
          }
          return newScore;
        });
        
        if (hasWon(gridWithNewTile, config.winningTile)) {
          setWon(true);
        } else if (isGameOver(gridWithNewTile)) {
          setGameOver(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, won, config.winningTile]);

  const handleConfigChange = (newConfig: GameConfig) => {
    setConfig(newConfig);
    resetGame();
  };

  const shareGame = () => {
    const shareText = `I scored ${score} points in 2048! Can you beat my score? Play at ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: '2048 Game',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{ background: theme.background }}
    >
      <div className="max-w-lg mx-auto p-4">
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">2048</h1>
            <p className="text-gray-600">Join the numbers and get to {config.winningTile}!</p>
          </div>

          {/* Score display */}
          <div className="flex justify-between mb-6">
            <div className="bg-gray-100 rounded-lg p-4 w-36 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Score</div>
              <div className="text-2xl font-bold">{score.toLocaleString()}</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 w-36 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Best</div>
              <div className="text-2xl font-bold">{bestScore.toLocaleString()}</div>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
                aria-label="Game settings"
              >
                <Settings size={22} />
              </button>
              
              <ThemeSelector />
              
              <button
                onClick={() => setShowThemeEditor(true)}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
                aria-label="Theme editor"
              >
                <Palette size={22} />
              </button>
            </div>
            
            <ShareScore 
              score={score}
              bestScore={bestScore}
              config={config}
              gameOver={gameOver}
              won={won}
              grid={grid}
            />
          </div>
        </div>

        <Grid grid={grid} />

        {/* Game over / win overlay */}
        {(gameOver || won) && (
          <div className="mt-8 text-center">
            <h2 className={`text-2xl font-bold mb-4 ${won ? 'text-green-500' : 'text-red-500'}`}>
              {won ? 'You Won!' : 'Game Over!'}
            </h2>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Settings modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <GameSettings
                config={config}
                onConfigChange={(newConfig) => {
                  setConfig(newConfig);
                  resetGame();
                }}
                onClose={() => setShowSettings(false)}
              />
            </div>
          </div>
        )}

        {/* Theme editor modal */}
        {showThemeEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <ThemeEditor onClose={() => setShowThemeEditor(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Game />
    </ThemeProvider>
  );
}