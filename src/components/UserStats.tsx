import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function UserStats() {
  const stats = useQuery(api.games.getUserStats);
  const user = useQuery(api.auth.loggedInUser);

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Games Played Yet</h3>
        <p className="text-gray-600">Start playing to see your statistics here!</p>
      </div>
    );
  }

  const winRate = stats.totalGames > 0 ? (stats.wins / stats.totalGames * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Statistics</h2>
        <p className="text-gray-600">Track your Tic-Tac-Toe performance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.totalGames}</div>
          <div className="text-sm text-blue-800 font-medium">Total Games</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.wins}</div>
          <div className="text-sm text-green-800 font-medium">Wins</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.losses}</div>
          <div className="text-sm text-red-800 font-medium">Losses</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.draws}</div>
          <div className="text-sm text-yellow-800 font-medium">Draws</div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Win Rate</h3>
        <div className="text-5xl font-bold text-purple-600 mb-2">{winRate}%</div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${winRate}%` }}
          ></div>
        </div>
        <p className="text-gray-600">
          {stats.wins} wins out of {stats.totalGames} games
        </p>
      </div>

      {/* Player Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Player Profile</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name || "Anonymous"}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Member since:</span> {user?._creationTime ? new Date(user._creationTime).toLocaleDateString() : "Unknown"}</p>
        </div>
      </div>
    </div>
  );
}
