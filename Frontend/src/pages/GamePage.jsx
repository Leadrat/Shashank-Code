import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gameAPI } from '../services/api'
import Toast from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'

const GamePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'AI'

  const [board, setBoard] = useState(Array(9).fill(''))
  const [gameOver, setGameOver] = useState(false)
  const [gameResult, setGameResult] = useState('')
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  const checkLocalWinCondition = (board, player) => {
    const winCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Check for win
    for (const combo of winCombinations) {
      if (combo.every(index => board[index] === player)) {
        return 'PlayerWin';
      }
    }

    // Check for draw
    if (!board.includes('')) {
      return 'Draw';
    }

    return null;
  };

  const handleCellClick = async (index) => {
    if (board[index] !== '' || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    
    // Check for win/draw after player's move
    const localResult = checkLocalWinCondition(newBoard, currentPlayer);
    if (localResult) {
      setBoard(newBoard);
      handleGameEnd(localResult);
      return;
    }

    try {
      setLoading(true);
      const response = await gameAPI.play({
        board: newBoard,
        mode: mode,
      });

      // api.js returns response.data, so response is already the payload
      const serverResult = response.result;
      setBoard(response.board);

      if (serverResult) {
        handleGameEnd(serverResult);
      } else if (mode === 'TwoPlayer') {
        // Switch player turn for two-player mode
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    } catch (error) {
      console.error('Game error:', error);
      showToast('Failed to process move', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleGameEnd = (result) => {
    setGameOver(true);
    
    // For two-player mode, check if result is X or O
    if (mode === 'TwoPlayer') {
      if (result === 'X' || result === 'O') {
        setGameResult(`${result} Wins! 🎉`);
      } else if (result === 'Draw') {
        setGameResult('Draw! 🤝');
      }
    } else {
      // For AI mode
      if (result === 'PlayerWin') {
        setGameResult('You Win! 🎉');
      } else if (result === 'AIWin') {
        setGameResult('AI Wins! 🤖');
      } else if (result === 'Draw') {
        setGameResult('Draw! 🤝');
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''))
    setGameOver(false)
    setGameResult('')
    setCurrentPlayer('X')
  }

  const handleReplay = async () => {
    try {
      setLoading(true)
      const response = await gameAPI.replay()
      setBoard(response.board)
      setGameOver(true)
      setGameResult(MapResult(response.result))
    } catch (error) {
      showToast('No previous game found', 'error')
    } finally {
      setLoading(false)
    }
  }

  const MapResult = (result) => {
    // For two-player mode
    if (mode === 'TwoPlayer') {
      if (result === 'X' || result === 'O') {
        return `${result} Won! 🎉`;
      }
      return 'Draw! 🤝';
    }
    
    // For AI mode
    switch (result) {
      case 'PlayerWin':
        return 'You Won! 🎉';
      case 'AIWin':
        return 'AI Won! 🤖';
      case 'Draw':
        return 'Draw! 🤝';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          🎮 Tic Tac Toe
        </h1>

        <div className="text-center mb-6">
          <p className="text-xl font-semibold text-gray-700">
            Mode: {mode === 'AI' ? 'Player vs AI' : 'Two Players'}
          </p>
          {mode === 'TwoPlayer' && !gameOver && (
            <p className="text-lg text-blue-600 mt-2">
              {currentPlayer}'s Turn
            </p>
          )}
          {gameOver && (
            <p className="text-2xl font-bold mt-2 text-green-600 animate-pulse">
              {gameResult}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={gameOver || cell !== ''}
                className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-4xl font-bold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cell}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            🔄 New Game
          </button>

          <button
            onClick={handleReplay}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            ▶️ Replay Last Game
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            🏠 Back to Home
          </button>
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    </div>
  )
}

export default GamePage
