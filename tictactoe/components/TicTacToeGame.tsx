import React, { useState, useEffect } from 'react';
import { GameData, Move } from '../lib/indexedDB';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameMode = 'ai' | 'human';

interface TicTacToeGameProps {
  onGameComplete: (gameData: GameData) => void;
  replayGame: GameData | null;
  onNewGame: () => void;
  backgroundColor: string;
  buttonColor: string;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({
  onGameComplete,
  replayGame,
  onNewGame,
  backgroundColor,
  buttonColor,
}) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (replayGame) {
      startReplay();
    }
  }, [replayGame]);

  const startReplay = () => {
    if (!replayGame) return;
    
    setIsReplaying(true);
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setReplayStep(0);
    
    // Replay moves with delay
    replayGame.moves.forEach((move, index) => {
      setTimeout(() => {
        setBoard(prev => {
          const newBoard = [...prev];
          newBoard[move.position] = move.player;
          return newBoard;
        });
        setIsPlayerTurn(move.player === 'O');
        setReplayStep(index + 1);
        
        if (index === replayGame.moves.length - 1) {
          setTimeout(() => {
            setWinner(replayGame.winner);
            setIsReplaying(false);
          }, 500);
        }
      }, (index + 1) * 800);
    });
  };

  const checkWinner = (board: Board): Player | 'tie' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.every(cell => cell !== null) ? 'tie' : null;
  };

  const getAIMove = (board: Board): number => {
    // Simple AI: Try to win, block player, or take center/corners
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    // Try to win
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'O';
      if (checkWinner(testBoard) === 'O') return move;
    }
    
    // Block player from winning
    for (const move of availableMoves) {
      const testBoard = [...board];
      testBoard[move] = 'X';
      if (checkWinner(testBoard) === 'X') return move;
    }
    
    // Take center if available
    if (availableMoves.includes(4)) return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8].filter(pos => availableMoves.includes(pos));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    // Take any available move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || isReplaying) return;

    const currentPlayer = isPlayerTurn ? 'X' : 'O';
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const newMoves: Move[] = [...moves, { player: currentPlayer, position: index }];
    setMoves(newMoves);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      saveGameData(newMoves, gameWinner);
      return;
    }

    if (gameMode === 'human') {
      // Human vs Human mode - just switch turns
      setIsPlayerTurn(!isPlayerTurn);
    } else {
      // Human vs AI mode
      if (isPlayerTurn) {
        setIsPlayerTurn(false);
        
        // AI move after delay
        setTimeout(() => {
          const aiMove = getAIMove(newBoard);
          const aiBoard = [...newBoard];
          aiBoard[aiMove] = 'O';
          setBoard(aiBoard);
          
          const aiMoves: Move[] = [...newMoves, { player: 'O', position: aiMove }];
          setMoves(aiMoves);

          const aiWinner = checkWinner(aiBoard);
          if (aiWinner) {
            setWinner(aiWinner);
            saveGameData(aiMoves, aiWinner);
          } else {
            setIsPlayerTurn(true);
          }
        }, 500);
      }
    }
  };

  const saveGameData = (gameMoves: Move[], gameWinner: 'X' | 'O' | 'tie') => {
    const gameData: GameData = {
      id: Date.now().toString(),
      moves: gameMoves,
      winner: gameWinner,
      date: new Date().toISOString(),
      gameMode,
      player1Name: gameMode === 'human' ? player1Name : 'You',
      player2Name: gameMode === 'human' ? player2Name : 'AI',
    };
    onGameComplete(gameData);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setMoves([]);
    setIsReplaying(false);
    setReplayStep(0);
    onNewGame();
  };

  const startNewGame = () => {
    if (gameMode === 'human' && (!player1Name.trim() || !player2Name.trim())) {
      setShowSetup(true);
      return;
    }
    resetGame();
    setShowSetup(false);
  };

  const getWinnerText = () => {
    if (gameMode === 'human') {
      if (winner === 'X') return `${player1Name} Wins! 🎉`;
      if (winner === 'O') return `${player2Name} Wins! 🎉`;
      if (winner === 'tie') return "It's a Tie! 🤝";
    } else {
      if (winner === 'X') return 'You Win! 🎉';
      if (winner === 'O') return 'AI Wins! 🤖';
      if (winner === 'tie') return "It's a Tie! 🤝";
    }
    return '';
  };

  const getStatusText = () => {
    if (isReplaying) return `Replaying... Step ${replayStep}/${replayGame?.moves.length || 0}`;
    if (winner) return getWinnerText();
    
    if (gameMode === 'human') {
      return isPlayerTurn ? `${player1Name}'s Turn (X)` : `${player2Name}'s Turn (O)`;
    } else {
      return isPlayerTurn ? 'Your Turn (X)' : 'AI Turn (O)';
    }
  };

  const getCurrentPlayerName = () => {
    if (gameMode === 'human') {
      return isPlayerTurn ? player1Name : player2Name;
    }
    return isPlayerTurn ? 'You' : 'AI';
  };

  if (showSetup) {
    return (
      <div className="flex flex-col items-center space-y-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Game Setup</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Game Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGameMode('ai')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    gameMode === 'ai'
                      ? 'bg-white text-purple-900'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  vs AI
                </button>
                <button
                  onClick={() => setGameMode('human')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    gameMode === 'human'
                      ? 'bg-white text-purple-900'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  vs Human
                </button>
              </div>
            </div>

            {gameMode === 'human' && (
              <>
                <div>
                  <label className="block text-white mb-2">Player 1 Name (X)</label>
                  <input
                    type="text"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
                    placeholder="Enter Player 1 name"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Player 2 Name (O)</label>
                  <input
                    type="text"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
                    placeholder="Enter Player 2 name"
                  />
                </div>
              </>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => setShowSetup(false)}
                className="flex-1 px-6 py-3 bg-gray-500/20 text-white font-semibold rounded-full hover:bg-gray-500/30 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={startNewGame}
                disabled={gameMode === 'human' && (!player1Name.trim() || !player2Name.trim())}
                style={{ background: buttonColor }}
                className="flex-1 px-6 py-3 text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Status */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {getStatusText()}
        </h2>
        {!isReplaying && !winner && (
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isPlayerTurn ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-purple-200">vs</span>
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              !isPlayerTurn ? 'bg-red-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="grid grid-cols-3 gap-4">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || isReplaying || (gameMode === 'ai' && !isPlayerTurn)}
              className={`
                w-20 h-20 rounded-2xl font-bold text-3xl transition-all duration-300 transform
                ${cell 
                  ? 'bg-white/20 border-2 border-white/30' 
                  : 'bg-white/5 border-2 border-white/10 hover:bg-white/15 hover:border-white/30 hover:scale-105'
                }
                ${cell === 'X' ? 'text-blue-400' : cell === 'O' ? 'text-red-400' : 'text-transparent'}
                ${!cell && !winner && !isReplaying && (gameMode === 'human' || isPlayerTurn) ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}
                disabled:opacity-50
              `}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowSetup(true)}
          style={{ background: buttonColor }}
          className="px-8 py-3 text-white font-semibold rounded-full hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          New Game
        </button>
        
        {replayGame && (
          <button
            onClick={() => startReplay()}
            disabled={isReplaying}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full 
                     hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 
                     shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReplaying ? 'Replaying...' : 'Replay Again'}
          </button>
        )}
      </div>

      {/* Game Stats */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="grid grid-cols-2 gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">X</div>
            <div className="text-sm text-purple-200">
              {gameMode === 'human' ? player1Name : 'You'}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">O</div>
            <div className="text-sm text-purple-200">
              {gameMode === 'human' ? player2Name : 'AI'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
