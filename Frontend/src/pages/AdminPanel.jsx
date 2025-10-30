import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'

const AdminPanel = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      if (error.response?.status === 403) {
        showToast('Access denied. Admin only.', 'error')
        setTimeout(() => navigate('/'), 2000)
      } else {
        showToast('Failed to fetch users', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          👑 Admin Panel
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <th className="p-4 text-left rounded-tl-lg">Username</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-center">Total Games</th>
                <th className="p-4 text-center">Wins</th>
                <th className="p-4 text-center">Losses</th>
                <th className="p-4 text-center rounded-tr-lg">Draws</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {user.username}
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-blue-600">
                    {user.totalGames}
                  </td>
                  <td className="p-4 text-center font-bold text-green-600">
                    {user.wins}
                  </td>
                  <td className="p-4 text-center font-bold text-red-600">
                    {user.losses}
                  </td>
                  <td className="p-4 text-center font-bold text-yellow-600">
                    {user.draws}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            🏠 Back to Home
          </button>
        </div>

        {toast.show && <Toast message={toast.message} type={toast.type} />}
      </div>
    </div>
  )
}

export default AdminPanel
