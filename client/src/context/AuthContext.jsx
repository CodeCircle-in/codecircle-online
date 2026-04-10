import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { getApiBase } from '../lib/utils'

const AuthContext = createContext(null)

const API = getApiBase()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cc_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get(`${API}/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('cc_token'); delete axios.defaults.headers.common['Authorization'] })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const loginWithGoogle = (redirectTo = '/dashboard') => {
    const target = encodeURIComponent(redirectTo)
    window.location.href = `${API}/auth/google?redirectTo=${target}`
  }

  const logout = () => {
    localStorage.removeItem('cc_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const setTokenAndUser = (token, userData) => {
    localStorage.setItem('cc_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, setTokenAndUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
