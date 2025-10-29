import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export function MatchHistory() {
  const matches = useQuery(api.games.getUserMatches);
  const user = useQuery(api.auth.loggedInUser);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [replayStep, setReplayStep] = useState(0);

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Match History</h3>
        <p className="text-gray-600">Play some games to see your match history here!</p>
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "win": return "text-green-600 bg-green-50";
      case "loss": return "text-red-600 bg-red-50";
      case "draw": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "win": return "🏆";
      case "loss": return "😞";
      case "draw": return "🤝";
      default: return "❓";
    }
  };

  if (selectedMatch) {
    // Replay view
    const replayBoard = Array(9).fill(null);
    for (let i = 0; i < replayStep; i++) {
      const move = selectedMatch.moveHistory[i];
      replayBoard[move.position] = move.symbol;
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedMatch(null)}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to History
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Match Replay</h2>
          <div className="w-20"></div>
        </div>

        {/* Match Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Date:</span> {new Date(selectedMatch.createdAt).toLocaleString()}</div>
            <div><span className="font-medium">Duration:</span> {formatDuration(selectedMatch.duration)}</div>
            <div><span className="font-medium">Players:</span> {selectedMatch.players.map((p: any) => p.username).join(" vs ")}</div>
            <div><span className="font-medium">Winner:</span> {selectedMatch.winner === "draw" ? "Draw" : `Player ${selectedMatch.winner}`}</div>
          </div>
        </div>

        {/* Replay Board */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-2 bg-gray-800 p-2 rounded-lg">
            {replayBoard.map((cell, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold"
              >
                <span className={cell === "X" ? "text-blue-600" : "text-red-500"}>
                  {cell}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Replay Controls */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setReplayStep(Math.max(0, replayStep - 1))}
            disabled={replayStep === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">
            Step {replayStep} / {selectedMatch.moveHistory.length}
          </span>
          <button
            onClick={() => setReplayStep(Math.min(selectedMatch.moveHistory.length, replayStep + 1))}
            disabled={replayStep >= selectedMatch.moveHistory.length}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Move History */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Move History</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedMatch.moveHistory.map((move: any, index: number) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  index < replayStep ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <span>Move {index + 1}: Player {move.symbol}</span>
                <span className="text-sm text-gray-600">
                  Position {move.position + 1} • {new Date(move.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Match History</h2>
        <p className="text-gray-600">Review your past games and watch replays</p>
      </div>

      <div className="space-y-4">
        {matches.map((match) => {
          const myResult = match.players.find(p => p.userId === user?._id)?.result || "unknown";
          const opponent = match.players.find(p => p.userId !== user?._id);
          
          return (
            <div
              key={match._id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getResultColor(myResult)}`}>
                    {getResultIcon(myResult)} {myResult.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      vs {opponent?.username || "Unknown Player"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(match.createdAt).toLocaleDateString()} • {formatDuration(match.duration)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-600">
                    <p>{match.moveHistory.length} moves</p>
                    <p>{match.winner === "draw" ? "Draw" : `Winner: ${match.winner}`}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMatch(match);
                      setReplayStep(0);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    📽️ Replay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
