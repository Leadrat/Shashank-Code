import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.message,
      data: error.response?.data,
    }

    // Handle common error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access (e.g., redirect to login)
          localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token')
          window.location.href = '/login?sessionExpired=true'
          break
        case 403:
          // Handle forbidden access
          console.error('Access forbidden')
          break
        case 404:
          // Handle not found
          console.error('Resource not found')
          break
        case 500:
          // Handle server error
          console.error('Server error occurred')
          break
        default:
          console.error('An error occurred')
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server. Please check your connection.')
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message)
    }

    return Promise.reject(errorResponse)
  }
)

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    // Clear auth data from local storage
    localStorage.removeItem(import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token')
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'refresh_token')
    return api.post('/auth/logout')
  },
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh-token', { refreshToken }),
  getCurrentUser: () => api.get('/auth/current'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
}

// Game API endpoints
export const gameAPI = {
  // Endpoints used by current UI
  play: (data) => api.post('/game/play', data),
  replay: () => api.get('/game/replay'),

  // Extended endpoints (not currently used by UI)
  createGame: (data) => api.post('/game/create', data),
  joinGame: (gameId) => api.post(`/game/${gameId}/join`),
  makeMove: (gameId, data) => api.post(`/game/${gameId}/move`, data),
  getGameState: (gameId) => api.get(`/game/${gameId}`),
  getActiveGames: () => api.get('/game/active'),
  surrender: (gameId) => api.post(`/game/${gameId}/surrender`),
  getGameHistory: (page = 1, limit = 10) => 
    api.get('/game/history', { params: { page, limit } })
}

// Score API endpoints
export const scoreAPI = {
  // Backend route is GET /api/score/user (no parameter)
  getUserScore: () => api.get('/score/user'),
  getLeaderboard: (limit = 10) => api.get('/score/leaderboard', { params: { limit } }),
  getScoreHistory: (userId, page = 1, limit = 10) => 
    api.get(`/score/history/${userId || ''}`, { params: { page, limit } }),
  getStats: () => api.get('/score/stats')
}

// Admin API endpoints
export const adminAPI = {
  // User management
  getAllUsers: (page = 1, limit = 20, search = '') => 
    api.get('/admin/users', { params: { page, limit, search } }),
  getUser: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  
  // Score management
  getAllScores: (page = 1, limit = 20, filters = {}) => 
    api.get('/admin/scores', { params: { page, limit, ...filters } }),
  
  // Admin actions
  makeAdmin: (userId) => api.post(`/admin/users/${userId}/make-admin`),
  removeAdmin: (userId) => api.post(`/admin/users/${userId}/remove-admin`),
  
  // System stats
  getSystemStats: () => api.get('/admin/stats')
}

export default api
