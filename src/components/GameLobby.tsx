import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { GameBoard } from "./GameBoard";
import { UserStats } from "./UserStats";
import { MatchHistory } from "./MatchHistory";
import { toast } from "sonner";

export function GameLobby() {
  const [activeTab, setActiveTab] = useState<"play" | "stats" | "history">("play");
  const [roomId, setRoomId] = useState("");
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  
  const createGame = useMutation(api.games.createGame);
  const joinGame = useMutation(api.games.joinGame);

  const handleCreateGame = async () => {
    try {
      const result = await createGame();
      setCurrentGameId(result.gameId);
      toast.success(`Game created! Room ID: ${result.roomId}`);
    } catch (error) {
      toast.error("Failed to create game");
    }
  };

  const handleJoinGame = async () => {
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    
    try {
      const gameId = await joinGame({ roomId: roomId.trim().toUpperCase() });
      setCurrentGameId(gameId);
      toast.success("Joined game successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to join game");
    }
  };

  if (currentGameId) {
    return (
      <GameBoard 
        gameId={currentGameId} 
        onLeaveGame={() => setCurrentGameId(null)} 
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "play", label: "Play Game", icon: "🎮" },
          { id: "stats", label: "Statistics", icon: "📊" },
          { id: "history", label: "Match History", icon: "📜" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === "play" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Start Playing</h2>
              <p className="text-gray-600">Create a new game or join an existing one</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Create Game */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Create New Game</h3>
                <p className="text-blue-600 mb-6">
                  Start a new game and invite a friend to join
                </p>
                <button
                  onClick={handleCreateGame}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Create Game Room
                </button>
              </div>

              {/* Join Game */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Join Existing Game</h3>
                <p className="text-green-600 mb-4">
                  Enter a room ID to join a friend's game
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter Room ID (e.g., ABC123)"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    maxLength={6}
                  />
                  <button
                    onClick={handleJoinGame}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Join Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && <UserStats />}
        {activeTab === "history" && <MatchHistory />}
      </div>
    </div>
  );
}
