import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface GameBoardProps {
  gameId: string;
  onLeaveGame: () => void;
}

export function GameBoard({ gameId, onLeaveGame }: GameBoardProps) {
  const game = useQuery(api.games.getGame, { gameId: gameId as Id<"games"> });
  const makeMove = useMutation(api.games.makeMove);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayStep, setReplayStep] = useState(0);

  const currentPlayer = game?.players.find(p => p.userId === loggedInUser?._id);
  const isMyTurn = game?.currentTurn === currentPlayer?.symbol;

  useEffect(() => {
    if (game?.status === "finished" && game.winner) {
      const message = game.winner === "draw" 
        ? "Game ended in a draw!" 
        : game.winner === currentPlayer?.symbol 
          ? "You won! 🎉" 
          : "You lost! Better luck next time.";
      
      toast.success(message);
    }
  }, [game?.status, game?.winner, currentPlayer?.symbol]);

  const handleCellClick = async (position: number) => {
    if (!game || game.status !== "playing" || !isMyTurn || isReplayMode) return;
    
    try {
      await makeMove({ gameId: gameId as Id<"games">, position });
    } catch (error: any) {
      toast.error(error.message || "Failed to make move");
    }
  };

  const startReplay = () => {
    setIsReplayMode(true);
    setReplayStep(0);
  };

  const stopReplay = () => {
    setIsReplayMode(false);
    setReplayStep(0);
  };

  const nextReplayStep = () => {
    if (game && replayStep < game.moveHistory.length) {
      setReplayStep(replayStep + 1);
    }
  };

  const prevReplayStep = () => {
    if (replayStep > 0) {
      setReplayStep(replayStep - 1);
    }
  };

  if (!game) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate board state for replay
  const displayBoard = isReplayMode 
    ? (() => {
        const board = Array(9).fill(null);
        for (let i = 0; i < replayStep; i++) {
          const move = game.moveHistory[i];
          board[move.position] = move.symbol;
        }
        return board;
      })()
    : game.board;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onLeaveGame}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Lobby
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Room: {game.roomId}</h2>
          {game.status === "waiting" && (
            <p className="text-blue-600">Waiting for another player...</p>
          )}
        </div>
        <div className="w-20"></div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {game.players.map((player, index) => (
          <div
            key={player.userId}
            className={`p-4 rounded-lg border-2 transition-colors ${
              game.currentTurn === player.symbol && game.status === "playing"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{player.username}</p>
                <p className="text-sm text-gray-600">Playing as {player.symbol}</p>
              </div>
              {game.currentTurn === player.symbol && game.status === "playing" && (
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Game Board */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-3 gap-2 bg-gray-800 p-2 rounded-lg">
          {displayBoard.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={game.status !== "playing" || !isMyTurn || isReplayMode}
              className={`w-20 h-20 bg-white rounded-lg flex items-center justify-center text-3xl font-bold transition-all hover:bg-gray-50 ${
                game.status === "playing" && isMyTurn && !cell && !isReplayMode
                  ? "cursor-pointer hover:shadow-md"
                  : "cursor-default"
              }`}
            >
              <span className={cell === "X" ? "text-blue-600" : "text-red-500"}>
                {cell}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Status */}
      <div className="text-center mb-6">
        {game.status === "waiting" && (
          <p className="text-lg text-blue-600">Waiting for another player to join...</p>
        )}
        {game.status === "playing" && !isReplayMode && (
          <p className="text-lg">
            {isMyTurn ? (
              <span className="text-green-600 font-semibold">Your turn!</span>
            ) : (
              <span className="text-gray-600">Waiting for opponent...</span>
            )}
          </p>
        )}
        {game.status === "finished" && (
          <div className="space-y-2">
            <p className="text-xl font-bold">
              {game.winner === "draw" ? (
                <span className="text-yellow-600">Game ended in a draw!</span>
              ) : (
                <span className={game.winner === currentPlayer?.symbol ? "text-green-600" : "text-red-500"}>
                  {game.winner === currentPlayer?.symbol ? "You won! 🎉" : "You lost!"}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Replay Controls */}
      {game.status === "finished" && game.moveHistory.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex justify-center items-center space-x-4">
            {!isReplayMode ? (
              <button
                onClick={startReplay}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📽️ Watch Replay
              </button>
            ) : (
              <>
                <button
                  onClick={stopReplay}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Stop
                </button>
                <button
                  onClick={prevReplayStep}
                  disabled={replayStep === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-sm text-gray-600">
                  Step {replayStep} / {game.moveHistory.length}
                </span>
                <button
                  onClick={nextReplayStep}
                  disabled={replayStep >= game.moveHistory.length}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Room */}
      {game.status === "waiting" && (
        <div className="border-t pt-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Share this room ID with a friend:</p>
            <div className="flex justify-center items-center space-x-2">
              <code className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-mono">
                {game.roomId}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(game.roomId);
                  toast.success("Room ID copied to clipboard!");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
