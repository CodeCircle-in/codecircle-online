import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const { setTokenAndUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const userRaw = params.get('user')
    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        setTokenAndUser(token, user)
        navigate('/', { replace: true })
      } catch {
        navigate('/', { replace: true })
      }
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-neutral-500 text-sm">Signing you in...</div>
    </div>
  )
}
