"use client"
import React, { useState, useEffect } from 'react';
import { TicTacToeGame } from '../components/TicTacToeGame'
import { GameHistory } from '../components/GameHistory';
import { GameData, openDB, saveGame, getGameHistory } from '../lib/indexedDB';

const backgroundColors = [
  { name: 'Purple Galaxy', value: 'from-purple-900 via-blue-900 to-indigo-900' },
  { name: 'Ocean Breeze', value: 'from-blue-900 via-teal-900 to-cyan-900' },
  { name: 'Sunset Glow', value: 'from-orange-900 via-red-900 to-pink-900' },
  { name: 'Forest Night', value: 'from-green-900 via-emerald-900 to-teal-900' },
  { name: 'Royal Purple', value: 'from-violet-900 via-purple-900 to-fuchsia-900' },
  { name: 'Midnight Blue', value: 'from-slate-900 via-blue-900 to-indigo-900' },
];

const buttonColors = [
  { name: 'Purple Pink', value: 'linear-gradient(to right, #8b5cf6, #ec4899)' },
  { name: 'Blue Cyan', value: 'linear-gradient(to right, #3b82f6, #06b6d4)' },
  { name: 'Orange Red', value: 'linear-gradient(to right, #f97316, #ef4444)' },
  { name: 'Green Teal', value: 'linear-gradient(to right, #10b981, #14b8a6)' },
  { name: 'Violet Fuchsia', value: 'linear-gradient(to right, #8b5cf6, #d946ef)' },
  { name: 'Indigo Blue', value: 'linear-gradient(to right, #6366f1, #3b82f6)' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'game' | 'history' | 'settings'>('game');
  const [gameHistory, setGameHistory] = useState<GameData[]>([]);
  const [replayGame, setReplayGame] = useState<GameData | null>(null);
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [selectedButtonColor, setSelectedButtonColor] = useState(0);

  useEffect(() => {
    initDB();
    // Load saved preferences
    const savedBg = localStorage.getItem('ticTacToe_background');
    const savedBtn = localStorage.getItem('ticTacToe_buttonColor');
    if (savedBg) setSelectedBackground(parseInt(savedBg));
    if (savedBtn) setSelectedButtonColor(parseInt(savedBtn));
  }, []);

  const initDB = async () => {
    await openDB();
    loadHistory();
  };

  const loadHistory = async () => {
    const history = await getGameHistory();
    setGameHistory(history);
  };

  const handleGameComplete = async (gameData: GameData) => {
    await saveGame(gameData);
    await loadHistory();
  };

  const handleReplay = (game: GameData) => {
    setReplayGame(game);
    setCurrentView('game');
  };

  const handleNewGame = () => {
    setReplayGame(null);
  };

  const handleBackgroundChange = (index: number) => {
    setSelectedBackground(index);
    localStorage.setItem('ticTacToe_background', index.toString());
  };

  const handleButtonColorChange = (index: number) => {
    setSelectedButtonColor(index);
    localStorage.setItem('ticTacToe_buttonColor', index.toString());
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundColors[selectedBackground].value}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            Tic Tac Toe
          </h1>
          <p className="text-xl text-purple-200">Challenge friends or AI and track your progress</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <button
              onClick={() => setCurrentView('game')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentView === 'game'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Play Game
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentView === 'history'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              History ({gameHistory.length})
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentView === 'settings'
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentView === 'game' ? (
            <TicTacToeGame
              onGameComplete={handleGameComplete}
              replayGame={replayGame}
              onNewGame={handleNewGame}
              backgroundColor={backgroundColors[selectedBackground].value}
              buttonColor={buttonColors[selectedButtonColor].value}
            />
          ) : currentView === 'history' ? (
            <GameHistory
              games={gameHistory}
              onReplay={handleReplay}
              onClearHistory={loadHistory}
            />
          ) : (
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Customization</h2>
                
                {/* Background Colors */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Background Theme</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {backgroundColors.map((bg, index) => (
                      <button
                        key={index}
                        onClick={() => handleBackgroundChange(index)}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                          selectedBackground === index
                            ? 'border-white shadow-lg scale-105'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${bg.value} mb-2`}></div>
                        <div className="text-white text-sm font-medium">{bg.name}</div>
                        {selectedBackground === index && (
                          <div className="absolute top-2 right-2 text-white text-xl">✓</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Colors */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Button Color</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {buttonColors.map((btn, index) => (
                      <button
                        key={index}
                        onClick={() => handleButtonColorChange(index)}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                          selectedButtonColor === index
                            ? 'border-white shadow-lg scale-105'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                      >
                        <div 
                          className="w-full h-12 rounded-lg mb-2"
                          style={{ background: btn.value }}
                        ></div>
                        <div className="text-white text-sm font-medium">{btn.name}</div>
                        {selectedButtonColor === index && (
                          <div className="absolute top-2 right-2 text-white text-xl">✓</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
