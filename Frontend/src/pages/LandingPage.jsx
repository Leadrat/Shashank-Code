import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const LandingPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const response = await authAPI.getCurrentUser()
        // api.js returns response.data; response is already the user payload
        setUser(response)
      }
    } catch (error) {
      console.error('Not authenticated')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full">
        <h1 className="text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          🎮 Smart Tic Tac Toe
        </h1>
        <p className="text-center text-gray-600 mb-8">Play with AI or a friend!</p>

        {user && (
          <div className="mb-6 text-center">
            <p className="text-green-600 font-semibold">Welcome, {user.username}!</p>
            {user.role === 'Admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Admin Panel
              </button>
            )}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => navigate('/game?mode=AI')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            🤖 Play with AI
          </button>

          <button
            onClick={() => navigate('/game?mode=TwoPlayer')}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            👥 Two Player Mode
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate('/scoreboard')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                📊 Scoreboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              🔐 Login / Signup
            </button>
          )}
        </div>
      </div>
    </div>
  )

  async function handleLogout() {
    try {
      await authAPI.logout()
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
}

export default LandingPage
