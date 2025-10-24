import React, { useState } from 'react';
import { GameData, clearAllGames } from '../lib/indexedDB';

interface GameHistoryProps {
  games: GameData[];
  onReplay: (game: GameData) => void;
  onClearHistory: () => void;
}

export const GameHistory: React.FC<GameHistoryProps> = ({
  games,
  onReplay,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'human'>('all');

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all game history?')) {
      await clearAllGames();
      onClearHistory();
    }
  };

  const getResultIcon = (winner: GameData['winner']) => {
    if (winner === 'X') return '🏆';
    if (winner === 'O') return '🤖';
    return '🤝';
  };

  const getResultText = (game: GameData) => {
    if (game.gameMode === 'human') {
      if (game.winner === 'X') return `${game.player1Name} Won`;
      if (game.winner === 'O') return `${game.player2Name} Won`;
      return 'Tie Game';
    } else {
      if (game.winner === 'X') return 'You Won';
      if (game.winner === 'O') return 'AI Won';
      return 'Tie Game';
    }
  };

  const getResultColor = (winner: GameData['winner']) => {
    if (winner === 'X') return 'text-green-400';
    if (winner === 'O') return 'text-red-400';
    return 'text-yellow-400';
  };

  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    return game.gameMode === filter;
  });

  const getStats = (gameMode?: 'ai' | 'human') => {
    const relevantGames = gameMode ? games.filter(g => g.gameMode === gameMode) : games;
    return ['X', 'O', 'tie'].map((result) => {
      const count = relevantGames.filter(game => game.winner === result).length;
      const percentage = relevantGames.length > 0 ? Math.round((count / relevantGames.length) * 100) : 0;
      return { result, count, percentage };
    });
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">No Games Yet</h3>
          <p className="text-purple-200">Play your first game to see history here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Game History</h2>
        <button
          onClick={handleClearHistory}
          className="px-6 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full 
                   hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
        >
          Clear All
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
          {[
            { key: 'all', label: 'All Games' },
            { key: 'ai', label: 'vs AI' },
            { key: 'human', label: 'vs Human' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                filter === key
                  ? 'bg-white text-purple-900 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {label} ({key === 'all' ? games.length : games.filter(g => g.gameMode === key).length})
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {getStats(filter === 'all' ? undefined : filter).map(({ result, count, percentage }) => (
          <div key={result} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl mb-2">
                {result === 'X' ? '🏆' : result === 'O' ? (filter === 'ai' ? '🤖' : '🎯') : '🤝'}
              </div>
              <div className="text-2xl font-bold text-white">{count}</div>
              <div className="text-sm text-purple-200">
                {result === 'X' ? 'X Wins' : result === 'O' ? 'O Wins' : 'Ties'} ({percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {filteredGames.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="text-xl font-bold text-white mb-1">No Games Found</h3>
              <p className="text-purple-200">No games match the selected filter.</p>
            </div>
          </div>
        ) : (
          filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 
                       hover:bg-white/15 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{getResultIcon(game.winner)}</div>
                  <div>
                    <div className={`text-lg font-semibold ${getResultColor(game.winner)}`}>
                      {getResultText(game)}
                    </div>
                    <div className="text-sm text-purple-200">
                      {new Date(game.date).toLocaleDateString()} at{' '}
                      {new Date(game.date).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-purple-300 flex items-center space-x-2">
                      <span>{game.moves.length} moves</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        game.gameMode === 'ai' 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {game.gameMode === 'ai' ? 'vs AI' : 'vs Human'}
                      </span>
                      {game.gameMode === 'human' && (
                        <>
                          <span>•</span>
                          <span>{game.player1Name} vs {game.player2Name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Move Preview */}
                  <div className="grid grid-cols-3 gap-1">
                    {Array(9).fill(null).map((_, cellIndex) => {
                      const move = game.moves.find(m => m.position === cellIndex);
                      return (
                        <div
                          key={cellIndex}
                          className={`w-6 h-6 rounded border text-xs flex items-center justify-center
                            ${move 
                              ? 'bg-white/20 border-white/30' 
                              : 'bg-white/5 border-white/10'
                            }
                            ${move?.player === 'X' ? 'text-blue-400' : move?.player === 'O' ? 'text-red-400' : ''}
                          `}
                        >
                          {move?.player || ''}
                        </div>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => onReplay(game)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full 
                             hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 
                             shadow-lg hover:shadow-xl"
                  >
                    Replay
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
