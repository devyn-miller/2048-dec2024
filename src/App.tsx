import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { Grid } from './components/Grid';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Tile, Direction, GameConfig } from './types/game';
import { createInitialGrid, move, addRandomTile, isGameOver, hasWon, createEmptyGrid } from './utils/gameLogic';
import { Settings, Rotate3D, Share2, Palette, Undo, Redo } from 'lucide-react';
import { ThemeEditor } from './components/ThemeEditor';
import { GameSettings } from './components/GameSettings';
import { ShareScore } from './components/ShareScore';
import { ThemeSelector } from './components/ThemeSelector';
import { Footer } from './components/Footer';

function Game() {
  const [config, setConfig] = useState<GameConfig>({
    gridSize: 4,
    winningTile: 2048,
  });
  
  // State management for undo/redo
  interface GameState {
    grid: Tile[][];
    score: number;
  }

  type GameAction = 
    | { type: 'MOVE'; grid: Tile[][]; score: number }
    | { type: 'UNDO' }
    | { type: 'REDO' };

  const gameReducer = (state: { 
    present: GameState, 
    past: GameState[], 
    future: GameState[] 
  }, action: GameAction) => {
    switch (action.type) {
      case 'MOVE':
        return {
          present: { grid: action.grid, score: action.score },
          past: [...state.past, state.present],
          future: []
        };
      case 'UNDO':
        if (state.past.length === 0) return state;
        return {
          present: state.past[state.past.length - 1],
          past: state.past.slice(0, -1),
          future: [state.present, ...state.future]
        };
      case 'REDO':
        if (state.future.length === 0) return state;
        return {
          present: state.future[0],
          past: [...state.past, state.present],
          future: state.future.slice(1)
        };
      default:
        return state;
    }
  };

  const [gameState, dispatch] = useReducer(gameReducer, {
    present: { 
      grid: createInitialGrid(config.gridSize), 
      score: 0 
    },
    past: [],
    future: []
  });

  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [scoreAnimation, setScoreAnimation] = useState<{ points: number; key: number } | null>(null);
  const { theme, themes, setTheme } = useTheme();

  const handleMove = useCallback((newGrid: Tile[][], newScore: number) => {
    const pointsGained = newScore - gameState.present.score;
    if (pointsGained > 0) {
      setScoreAnimation({ points: pointsGained, key: Date.now() });
      setTimeout(() => setScoreAnimation(null), 500);
    }
    dispatch({ 
      type: 'MOVE', 
      grid: newGrid, 
      score: newScore 
    });
  }, [gameState.present.score]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  useEffect(() => {
    const directions: { [key: string]: Direction } = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      'W': 'up',
      's': 'down',
      'S': 'down',
      'a': 'left',
      'A': 'left',
      'd': 'right',
      'D': 'right'
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || won) return;
      
      // Ignore if any input element is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'SELECT') {
        return;
      }

      const direction = directions[event.key];
      if (!direction) return;

      event.preventDefault(); // Prevent page scroll on arrow keys

      const { grid: newGrid, moved, score: points } = move(gameState.present.grid, direction);
      if (moved) {
        const gridWithNewTile = addRandomTile(newGrid);
        handleMove(gridWithNewTile, gameState.present.score + points);
        
        if (hasWon(gridWithNewTile, config.winningTile)) {
          setWon(true);
        } else if (isGameOver(gridWithNewTile)) {
          setGameOver(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.present.grid, gameOver, won, config.winningTile]);

  useEffect(() => {
    if (gameState.present.score > bestScore) {
      setBestScore(gameState.present.score);
    }
  }, [gameState.present.score, bestScore]);

  const resetGame = () => {
    dispatch({ type: 'MOVE', grid: createInitialGrid(config.gridSize), score: 0 });
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    resetGame();
  }, [config.gridSize]);

  const handleConfigChange = (newConfig: GameConfig) => {
    setConfig(newConfig);
    resetGame();
  };

  const shareGame = () => {
    const shareText = `I scored ${gameState.present.score} points in 2048! Can you beat my score? Play at ${window.location.href}`;
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
    <div className="relative">
      <div 
        className="min-h-screen w-full flex flex-col items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(${theme.background}ee, ${theme.background}ff)`,
          backgroundAttachment: 'fixed' 
        }}
      >
        <div className="max-w-lg w-full mx-auto p-4">
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                2048
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Join the numbers and get to {config.winningTile}!</p>
            </div>

            {/* Score display */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 w-40 shadow-lg transition-transform hover:scale-105">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Score</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {gameState.present.score.toLocaleString()}
                </div>
                {scoreAnimation && (
                  <div 
                    key={scoreAnimation.key}
                    className="absolute -top-4 right-2 text-green-500 font-bold animate-fade-up"
                  >
                    +{scoreAnimation.points}
                  </div>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-40 shadow-lg transition-transform hover:scale-105">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Best</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {bestScore.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg group"
                aria-label="Game settings"
              >
                <Settings size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
                <span className="sr-only">Settings</span>
              </button>
              
              <ThemeSelector />

              <button
                onClick={handleUndo}
                disabled={gameState.past.length === 0}
                className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Undo move"
              >
                <Undo size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
                <span className="sr-only">Undo</span>
              </button>

              <button
                onClick={handleRedo}
                disabled={gameState.future.length === 0}
                className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Redo move"
              >
                <Redo size={22} className="group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300" />
                <span className="sr-only">Redo</span>
              </button>

              <ShareScore 
                score={gameState.present.score}
                bestScore={bestScore}
                config={config}
                gameOver={gameOver}
                won={won}
                grid={gameState.present.grid}
              />
            </div>
          </div>

          <Grid grid={gameState.present.grid} />

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
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-8">
          <Game />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}