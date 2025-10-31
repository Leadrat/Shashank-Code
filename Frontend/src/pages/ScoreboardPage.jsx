import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { scoreAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const ScoreboardPage = () => {
  const navigate = useNavigate()
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScore()
  }, [])

  const fetchScore = async () => {
    try {
      const response = await scoreAPI.getUserScore()
      setScore(response)
    } catch (error) {
      console.error('Failed to fetch score:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const totalGames = score.wins + score.losses + score.draws
  const winRate = totalGames > 0 ? ((score.wins / totalGames) * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          📊 Scoreboard
        </h1>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              Your Stats
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {score.wins}
                </div>
                <div className="text-sm text-gray-600 mt-1">Wins</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-red-600">
                  {score.losses}
                </div>
                <div className="text-sm text-gray-600 mt-1">Losses</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600">
                  {score.draws}
                </div>
                <div className="text-sm text-gray-600 mt-1">Draws</div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Games:</span>
                <span className="text-2xl font-bold text-blue-600">{totalGames}</span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-700 font-semibold">Win Rate:</span>
                <span className="text-2xl font-bold text-purple-600">
                  {winRate}%
                </span>
              </div>
            </div>
          </div>

          {totalGames === 0 && (
            <div className="text-center py-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                📝 Play some games to see your stats here!
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScoreboardPage
