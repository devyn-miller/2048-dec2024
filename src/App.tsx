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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver) return;

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
  }, [grid, gameOver, bestScore, config.winningTile]);

  const resetGame = () => {
    setGrid(createInitialGrid(config.gridSize));
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const handleConfigChange = (newConfig: GameConfig) => {
    setConfig(newConfig);
    setGrid(createInitialGrid(newConfig.gridSize));
    setScore(0);
    setGameOver(false);
    setWon(false);
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
      <div className="w-[400px] mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">2048</h1>
            <p className="text-gray-600">Join the numbers and get to {config.winningTile}!</p>
          </div>
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Game settings"
            >
              <Settings size={24} />
            </button>
            
            <ThemeSelector />
            
            <button
              onClick={() => setShowThemeEditor(true)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Theme editor"
            >
              <Palette size={24} />
            </button>
            
            <ShareScore 
              score={score}
              bestScore={bestScore}
              config={config}
              gameOver={gameOver}
              won={won}
              grid={grid}
            />
          </div>

          <div className="flex justify-between mb-4">
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            <div className="bg-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">Best</div>
              <div className="text-2xl font-bold">{bestScore}</div>
            </div>
          </div>

          {showSettings && (
            <GameSettings
              config={config}
              onConfigChange={(newConfig) => {
                setConfig(newConfig);
                resetGame();
              }}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>

        <Grid grid={grid} />

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